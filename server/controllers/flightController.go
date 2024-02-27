package controllers

import (
	"fmt"
	"strconv"
	"time"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// ADMIN
func CreateFlight(c *fiber.Ctx) error {
	var request struct {
		AirlplaneID uint   `json:"airplaneId"`
		AirlineID   uint   `json:"airlineId"`
		Status      string `json:"status"`
		Flight      struct {
			Arrival    models.AirportResponse `json:"arrival"`
			Departure  models.AirportResponse `json:"departure"`
			FlightDate models.FlightDate      `json:"flightTime"`
		} `json:"flight"`
	}

	if err := c.BodyParser(&request); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Failed request"})
	}

	db := database.GetDB()

	var flightRoute models.FlightRoute
	db.Where("departure_id = ? AND arrival_id = ?", request.Flight.Departure.ID, request.Flight.Arrival.ID).First(&flightRoute)

	if flightRoute.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Flight route not found",
		})
	}

	departureTime, err := time.Parse("2006-01-02T15:04:05.000Z", request.Flight.FlightDate.DepartureTime)
	if err != nil {
		fmt.Println("error in departure time parsing", err)
		return err
	}
	arrivalTime, err := time.Parse("2006-01-02T15:04:05.000Z", request.Flight.FlightDate.ArrivalTime)
	if err != nil {
		fmt.Println("error in arrival time parsing", err)
		return err
	}

	flight := models.Flight{
		AirplaneID:    request.AirlplaneID,
		FlightRouteID: flightRoute.ID,
		DepartureTime: departureTime,
		ArrivalTime:   arrivalTime,
		Status:        request.Status,
		AirlineID:     request.AirlineID,
	}

	db.Create(&flight)
	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func GetAirlineFromRoutes(c *fiber.Ctx) error {
	arrival := c.Query("arrivalId")
	departure := c.Query("departureId")

	var arrivalId, departureId int
	var err error

	if arrival != "" {
		arrivalId, err = strconv.Atoi(arrival)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{"message": "Invalid arrivalId"})
		}
	}

	if departure != "" {
		departureId, err = strconv.Atoi(departure)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{"message": "Invalid departureId"})
		}
	}

	var results []map[string]interface{}
	db := database.GetDB()

	query := db.Table("airline_flight_routes AS afr").
		Select("airlines.id, airlines.name").
		Joins("JOIN flight_routes AS fr ON afr.flight_route_id = fr.id").
		Joins("JOIN airports AS arrival ON arrival.id = fr.arrival_id").
		Joins("JOIN airports AS departure ON departure.id = fr.departure_id").
		Joins("JOIN airlines ON afr.airline_id = airlines.id").
		Group("airlines.id, airlines.name").
		Limit(20)

	if arrival != "" {
		query = query.Where("fr.arrival_id = ?", arrivalId)
	}
	if departure != "" {
		query = query.Where("fr.departure_id = ?", departureId)
	}

	result := query.Scan(&results)

	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{"message": "Failed to fetch airline"})
	}

	var airlines []models.AirlineResponse
	for _, item := range results {
		var airline models.AirlineResponse
		airline.ID, _ = item["id"].(int64)
		airline.Name, _ = item["name"].(string)
		airlines = append(airlines, airline)
	}

	return c.JSON(airlines)
}

func GetAvailableAirplane(c *fiber.Ctx) error {
	airline := c.Query("airlineId")

	var airlineId int
	var err error

	if airline != "" {
		airlineId, err = strconv.Atoi(airline)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{"message": "Invalid departureId"})
		}
	}

	var airplanes []models.Airplane
	db := database.GetDB()

	result := db.Preload("Airline").
		Joins("JOIN airlines ON airplanes.airline_id = airlines.id").
		Where("airlines.id = ? AND airplanes.is_available = ?", airlineId, true).
		Find(&airplanes)

	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch available airplanes"})
	}

	return c.JSON(airplanes)
}

