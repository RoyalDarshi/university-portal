package university

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetColleges(c *gin.Context) {
	colleges := []models.College{}
	db.DB.Find(&colleges)
	c.JSON(http.StatusOK, colleges)
}

func CreateCollege(c *gin.Context) {
	var college models.College

	if err := c.ShouldBindJSON(&college); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if college.Name == "" || college.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name & Email required"})
		return
	}

	db.DB.Create(&college)
	c.JSON(http.StatusCreated, gin.H{"message": "College added successfully", "college": college})
}
