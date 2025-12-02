package university

import (
	"net/http"
	"university-backend/internal/db"

	"github.com/gin-gonic/gin"
)

func Reports(c *gin.Context) {

	// Top 5 students across university
	var topStudents []struct {
		Name       string
		TotalMarks int
	}
	db.DB.Raw(`
		SELECT students.name, COALESCE(SUM(internal_marks.marks), 0) AS total_marks
		FROM internal_marks
		JOIN students ON students.id = internal_marks.student_id
		GROUP BY students.id
		ORDER BY total_marks DESC
		LIMIT 5
	`).Scan(&topStudents)

	// Average marks per branch
	var branchAvg []struct {
		Branch   string
		AvgMarks float64
	}
	db.DB.Raw(`
		SELECT branches.name AS branch, AVG(internal_marks.marks) AS avg_marks
		FROM internal_marks
		JOIN students ON students.id = internal_marks.student_id
		JOIN branches ON branches.id = students.branch_id
		GROUP BY branches.id
		ORDER BY avg_marks DESC
	`).Scan(&branchAvg)

	c.JSON(http.StatusOK, gin.H{
		"top_students": topStudents,
		"branch_avg":   branchAvg,
	})
}