func GetFlightRoutes(c *fiber.Ctx) error {
	queryTerm := c.Query("term")
	queryTerm = "%" + queryTerm + "%"

	var results []map[string]interface{}

	db := database.GetDB()

	result := db.
		Table("flight_routes").
		Select(`flight_routes.id, 
                departure.name AS "departure_airport.name", 
                departure.code AS "departure_airport.code", 
                departure_country.name AS "departure_airport.country", 
                departure_city.name AS "departure_airport.city", 
                arrival.name AS "arrival_airport.name", 
                arrival.code AS "arrival_airport.code", 
                arrival_country.name AS "arrival_airport.country", 
                arrival_city.name AS "arrival_airport.city", 
                flight_routes.price AS "price", 
                flight_routes.flight_duration AS "flightDuration"`).
		Joins("JOIN airports AS departure ON flight_routes.departure_id = departure.id").
		Joins("JOIN airports AS arrival ON flight_routes.arrival_id = arrival.id").
		Joins("JOIN cities AS departure_city ON departure.city_id = departure_city.id").
		Joins("JOIN cities AS arrival_city ON arrival.city_id = arrival_city.id").
		Joins("JOIN countries AS departure_country ON departure_city.country_id = departure_country.id").
		Joins("JOIN countries AS arrival_country ON arrival_city.country_id = arrival_country.id").
		Where("departure.name ILIKE ? OR arrival.name ILIKE ? OR departure_city.name ILIKE ? OR arrival_city.name ILIKE ? OR departure_country.name ILIKE ? OR arrival_country.name ILIKE ?", queryTerm, queryTerm, queryTerm, queryTerm, queryTerm, queryTerm).
		Group("flight_routes.id, departure.name, departure.code, departure_country.name, departure_city.name, arrival.name, arrival.code, arrival_country.name, arrival_city.name").
		Limit(10).
		Scan(&results)

	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to fetch flight route details"})
	}

	var flightRoutes []models.FlightRouteResponse
	for _, item := range results {
		var flightRoute models.FlightRouteResponse

		flightRoute.ID = item["id"].(int64)
		flightRoute.Price = item["price"].(int64)
		flightRoute.FlightDuration = item["flightDuration"].(int64)
		flightRoute.DepartureAirport.Name = item["departure_airport.name"].(string)
		flightRoute.DepartureAirport.Code = item["departure_airport.code"].(string)
		flightRoute.DepartureAirport.Country = item["departure_airport.country"].(string)
		flightRoute.DepartureAirport.City = item["departure_airport.city"].(string)
		flightRoute.ArrivalAirport.Name = item["arrival_airport.name"].(string)
		flightRoute.ArrivalAirport.Code = item["arrival_airport.code"].(string)
		flightRoute.ArrivalAirport.Country = item["arrival_airport.country"].(string)
		flightRoute.ArrivalAirport.City = item["arrival_airport.city"].(string)
		flightRoutes = append(flightRoutes, flightRoute)
	}

	return c.JSON(flightRoutes)
}

// USERS * ADMIN
func flightDetailQuery(offset int, limit int) *gorm.DB {

	db := database.GetDB()

	query := db.Table("flights AS f").Offset(offset).Limit(limit).
		Joins("join flight_routes AS fr on f.flight_route_id = fr.id").
		Preload("Airplane").
		Preload("Airplane.Airline").
		Preload("FlightRoute").
		Preload("FlightRoute.ArrivalAirport").
		Preload("FlightRoute.ArrivalAirport.City").
		Preload("FlightRoute.ArrivalAirport.City.Country").
		Preload("FlightRoute.DepartureAirport").
		Preload("FlightRoute.DepartureAirport.City").
		Preload("FlightRoute.DepartureAirport.City.Country").
		Preload("Airline")

	return query
}

func GetAllPendingFlights(c *fiber.Ctx) error {
	limitQuery := c.Query("limit", "10")
	offsetQuery := c.Query("offset", "0")

	limit, err := strconv.Atoi(limitQuery)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid limit value"})
	}

	offset, err := strconv.Atoi(offsetQuery)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid offset value"})
	}

	db := database.GetDB()

	var totalCount int64
	db.Model(&models.Flight{}).Count(&totalCount)

	if int64(offset) >= totalCount {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Exceed number of records"})
	}

	var flights []models.Flight

	query := flightDetailQuery(offset, limit)

	if err := query.Where("status ILIKE ?", "pending").
		Find(&flights).Error; err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{"message": "Failed to retrieve flights"})
	}

	return c.JSON(flights)
}

