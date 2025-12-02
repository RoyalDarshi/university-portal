package student

import (
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

	var data []MarksResponse

	db.DB.Raw(`
		SELECT subjects.name AS subject,
		       internal_marks.exam_type,
		       internal_marks.marks,
		       subjects.max_marks
		FROM internal_marks
		JOIN subjects ON subjects.id = internal_marks.subject_id
		WHERE internal_marks.student_id = ?
	`, studentID).Scan(&data)

	c.JSON(http.StatusOK, data)
}
