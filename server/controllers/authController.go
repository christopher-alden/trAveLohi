package controllers

import (
	"regexp"
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
	var request struct {
		FirstName              string `json:"firstName"`
		LastName               string `json:"lastName"`
		Email                  string `json:"email"`
		Password               string `json:"password"`
		Gender                 string `json:"gender"`
		DateOfBirth            string `json:"dateOfBirth"`
		ProfilePhoto           string `json:"profilePhoto"`
		SecurityQuestion       string `json:"securityQuestion"`
		SecurityQuestionAnswer string `json:"securityQuestionAnswer"`
		Role                   string `json:"role"`
		IsBanned               string `json:"isBanned"`
		IsNewsletter           string `json:"isNewsletter"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Request parsing failed"})
	}

	nameRegex := regexp.MustCompile(`^[a-zA-Z]{5,}$`)
	if !nameRegex.MatchString(request.FirstName) || !nameRegex.MatchString(request.LastName) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "First name and last name must be more than 5 characters and contain no symbols or numbers"})
	}

	dob, err := time.Parse("2006-01-02", request.DateOfBirth)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid date of birth format"})
	}
	if time.Now().Year()-dob.Year() < 13 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User must be at least 13 years old"})
	}

	if request.Gender != "Male" && request.Gender != "Female" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Gender must be male or female"})
	}

	var existingUser models.User
	db := database.GetDB()
	db.Where("email = ?", request.Email).First(&existingUser)
	if existingUser.Email == request.Email {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "User already exists"})
	}

	password, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	isBanned := request.IsBanned == "true"
	isNewsletter := request.IsNewsletter == "true"

	user := models.User{
		FirstName:              request.FirstName,
		LastName:               request.LastName,
		Email:                  request.Email,
		Password:               password,
		Gender:                 request.Gender,
		DateOfBirth:            dob,
		ProfilePhoto:           request.ProfilePhoto,
		SecurityQuestion:       request.SecurityQuestion,
		SecurityQuestionAnswer: request.SecurityQuestionAnswer,
		Role:                   request.Role,
		IsBanned:               isBanned,
		IsNewsletter:           isNewsletter,
	}

	db.Create(&user)
	return c.JSON(fiber.Map{"message": "User registered successfully"})
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

	if user.IsBanned {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "User is banned",
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
