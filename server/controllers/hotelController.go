package controllers

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateHotel(c *fiber.Ctx) error {
	var request struct {
		Name        string   `json:"name"`
		Description string   `json:"description"`
		Rating      float64  `json:"rating"`
		Address     string   `json:"address"`
		Images      []string `json:"images"`
		CityID      uint     `json:"cityId"`
		FacilityIDs []uint   `json:"facilitiesId"`
	}

	if err := c.BodyParser(&request); err != nil {
		fmt.Print(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Could not parse request"})
	}

	// var cityId uint
	// if request.CityID != "" {
	//     parsedCityID, err := strconv.Atoi(request.CityID)
	//     if err != nil {
	//         return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid CityID"})
	//     }
	//     cityId = uint(parsedCityID)
	// }

	// parsedRating, err := strconv.ParseFloat(request.Rating, 64)
	// if err != nil {
	//     return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid Rating"})
	// }

	db := database.GetDB()

	imagesJSON, err := json.Marshal(request.Images)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Could not process images"})
	}

	hotel := models.Hotel{
		Name:        request.Name,
		Description: request.Description,
		Rating:      request.Rating,
		Address:     request.Address,
		Images:      imagesJSON,
		CityID:      request.CityID,
	}

	result := db.Create(&hotel)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Could not create hotel"})
	}

	for _, fID := range request.FacilityIDs {
		// fID, err := strconv.Atoi(fIDStr)
		// if err != nil {
		//     continue // Skip invalid facility IDs or handle error appropriately
		// }
		var facility models.Facility
		if db.First(&facility, fID).Error != nil {
			continue // Skip if facility not found
		}

		db.Model(&hotel).Association("Facilities").Append(&facility)
	}

	return c.JSON(fiber.Map{
		"message": "Hotel created successfully",
		"hotel":   hotel,
	})
}

func GetAllHotel(c *fiber.Ctx) error {
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
	db.Model(&models.Hotel{}).Count(&totalCount)

	if int64(offset) >= totalCount {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Exceed number of records"})
	}

	var hotels []models.Hotel

	query := db.Table("hotels AS h").Offset(offset).Limit(limit).
		Preload("City").
		Preload("City.Country").
		Preload("Facilities")
	if err := query.Find(&hotels).Error; err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Failed to retrieve hotels",
		})
	}

	return c.JSON(hotels)
}

func CreateRoomDetails(c *fiber.Ctx) error {
	var requests []struct {
		HotelID        uint     `json:"hotelId"`
		Name           string   `json:"name"`
		Price          uint     `json:"price"`
		Images         []string `json:"images"`
		RoomFacilities struct {
			IsFreeBreakfast bool `json:"isFreeBreakfast"`
			IsFreeWifi      bool `json:"isFreeWifi"`
			IsNonSmoking    bool `json:"isNonSmoking"`
			IsRefundable    bool `json:"isRefundable"`
			IsReschedule    bool `json:"isReschedule"`
		} `json:"roomFacilities"`
		Guest      uint   `json:"guest"`
		Bed        string `json:"bed"`
		Area       uint   `json:"area"`
		Allocation uint   `json:"allocation"`
	}

	if err := c.BodyParser(&requests); err != nil {
		fmt.Print(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Could not parse request"})
	}

	db := database.GetDB()
	tx := db.Begin()

	for _, request := range requests {
		imagesJSON, err := json.Marshal(request.Images)
		if err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Could not process images"})
		}

		var hotel models.Hotel
		db.Where("ID = ?", request.HotelID).First(&hotel)

		if hotel.ID == 0 {
			tx.Rollback()
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Hotel not found",
			})
		}

		roomDetail := models.RoomDetail{
			HotelID:         request.HotelID,
			Name:            request.Name,
			Price:           request.Price,
			Images:          imagesJSON,
			IsFreeBreakfast: request.RoomFacilities.IsFreeBreakfast,
			IsFreeWifi:      request.RoomFacilities.IsFreeWifi,
			IsNonSmoking:    request.RoomFacilities.IsNonSmoking,
			IsRefundable:    request.RoomFacilities.IsRefundable,
			IsReschedule:    request.RoomFacilities.IsReschedule,
			Guest:           request.Guest,
			Bed:             request.Bed,
			Area:            request.Area,
			Allocation:      request.Allocation,
		}

		if err := tx.Create(&roomDetail).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Could not create room detail"})
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Could not commit transaction"})
	}

	return c.JSON(fiber.Map{"message": "Success"})
}

