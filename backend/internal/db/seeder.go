package db

import (
	"fmt"
	"log"

	"university-backend/internal/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func hashPassword(p string) string {
	h, _ := bcrypt.GenerateFromPassword([]byte(p), bcrypt.DefaultCost)
	return string(h)
}

func Seed(db *gorm.DB) {
	fmt.Println("🌱 Running Seeder...")

	// 1. University
	university := models.University{Name: "Global Technical University"}
	if err := db.FirstOrCreate(&university, models.University{Name: university.Name}).Error; err != nil {
		log.Printf("⚠ Could not seed university: %v", err)
	}

	// 2. Colleges
	colleges := []models.College{
		{Name: "ABC Engineering College", Code: "ABC01", Email: "abc@college.com", Phone: "9999911111", Address: "Delhi"},
		{Name: "XYZ Institute of Technology", Code: "XYZ01", Email: "xyz@college.com", Phone: "9999922222", Address: "Mumbai"},
	}
	for _, c := range colleges {
		db.Where(models.College{Email: c.Email}).FirstOrCreate(&c)
	}
	log.Println("✔ Colleges ensured")

	// 3. Branches
	branches := []models.Branch{
		{Name: "Computer Science", CollegeID: 1},
		{Name: "Civil Engineering", CollegeID: 1},
		{Name: "Computer Science", CollegeID: 2},
		{Name: "Mechanical Engineering", CollegeID: 2},
	}
	for _, b := range branches {
		db.Where(models.Branch{Name: b.Name, CollegeID: b.CollegeID}).FirstOrCreate(&b)
	}
	log.Println("✔ Branches ensured")

	// 4. Courses
	courses := []models.Course{
		{Name: "B.Tech CSE", BranchID: 1},
		{Name: "BCA", BranchID: 1},
		{Name: "B.Tech Civil", BranchID: 2},
		{Name: "B.Tech CSE", BranchID: 3},
		{Name: "B.Tech Mechanical", BranchID: 4},
	}
	for _, c := range courses {
		db.Where(models.Course{Name: c.Name, BranchID: c.BranchID}).FirstOrCreate(&c)
	}
	log.Println("✔ Courses ensured")

	// 5. Subjects
	subjects := []models.Subject{
		{Name: "Data Structures", CourseID: 1, Semester: 3, MaxMarks: 100},
		{Name: "DBMS", CourseID: 1, Semester: 3, MaxMarks: 100},
		{Name: "Computer Networks", CourseID: 1, Semester: 4, MaxMarks: 100},
		{Name: "Operating Systems", CourseID: 1, Semester: 4, MaxMarks: 100},
		{Name: "Programming in C", CourseID: 2, Semester: 1, MaxMarks: 100},
		{Name: "Engineering Mechanics", CourseID: 3, Semester: 1, MaxMarks: 100},
		{Name: "Machine Learning", CourseID: 4, Semester: 5, MaxMarks: 100},
		{Name: "Thermodynamics", CourseID: 5, Semester: 3, MaxMarks: 100},
	}
	for _, s := range subjects {
		db.Where(models.Subject{Name: s.Name, CourseID: s.CourseID}).FirstOrCreate(&s)
	}
	log.Println("✔ Subjects ensured")

	// 6. Users (login credentials)
	users := []models.User{
		{Email: "uni@admin.com", Password: hashPassword("123"), Role: "university", ReferenceID: 1},
		{Email: "college1@demo.com", Password: hashPassword("123"), Role: "college", ReferenceID: 1},
		{Email: "college2@demo.com", Password: hashPassword("123"), Role: "college", ReferenceID: 2},
		{Email: "arjun@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: 1},
		{Email: "neha@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: 2},
		{Email: "rahul@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: 3},
	}
	for _, u := range users {
		// Check by email
		var count int64
		db.Model(&models.User{}).Where("email = ?", u.Email).Count(&count)
		if count == 0 {
			db.Create(&u)
		}
	}
	log.Println("✔ Users ensured")

	// 7. Students table
	students := []models.Student{
		{Name: "Arjun", Email: "arjun@student.com", Enrollment: "CSE21A001", CourseID: 1, BranchID: 1, CollegeID: 1, Semester: 3, Phone: "9876543210"},
		{Name: "Neha", Email: "neha@student.com", Enrollment: "CSE21A002", CourseID: 1, BranchID: 1, CollegeID: 1, Semester: 3, Phone: "8888877777"},
		{Name: "Rahul", Email: "rahul@student.com", Enrollment: "MECH22B001", CourseID: 5, BranchID: 4, CollegeID: 2, Semester: 3, Phone: "9998886666"},
	}
	for _, s := range students {
		db.Where(models.Student{Enrollment: s.Enrollment}).FirstOrCreate(&s)
	}
	log.Println("✔ Students ensured")

	// 8. Internal Marks
	internalMarks := []models.InternalMarks{
		{StudentID: 1, SubjectID: 1, Marks: 76, ExamType: "Mid"},
		{StudentID: 1, SubjectID: 2, Marks: 85, ExamType: "Mid"},
		{StudentID: 1, SubjectID: 3, Marks: 89, ExamType: "Final"},
		{StudentID: 1, SubjectID: 4, Marks: 91, ExamType: "Final"},

		{StudentID: 2, SubjectID: 1, Marks: 63, ExamType: "Mid"},
		{StudentID: 2, SubjectID: 2, Marks: 72, ExamType: "Mid"},
		{StudentID: 2, SubjectID: 3, Marks: 70, ExamType: "Final"},
		{StudentID: 2, SubjectID: 4, Marks: 67, ExamType: "Final"},

		{StudentID: 3, SubjectID: 7, Marks: 80, ExamType: "Mid"},
		{StudentID: 3, SubjectID: 8, Marks: 74, ExamType: "Final"},
	}
	for _, m := range internalMarks {
		db.Where(models.InternalMarks{StudentID: m.StudentID, SubjectID: m.SubjectID, ExamType: m.ExamType}).FirstOrCreate(&m)
	}
	log.Println("✔ Internal Marks ensured")

	fmt.Println("🌱 Seeder completed successfully")
}

func SeedUsers(db *gorm.DB) {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		return // users already exist
	}

	users := []models.User{
		// 🔴 CHANGE THIS: Wrap "123" in hashPassword()
		{Email: "uni@admin.com", Password: hashPassword("123"), Role: "university", ReferenceID: 1},
		{Email: "college1@demo.com", Password: hashPassword("123"), Role: "college", ReferenceID: 1},
		{Email: "college2@demo.com", Password: hashPassword("123"), Role: "college", ReferenceID: 2},
		{Email: "arjun@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: 1},
		{Email: "neha@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: 2},
		{Email: "rahul@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: 3},
	}
	for i := range users {
		db.Create(&users[i])
	}

	for _, u := range users {
		db.Create(&u)
	}

	println("✔ Dummy users added")
}
