package database

import (
	"fmt"

	"github.com/christopher-alden/trAveLohi/models"
)

func seedLocations() {
	db := GetDB()
	countries := []models.Country{
		{Name: "United States"},
		{Name: "Japan"},
		{Name: "United Kingdom"},
		{Name: "France"},
		{Name: "Germany"},
		{Name: "United Arab Emirates"},
		{Name: "Singapore"},
		{Name: "South Korea"},
		{Name: "Netherlands"},
		{Name: "Australia"},
		{Name: "Canada"},
		{Name: "China"},
		{Name: "India"},
		{Name: "Brazil"},
		{Name: "Russia"},
		{Name: "Mexico"},
		{Name: "Turkey"},
		{Name: "Thailand"},
		{Name: "Indonesia"},
	}

	for _, country := range countries {
		db.FirstOrCreate(&country, models.Country{Name: country.Name})
	}

	cities := map[string]map[string]string{
		"United States": {
			"New York": "America/New_York",
			"Los Angeles": "America/Los_Angeles",
			"Chicago": "America/Chicago",
			"San Francisco": "America/Los_Angeles",
			"Miami": "America/New_York",
		},
		"Japan": {
			"Tokyo": "Asia/Tokyo",
			"Osaka": "Asia/Tokyo",
			"Kyoto": "Asia/Tokyo",
			"Sapporo": "Asia/Tokyo",
			"Fukuoka": "Asia/Tokyo",
		},
		"United Kingdom": {
			"London": "Europe/London",
			"Birmingham": "Europe/London",
			"Liverpool": "Europe/London",
		},
		"France": {
			"Paris": "Europe/Paris",
			"Bordeaux": "Europe/Paris",
			"Marseille": "Europe/Paris",
		},
		"Germany": {
			"Berlin": "Europe/Berlin",
			"Munich": "Europe/Berlin",
			"Frankfurt": "Europe/Berlin",
		},
		"United Arab Emirates": {
			"Dubai": "Asia/Dubai",
		},
		"Singapore": {
			"Singapore": "Asia/Singapore",
		},
		"South Korea": {
			"Seoul": "Asia/Seoul",
			"Jeju": "Asia/Seoul",
		},
		"Netherlands": {
			"Amsterdam": "Europe/Amsterdam",
			"Eindhoven": "Europe/Amsterdam",
		},
		"Australia": {
			"Sydney": "Australia/Sydney",
			"Melbourne": "Australia/Melbourne",
		},
		"Canada": {
			"Montreal": "America/Toronto",
			"Ottawa": "America/Toronto",
		},
		"China": {
			"Beijing": "Asia/Shanghai",
			"Guangzhou": "Asia/Shanghai",
		},
		"India": {
			"Mumbai": "Asia/Kolkata",
		},
		"Brazil": {
			"Rio de Janeiro": "America/Sao_Paulo",
			"São Paulo": "America/Sao_Paulo",
		},
		"Indonesia": {
			"Jakarta": "Asia/Jakarta",
			"Binus": "Asia/Jakarta",
		},
	}

	for countryName, cityDetails := range cities {
		var country models.Country
		if err := db.Where("name = ?", countryName).First(&country).Error; err != nil {
			fmt.Printf("Could not find country '%s': %v\n", countryName, err)
			continue
		}
		for cityName, cityTimezone := range cityDetails {
			city := models.City{Name: cityName, CountryID: country.ID, LT: cityTimezone}
			db.FirstOrCreate(&city, models.City{Name: cityName, CountryID: country.ID, LT: cityTimezone})
		}
	}
	

	airports := []struct {
		Name string
		City string
		Code string
	}{
		{Name: "John F. Kennedy International Airport", City: "New York", Code: "JFK"},
		{Name: "Los Angeles International Airport", City: "Los Angeles", Code: "LAX"},
		{Name: "Midway International Airport", City: "Chicago", Code: "MDW"},
		{Name: "San Francisco International Airport", City: "San Francisco", Code: "SFO"},
		{Name: "Miami International Airport", City: "Miami", Code: "MIA"},

		{Name: "Narita International Airport", City: "Tokyo", Code: "NRT"},
		{Name: "Kansai International Airport", City: "Osaka", Code: "KIX"},
		{Name: "New Chitose Airport", City: "Sapporo", Code: "CTS"},
		{Name: "Fukuoka Airport", City: "Fukuoka", Code: "FUK"},

		{Name: "London City Airport", City: "London", Code: "LCY"},
		{Name: "Birmingham Airport", City: "Birmingham", Code: "BHX"},
		{Name: "Liverpool John Lennon Airport", City: "Liverpool", Code: "LPL"},

		{Name: "Charles de Gaulle Airportt", City: "Paris", Code: "CDG"},
		{Name: "Bordeaux–Mérignac Airport", City: "Bordeaux", Code: "BOD"},
		{Name: "Marseille Provence Airport", City: "Marseille", Code: "MRS"},

		{Name: "Berlin Brandenburg Airport", City: "Berlin", Code: "BER"},
		{Name: "Munich Airport", City: "Munich", Code: "MUC"},
		{Name: "Frankfurt Airport", City: "Frankfurt", Code: "FRA"},

		{Name: "Dubai International Airport", City: "Dubai", Code: "DXB"},

		{Name: "Changi Airport", City: "Singapore", Code: "SIN"},

		{Name: "Incheon International Airport", City: "Seoul", Code: "ICN"},
		{Name: "Jeju International Airport", City: "Jeju", Code: "CJU"},

		{Name: "Amsterdam Airport Schiphol", City: "Amsterdam", Code: "AMS"},
		{Name: "Eindhoven Airport", City: "Eindhoven", Code: "EIN"},

		{Name: "Sydney Airport", City: "Sydney", Code: "SYD"},
		{Name: "Melbourne Airport", City: "Melbourne", Code: "MEL"},

		{Name: "Montréal–Trudeau International Airport", City: "Montreal", Code: "YUL"},
		{Name: "Ottawa Macdonald–Cartier International Airport", City: "Ottawa", Code: "YOW"},

		{Name: "Beijing Capital International Airport", City: "Beijing", Code: "PEK"},
		{Name: "Guangzhou Baiyun International Airport", City: "Guangzhou", Code: "CAN"},

		{Name: "Chhatrapati Shivaji Maharaj International Airport", City: "Mumbai", Code: "BOM"},

		{Name: "Rio de Janeiro International Airport", City: "Rio de Janeiro", Code: "GIG"},
		{Name: "São Paulo International Airport", City: "São Paulo", Code: "GRU"},

		{Name: "Soekarno–Hatta International Airport", City: "Jakarta", Code: "CGK"},
		{Name: "Binus University Airport", City: "Binus", Code: "BNS"},
	}

	for _, airport := range airports {
		var city models.City
		if err := db.Where("name = ?", airport.City).First(&city).Error; err != nil {
			fmt.Printf("Could not find city '%s' for airport seeding: %v\n", airport.City, err)
			continue
		}
		newAirport := models.Airport{Name: airport.Name, CityID: city.ID, Code: airport.Code}
		db.FirstOrCreate(&newAirport, models.Airport{Code: airport.Code})
	}
}
