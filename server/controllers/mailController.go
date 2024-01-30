package controllers

import (
	"os"
	"strings"
	"time"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/mail"
	"github.com/christopher-alden/trAveLohi/models"
	"github.com/gofiber/fiber/v2"
)

func SendWelcomeEmailHandler(c *fiber.Ctx) error {
	var request struct {
		Subject   string `json:"subject"`
		To        string `json:"to"`
		FirstName string `json:"firstName"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request")
	}

	htmlContent, err := os.ReadFile("./mail/welcomeTemplate.html")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to load email template")
	}

	sender := mail.GmailSender{
		Name:              "trAveLohi AL",
		FromEmailAddress:  "travelohi.al@gmail.com",
		FromEmailPassword: "ucjfsdyiuamhwbvl",
	}

	if err := sender.SendEmail(request.Subject, string(htmlContent), request.To, nil, nil, nil); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to send email")
	}

	return c.SendString("Email sent successfully")
}


func SendOTPEmailHandler(c *fiber.Ctx) error {
	var request struct {
		Subject string `json:"subject"`
		To      string `json:"to"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request")
	}

	var user models.User

	database.DB.Where("email = ?", request.To).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Invalid email",
		})
	}

	var otp models.OTP

	database.DB.Where("user_id = ?", user.ID).First(&otp)

	newOTP := generateOTP()

	expirationTime := time.Now().Add(10 * time.Minute)

	if otp.ID == 0 {
		otp = models.OTP{
			UserID:    user.ID,
			OTP:       newOTP,
			ExpiresAt: expirationTime,
		}
		database.DB.Create(&otp)
	} else {
		otp.OTP = newOTP
		otp.ExpiresAt = expirationTime
		database.DB.Save(&otp)
	}

	htmlContent, err := os.ReadFile("./mail/OTP.html")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to load email template")
	}

	htmlString := string(htmlContent)
	htmlString = strings.ReplaceAll(htmlString, "{OTP}", newOTP)
	htmlString = strings.ReplaceAll(htmlString, "{USER}", user.FirstName)

	sender := mail.GmailSender{
		Name:              "trAveLohi AL",
		FromEmailAddress:  "travelohi.al@gmail.com",
		FromEmailPassword: "ucjfsdyiuamhwbvl",
	}

	if err := sender.SendEmail(request.Subject, htmlString, request.To, nil, nil, nil); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to send email")
	}

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}
