package controllers

import (
	"errors"
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func BAN(c *fiber.Ctx) error {

	userIDParam := c.Params("ID")

	userId, err := strconv.Atoi(userIDParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "NaN"})
	}

	db := database.GetDB()

	var user models.User
	db.Where("id = ?", userId).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User Not Found",
		})
	}

	user.IsBanned = !user.IsBanned
	db.Save(&user)

	return c.JSON(fiber.Map{
		"message": "User Banned Successfully",
		"user":    user,
	})
}

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt_token_cookie")
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Not Authenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	db := database.GetDB()
	db.Where("id = ?", claims.Issuer).Preload("UserCC").First(&user)

	return c.JSON(user)
}

func generateOTP() string {
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

func ValidateResetPasswordEmail(c *fiber.Ctx) error {
	email := c.Query("email")

	var user models.User
	db := database.GetDB()
	db.Where("email = ?", email).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User Not Found",
		})
	}

	if user.IsBanned {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "User Is Banned",
		})
	}

	return c.JSON(fiber.Map{
		"message":          "Success",
		"securityQuestion": user.SecurityQuestion,
	})
}

func GetAllUser(c *fiber.Ctx) error {

	limitQuery := c.Query("limit", "10")
	offsetQuery := c.Query("offset", "0")

	limit, err := strconv.Atoi(limitQuery)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid limit value"})
	}

	offset, err := strconv.Atoi(offsetQuery)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid offset value"})
	}

	var users []models.User
	db := database.GetDB()

	var totalCount int64
	db.Model(&models.User{}).Count(&totalCount)

	if int64(offset) >= totalCount {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Offset is larger than the total number of records"})
	}

	if result := db.Offset(offset).Limit(limit).Find(&users); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to fetch promos"})
	}

	return c.JSON(users)

}

// func CreateUserTransaction(c *fiber.Ctx) error{
// 	var request struct{
// 		UserID          uint      `json:"userId"`
// 		Price           uint      `json:"price"`
// 		TransactionDate string `json:"transactionDate"`
// 		Status string `json:"status"`
// 	}

// 	if err := c.BodyParser(&request); err != nil {
// 		c.Status(fiber.StatusBadRequest)
// 		return c.JSON(fiber.Map{"message": "Failed request"})
// 	}

// 	transactionDate, err := time.Parse("2006-01-02T15:04:05.000Z", request.TransactionDate)
// 	if err != nil {
// 		fmt.Println("error in departure time parsing", err)
// 		return err
// 	}

// 	db := database.GetDB()

// 	userTransaction := models.UserTransaction{
// 		UserID: request.UserID,
// 		Price: request.Price,
// 		TransactionDate: transactionDate,
// 		Status: request.Status,
// 	}
// 	db.Create(&userTransaction)

// 	return c.JSON(fiber.Map{
// 		"message": "Success",
// 		"userTransaction": userTransaction,
// 	})
// }

func UpdateOrCreateUserCC(c *fiber.Ctx) error {
	type UserCCRequest struct {
		UserID uint   `json:"userId" validate:"required"`
		Number string `json:"number" validate:"required"`
		Type   string `json:"type" validate:"required"`
		CVV    string `json:"cvv" validate:"required"`
		Name   string `json:"name" validate:"required"`
	}

	var request UserCCRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Error parsing request"})
	}

	db := database.GetDB()

	var userCC models.UserCC
	result := db.Where("user_id = ?", request.UserID).First(&userCC)

	if result.Error == nil {
		userCC.Number = request.Number
		userCC.Type = request.Type
		userCC.CVV = request.CVV
		userCC.Name = request.Name
		if err := db.Save(&userCC).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error updating credit card details"})
		}
	} else if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		newUserCC := models.UserCC{
			UserID: request.UserID,
			Number: request.Number,
			Type:   request.Type,
			CVV:    request.CVV,
			Name:   request.Name,
		}
		if err := db.Create(&newUserCC).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error creating credit card details"})
		}
	} else {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Database error"})
	}

	return c.JSON(fiber.Map{"message": "Credit card details processed successfully"})
}

