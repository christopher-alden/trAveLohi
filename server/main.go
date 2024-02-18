package main

import (
	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()
	database.Connect()
	// database.Seed()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
	}))

	routes.Setup(app)
	app.Listen(":8000")
}
