package database

import (
	"github.com/christopher-alden/trAveLohi/models"

	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func GetDB() *gorm.DB {
	if db == nil {
		Connect()
	}
	return db
}

func Connect() {
	dbUsername := "christopheralden"
	dbPassword := "al23-2"
	dbName := "travelohi"
	connStr := fmt.Sprintf("host=localhost user=%s database=%s password=%s sslmode=disable timezone=UTC", dbUsername, dbName, dbPassword)
	connection, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})

	if err != nil {
		panic(err)
	}
	db = connection

	Migrate()
}

func Migrate() {
	if db != nil {

		db.AutoMigrate(&models.Country{})
		db.AutoMigrate(&models.City{})
		db.AutoMigrate(&models.Airport{})

		db.AutoMigrate(&models.Airline{})
		db.AutoMigrate(&models.Traveler{})

		db.AutoMigrate(&models.FlightRoute{})
		db.AutoMigrate(&models.Airplane{})
		
		db.AutoMigrate(&models.SeatDetail{})
		db.AutoMigrate(&models.Flight{})

		db.AutoMigrate(&models.User{})
		db.AutoMigrate(&models.OTP{})
		db.AutoMigrate(&models.Promo{})
		db.AutoMigrate(&models.UserPromo{})

		db.AutoMigrate(&models.UserTransaction{})
		db.AutoMigrate(&models.FlightTransaction{})
		migrateSchema()
	}
}

func migrateSchema() {
	sqlStatements := []string{
		`ALTER DATABASE travelohi SET timezone TO 'UTC';`,

		`CREATE OR REPLACE FUNCTION trg_flight_create() RETURNS TRIGGER AS $$
		BEGIN
			UPDATE airplanes
			SET is_available = FALSE
			WHERE id = NEW.airplane_id;
			RETURN NEW;
		END;
		$$ LANGUAGE plpgsql;
		`,
		`CREATE TRIGGER trg_after_flight_create
		AFTER INSERT ON flights
		FOR EACH ROW
		EXECUTE FUNCTION trg_flight_create();`,


		`CREATE OR REPLACE FUNCTION trg_flight_transaction_insert() RETURNS TRIGGER AS $$
        BEGIN
            UPDATE seat_details
            SET is_available = FALSE
            WHERE id = NEW.seat_id;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`,
		`CREATE TRIGGER trg_after_flight_transaction_insert
        AFTER INSERT ON flight_transactions
        FOR EACH ROW
        EXECUTE FUNCTION trg_flight_transaction_insert();`,


		`CREATE OR REPLACE FUNCTION trg_flight_cancel()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE seat_details
            SET is_available = TRUE
            FROM flight_transactions
            WHERE flight_transactions.flight_id = OLD.id
            AND seat_details.id = flight_transactions.seat_id;

			UPDATE airplanes
			SET is_available = TRUE
			WHERE id = OLD.airplane_id;
			
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;`,
		`CREATE TRIGGER trg_after_flight_cancel
        AFTER UPDATE OF status ON flights
        FOR EACH ROW
        WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'cancel')
        EXECUTE FUNCTION trg_flight_cancel();`,


		`CREATE OR REPLACE FUNCTION trg_flight_transaction_refund()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE seat_details
            SET is_available = TRUE
            WHERE id = OLD.seat_id;
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;`,
		`CREATE TRIGGER trg_after_flight_transaction_refund
        AFTER UPDATE ON flight_transactions
        FOR EACH ROW
        WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'refunded')
        EXECUTE FUNCTION trg_flight_transaction_refund();`,


		`CREATE OR REPLACE FUNCTION calculate_arrival_time()
        RETURNS TRIGGER AS $$
        DECLARE
            flight_duration_interval INTERVAL;
        BEGIN
            SELECT flight_routes.flight_duration * INTERVAL '1 minute' INTO flight_duration_interval
            FROM flight_routes
            WHERE flight_routes.id = NEW.flight_route_id;
            NEW.arrival_time := NEW.departure_time + flight_duration_interval;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`,
		`CREATE TRIGGER trigger_calculate_arrival_time
        BEFORE INSERT OR UPDATE ON flights
        FOR EACH ROW
        EXECUTE FUNCTION calculate_arrival_time();`,
	}
	for _, sql := range sqlStatements {
		if err := db.Exec(sql).Error; err != nil {
			fmt.Printf("Failed to execute migration: %v", err)
		}
	}
}

func Seed() {
	if db == nil {
		return
	}
	seedLocations()
	seedFlights()
}
