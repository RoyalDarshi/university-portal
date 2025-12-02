package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func OnlyUniversity(c *gin.Context) {
	if c.GetString("role") != "university" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		c.Abort()
		return
	}
	c.Next()
}

func OnlyCollege(c *gin.Context) {
	if c.GetString("role") != "college" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		c.Abort()
		return
	}
	c.Next()
}

func OnlyStudent(c *gin.Context) {
	if c.GetString("role") != "student" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		c.Abort()
		return
	}
	c.Next()
}
