package university

import (
	"net/http"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetBranches(c *gin.Context) {
	collegeID := c.Query("college")
	var branches []models.Branch

	if collegeID != "" {
		db.DB.Where("college_id = ?", collegeID).Find(&branches)
	} else {
		db.DB.Find(&branches)
	}

	c.JSON(http.StatusOK, branches)
}

func CreateBranch(c *gin.Context) {
	var branch models.Branch
	if err := c.ShouldBindJSON(&branch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if branch.Name == "" || branch.CollegeID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Branch name & CollegeID required"})
		return
	}

	db.DB.Create(&branch)
	c.JSON(http.StatusCreated, gin.H{"message": "Branch added successfully", "branch": branch})
}
