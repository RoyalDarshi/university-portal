package university

import (
	"net/http"

	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

type FeeSummaryItem struct {
	StudentID     uint    `json:"student_id"`
	StudentName   string  `json:"student_name"`
	Enrollment    string  `json:"enrollment"`
	CollegeName   string  `json:"college_name"`
	CourseName    string  `json:"course_name"`
	TotalFee      float64 `json:"total_fee"`
	PaidAmount    float64 `json:"paid_amount"`
	PendingAmount float64 `json:"pending_amount"`
	Status        string  `json:"status"` // Paid / Partial / Pending
}

func GetFeeSummary(c *gin.Context) {
	collegeID := c.Query("college_id") // optional

	// 1) Load students (+ college + course)
	var students []models.Student
	query := db.DB.Preload("College").Preload("Course")
	if collegeID != "" {
		query = query.Where("college_id = ?", collegeID)
	}
	if err := query.Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load students"})
		return
	}
	if len(students) == 0 {
		c.JSON(http.StatusOK, []FeeSummaryItem{})
		return
	}

	// Collect IDs
	courseIDs := make([]uint, 0, len(students))
	studentIDs := make([]uint, 0, len(students))
	courseSeen := make(map[uint]bool)

	for _, s := range students {
		studentIDs = append(studentIDs, s.ID)
		if !courseSeen[s.CourseID] {
			courseIDs = append(courseIDs, s.CourseID)
			courseSeen[s.CourseID] = true
		}
	}

	// 2) Load fee structures per course
	var feeStructures []models.FeeStructure
	if err := db.DB.Where("course_id IN ?", courseIDs).Find(&feeStructures).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load fee structures"})
		return
	}
	feeByCourse := make(map[uint]float64)
	for _, fs := range feeStructures {
		feeByCourse[fs.CourseID] = fs.Amount
	}

	// 3) Load total paid per student
	type payAgg struct {
		StudentID uint
		Total     float64
	}
	var agg []payAgg
	if err := db.DB.Model(&models.FeePayment{}).
		Select("student_id, SUM(amount) as total").
		Where("student_id IN ?", studentIDs).
		Group("student_id").
		Scan(&agg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load payments"})
		return
	}
	paidByStudent := make(map[uint]float64)
	for _, row := range agg {
		paidByStudent[row.StudentID] = row.Total
	}

	// 4) Build response
	resp := make([]FeeSummaryItem, 0, len(students))
	for _, s := range students {
		totalFee := feeByCourse[s.CourseID]
		paid := paidByStudent[s.ID]
		pending := totalFee - paid
		status := "Pending"
		if totalFee <= 0 {
			status = "No Fee"
		} else if pending <= 0 {
			status = "Paid"
			pending = 0
		} else if paid > 0 {
			status = "Partial"
		}

		item := FeeSummaryItem{
			StudentID:     s.ID,
			StudentName:   s.Name,
			Enrollment:    s.Enrollment,
			CollegeName:   s.College.Name,
			CourseName:    s.Course.Name,
			TotalFee:      totalFee,
			PaidAmount:    paid,
			PendingAmount: pending,
			Status:        status,
		}
		resp = append(resp, item)
	}

	c.JSON(http.StatusOK, resp)
}
