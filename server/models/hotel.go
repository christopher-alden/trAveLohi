package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Hotel struct {
	gorm.Model
	Name        string         `gorm:"type:varchar(50);not null" json:"name"`
	Description string         `gorm:"type:text;not null" json:"description"`
	Rating      float64        `gorm:"type:numeric;not null" json:"rating"`
	Address     string         `gorm:"type:text;not null" json:"address"`
	Images      datatypes.JSON `json:"images"`
	CityID      uint           `gorm:"not null" json:"cityId"`
	City        City           `gorm:"foreignKey:CityID" json:"city,omitempty"`
	Facilities  []Facility     `gorm:"many2many:hotel_facilities" json:"facilities,omitempty"`
}

type HotelDetail struct {
	gorm.Model
	HotelID         uint           `gorm:"not null" json:"hotelId"`
	Price           uint           `gorm:"not null" json:"price"`
	Images          datatypes.JSON `json:"images"`
	IsFreeBreakfast bool           `json:"isFreeBreakfast"`
	IsFreeWifi      bool           `json:"isFreeWifi"`
	IsNonSmoking    bool           `json:"isNonSmoking"`
	IsRefundable    bool           `json:"isRefundable"`
	IsReschedule    bool           `json:"isReschedule"`
	Guest           uint           `json:"guest"`
	Bed             string         `json:"bed"`
	Area            uint           `json:"area"`
	Allocation      uint           `json:"allocation"`
	Hotel           Hotel          `gorm:"foreignKey:HotelID" json:"hotel,omitempty"`
}

type Facility struct {
	gorm.Model
	Name   string  `gorm:"not null" json:"name"`
	Hotels []Hotel `gorm:"many2many:hotel_facilities" json:"hotel,omitempty"`
}
type HotelTransaction struct {
	gorm.Model
	ReservationCode   string `gorm:"not null" json:"reservationCode"`
	TravelerID        string `gorm:"not null" json:"travelerId"`
	UserTransactionID string `gorm:"not null" json:"userTransactionID"`

	UserTransaction UserTransaction `gorm:"foreignKey:UserTransactionID" json:"userTransaction,omitempty"`
	Traveler        Traveler        `gorm:"foreignKey:TravelerID" json:"traveler,omitempty"`
}
