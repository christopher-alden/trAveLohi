package database

import (
	"github.com/christopher-alden/trAveLohi/models"
)

func SeedHotel() error {
	db := GetDB()
	facilities := []models.Facility{
		{Name: "WiFi"},
		{Name: "Swimming Pool"},
		{Name: "Parking"},
		{Name: "Restaurant"},
		{Name: "Elevator"},
		{Name: "Wheelchair Access"},
		{Name: "Fitness Center"},
		{Name: "Meeting Facilities"},
		{Name: "Airport Transfer"},
		{Name: "AC"},
		{Name: "24-Hour Front Desk"},
	}

	for _, facility := range facilities {
		err := db.FirstOrCreate(&facility, models.Facility{Name: facility.Name}).Error
		if err != nil {
			return err
		}
	}

	return nil
}
