package college

import (
	"net/http"
	"time"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

type MarksRequest struct {
	StudentID uint   `json:"student_id"`
	SubjectID uint   `json:"subject_id"`
	Marks     int    `json:"marks"`
	ExamType  string `json:"exam_type"`
}

func SubmitMarks(c *gin.Context) {
	collegeUserID := c.GetUint("userID")

	var marksReq []MarksRequest
	if err := c.ShouldBindJSON(&marksReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	for _, m := range marksReq {
		record := models.InternalMarks{
			StudentID:   m.StudentID,
			SubjectID:   m.SubjectID,
			Marks:       m.Marks,
			ExamType:    m.ExamType,
			SubmittedBy: collegeUserID,
			SubmittedAt: time.Now(),
		}

		// If exists → update instead of duplicate
		db.DB.Where(
			"student_id = ? AND subject_id = ? AND exam_type = ?",
			m.StudentID, m.SubjectID, m.ExamType,
		).Assign(record).FirstOrCreate(&record)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Marks submitted successfully"})
}
