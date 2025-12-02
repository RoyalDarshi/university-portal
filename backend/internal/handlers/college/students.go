package college

import (
	"fmt"
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetStudents(c *gin.Context) {
	collegeID := c.GetUint("referenceID")
	branch := c.Query("branch")
	semester := c.Query("semester")

	fmt.Printf("DEBUG: GetStudents CollegeID=%d Branch='%s' Semester='%s'\n", collegeID, branch, semester)

	query := db.DB.Where("college_id = ?", collegeID)

	if branch != "" {
		query = query.Where("branch_id = ?", branch)
	}
	if semester != "" {
		query = query.Where("semester = ?", semester)
	}

	// Initialize as empty slice to ensure [] instead of null in JSON
	students := []models.Student{}
	query.Find(&students)

	// Debug log
	fmt.Printf("DEBUG: CollegeID=%v, Branch=%v, Semester=%v, Found=%d students\n", collegeID, branch, semester, len(students))

	c.JSON(http.StatusOK, students)
}

func AddStudent(c *gin.Context) {
	collegeID := c.GetUint("referenceID")

	var student models.Student
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	student.CollegeID = collegeID

	if student.Name == "" || student.Enrollment == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name & enrollment required"})
		return
	}

	// Prevent duplicate enrollment
	var count int64
	db.DB.Model(&models.Student{}).Where("enrollment = ?", student.Enrollment).Count(&count)
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Enrollment already exists"})
		return
	}

	db.DB.Create(&student)
	c.JSON(http.StatusCreated, gin.H{"message": "Student added successfully", "student": student})
}
