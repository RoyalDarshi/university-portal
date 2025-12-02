package main

import (
	"encoding/json"
	"fmt"
	"os"
	"university-backend/internal/config"
	"university-backend/internal/db"
	"university-backend/internal/models"
)

func main() {
	config.LoadEnv()
	db.Connect()

	var users []models.User
	var colleges []models.College
	var students []models.Student

	db.DB.Find(&users)
	db.DB.Find(&colleges)
	db.DB.Find(&students)

	data := map[string]interface{}{
		"users":    users,
		"colleges": colleges,
		"students": students,
	}

	file, _ := os.Create("debug_dump.json")
	defer file.Close()
	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	encoder.Encode(data)

	fmt.Println("✅ Data dumped to debug_dump.json")
}
