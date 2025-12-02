package models

import "time"

type InternalMarks struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	StudentID   uint      `gorm:"not null;index"`
	SubjectID   uint      `gorm:"not null;index"`
	Marks       int       `gorm:"not null"`
	ExamType    string    `gorm:"not null"`
	SubmittedBy uint      `gorm:"not null"`
	SubmittedAt time.Time `gorm:"autoCreateTime"`
}
