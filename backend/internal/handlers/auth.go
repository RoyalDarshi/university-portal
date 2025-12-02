package handlers

import (
	"net/http"
	"time"
	"university-backend/internal/db"
	"university-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("xvhsxvsfsh2121767sbhdt121rf1d12d1") // ⚠ change in production

func Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	var user models.User
	result := db.DB.Where("email = ?", req.Email).First(&user)
	if result.RowsAffected == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// JWT claims
	claims := jwt.MapClaims{
		"userID":      user.ID,
		"role":        user.Role,
		"referenceID": user.ReferenceID,
		"exp":         time.Now().Add(time.Hour * 24 * 7).Unix(), // valid for 7 days
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, _ := token.SignedString(jwtKey)

	c.JSON(200, gin.H{
		"token":        signedToken,
		"role":         user.Role,
		"reference_id": user.ReferenceID,
		"user_id":      user.ID,
	})
}
