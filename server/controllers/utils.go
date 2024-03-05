package controllers

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"time"
)


func cvtBool(input string) bool{
	return (input == "true")
}

func generateTicketCode(flightID uint, airlineName, airplaneType, passportNumber string, seatID uint) (string, error) {
	// Extract initials and last characters
	initials := fmt.Sprintf("%c%d%c%c%d",
		airlineName[0],
		flightID%10,
		airplaneType[0],
		passportNumber[len(passportNumber)-1],
		seatID%10,
	)

	// Generate a random component
	randomComponent, err := generateRandomString(6)
	if err != nil {
		return "", err
	}

	ticketCode := initials + randomComponent
	return ticketCode[:10], nil 
}
func generateReservationCode(hotelID, roomDetailID uint) (string, error) {
    timestamp := time.Now().Unix()
    randomComponent, err := generateRandomString(4) // Shorter random component for readability
    if err != nil {
        return "", err
    }
    reservationCode := fmt.Sprintf("H%dR%dT%d%s", hotelID, roomDetailID, timestamp, randomComponent)
    return reservationCode, nil
}

func generateRandomString(n int) (string, error) {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, n)
	for i := range result {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(letters))))
		if err != nil {
			return "", err
		}
		result[i] = letters[num.Int64()]
	}
	return string(result), nil
}