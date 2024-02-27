package models

import (
	"time"

	"gorm.io/gorm"
)

type Airplane struct {
	gorm.Model
	Code        string       `gorm:"type:varchar(5);not null" json:"code"`
	AirlineID   uint         `gorm:"not null" json:"airlineId"`
	Type        string       `gorm:"type:varchar(100);not null" json:"type"`
	IsAvailable bool         `gorm:"default:true" json:"isAvailable"`
	Airline     Airline      `gorm:"foreignKey:AirlineID" json:"airline"`
	SeatDetails []SeatDetail `gorm:"foreignKey:AirplaneID" json:"seatDetails,omitempty"`
}

// Each Airline has an []AirlineRoutes and []Airplanes and []Flights
// : this means airline have its own routes, has an inventory of airplanes
// : then has its own Flights by taking Airplane and FlightRoute and combining it together
type Airline struct {
	gorm.Model
	Name         string        `gorm:"type:varchar(100);not null" json:"name"`
	Airplanes    []Airplane    `gorm:"foreignKey:AirlineID" json:"airplanes,omitempty"`
	FlightRoutes []FlightRoute `gorm:"many2many:airline_flight_routes;" json:"flightRoutes,omitempty"`
	Flights      []Flight      `gorm:"foreignKey:AirlineID" json:"flights,omitempty"`
}

// [MASTER] Seat details has a Many-1 relationship with Aiplane to avoid duplication
// : Should still have a unique ID for each seat, but there can be duplicate codes for different airplane
// : Availability is controlled by a trigger
// : Case 1: Insert in FlightTransaction would cause IsAvailable to be false
// : Case 2: Update of status = cancel in Flight or if past ArrivalTime would cause IsAvailability to be true
// : Case 3: If FlightTransaction is refunded would cause IsAvailability to be true
type SeatDetail struct {
	gorm.Model
	AirplaneID  uint     `gorm:"not null" json:"airplaneId"`
	Code        string   `gorm:"type:varchar(5);not null" json:"code"`
	Class       string   `gorm:"type:varchar(100);not null" json:"class"`
	IsAvailable bool     `gorm:"default:true" json:"isAvailable"`
	Airplane    Airplane `gorm:"foreignKey:AirplaneID" json:"airplane,omitempty"`
}

// [MASTER] This should define all the possible routes for Flight
// : Flight will get the departureID and ArrivalID from here
// : Admin should only be able to manipulate FlightRoutes and not make crazy routes by himself
// : FlightDuration is in minutes
// : Price should define the base price for each route, idc about the total price later that is the business logic
type FlightRoute struct {
	gorm.Model
	DepartureID    uint `gorm:"not null" json:"departureId"`
	ArrivalID      uint `gorm:"not null" json:"arrivalId"`
	FlightDuration uint `gorm:"not null" json:"flightDuration"`
	Price          uint `gorm:"not null" json:"price"`

	DepartureAirport Airport   `gorm:"foreignKey:DepartureID" json:"departureAirport,omitempty"`
	ArrivalAirport   Airport   `gorm:"foreignKey:ArrivalID" json:"arrivalAirport,omitempty"`
	Airlines         []Airline `gorm:"many2many:airline_flight_routes;" json:"airlines,omitempty"`
}

// [HEADER] This holds all the main headers regarding to flights
// : Flight related to User should be found in FlightTransactions
// : A Trigger will decide DepartureTime and ArrivalTime from the interval of FlightRoutes-FlightDuration ...
//
//	from AirlineRoute
//
// Untuk flight DepartureTime dan Arrifval time refer kepada flight itu saja
// Saat create akan juga ada departureDate dan rerturnDate, kolom tersebut untuk menentukan
// : kapan pesawat pergi dan balik bukan kapan berangkat dan sampai
// : arrivalTime harusnya ditentukan oleh business logic departureTime + flightRoute.duration
// : Status is flight status of 'on-going', 'cancelled', idc about 'delayed'
type Flight struct {
	gorm.Model
	AirplaneID    uint      `gorm:"not null" json:"airplaneId"`
	FlightRouteID uint      `gorm:"not null" json:"flightRouteId"`
	DepartureTime time.Time `gorm:"type:timestamp" json:"departureTime"`
	ArrivalTime   time.Time `gorm:"type:timestamp" json:"arrivalTime"`
	Status        string    `gorm:"type:varchar(50)" json:"status"`
	AirlineID     uint      `gorm:"not null" json:"airlineId"`

	Airplane    Airplane    `gorm:"foreignKey:AirplaneID" json:"airplane,omitempty"`
	FlightRoute FlightRoute `gorm:"foreignKey:FlightRouteID" json:"flightRoute,omitempty"`
	Airline     Airline     `gorm:"foreignKey:AirlineID" json:"airline,omitempty"`
}

// [TRANSACTION] This will hold flight reservations
// : Refer to TransactionID to get information related to User
// : Refer to FlightID to get all information related to Flights
// : This should encapsulate all information regarding the Flight and Traveller (like a Boarding Pass)
// : isRoundTrip does not determine anything, its just attribute to mark if the user chooses a round trip flight
// : To find Transaction details made by user, refer to UserTransactionID
// : Status is transaction status of 'on-going','completed','refunded'
type FlightTransaction struct {
	gorm.Model
	TicketCode        string `gorm:"type:varchar(10);not null;unique" json:"ticketCode"`
	UserTransactionID uint   `gorm:"not null" json:"userTransactionId"`
	FlightID          uint   `gorm:"not null" json:"flightId"`
	TravelerID        uint   `gorm:"not null" json:"travelerId"`
	SeatID            uint   `gorm:"not null" json:"seatId"`
	IsRoundTrip       bool   `gorm:"default:true" json:"isRoundTrip"`
	Baggage           uint   `gorm:"nullable" json:"baggage"`

	Flight          Flight          `gorm:"foreignKey:FlightID" json:"flight,omitempty"`
	UserTransaction UserTransaction `gorm:"foreignKey:UserTransactionID" json:"userTransaction,omitempty"`
	SeatDetail      SeatDetail      `gorm:"foreignKey:SeatID" json:"seatDetail,omitempty"`
	Traveler        Traveler        `gorm:"foreignKey:TravelerID" json:"traveler,omitempty"`
}

// ======

type FlightRouteResponse struct {
	ID               int64 `json:"id"`
	DepartureAirport struct {
		Name    string `json:"name"`
		Code    string `json:"code"`
		Country string `json:"country"`
		City    string `json:"city"`
	} `json:"departureAirport"`
	ArrivalAirport struct {
		Name    string `json:"name"`
		Code    string `json:"code"`
		Country string `json:"country"`
		City    string `json:"city"`
	} `json:"arrivalAirport"`
	Price          int64 `json:"price"`
	FlightDuration int64 `json:"flightDuration"`
}

type AirlineResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type FlightDate struct {
	DepartureTime string `json:"departureTime"`
	ArrivalTime   string `json:"arrivalTime"`
}
