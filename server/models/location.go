package models

import (
	"gorm.io/gorm"
)

type Country struct {
	gorm.Model
	Name   string `gorm:"type:varchar(100);not null" json:"name"`
	Cities []City `json:"cities,omitempty"`
}

type City struct {
	gorm.Model
	CountryID uint   `gorm:"not null" json:"countryId"`
	Name      string `gorm:"type:varchar(100);not null" json:"name"`
	LT        string `gorm:"type:varchar(50);not null" json:"lt"`
	Country   Country `json:"country,omitempty"`
}

type Airport struct {
	gorm.Model
	CityID uint   `gorm:"not null" json:"cityId"`
	Name   string `gorm:"type:varchar(100);not null" json:"name"`
	Code   string `gorm:"type:char(3);not null;unique" json:"code"`
	City   City   `gorm:"foreignKey:CityID" json:"city,omitempty"`
}

type AirportResponse struct {
	ID int64 `json:"id"`
	Name    string `json:"name"`
	Code    string `json:"code"`
	Country string `json:"country"`
	City    string `json:"city"`
}