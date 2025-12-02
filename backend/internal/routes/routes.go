package routes

import (
	"university-backend/internal/handlers"
	collegeHandlers "university-backend/internal/handlers/college"
	studentHandlers "university-backend/internal/handlers/student"
	universityHandlers "university-backend/internal/handlers/university"
	"university-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	// AUTH
	r.POST("/auth/login", handlers.Login)

	// ⏣ UNIVERSITY PANEL
	u := r.Group("/university", middleware.Auth(), middleware.OnlyUniversity)
	{
		u.GET("/dashboard", universityHandlers.Dashboard)
		u.GET("/colleges", universityHandlers.GetColleges)
		u.POST("/colleges", universityHandlers.CreateCollege)
		u.GET("/branches", universityHandlers.GetBranches)
		u.POST("/branches", universityHandlers.CreateBranch)
		u.GET("/courses", universityHandlers.GetCourses)
		u.POST("/courses", universityHandlers.CreateCourse)
		u.GET("/subjects", universityHandlers.GetSubjects)
		u.POST("/subjects", universityHandlers.CreateSubject)
		u.GET("/reports", universityHandlers.Reports)
		u.GET("/students", universityHandlers.GetAllStudents)
	}

	// ⏣ COLLEGE PANEL
	c := r.Group("/college", middleware.Auth(), middleware.OnlyCollege)
	{
		c.GET("/dashboard", collegeHandlers.Dashboard)
		c.GET("/students", collegeHandlers.GetStudents)
		c.POST("/students", collegeHandlers.AddStudent)
		c.GET("/subjects", collegeHandlers.GetSubjects)
		c.POST("/marks", collegeHandlers.SubmitMarks)
		c.GET("/marks/report", collegeHandlers.MarksReport)
	}

	// ⏣ STUDENT PANEL
	s := r.Group("/student", middleware.Auth(), middleware.OnlyStudent)
	{
		s.GET("/dashboard", studentHandlers.Dashboard)
		s.GET("/profile", studentHandlers.Profile)
		s.GET("/marks", studentHandlers.GetStudentMarks)
		s.GET("/subjects", studentHandlers.GetSubjects)
	}
}
