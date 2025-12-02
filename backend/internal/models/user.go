package models

type User struct {
	ID          uint   `gorm:"primaryKey;autoIncrement"`
	Email       string `gorm:"unique;not null"`
	Password    string `gorm:"not null"`
	Role        string `gorm:"not null"`
	ReferenceID uint   `gorm:"not null;index"` // maps to college / student / university ID
}
