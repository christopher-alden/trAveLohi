package models

import (
	"time"

	"gorm.io/gorm"
)

type UserPromo struct {
	gorm.Model
	UserID      uint `gorm:"not null"`
	PromoID     uint  `gorm:"not null"`
	IsAvailable bool  `gorm:"default:true"`
	User        User  `gorm:"foreignKey:UserID"`
	Promo       Promo `gorm:"foreignKey:PromoID"`
}

type Promo struct {
	gorm.Model
	Image       string      `gorm:"type:text"`
	Amount      int         `gorm:"not null"`
	Description string      `gorm:"type:text"`
	FromDate    time.Time   `gorm:"type:date"`
	ToDate      time.Time   `gorm:"type:date"`
	Code        string      `gorm:"type:varchar(10)"`
	IsValid     bool        `gorm:"default:true"`
	UserPromos  []UserPromo `gorm:"foreignKey:PromoID"`
}
