package student

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func Dashboard(c *gin.Context) {
	studentID := c.GetUint("referenceID")

	var totalSubjects int64
	var totalMarks int64

	// Count subjects matching student's course & semester
	var student models.Student
	db.DB.First(&student, studentID)

	db.DB.Model(&models.Subject{}).
		Where("course_id = ? AND semester = ?", student.CourseID, student.Semester).
		Count(&totalSubjects)

	// Sum internal marks scored by student
	db.DB.Model(&models.InternalMarks{}).
		Where("student_id = ?", studentID).
		Select("COALESCE(SUM(marks), 0)").Scan(&totalMarks)

	c.JSON(http.StatusOK, gin.H{
		"total_subjects": totalSubjects,
		"total_marks":    totalMarks,
		"semester":       student.Semester,
	})
}
