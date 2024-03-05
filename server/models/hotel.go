package models

import (
	"time"

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
	RoomDetails []RoomDetail   `gorm:"foreignKey:HotelID" json:"roomDetails,omitempty"`
}

type RoomDetail struct {
	gorm.Model
	HotelID         uint           `gorm:"not null" json:"hotelId"`
	Name            string         `gorm:"not null" json:"name"`
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

type HotelRoomDetails struct {
	HotelID          uint `json:"hotelId"`
	LowestPrice      uint `json:"lowestPrice"`
	TotalAllocations uint `json:"totalAllocations"`
}

type Facility struct {
	gorm.Model
	Name   string  `gorm:"not null" json:"name"`
	Hotels []Hotel `gorm:"many2many:hotel_facilities" json:"hotel,omitempty"`
}

type HotelTransaction struct {
	gorm.Model
	HotelID           uint      `gorm:"not null" json:"hotelId"`
	RoomDetailID      uint      `gorm:"not null" json:"roomDetailId"`
	ReservationCode   string    `gorm:"not null" json:"reservationCode"`
	UserTransactionID uint    `gorm:"not null" json:"userTransactionID"`
	CheckInTime       time.Time `gorm:"type:timestamp" json:"checkInTime"`
	CheckOutTime      time.Time `gorm:"type:timestamp" json:"checkOutTime"`

	UserTransaction UserTransaction `gorm:"foreignKey:UserTransactionID" json:"userTransaction,omitempty"`
	Hotel Hotel `gorm:"foreignKey:HotelID" json:"hotel,omitempty"`
	RoomDetail RoomDetail `gorm:"foreignKey:RoomDetailID" json:"roomDetail,omitempty"`

}
