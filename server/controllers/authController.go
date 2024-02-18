package controllers

import (
	"strconv"
	"time"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "secret"

func Register(c *fiber.Ctx) error {
	var request map[string]string
	if err := c.BodyParser(&request); err != nil {
		return err
	}

	var existingUser models.User
	db := database.GetDB()
	db.Where("email = ?", request["email"]).First((&existingUser))

	if existingUser.Email == request["email"] {
		c.Status(fiber.StatusConflict)
		return c.JSON(fiber.Map{
			"message": "User Already Exists",
		})
	}

	dob, err := time.Parse("2006-01-02", request["dateOfBirth"])
	if err != nil {
		return err
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(request["password"]), 14)

	isBanned := cvtBool(request["isBanned"])
	isNewsletter := cvtBool(request["isNewsletter"])
	
	user := models.User{
		FirstName:              request["firstName"],
		LastName:               request["lastName"],
		Email:                  request["email"],
		Password:               password,
		Gender:                 request["gender"],
		DateOfBirth:            dob,
		ProfilePhoto:           request["profilePhoto"],
		SecurityQuestion:       request["securityQuestion"],
		SecurityQuestionAnswer: request["securityQuestionAnswer"],
		Role:                   request["role"],
		IsBanned:               isBanned,
		IsNewsletter:           isNewsletter,
	}

	db.Create(&user)
	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func Login(c *fiber.Ctx) error {
	var request map[string]string
	if err := c.BodyParser(&request); err != nil {
		c.Status(fiber.StatusBadGateway)
		return c.JSON(fiber.Map{
			"message": "Error",
		})
	}

	var user models.User
	db := database.GetDB()
	db.Where("email = ?", request["email"]).First((&user))

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User Not Found",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(request["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Incorrect Password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Could Not Login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt_token_cookie",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func LoginOTP(c *fiber.Ctx) error {
	var request struct {
		Email string `json:"email"`
		OTP   string `json:"otp"`
	}
	if err := c.BodyParser(&request); err != nil {
		c.Status(fiber.StatusBadGateway)
		return c.JSON(fiber.Map{
			"message": "Error",
		})
	}

	var user models.User
	db := database.GetDB()
	db.Where("email = ?", request.Email).First((&user))

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User Not Found",
		})
	}

	var OTP models.OTP
	db.Where("ID = ?", user.ID).First((&OTP))

	if OTP.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch OTP",
		})
	}

	if request.OTP != OTP.OTP {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Could Not Login",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Could Not Login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt_token_cookie",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt_token_cookie",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}
