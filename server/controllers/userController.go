package controllers

import (
	"fmt"
	"math/rand"
	"strconv"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt_token_cookie")
	token, err :=  jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token)(interface{}, error){
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

	db:= database.GetDB()
	db.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func generateOTP() string {
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

func ValidateResetPasswordEmail(c *fiber.Ctx) error {
    email := c.Query("email")

    var user models.User
	db:= database.GetDB()
    db.Where("email = ?", email).First(&user)

    if user.ID == 0 {
        c.Status(fiber.StatusNotFound)
        return c.JSON(fiber.Map{
            "message": "User Not Found",
        })
    }

    return c.JSON(fiber.Map{
        "message": "Success",
		"securityQuestion": user.SecurityQuestion,
    })
}

func GetAllUser(c *fiber.Ctx) error{

	limitQuery :=  c.Query("limit", "10")
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

	if int64(offset)>= totalCount {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Offset is larger than the total number of records"})
	}

	if result := db.Offset(offset).Limit(limit).Find(&users); result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to fetch promos"})
    }

    return c.JSON(users)

}
