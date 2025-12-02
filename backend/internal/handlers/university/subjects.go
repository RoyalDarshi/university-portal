package university

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetSubjects(c *gin.Context) {
	courseID := c.Query("course")
	var subjects []models.Subject

	if courseID != "" {
		db.DB.Where("course_id = ?", courseID).Find(&subjects)
	} else {
		db.DB.Find(&subjects)
	}

	c.JSON(http.StatusOK, subjects)
}

func CreateSubject(c *gin.Context) {
	var subject models.Subject
	if err := c.ShouldBindJSON(&subject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if subject.Name == "" || subject.CourseID == 0 || subject.Semester == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name, CourseID and Semester required"})
		return
	}

	db.DB.Create(&subject)
	c.JSON(http.StatusCreated, gin.H{"message": "Subject added successfully", "subject": subject})
}