func GetHotelAndRoomDetails(c *fiber.Ctx) error {
	hotelQuery := c.Query("hotelId")
	roomQuery := c.Query("roomId")

	hotelId, err := strconv.Atoi(hotelQuery)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid hotelId"})
	}

	var roomId int
	if roomQuery != "" {
		roomId, err = strconv.Atoi(roomQuery)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid roomId"})
		}
	}

	db := database.GetDB()

	var hotel models.Hotel
	query := db.Preload("City").
		Preload("City.Country").
		Preload("Facilities").
		Preload("RoomDetails", func(db *gorm.DB) *gorm.DB {
			if roomQuery != "" {
				return db.Where("id = ?", roomId)
			}
			return db
		}).
		Where("id = ?", hotelId)

	if err := query.First(&hotel).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to retrieve hotel"})
	}

	return c.JSON(hotel)
}

func CreateCompleteHotelTransaction(c *fiber.Ctx) error {
	type HotelTransactionRequest struct {
		CheckInTime  string `json:"checkInTime"`
		CheckOutTime string `json:"checkOutTime"`
		HotelID      uint   `json:"hotelId"`
		RoomDetailID uint   `json:"roomDetailId"`
	}

	var request struct {
		UserID           uint                    `json:"userId"`
		Price            uint                    `json:"price"`
		TransactionDate  string                  `json:"transactionDate"`
		Status           string                  `json:"status"`
		HotelTransaction HotelTransactionRequest `json:"hotelTransaction"`
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

	reservationCode, err := generateReservationCode(request.HotelTransaction.HotelID, request.HotelTransaction.RoomDetailID)
    if err != nil {
        tx.Rollback()
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to generate reservation code", "error": err.Error()})
    }

    checkInTime, err := time.Parse("2006-01-02T15:04:05.000Z", request.HotelTransaction.CheckInTime)
    if err != nil {
        tx.Rollback()
        return c.JSON(fiber.Map{"message": "Invalid check-in date"})
    }

    checkOutTime, err := time.Parse("2006-01-02T15:04:05.000Z", request.HotelTransaction.CheckOutTime)
    if err != nil {
        tx.Rollback()
        return c.JSON(fiber.Map{"message": "Invalid check-out date"})
    }

	if checkInTime.After(checkOutTime) {
        tx.Rollback()
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Check-in date must be before check-out date"})
    }

	var roomDetail models.RoomDetail
    if err := db.Where("id = ?", request.HotelTransaction.RoomDetailID).First(&roomDetail).Error; err != nil {
        tx.Rollback()
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to find room detail", "error": err.Error()})
    }

    if roomDetail.Allocation <= 0 {
        tx.Rollback()
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "No allocations left for the selected room"})
    }

    hotelTransaction := models.HotelTransaction{
        HotelID:           request.HotelTransaction.HotelID,
        RoomDetailID:      request.HotelTransaction.RoomDetailID,
        ReservationCode:   reservationCode,
        UserTransactionID: userTransaction.ID,
        CheckInTime:       checkInTime,
        CheckOutTime:      checkOutTime,
    }

    if err := tx.Create(&hotelTransaction).Error; err != nil {
        tx.Rollback()
        return c.JSON(fiber.Map{"message": "Failed to create hotel transaction", "error": err.Error()})
    }

    tx.Commit()
    return c.JSON(fiber.Map{"message": "Success", "reservationCode": reservationCode})

}


func UpdateHotelTime(c *fiber.Ctx) error {
	type UpdateCheckInOutRequest struct {
		ReservationCode string `json:"reservationCode"`
		CheckInTime     string `json:"checkInTime"`
		CheckOutTime    string `json:"checkOutTime"`
	}

	var request UpdateCheckInOutRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Request parsing failed"})
	}

	checkInTime, err := time.Parse("2006-01-02T15:04:05.000Z", request.CheckInTime)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid check-in date format"})
	}

	checkOutTime, err := time.Parse("2006-01-02T15:04:05.000Z", request.CheckOutTime)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid check-out date format"})
	}

	if checkInTime.After(checkOutTime) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Check-in date must be before check-out date"})
	}

	db := database.GetDB()
	var hotelTransaction models.HotelTransaction

	if err := db.Where("reservation_code = ?", request.ReservationCode).First(&hotelTransaction).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "Hotel transaction not found"})
	}

	hotelTransaction.CheckInTime = checkInTime
	hotelTransaction.CheckOutTime = checkOutTime

	if err := db.Save(&hotelTransaction).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to update hotel transaction", "error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Hotel transaction updated successfully", "reservationCode": request.ReservationCode})
}