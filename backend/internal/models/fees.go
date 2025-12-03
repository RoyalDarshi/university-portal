package models

import "time"

type FeeStructure struct {
	ID       uint    `gorm:"primaryKey"`
	CourseID uint    `gorm:"not null"`
	Amount   float64 `gorm:"not null"` // total course fee OR semester fee

	Course Course `gorm:"foreignKey:CourseID"`
}

type FeePayment struct {
	ID        uint      `gorm:"primaryKey"`
	StudentID uint      `gorm:"not null"`
	Amount    float64   `gorm:"not null"`
	PaidAt    time.Time `gorm:"autoCreateTime"`
	Mode      string    `gorm:"not null"` // Cash / UPI / Card / NetBanking
	TransID   string    `gorm:"not null"` // reference number

	Student Student `gorm:"foreignKey:StudentID"`
}
