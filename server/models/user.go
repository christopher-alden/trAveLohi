package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID              		uint   		`gorm:"primaryKey;autoIncrement"`
	FirstName       		string 		`gorm:"type:varchar(50)"`
	LastName       	 		string 		`gorm:"type:varchar(50)"`
	Email          	 		string 		`gorm:"type:varchar(100);unique;not null"`
	Password        		[]byte 		`gorm:"type:varchar(255);not null"`
	Gender          		string 		`gorm:"type:char(10)"`
	DateOfBirth     		time.Time 	`gorm:"type:date"`
	ProfilePhoto    		string    	`gorm:"type:text"`
	SecurityQuestion     	string    	`gorm:"type:text"`
	SecurityQuestionAnswer 	string  	`gorm:"type:text"`
}

type OTP struct{
	gorm.Model
	UserID					uint		`gorm:"foreignKey"`
	OTP						string		`gorm:"type:char(6)"`
	ExpiresAt  				time.Time	`gorm:"type:date"`
}