package college

import (
	"net/http"
	"university-backend/internal/db"

	"github.com/gin-gonic/gin"
)

func MarksReport(c *gin.Context) {
	collegeID := c.GetUint("referenceID")

	type Result struct {
		StudentID uint
		Name      string
		Subject   string
		Marks     int
		ExamType  string
	}

	var data []Result

	db.DB.Raw(`
		SELECT students.id as student_id, students.name, subjects.name as subject,
		internal_marks.marks, internal_marks.exam_type
		FROM internal_marks
		JOIN students ON students.id = internal_marks.student_id
		JOIN subjects ON subjects.id = internal_marks.subject_id
		WHERE students.college_id = ?
	`, collegeID).Scan(&data)

	c.JSON(http.StatusOK, data)
}
