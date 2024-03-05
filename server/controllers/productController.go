package controllers

import (
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreatePromo(c *fiber.Ctx) error {
	var request map[string]string
	if err := c.BodyParser(&request); err != nil {
		return err
	}
	var existingPromo models.Promo
	db := database.GetDB()
	db.Where("code = ?", request["code"]).First((&existingPromo))

	fmt.Print(existingPromo.Code)

	if existingPromo.Code == request["code"] {
		c.Status(fiber.StatusConflict)
		return c.JSON(fiber.Map{
			"message": "Promo Already Exists",
		})
	}

	toDate, err := time.Parse("2006-01-02", request["toDate"])
	if err != nil {
		return err
	}
	fromDate, err := time.Parse("2006-01-02", request["fromDate"])
	if err != nil {
		return err
	}
	amount, err := strconv.Atoi(request["amount"])
	if err != nil {
		return err
	}
	isValid := cvtBool(request["isValid"])

	promo := models.Promo{
		Image:       request["image"],
		Amount:      amount,
		Description: request["description"],
		FromDate:    fromDate,
		ToDate:      toDate,
		Code:        request["code"],
		IsValid:     isValid,
	}

	db.Create(&promo)

	if err := assignPromoToAllUser(promo); err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Assigning Promo Failed",
		})
	}
	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func GetUserPromos(c *fiber.Ctx) error {
	queryUser := c.Query("user")

	var promos []models.Promo
	db := database.GetDB()

	err := db.Table("user_promos").Select("promos.*").
		Joins("join promos on promos.id = user_promos.promo_id").
		Where("user_promos.user_id = ?", queryUser).Limit(10).
		Find(&promos).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.Status(fiber.StatusNotFound)
			return c.JSON(fiber.Map{
				"message": "No promos found for user",
			})
		} else {
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{"message": "Failed to fetch promos for user"})
		}
	}

	return c.JSON(promos)
}

func GetAllPromos(c *fiber.Ctx) error {
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

	var promos []models.Promo
	db := database.GetDB()

	var totalCount int64
	db.Model(&models.Promo{}).Count(&totalCount)

	if int64(offset) >= totalCount {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Exceed number of records"})
	}

	if err := db.Offset(offset).Limit(limit).Find(&promos).Error; err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{"message": "Failed to fetch promos"})
	}

	return c.JSON(promos)
}

func assignPromoToAllUser(promo models.Promo) error {
	var users []models.User
	db := database.GetDB()
	if err := db.Find(&users).Error; err != nil {
		return err
	}

	for _, user := range users {
		userPromo := models.UserPromo{
			UserID:      user.ID,
			PromoID:     promo.ID,
			IsAvailable: true,
		}
		if err := db.Create(&userPromo).Error; err != nil {
			return err
		}
	}

	return nil
}

func UpdatePromo(c *fiber.Ctx) error {
	type UpdatePromoRequest struct {
		ID uint `json:"id"`
		Code        *string `json:"code"`
		Image       *string `json:"image,omitempty"`
		Amount      *int    `json:"amount,omitempty"`
		Description *string `json:"description,omitempty"`
		FromDate    *string `json:"fromDate,omitempty"`
		ToDate      *string `json:"toDate,omitempty"`
		IsValid     *bool   `json:"isValid,omitempty"`
	}

	var request UpdatePromoRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Request parsing failed"})
	}

	var promo models.Promo
	db := database.GetDB() 

	if err := db.Where("id = ?", request.ID).First(&promo).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "Promo not found"})
	}

	if request.Image != nil {
		promo.Image = *request.Image
	}
	if request.Code != nil {
		promo.Code = *request.Code
	}
	if request.Amount != nil {
		promo.Amount = *request.Amount
	}
	if request.Description != nil {
		promo.Description = *request.Description
	}
	if request.FromDate != nil {
		fromDate, err := time.Parse("2006-01-02T15:04:05.000Z", *request.FromDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid from date format"})
		}
		promo.FromDate = fromDate
	}
	if request.ToDate != nil {
		toDate, err := time.Parse("2006-01-02T15:04:05.000Z", *request.ToDate)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid to date format"})
		}
		promo.ToDate = toDate
	}
	if request.IsValid != nil {
		promo.IsValid = *request.IsValid
	}

	if err := db.Save(&promo).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to update promo", "error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Promo updated successfully", "promo": promo})
}

