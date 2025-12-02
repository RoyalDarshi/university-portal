package main

import (
	"fmt"
	"university-backend/internal/config"
	"university-backend/internal/db"
	"university-backend/internal/models"
)

func main() {
	config.LoadEnv()
	db.Connect()

	var userCount, studentCount, collegeCount int64
	db.DB.Model(&models.User{}).Count(&userCount)
	db.DB.Model(&models.Student{}).Count(&studentCount)
	db.DB.Model(&models.College{}).Count(&collegeCount)

	fmt.Printf("Users: %d\n", userCount)
	fmt.Printf("Students: %d\n", studentCount)
	fmt.Printf("Colleges: %d\n", collegeCount)

	if userCount > 0 && studentCount > 0 && collegeCount > 0 {
		fmt.Println("✅ Data verification successful")
	} else {
		fmt.Println("❌ Data verification failed")
	}
}
