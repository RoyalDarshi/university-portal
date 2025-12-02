package models

type Subject struct {
	ID       uint   `gorm:"primaryKey;autoIncrement"`
	Name     string `gorm:"not null"`
	CourseID uint   `gorm:"not null;index"`
	Semester int    `gorm:"not null"`
	MaxMarks int    `gorm:"not null;default:100"`
}
