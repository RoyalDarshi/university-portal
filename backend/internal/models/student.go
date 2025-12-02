package models

type Student struct {
	ID         uint   `gorm:"primaryKey;autoIncrement"`
	Name       string `gorm:"not null"`
	Enrollment string `gorm:"unique;not null"`
	Email      string
	Phone      string
	Semester   int `gorm:"not null"`

	CollegeID uint `gorm:"not null;index"`
	BranchID  uint `gorm:"not null;index"`
	CourseID  uint `gorm:"not null;index"`
}
