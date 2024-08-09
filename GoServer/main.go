package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"github.com/joho/godotenv"
	_ "github.com/go-sql-driver/mysql"
)


type Config struct {
	DBUsername string
	DBPassword string
	DBHost     string
	DBName     string
}

var db *sql.DB

func initDB(cfg *Config) (*sql.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s", cfg.DBUsername, cfg.DBPassword, cfg.DBHost, cfg.DBName)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Printf("First error")
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Printf("Testing error")
		log.Printf(dsn)
		return nil, fmt.Errorf("error connecting to database: %w", err)
	} else {
		log.Printf("Connected")
	}

	return db, nil

}

func HomeEndpoint(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello world")
}

func main() {
	var err error
	err = godotenv.Load() 
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	DB_Username := os.Getenv("DB_USERNAME")
	DB_Password := os.Getenv("DB_PASSWORD")
	DB_Host := os.Getenv("DB_HOST")
	DB_Name := os.Getenv("DB_NAME")
	
	cfg := Config{
		DBUsername: DB_Username,
		DBPassword: DB_Password,
		DBHost:     DB_Host, // Include port
		DBName:     DB_Name,
	}

	db, err = initDB(&cfg)

	if err != nil {
		log.Printf("Failed to connect to the database: %v", err)
		db = nil
	}
	
	defer db.Close()

	log.Printf("Starting Handlers")
	
	http.HandleFunc("/user", newUser)
	http.HandleFunc("/getData", getData)
	http.HandleFunc("/writeMeal", writeMeal)
	http.HandleFunc("/getMeal", favoriteMeals)
	http.HandleFunc("/", HomeEndpoint)

	if err := http.ListenAndServe(":3000", nil); err != nil {
		 log.Fatalf("Server error: %v", err)
	}

}
