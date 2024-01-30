package routes

import (
	"github.com/christopher-alden/trAveLohi/controllers"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.User)
	app.Post("/api/logout", controllers.Logout)
	app.Post("/api/send-welcome-email", controllers.SendWelcomeEmailHandler)
	app.Post("/api/send-otp-email", controllers.SendOTPEmailHandler)
	app.Post("/api/login-otp", controllers.LoginOTP)
	app.Get("/api/validate-reset-password-email", controllers.ValidateResetPasswordEmail)
}
