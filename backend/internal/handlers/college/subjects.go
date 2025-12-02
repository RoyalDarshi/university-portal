package college

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetSubjects(c *gin.Context) {
	course := c.Query("course")
	semester := c.Query("semester")

	if course == "" || semester == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "course and semester required"})
		return
	}

	var subjects []models.Subject
	db.DB.Where("course_id = ? AND semester = ?", course, semester).Find(&subjects)

	c.JSON(http.StatusOK, subjects)
}
