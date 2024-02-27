package controllers

import (
	"fmt"
	"strconv"

	"github.com/christopher-alden/trAveLohi/database"
	"github.com/christopher-alden/trAveLohi/models"
	"github.com/gofiber/fiber/v2"
)

func SearchAirports(c *fiber.Ctx) error {
	queryTerm := c.Query("term")
	queryTerm = "%" + queryTerm + "%"

	var airport models.Airport

    var results []map[string]interface{}

	db := database.GetDB()

	result := db.
		Model(&airport).
		Select(`airports.id, airports.name, airports.code, cities.name AS "city", countries.name AS "country"`).
		Joins("LEFT JOIN cities ON airports.city_id = cities.id").
		Joins("LEFT JOIN countries ON cities.country_id = countries.id").
		Where("airports.name ILIKE ? OR cities.name ILIKE ? OR countries.name ILIKE ? OR airports.code ILIKE ?", queryTerm, queryTerm, queryTerm, queryTerm).
		Limit(5).
		Scan(&results)

	if result.Error != nil {
		fmt.Printf("Error fetching airport details: %v\n", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to fetch airport details"})
	}

	var airports []models.AirportResponse
	for _, item := range results{
		var airport models.AirportResponse

		airport.ID = item["id"].(int64)
		airport.Name = item["name"].(string)
		airport.Code = item["code"].(string)
		airport.Country = item["country"].(string)
		airport.City = item["city"].(string)
		airports = append(airports, airport)
	}

	return c.JSON(airports)
}

func GetAirport(c *fiber.Ctx) error{
	queryId := c.Query("id")
	var airport models.Airport
	db := database.GetDB()

	id, err := strconv.Atoi(queryId)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid value"})
	}

	resultErr := db.Table("airports").
		Preload("City").
		Preload("City.Country").
		Where("airports.id = ?", id).Find(&airport).Error

	if resultErr != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message":"Failed to fetch city",
		})
	}

	return c.JSON(airport)
}

func GetCity(c *fiber.Ctx) error{
	queryCityId := c.Query("cityId")

	var city models.City
	db := database.GetDB()

	cityId, err := strconv.Atoi(queryCityId)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"message": "Invalid value"})
	}

	fmt.Print(cityId)
	resultErr := db.Table("cities").
		Preload("Country").
		Where("cities.id = ?", cityId).Find(&city).Error

	if resultErr != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message":"Failed to fetch city",
		})
	}

	return c.JSON(city)
}