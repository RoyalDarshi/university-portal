package college

import (
	"net/http"
	"time"

	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

type RecordPaymentRequest struct {
	StudentID uint    `json:"student_id"`
	Amount    float64 `json:"amount"`
	Mode      string  `json:"mode"`     // UPI / CASH / CARD / NETBANKING
	TransID   string  `json:"trans_id"` // some reference / receipt no.
}

type FeeSummaryItem struct {
	StudentID     uint    `json:"student_id"`
	StudentName   string  `json:"student_name"`
	Enrollment    string  `json:"enrollment"`
	CourseName    string  `json:"course_name"`
	CollegeName   string  `json:"college_name"`
	TotalFee      float64 `json:"total_fee"`
	PaidAmount    float64 `json:"paid_amount"`
	PendingAmount float64 `json:"pending_amount"`
	Status        string  `json:"status"`
}

func RecordPayment(c *gin.Context) {
	var req RecordPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}
	if req.StudentID == 0 || req.Amount <= 0 || req.Mode == "" || req.TransID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	// ensure student exists
	var s models.Student
	if err := db.DB.First(&s, "id = ?", req.StudentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	payment := models.FeePayment{
		StudentID: req.StudentID,
		Amount:    req.Amount,
		Mode:      req.Mode,
		TransID:   req.TransID,
		PaidAt:    time.Now(),
	}

	if err := db.DB.Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment recorded",
		"data":    payment,
	})
}

func CollegeFeeSummary(c *gin.Context) {

	collegeID := c.GetUint("referenceID")

	var students []models.Student
	db.DB.Where("college_id = ?", collegeID).Find(&students)

	var summary []FeeSummaryItem

	for _, s := range students {

		var fee models.FeeStructure
		db.DB.Where("course_id = ?", s.CourseID).First(&fee)

		var paid struct{ Total float64 }
		db.DB.Model(&models.FeePayment{}).
			Select("SUM(amount) as total").
			Where("student_id = ?", s.ID).
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

		summary = append(summary, FeeSummaryItem{
			StudentID:     s.ID,
			StudentName:   s.Name,
			Enrollment:    s.Enrollment,
			CourseName:    s.Course.Name,
			CollegeName:   s.College.Name,
			TotalFee:      fee.Amount,
			PaidAmount:    paid.Total,
			PendingAmount: pending,
			Status:        status,
		})
	}

	c.JSON(200, summary)
}
