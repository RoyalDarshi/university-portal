package models

type Course struct {
	ID       uint   `gorm:"primaryKey;autoIncrement"`
	Name     string `gorm:"not null"`
	BranchID uint   `gorm:"not null;index"`

	Subjects []Subject `gorm:"foreignKey:CourseID"`
}
