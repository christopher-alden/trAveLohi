package database

import (
	"fmt"
	"strings"

	"github.com/christopher-alden/trAveLohi/models"
)

func seedFlights() {
	db := GetDB()

	airlines := []models.Airline{
		{Name: "AirAsia"},
		{Name: "Garuda Indonesia"},
		{Name: "Lion Air"},
		{Name: "Singapore Airlines"},
		{Name: "American Airlines"},
		{Name: "Delta Air Lines"},
		{Name: "United Airlines"},
		{Name: "Qantas Airways"},
		{Name: "Air Canada"},
		{Name: "Lufthansa"},
		{Name: "British Airways"},
		{Name: "Air France"},
		{Name: "All Nippon Airways"},
		{Name: "Emirates"},
		{Name: "Cathay Pacific"},
	}

	for _, airline := range airlines {
		err := db.FirstOrCreate(&airline, models.Airline{Name: airline.Name}).Error
		if err != nil {
			fmt.Printf("Failed to seed airline '%s': %v", airline.Name, err)
		}
	}

	routes := []struct {
		DepartureID    uint
		ArrivalID      uint
		FlightDuration uint // minutes
		Price          uint  // USD
	}{
		// -- NORTH AMERICA --
		// Within NA
		{27, 28, 120, 90}, // YUL (Montreal) to YOW (Ottawa)
		{1, 27, 540, 650}, // JFK (New York) to YUL (Montreal)
		// NA to Asia
		{1, 6, 840, 1000},   // JFK (New York) to NRT (Tokyo)
		{2, 20, 1020, 1100}, // LAX (Los Angeles) to SIN (Singapore)
		// NA to Europe
		{3, 13, 495, 650}, // MDW (Chicago) to CDG (Paris)
		{3, 11, 480, 500}, // MDW (Chicago) to BHX (Birmingham)
		// NA to SA
		{5, 33, 480, 400}, // MIA (Miami) to GRU (São Paulo)
		// NA to Middle East
		{2, 19, 960, 1100}, // LAX (Los Angeles) to DXB (Dubai)
		// NA to Australia
		{28, 26, 65, 80}, // YOW (Ottawa) to MEL (Melbourne)

		// -- SOUTH AMERICA --
		// SA to NA
		{32, 5, 525, 650}, // GIG (Rio de Janeiro) to MIA (Miami)
		{1, 32, 480, 550}, // JFK (New York) to GIG (Rio de Janeiro)
		// SA to Asia
		{33, 34, 55, 90},   // GRU (São Paulo) to CGK (Jakarta)
		{32, 31, 480, 400}, // GIG (Rio de Janeiro) to BOM (Mumbai)

		// -- EUROPE --
		// Within Europe
		{16, 17, 75, 150},  // BER (Berlin) to MUC (Munich)
		{13, 23, 120, 200}, // CDG (Paris) to AMS (Amsterdam)
		{14, 15, 45, 80},   // BOD (Bordeaux) to MRS (Marseille)
		{24, 23, 90, 110},  // EIN (Eindhoven) to AMS (Amsterdam)
		{11, 12, 45, 50},   // BHX (Birmingham) to LPL (Liverpool)
		{10, 18, 95, 200},  // LCY (London) to FRA (Frankfurt)
		{17, 16, 75, 150},  // MUC (Munich) to BER (Berlin)
		{23, 13, 65, 120},  // AMS (Amsterdam) to CDG (Paris)
		{12, 10, 55, 60},   // LPL (Liverpool) to LCY (London)
		{15, 14, 50, 70},   // MRS (Marseille) to BOD (Bordeaux)
		{18, 24, 110, 200}, // FRA (Frankfurt) to EIN (Eindhoven)
		{13, 23, 75, 130},  // CDG (Paris) to AMS (Amsterdam)
		{12, 10, 50, 70},   // LPL (Liverpool) to LCY (London)
		{15, 13, 45, 90},   // MRS (Marseille) to CDG (Paris)
		{18, 17, 85, 100},  // FRA (Frankfurt) to MUC (Munich)
		// Europe to North America
		{10, 1, 435, 700}, // LCY (London) to JFK (New York)
		{13, 4, 660, 750}, // CDG (Paris) to SFO (San Francisco)
		{11, 3, 480, 550}, // BHX (Birmingham) to MDW (Chicago)

		// -- ASIA --
		// Within Asia
		{20, 34, 105, 100}, // SIN (Singapore) to CGK (Jakarta)
		{9, 7, 120, 130},   // FUK (Fukuoka) to KIX (Osaka)
		{21, 22, 55, 70},   // ICN (Seoul) to CJU (Jeju)
		{7, 8, 75, 120},    // KIX (Osaka) to CTS (Sapporo)
		{29, 30, 180, 300}, // PEK (Beijing) to CAN (Guangzhou)
		{6, 21, 165, 300},  // NRT (Tokyo) to ICN (Seoul)
		{8, 9, 105, 130},   // CTS (Sapporo) to FUK (Fukuoka)
		{22, 7, 60, 90},    // CJU (Jeju) to KIX (Osaka)
		{7, 6, 165, 320},   // KIX (Osaka) to NRT (Tokyo)
		{8, 21, 130, 200},  // CTS (Sapporo) to ICN (Seoul)
		{34, 20, 120, 150}, // CGK (Jakarta) to SIN (Singapore)
		{22, 6, 120, 180},  // CJU (Jeju) to NRT (Tokyo)
		{34, 6, 440, 850},  // CGK (Jakarta) to NRT (Tokyo)
		{20, 6, 365, 410},  // SIN (Singapore) to NRT (Tokyo)
		{34, 21, 430, 570}, // CGK (Jakarta) to ICN (Seoul)
		{20, 21, 480, 290}, // SIN (Singapore) to ICN (Seoul)
		{6, 34, 480, 780},  // NRT to CGK
		{6, 20, 355, 435},  // NRT to SIN
		{21, 34, 490, 910}, // ICN to CKG
		{21, 20, 320, 680}, // ICN to SIN

		// Asia to Australia
		{6, 25, 565, 800},  // NRT (Tokyo) to SYD (Sydney)
		{20, 25, 495, 700}, // SIN (Singapore) to SYD (Sydney)
		// Asia to SA
		{31, 32, 120, 160}, // BOM (Mumbai) to GIG (Rio de Janeiro)
		{34, 33, 120, 160}, // CGK (Jakarta) to GRU (São Paulo)

		// -- AUSTRALIA --
		// Australia to NA
		{26, 27, 1320, 950}, // MEL (Melbourne) to YUL (Montreal)
		{26, 28, 1320, 900}, // MEL (Melbourne) to YOW (Ottawa)
		// Australia to Asia
		{25, 20, 600, 850}, // SYD (Sydney) to SIN (Singapore)

		// -- MIDDLE EAST --
		// Middle East to Europe
		{19, 10, 420, 600}, // DXB (Dubai) to LCY (London)
		// Middle East to NA
		{19, 2, 900, 1000}, // DXB (Dubai) to LAX (Los Angeles)
	}

	for _, route := range routes {
		flightRoute := models.FlightRoute{
			DepartureID:    route.DepartureID,
			ArrivalID:      route.ArrivalID,
			FlightDuration: route.FlightDuration,
			Price:          route.Price,
		}

		if err := db.FirstOrCreate(&flightRoute, models.FlightRoute{DepartureID: route.DepartureID, ArrivalID: route.ArrivalID, FlightDuration: route.FlightDuration, Price: route.Price}).Error; err != nil {
			fmt.Printf("Failed to create flight route from %d to %d: %v", route.DepartureID, route.ArrivalID, err)
		}
	}

	airlineRoutes := map[uint][]uint{
		// AirAsia - Focuses mainly on Asia with key international routes
		1: {44, 34, 48, 52, 37, 40, 47, 50, 36},

		// Garuda Indonesia - Indonesia's flagship, covering domestic and major international routes
		2: {3, 44, 34, 20, 48, 52, 12, 33, 55, 13, 23, 25, 26},

		// Lion Air - Focuses on domestic and short to medium-haul Asian routes
		3: {34, 44, 20, 48, 21, 22, 40, 41, 42, 47, 50, 6},

		// Singapore Airlines - A global network covering Asia, Europe, Americas, and Oceania
		4: {3, 44, 4, 53, 58, 52, 19, 60, 10, 29, 30, 31, 32, 35, 36, 37, 38, 39, 43, 45},

		// American Airlines - Major US and international destinations
		5: {2, 5, 7, 10, 29, 30, 31, 32, 59, 60, 11, 33, 54, 56, 57},

		// Delta Air Lines - Extensive US network and international routes
		6: {2, 7, 10, 11, 29, 30, 31, 32, 59, 60, 12, 33, 54, 56, 57},

		// United Airlines - US and international, with a focus on trans-Pacific and trans-Atlantic
		7: {5, 7, 8, 10, 30, 31, 32, 59, 60, 13, 34, 44, 53, 58},

		// Qantas Airways - Focus on connecting Australia with Asia, Americas, and Europe
		8: {52, 53, 56, 57, 58, 20, 48, 34, 44, 3, 4, 19, 60},

		// Air Canada - Connecting Canada with major hubs in Europe, Asia, and the Americas
		9: {1, 8, 9, 59, 60, 2, 5, 7, 10, 30, 31},

		// Lufthansa - Major European network with extensive global connections
		10: {14, 19, 20, 24, 28, 30, 13, 23, 25, 26, 27},

		// British Airways - UK and global destinations, strong presence in Europe and North America
		11: {15, 18, 19, 22, 29, 10, 30, 13, 23, 32, 59},

		// Air France - France, European network, and international routes
		12: {5, 15, 23, 25, 27, 30, 32, 59, 13, 23},

		// All Nippon Airways (ANA) - Japanese domestic and international routes, especially to Asia and North America
		13: {3, 33, 34, 37, 40, 44, 6, 21, 52, 53},

		// Emirates - Middle Eastern hub connecting to Asia, Europe, Americas, and Africa
		14: {4, 8, 19, 59, 60, 10, 29, 30, 31, 32, 35, 36, 37},

		// Cathay Pacific - Focus on connecting Hong Kong with Asia, Europe, North America, and Australia
		15: {52, 53, 58, 3, 44, 6, 21, 37, 40, 4, 19, 60},
	}

	for airlineID, routeIDs := range airlineRoutes {
		var airline models.Airline
		if err := db.First(&airline, airlineID).Error; err != nil {
			fmt.Printf("Airline not found: %v\n", err)
			continue
		}

		for _, routeID := range routeIDs {
			var route models.FlightRoute
			if err := db.First(&route, routeID).Error; err != nil {
				fmt.Printf("Route not found: %v\n", err)
				continue
			}

			err := db.Model(&airline).Association("FlightRoutes").Append(&route)
			if err != nil {
				fmt.Printf("Failed to assign route %d to airline %d: %v\n", routeID, airlineID, err)
			}
		}
	}

	airplaneModels := []struct {
		Type       string
		TotalSeats int
		SeatLayout map[string]int
	}{
		{"Airbus A320", 180, map[string]int{"Economy": 168, "Business": 12}},
		{"Boeing 737-800", 160, map[string]int{"Economy": 144, "Business": 16}},
		{"Airbus A330-300", 277, map[string]int{"Economy": 247, "Business": 30}},
		{"Boeing 777-300ER", 396, map[string]int{"Economy": 306, "Business": 58, "First Class": 32}},
		{"Boeing 787-9", 236, map[string]int{"Economy": 198, "Business": 28, "Premium Economy": 10}},
	}

	airlineKey := []uint{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}

	for _, airlineID := range airlineKey {
		for i, modelDetail := range airplaneModels {
			if i >= 5 {
				break
			}
			airplaneCode := strings.ToUpper(fmt.Sprintf("%s%02d%d", modelDetail.Type[:2], airlineID, i+1))
			airplane := models.Airplane{
				Code:      airplaneCode,
				AirlineID: airlineID,
				Type:      modelDetail.Type,
				IsAvailable: true,
			}
			db.FirstOrCreate(&airplane, models.Airplane{Code: airplaneCode})
			seatNumber := 1
	
			for class, seats := range modelDetail.SeatLayout {
				for s := 0; s < seats; s++ {
					seatCode := fmt.Sprintf("%d%s", seatNumber, "A")
					seat := models.SeatDetail{
						AirplaneID:  airplane.ID,
						Code:        seatCode,
						Class:       class,
						IsAvailable: true,
					}
					db.FirstOrCreate(&seat, models.SeatDetail{AirplaneID: airplane.ID, Code: seatCode})
					seatNumber++
				}
			}
		}
		
	}

	
}
