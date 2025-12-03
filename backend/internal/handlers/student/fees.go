package student

import (
	"net/http"

	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

type StudentFeeSummary struct {
	StudentID     uint    `json:"student_id"`
	Name          string  `json:"name"`
	Enrollment    string  `json:"enrollment"`
	Course        string  `json:"course"`
	College       string  `json:"college"`
	TotalFee      float64 `json:"total_fee"`
	PaidAmount    float64 `json:"paid_amount"`
	PendingAmount float64 `json:"pending_amount"`
	Status        string  `json:"status"`
}

func GetMyFeeSummary(c *gin.Context) {

	studentID := c.GetUint("referenceID")

	var student models.Student
	db.DB.Preload("Course").Preload("College").
		Where("id = ?", studentID).
		First(&student)

	var fee models.FeeStructure
	db.DB.Where("course_id = ?", student.CourseID).First(&fee)

	var paid struct{ Total float64 }
	db.DB.Model(&models.FeePayment{}).
		Select("SUM(amount) as total").
		Where("student_id = ?", studentID).
		Scan(&paid)

	pending := fee.Amount - paid.Total

	status := "Pending"
	if paid.Total == 0 {
		status = "No Fee"
	} else if pending <= 0 {
		status = "Paid"
	} else {
		status = "Partial"
	}

	c.JSON(200, gin.H{
		"student_id":     studentID,
		"name":           student.Name,
		"enrollment":     student.Enrollment,
		"course":         student.Course.Name,
		"college":        student.College.Name,
		"total_fee":      fee.Amount,
		"paid_amount":    paid.Total,
		"pending_amount": pending,
		"status":         status,
	})
}

func GetMyFeeHistory(c *gin.Context) {
	studentID := c.GetUint("referenceID")
	if studentID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id is required"})
		return
	}

	var payments []models.FeePayment
	if err := db.DB.
		Where("student_id = ?", studentID).
		Order("paid_at DESC").
		Find(&payments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load history"})
		return
	}

	c.JSON(http.StatusOK, payments)
}
