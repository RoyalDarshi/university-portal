package models

type Student struct {
	ID         uint   `gorm:"primaryKey"`
	Name       string `gorm:"not null"`
	Enrollment string `gorm:"unique;not null"`
	BranchID   uint   `gorm:"not null"`
	CourseID   uint   `gorm:"not null"`
	CollegeID  uint   `gorm:"not null"`
	Semester   int    `gorm:"not null"`
	Email      string
	Phone      string

	// 🔥 Relations
	College College `gorm:"foreignKey:CollegeID"`
	Branch  Branch  `gorm:"foreignKey:BranchID"`
	Course  Course  `gorm:"foreignKey:CourseID"`
}