// func CreateTraveler(c *fiber.Ctx) error {
//     var request struct {
//         FirstName      string `json:"firstName"`
//         LastName       string `json:"lastName"`
//         PassportNumber string `json:"passportNumber"`
//         DateOfBirth    string `json:"dateOfBirth"`
//     }

//     if err := c.BodyParser(&request); err != nil {
//         return err
//     }

//     dob, err := time.Parse("2006-01-02", request.DateOfBirth)
//     if err != nil {
//         return err
//     }

//     db := database.GetDB()

//     traveler := models.Traveler{
//         FirstName:      request.FirstName,
//         LastName:       request.LastName,
//         PassportNumber: request.PassportNumber,
//         DateOfBirth:    dob,
//     }

//     result := db.Where(models.Traveler{PassportNumber: traveler.PassportNumber}).
// 			FirstOrCreate(&traveler)
    
//     if result.Error != nil {
//         c.Status(fiber.StatusInternalServerError)
//         return c.JSON(fiber.Map{"message": "Failed to find or create traveler", "error": result.Error.Error()})
//     }

//     if result.RowsAffected > 0 {
//         return c.JSON(fiber.Map{
//             "message": "New traveler created successfully",
//             "traveler": traveler,
//         })
//     } else {
//         return c.JSON(fiber.Map{
//             "message": "Traveler already exists",
//             "traveler": traveler,
//         })
//     }
// }

func GetCart(c *fiber.Ctx) error {
	db := database.GetDB()

	limitQuery := c.Query("limit", "10")
	offsetQuery := c.Query("offset", "0")
	mode := c.Query("mode")
	userIDQuery := c.Query("userID")
    if userIDQuery == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
    }

	userId, err := strconv.Atoi(userIDQuery)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid limit query parameter"})
	}
	limit, err := strconv.Atoi(limitQuery)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid limit query parameter"})
	}

	offset, err := strconv.Atoi(offsetQuery)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid offset query parameter"})
	}

	subQuery := db.Model(&models.UserTransaction{}).Select("id").Where("status = ? AND user_id = ?", "cart", userId)	
	switch mode {
	case "flights":
		var flightTransactions []*models.FlightTransaction
		err = db.Model(&models.FlightTransaction{}).
			Where("user_transaction_id IN (?)", subQuery).
			Preload("UserTransaction").
			Preload("Flight").
			Preload("Flight.Airplane").
			Preload("Flight.Airplane.Airline").
			Preload("Flight.FlightRoute").
			Preload("Flight.FlightRoute.ArrivalAirport").
			Preload("Flight.FlightRoute.ArrivalAirport.City").
			Preload("Flight.FlightRoute.ArrivalAirport.City.Country").
			Preload("Flight.FlightRoute.DepartureAirport").
			Preload("Flight.FlightRoute.DepartureAirport.City").
			Preload("Flight.FlightRoute.DepartureAirport.City.Country").
			Preload("Flight.Airline").
			Preload("SeatDetail").
			Preload("Traveler").
			Offset(offset).
			Limit(limit).
			Find(&flightTransactions).Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to query flight transactions"})
		}
		return c.JSON(flightTransactions)

	case "hotels":
		var hotelTransactions []*models.HotelTransaction
		err = db.Model(&models.HotelTransaction{}).
			Where("user_transaction_id IN (?)", subQuery).
			Preload("UserTransaction").
			Preload("Hotel").
			Preload("RoomDetail").
			Offset(offset).
			Limit(limit).
			Find(&hotelTransactions).Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to query hotel transactions"})
		}
		return c.JSON(hotelTransactions)
	

	default:
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid mode query parameter"})
	}
}