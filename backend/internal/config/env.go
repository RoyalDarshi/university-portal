package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠ .env not found, using system environment")
	}
}

func GetEnv(k, d string) string {
	if val := os.Getenv(k); val != "" {
		return val
	}
	return d
}