func GetFlightFromLocation(c *fiber.Ctx) error {
	arrival := c.Query("arrivalId")
	departure := c.Query("departureId")
	limitQuery := c.Query("limit", "10")
	offsetQuery := c.Query("offset", "0")
	typeQuery := c.Query("searchType")

	var arrivalId, departureId int
	var err error

	limit, err := strconv.Atoi(limitQuery)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid limit value"})
	}

	offset, err := strconv.Atoi(offsetQuery)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid offset value"})
	}

	if arrival != "" {
		arrivalId, err = strconv.Atoi(arrival)
		if err != nil {
			arrival = ""
		}
	}

	if departure != "" {
		departureId, err = strconv.Atoi(departure)
		if err != nil {
			departure = ""
		}
	}

	var flights []models.Flight
	db := database.GetDB()

	var totalCount int64
	db.Model(&models.Flight{}).Count(&totalCount)

	if int64(offset) >= totalCount {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Exceed number of records"})
	}

	query := flightDetailQuery(offset, limit)

	if typeQuery == "" {
		if arrival != "" {
			query = query.Where("fr.arrival_id = ?", arrivalId)
		}
		if departure != "" {
			query = query.Where("fr.departure_id = ?", departureId)
		}
	} else if typeQuery == "location" {
		query = query.Where("fr.arrival_id = ? OR fr.departure_id = ?", arrivalId, departureId)
	}

	query = query.Where("f.status ILIKE ?", "pending")

	queryErr := query.Find(&flights).Error

	if queryErr != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{"message": "Failed to fetch airline"})
	}

	return c.JSON(flights)
}

func GetFlightDetails(c *fiber.Ctx) error {
	flightQuery := c.Query("flightId")

	flightId, err := strconv.Atoi(flightQuery)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid limit value"})
	}

	var flight models.Flight

	query := flightDetailQuery(0, 1)

	query = query.Where("f.id = ? ", flightId)
	query = query.Where("f.status ILIKE  ?", "pending")

	queryErr := query.Find(&flight).Error

	if queryErr != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch flight",
		})
	}

	return c.JSON(flight)
}

func GetSeatAmountFromFlight(c *fiber.Ctx) error {
	flightQuery := c.Query("flightId")
	flightId, err := strconv.Atoi(flightQuery)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid flight ID value"})
	}

	db := database.GetDB()

	var totalCount int64

	queryErr := db.Table("flights AS f").
		Joins("JOIN airplanes ON airplanes.id = f.airplane_id").
		Joins("JOIN seat_details AS seat ON airplanes.id = seat.airplane_id AND seat.is_available = ?", true).
		Where("f.id = ?", flightId).
		Count(&totalCount).Error

	if queryErr != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch seat details",
		})
	}

	return c.JSON(fiber.Map{
		"seatAmount": totalCount,
	})
}

func GetSeatDetailsFromFlight(c *fiber.Ctx) error {
	flightQuery := c.Query("flightId")
	flightId, err := strconv.Atoi(flightQuery)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid flight ID value"})
	}

	var seatDetails []models.SeatDetail

	db := database.GetDB()

	query := db.Table("flights AS f").
		Select(`seat.id AS "ID", airplanes.id AS "airplaneId", seat.code, seat.class, seat.is_available`).
		Joins("JOIN airplanes ON airplanes.id = f.airplane_id").
		Joins("JOIN seat_details AS seat ON airplanes.id = seat.airplane_id").
		Where("f.id = ?", flightId).
		Order("seat.id ASC")

	queryErr := query.Find(&seatDetails).Error

	if queryErr != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch seat details",
		})
	}

	return c.JSON(seatDetails)
}

// func CreateFlightTransaction(c *fiber.Ctx) error {
// 	var request struct {
// 		TicketCode        string `json:"ticketCode"`
// 		UserTransactionID uint   `json:"userTransactionId"`
// 		FlightID          uint   `json:"flightId"`
// 		TravelerID        uint   `json:"travelerId"`
// 		SeatID            uint   `json:"seatId"`
// 		IsRoundTrip       bool   `json:"isRoundTrip"`
// 		Baggage           uint   `json:"baggage"`
// 	}

// 	if err := c.BodyParser(&request); err != nil {
// 		c.Status(fiber.StatusBadRequest)
// 		return c.JSON(fiber.Map{"message": "Failed request"})
// 	}

