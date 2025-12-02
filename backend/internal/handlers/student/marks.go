package student

import (
	"fmt"
	"net/http"
	"university-backend/internal/db"

	"github.com/gin-gonic/gin"
)

type MarksResponse struct {
	Subject  string
	ExamType string
	Marks    int
	MaxMarks int
}

func GetStudentMarks(c *gin.Context) {
	studentID := c.GetUint("referenceID")

	// Initialize as empty slice to ensure [] instead of null
	data := []MarksResponse{}

	db.DB.Raw(`
		SELECT subjects.name AS subject,
		       internal_marks.exam_type,
		       internal_marks.marks,
		       subjects.max_marks
		FROM internal_marks
		JOIN subjects ON subjects.id = internal_marks.subject_id
		WHERE internal_marks.student_id = ?
	`, studentID).Scan(&data)

	fmt.Printf("DEBUG: GetStudentMarks StudentID=%d Found=%d\n", studentID, len(data))

	c.JSON(http.StatusOK, data)
}
