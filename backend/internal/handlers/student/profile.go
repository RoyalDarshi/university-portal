package student

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func Profile(c *gin.Context) {
	studentID := c.GetUint("referenceID")

	var student models.Student
	result := db.DB.First(&student, studentID)

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	// Fetch related College, Branch, and Course
	var college models.College
	var branch models.Branch
	var course models.Course

	db.DB.First(&college, student.CollegeID)
	db.DB.First(&branch, student.BranchID)
	db.DB.First(&course, student.CourseID)

	// Create response with names instead of IDs
	response := gin.H{
		"id":         student.ID,
		"name":       student.Name,
		"enrollment": student.Enrollment,
		"email":      student.Email,
		"phone":      student.Phone,
		"semester":   student.Semester,
		"college":    college.Name,
		"branch":     branch.Name,
		"course":     course.Name,
	}

	c.JSON(http.StatusOK, response)
}
