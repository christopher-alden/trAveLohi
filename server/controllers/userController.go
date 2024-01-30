package controllers

import (
	"fmt"
	"math/rand"

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

	database.DB.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func generateOTP() string {
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

func ValidateResetPasswordEmail(c *fiber.Ctx) error {
    email := c.Query("email")

    var user models.User
    database.DB.Where("email = ?", email).First(&user)

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
