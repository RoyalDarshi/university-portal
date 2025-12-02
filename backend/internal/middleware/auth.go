package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("xvhsxvsfsh2121767sbhdt121rf1d12d1") // SAME as auth.go

// Extract + validate token
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			c.Abort()
			return
		}

		// Remove Bearer prefix if frontend sends Bearer token
		tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		// Convert float64 to uint for proper retrieval with GetUint()
		userID := uint(claims["userID"].(float64))
		referenceID := uint(claims["referenceID"].(float64))

		c.Set("userID", userID)
		c.Set("role", claims["role"])
		c.Set("referenceID", referenceID)
		c.Next()
	}
}
