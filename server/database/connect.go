package database

import(
    "github.com/christopher-alden/trAveLohi/models"

    "gorm.io/gorm"
	"gorm.io/driver/postgres"
    "fmt"
)
var DB *gorm.DB

func Connect() {
    dbUsername := "christopheralden"
    dbPassword := ""
    dbName := "trAveLohi"
    connStr:= fmt.Sprintf("host=localhost user=%s database=%s password=%s sslmode=disable", dbUsername, dbName, dbPassword)
    connection, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})

    if err != nil {
        panic(err)
    }
    DB = connection

    Migrate()
}

func Migrate(){
    if(DB!=nil){
        DB.AutoMigrate(&models.User{})
        DB.AutoMigrate(&models.OTP{})
    }
}