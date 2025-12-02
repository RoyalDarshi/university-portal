package university

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetCourses(c *gin.Context) {
	branchID := c.Query("branch")
	var courses []models.Course

	if branchID != "" {
		db.DB.Where("branch_id = ?", branchID).Find(&courses)
	} else {
		db.DB.Find(&courses)
	}

	c.JSON(http.StatusOK, courses)
}

func CreateCourse(c *gin.Context) {
	var course models.Course
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if course.Name == "" || course.BranchID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Course name & BranchID required"})
		return
	}
	db.DB.Create(&course)
	c.JSON(http.StatusCreated, gin.H{"message": "Course added successfully", "course": course})
}
