package db

import (
	"fmt"
	"log"
	"os"

	"university-backend/internal/models" // ⬅ make sure this matches your module name

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	// Read from environment variables (recommended for deployment)
	user := getEnv("DB_USER", "root")
	pass := getEnv("DB_PASS", "root")
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	name := getEnv("DB_NAME", "university_portal")

	// Build DSN
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		user, pass, host, port, name,
	)

	// Connect
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent), // set Warn or Info for logs
	})
	if err != nil {
		log.Fatalf("❌ Database connection failed: %v", err)
	}

	DB = db
	fmt.Println("✅ Connected to MySQL database")

	// Auto migrate models
	DB.Migrator().DropTable(
		&models.InternalMarks{},
		&models.Student{},
		&models.User{},
		&models.Subject{},
		&models.Course{},
		&models.Branch{},
		&models.College{},
		&models.University{},
	)

	err = DB.AutoMigrate(
		&models.University{},
		&models.College{},
		&models.Branch{},
		&models.Course{},
		&models.Subject{},
		&models.Student{},
		&models.User{},
		&models.InternalMarks{},
		&models.FeeStructure{},
		&models.FeePayment{},
	)
	if err != nil {
		log.Fatalf("❌ Auto migration failed: %v", err)
	}

	Seed(DB) // run seeder ONLY after migration passes
	// SeedUsers(DB)

	fmt.Println("🚀 Database migration completed")
}

// Helper: read environment variables
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}
