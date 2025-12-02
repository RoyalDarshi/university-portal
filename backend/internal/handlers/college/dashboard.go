package college

import (
	"fmt"
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func Dashboard(c *gin.Context) {
	collegeID := c.GetUint("referenceID")
	fmt.Printf("DEBUG: Dashboard CollegeID=%v\n", collegeID)

	var studentCount int64
	var branchCount int64
	var courseCount int64

	db.DB.Model(&models.Student{}).Where("college_id = ?", collegeID).Count(&studentCount)
	db.DB.Model(&models.Branch{}).Where("college_id = ?", collegeID).Count(&branchCount)
	db.DB.Model(&models.Course{}).Joins("JOIN branches ON courses.branch_id = branches.id").
		Where("branches.college_id = ?", collegeID).Count(&courseCount)

	c.JSON(http.StatusOK, gin.H{
		"students": studentCount,
		"branches": branchCount,
		"courses":  courseCount,
	})
}
