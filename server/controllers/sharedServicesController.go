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

    var airports []models.Airport

    db := database.GetDB()

    result := db.
        Model(&models.Airport{}).
        Joins("JOIN cities ON cities.id = airports.city_id").
        Joins("JOIN countries ON countries.id = cities.country_id").
        Preload("City").
        Preload("City.Country").
        Where("airports.name ILIKE ? OR cities.name ILIKE ? OR countries.name ILIKE ? OR airports.code ILIKE ?", queryTerm, queryTerm, queryTerm, queryTerm).
        Limit(5).
        Find(&airports)

    if result.Error != nil {
        fmt.Printf("Error fetching airport details: %v\n", result.Error)
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to fetch airport details"})
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

func SearchCities(c *fiber.Ctx) error {
	searchTerm := c.Query("name") 

	var cities models.City
	db := database.GetDB()

	if err := db.Joins("Country").Where("city.name LIKE ? OR country.name LIKE ?", "%"+searchTerm+"%", "%"+searchTerm+"%").First(&cities).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to search for cities"})
	}

	return c.JSON(cities)
}