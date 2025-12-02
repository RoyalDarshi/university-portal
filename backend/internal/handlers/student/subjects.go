package student

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetSubjects(c *gin.Context) {
	studentID := c.GetUint("referenceID")

	var student models.Student
	db.DB.First(&student, studentID)

	var subjects []models.Subject
	db.DB.Where(
		"course_id = ? AND semester = ?",
		student.CourseID, student.Semester,
	).Find(&subjects)

	c.JSON(http.StatusOK, subjects)
}