// 	db := database.GetDB()

// 	flightTransaction := models.FlightTransaction{
// 		TicketCode:        request.TicketCode,
// 		UserTransactionID: request.UserTransactionID,
// 		FlightID:          request.FlightID,
// 		TravelerID:        request.TravelerID,
// 		SeatID:            request.SeatID,
// 		IsRoundTrip:       request.IsRoundTrip,
// 		Baggage:           request.Baggage,
// 	}

// 	result := db.Create(&flightTransaction)

// 	if result.Error != nil {
// 		c.Status(fiber.StatusInternalServerError)
// 		return c.JSON(fiber.Map{"message": "Failed to create flight transaction", "error": result.Error.Error()})
// 	}

// 	return c.JSON(fiber.Map{
// 		"message":"Success",
// 		"flightTransaction":flightTransaction,
// 	})

// }

func CreateCompleteFlightTransaction(c *fiber.Ctx) error {
	type TravelerRequest struct {
		FirstName      string `json:"firstName"`
		LastName       string `json:"lastName"`
		PassportNumber string `json:"passportNumber"`
		DateOfBirth    string `json:"dateOfBirth"`
	}

	type FlightTransactionRequest struct {
		TicketCode  string `json:"ticketCode"`
		FlightID    uint   `json:"flightId"`
		SeatID      uint   `json:"seatId"`
		IsRoundTrip bool   `json:"isRoundTrip"`
		Baggage     uint   `json:"baggage"`
	}

	var request struct {
		UserID             uint                       `json:"userId"`
		Price              uint                       `json:"price"`
		TransactionDate    string                     `json:"transactionDate"`
		Status             string                     `json:"status"`
		Travelers          []TravelerRequest          `json:"travelers"`
		FlightTransactions []FlightTransactionRequest `json:"flightTransactions"`
	}

	if err := c.BodyParser(&request); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Request parsing failed"})
	}

	db := database.GetDB()
	tx := db.Begin()

	transactionDate, err := time.Parse("2006-01-02T15:04:05.000Z", request.TransactionDate)
	if err != nil {
		tx.Rollback()
		return c.JSON(fiber.Map{"message": "Invalid transaction date"})
	}

	userTransaction := models.UserTransaction{
		UserID:          request.UserID,
		Price:           request.Price,
		TransactionDate: transactionDate,
		Status:          request.Status,
	}

	if err := tx.Create(&userTransaction).Error; err != nil {
		tx.Rollback()
		return c.JSON(fiber.Map{"message": "Failed to create user transaction", "error": err.Error()})
	}

	for i, travelerReq := range request.Travelers {
		dob, _ := time.Parse("2006-01-02", travelerReq.DateOfBirth)
		traveler := models.Traveler{
			FirstName:      travelerReq.FirstName,
			LastName:       travelerReq.LastName,
			PassportNumber: travelerReq.PassportNumber,
			DateOfBirth:    dob,
		}

		if err := tx.Where(models.Traveler{PassportNumber: traveler.PassportNumber}).FirstOrCreate(&traveler).Error; err != nil {
			tx.Rollback()
			return c.JSON(fiber.Map{"message": "Failed to create or find traveler", "error": err.Error()})
		}

		var seat models.SeatDetail
		if err := tx.Where("id = ?", request.FlightTransactions[i].SeatID).First(&seat).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to find seat", "error": err.Error()})
		}

		if !seat.IsAvailable{
			tx.Rollback()
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Seat is not available"})
		}

		flightTransactionReq := request.FlightTransactions[i]
		flightTransaction := models.FlightTransaction{
			TicketCode:        flightTransactionReq.TicketCode,
			UserTransactionID: userTransaction.ID,
			FlightID:          flightTransactionReq.FlightID,
			TravelerID:        traveler.ID,
			SeatID:            flightTransactionReq.SeatID,
			IsRoundTrip:       flightTransactionReq.IsRoundTrip,
			Baggage:           flightTransactionReq.Baggage,
		}

		if err := tx.Create(&flightTransaction).Error; err != nil {
			tx.Rollback()
			return c.JSON(fiber.Map{"message": "Failed to create flight transaction", "error": err.Error()})
		}
	}

	tx.Commit()
	return c.JSON(fiber.Map{"message": "Complete transaction created successfully"})
}
