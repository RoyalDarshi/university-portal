package models

type College struct {
	ID       uint   `gorm:"primaryKey;autoIncrement"`
	Name     string `gorm:"not null"`
	Code     string `gorm:"unique;not null"`
	Email    string `gorm:"unique;not null"`
	Phone    string
	Address  string
	Branches []Branch `gorm:"foreignKey:CollegeID"`
}
