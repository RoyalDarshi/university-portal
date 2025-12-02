package university

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

type StudentResponse struct {
	ID         uint   `json:"ID"`
	Name       string `json:"Name"`
	Enrollment string `json:"Enrollment"`
	Semester   int    `json:"Semester"`
	College    string `json:"College"`
	Branch     string `json:"Branch"`
	Course     string `json:"Course"`
}

func GetAllStudents(c *gin.Context) {
	collegeID := c.Query("college_id")

	var students []models.Student

	query := db.DB.Preload("College").Preload("Branch").Preload("Course")

	if collegeID != "" {
		query = query.Where("college_id = ?", collegeID)
	}

	query.Find(&students)

	var response []StudentResponse
	for _, s := range students {
		response = append(response, StudentResponse{
			ID:         s.ID,
			Name:       s.Name,
			Enrollment: s.Enrollment,
			Semester:   s.Semester,
			College:    s.College.Name,
			Branch:     s.Branch.Name,
			Course:     s.Course.Name,
		})
	}

	c.JSON(http.StatusOK, response)
}
