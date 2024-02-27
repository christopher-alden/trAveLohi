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

