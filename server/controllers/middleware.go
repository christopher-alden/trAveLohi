package controllers

import (
	"fmt"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

func AdminOnly(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt_token_cookie")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil{
		fmt.Print("no token")
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Not Authenthicated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	db:= database.GetDB()
	db.Where("id = ?", claims.Issuer).First(&user)

	if user.Role != "admin" {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message":"Not Authorized",
		})
	}

	return c.Next()
}
