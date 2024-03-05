package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName              string      `gorm:"type:varchar(50)"`
	LastName               string      `gorm:"type:varchar(50)"`
	Email                  string      `gorm:"type:varchar(100);unique;not null"`
	Password               []byte      `gorm:"type:varchar(255);not null"`
	Gender                 string      `gorm:"type:varchar(10)"`
	DateOfBirth            time.Time   `gorm:"type:date"`
	ProfilePhoto           string      `gorm:"type:text"`
	SecurityQuestion       string      `gorm:"type:text"`
	SecurityQuestionAnswer string      `gorm:"type:text"`
	Role                   string      `gorm:"type:varchar(50)"`
	IsBanned               bool        `gorm:"default:false"`
	IsNewsletter           bool        `gorm:"default:false"`
	UserPromos             []UserPromo `gorm:"foreignKey:UserID"`
	Balance                uint        `gorm:"default:0"`
	Address                string      `gorm:"type:text"`
	PhoneNumber            string      `gorm:"type:varchar(12)"`
	UserCC                 UserCC      `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type UserCC struct {
	gorm.Model
	UserID uint   `gorm:"not null;unique"`
	Number string `gorm:"type:varchar(20);not null" json:"number"`
	Type   string `gorm:"type:varchar(20);not null" json:"type"`
	CVV    string `gorm:"type:varchar(5);not null" json:"ccv"`
	Name   string `gorm:"type:varchar(100);not null" json:"name"`
}

type OTP struct {
	gorm.Model
	UserID    uint      `gorm:"foreignKey"`
	OTP       string    `gorm:"type:char(6)"`
	ExpiresAt time.Time `gorm:"type:date"`
}

// [MASTER] this will be used for ticket and hotel registration.
type Traveler struct {
	gorm.Model
	FirstName      string    `gorm:"type:varchar(50)" json:"firstName"`
	LastName       string    `gorm:"type:varchar(50)" json:"lastName"`
	PassportNumber string    `gorm:"type:varchar(12);unique;not null" json:"passportNumber"`
	DateOfBirth    time.Time `gorm:"type:date" json:"dob"`
}

// [TRANSACTION HEADER] This should hold each Transaction (Flight and Hotel) that respective Users made
// : To identify if user made a transaction to Flight or Hotel, we can directly access the corresponding TransactionID
// : This should be created first when inserting any type of Transaction
// : This will then  be referenced as a key for the flight or hotel transaction
// : Price is the grand total of the transaction made by User, it should be referenced ...
// to SeatDetails-Class, FlightRoutes-Price, amount of tickets bought in a transaction to get the final price or some shit idk

type UserTransaction struct {
	gorm.Model
	UserID          uint      `gorm:"not null" json:"userId"`
	Price           uint      `gorm:"not null" json:"price"`
	TransactionDate time.Time `gorm:"type:timestamp" json:"transactionDate"`
	Status          string    `gorm:"not null" json:"status"`
}
