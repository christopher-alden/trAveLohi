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
	app.Get("/api/search-airports", controllers.SearchAirports)
	app.Get("/api/get-city", controllers.GetCity)
	app.Get("/api/get-airport", controllers.GetAirport)
	app.Get("/api/get-user-promos", controllers.GetUserPromos)

	app.Post("/api/create-promo", controllers.AdminOnly, controllers.CreatePromo)
	app.Get("/api/get-all-promos", controllers.AdminOnly, controllers.GetAllPromos)

	app.Get("/api/get-all-users", controllers.AdminOnly, controllers.GetAllUser)
	app.Get("/api/get-flight-routes", controllers.GetFlightRoutes)
	app.Get("/api/get-airline-from-routes", controllers.GetAirlineFromRoutes)
	app.Get("/api/get-available-airplane", controllers.GetAvailableAirplane)
	app.Post("/api/create-flight", controllers.CreateFlight)
	app.Get("/api/get-all-pending-flights", controllers.GetAllPendingFlights)
	app.Get("/api/get-flights-from-location", controllers.GetFlightFromLocation)
	app.Get("/api/get-flight-details", controllers.GetFlightDetails)
	app.Get("/api/get-seat-details", controllers.GetSeatDetailsFromFlight)
	app.Get("/api/get-seat-amount", controllers.GetSeatAmountFromFlight)
	app.Post("/api/create-complete-flight-transaction", controllers.CreateCompleteFlightTransaction)
	// app.Post("/api/create-user-transaction", controllers.CreateUserTransaction)
	// app.Post("/api/create-flight-transaction", controllers.CreateFlightTransaction)
	// app.Post("/api/create-traveler", controllers.CreateTraveler)
	app.Patch("/api/user/:ID/ban", controllers.BAN)
	app.Post("/api/create-hotel", controllers.CreateHotel)
	app.Post("/api/create-room-details", controllers.CreateRoomDetails)
	app.Get("/api/get-all-hotels", controllers.GetAllHotel)
	app.Get("/api/get-hotel-and-room-details", controllers.GetHotelAndRoomDetails)
	app.Post("/api/create-complete-hotel-transaction", controllers.CreateCompleteHotelTransaction)
	app.Post("/api/update-user-profile", controllers.UpdateUserProfile)
	app.Post("/api/update-password", controllers.UpdatePassword)
	app.Post("/api/update-hotel-time", controllers.UpdateHotelTime)
	app.Put("/api/update-promo", controllers.UpdatePromo)

	app.Put("/api/user/cc", controllers.UpdateOrCreateUserCC)
	app.Get("/api/get-cart", controllers.GetCart)
	app.Get("/api/search-cities", controllers.SearchCities)
	app.Post("/api/hotel-pay", controllers.ChangeHotelTransactionStatus)


}
