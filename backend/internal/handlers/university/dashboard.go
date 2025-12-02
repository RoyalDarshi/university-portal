package university

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func Dashboard(c *gin.Context) {
	var collegeCount, branchCount, courseCount, studentCount int64

	db.DB.Model(&models.College{}).Count(&collegeCount)
	db.DB.Model(&models.Branch{}).Count(&branchCount)
	db.DB.Model(&models.Course{}).Count(&courseCount)
	db.DB.Model(&models.Student{}).Count(&studentCount)

	c.JSON(http.StatusOK, gin.H{
		"colleges": collegeCount,
		"branches": branchCount,
		"courses":  courseCount,
		"students": studentCount,
	})
}
