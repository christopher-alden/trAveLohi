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
	app.Get("/api/get-airports", controllers.GetAirports)
	app.Get("/api/get-user-promos", controllers.GetUserPromos)


	
	app.Post("/api/create-promo",controllers.AdminOnly, controllers.CreatePromo)
	app.Get("/api/get-all-promos", controllers.AdminOnly, controllers.GetAllPromos)

	app.Get("/api/get-all-users", controllers.AdminOnly, controllers.GetAllUser)
	app.Get("/api/get-flight-routes", controllers.GetFlightRoutes)
	app.Get("/api/get-airline-from-routes", controllers.GetAirlineFromRoutes)
	app.Get("/api/get-available-airplane", controllers.GetAvailableAirplane)
	app.Post("/api/create-flight", controllers.CreateFlight)
	app.Get("/api/get-all-pending-flights", controllers.GetAllPendingFlights)
	app.Get("/api/get-flights-from-location", controllers.GetFlightFromLocation)
}