func UpdateUserProfile(c *fiber.Ctx) error {
	type UpdateUserRequest struct {
		UserID       uint    `json:"userId"`
		FirstName    *string `json:"firstName"`
		LastName     *string `json:"lastName"`
		PhoneNumber  *string `json:"phoneNumber"`
		Gender       *string `json:"gender"`
		DateOfBirth  *string `json:"dateOfBirth"`
		Address      *string `json:"address"`
		Newsletter   *bool   `json:"isNewsletter"`
		ProfilePhoto *string `json:"profilePhoto"`
	}

	var request UpdateUserRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Error parsing request"})
	}

	var user models.User
	db := database.GetDB()
	if err := db.First(&user, request.UserID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "User not found"})
	}

	if request.FirstName != nil {
		user.FirstName = *request.FirstName
	}
	if request.LastName != nil {
		user.LastName = *request.LastName
	}
	if request.Gender != nil {
		user.Gender = *request.Gender
	}
	if request.PhoneNumber != nil {
		user.PhoneNumber = *request.PhoneNumber
	}
	if request.DateOfBirth != nil {
		dob, err := time.Parse("2006-01-02", *request.DateOfBirth)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid date format"})
		}
		user.DateOfBirth = dob
	}
	if request.Address != nil {
		user.Address = *request.Address
	}
	if request.Newsletter != nil {
		user.IsNewsletter = *request.Newsletter
	}
	if request.ProfilePhoto != nil {
		user.ProfilePhoto = *request.ProfilePhoto
	}

	if err := db.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error updating user"})
	}

	return c.JSON(fiber.Map{"message": "User updated successfully"})
}

func UpdatePassword(c *fiber.Ctx) error {
	type UpdatePasswordRequest struct {
		UserEmail              string `json:"userEmail"`
		SecurityQuestionAnswer string `json:"securityQuestionAnswer"`
		NewPassword            string `json:"newPassword"`
	}

	var request UpdatePasswordRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Error parsing request"})
	}

	db := database.GetDB()

	fmt.Println(request.UserEmail)
	fmt.Println(request.SecurityQuestionAnswer)
	var user models.User
	if err := db.Where("email ILIKE ?", request.UserEmail).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(request.NewPassword)); err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Old password match"})
	}

	if user.SecurityQuestionAnswer != request.SecurityQuestionAnswer {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Security question answer does not match"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	user.Password = hashedPassword
	if err := db.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update password"})
	}

	return c.JSON(fiber.Map{"message": "Password updated successfully"})
}


func ChangeHotelTransactionStatus(c *fiber.Ctx) error {
	var request struct {
		ReservationCode string  `json:"reservationCode"`
		PaidAmount      float64 `json:"paidAmount"`
		Mode            string  `json:"mode"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Request parsing failed"})
	}

	db := database.GetDB()
	var hotelTransaction models.HotelTransaction
	if err := db.Preload("UserTransaction").Where("reservation_code = ?", request.ReservationCode).First(&hotelTransaction).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "Hotel transaction not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error finding hotel transaction"})
	}

	if !hotelTransaction.CheckOutTime.After(hotelTransaction.CheckInTime) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Check-out date must be after check-in date"})
	}

	if hotelTransaction.CheckOutTime.Before(time.Now()) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Cannot check out with an expired transaction"})
	}
	var user models.User
	if err := db.Preload("UserCC").First(&user, hotelTransaction.UserTransaction.UserID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error finding user"})
	}

	switch request.Mode {
		case "credit":
			if user.UserCC.ID == 0 {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "No credit card found on user"})
			}

		case "wallet":
			if user.Balance < uint(request.PaidAmount) {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Insufficient wallet balance"})
			}
			user.Balance -= uint(request.PaidAmount)
			if err := db.Save(&user).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error updating user balance"})
			}

		default:
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid payment mode"})
    }

	userTransaction := &hotelTransaction.UserTransaction
	userTransaction.Status = "pending"
	if err := db.Save(userTransaction).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error updating transaction status"})
	}


	return c.JSON(fiber.Map{"message": "Hotel transaction status updated successfully to pending"})
}