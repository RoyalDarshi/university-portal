package models

type Branch struct {
	ID        uint   `gorm:"primaryKey;autoIncrement"`
	Name      string `gorm:"not null"`
	CollegeID uint   `gorm:"not null;index"`

	Courses []Course `gorm:"foreignKey:BranchID"`
}
