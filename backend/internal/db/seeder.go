package db

import (
	"fmt"

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
	db.FirstOrCreate(&university, models.University{Name: university.Name})

	// 2. Colleges
	colleges := []models.College{
		{Name: "ABC Engineering College", Code: "ABC01", Email: "abc@college.com", Phone: "9999911111", Address: "Delhi"},
		{Name: "XYZ Institute of Technology", Code: "XYZ01", Email: "xyz@college.com", Phone: "9999922222", Address: "Mumbai"},
	}
	for i := range colleges {
		db.FirstOrCreate(&colleges[i], models.College{Email: colleges[i].Email})
	}
	fmt.Println("✔ Colleges OK")

	// 3. Branches
	branches := []models.Branch{
		{Name: "Computer Science", CollegeID: colleges[0].ID},
		{Name: "Civil Engineering", CollegeID: colleges[0].ID},
		{Name: "Computer Science", CollegeID: colleges[1].ID},
		{Name: "Mechanical Engineering", CollegeID: colleges[1].ID},
	}
	for i := range branches {
		db.FirstOrCreate(&branches[i], models.Branch{Name: branches[i].Name, CollegeID: branches[i].CollegeID})
	}
	fmt.Println("✔ Branches OK")

	// 4. Courses
	courses := []models.Course{
		{Name: "B.Tech CSE", BranchID: branches[0].ID},
		{Name: "BCA", BranchID: branches[0].ID},
		{Name: "B.Tech Civil", BranchID: branches[1].ID},
		{Name: "B.Tech CSE", BranchID: branches[2].ID},
		{Name: "B.Tech Mechanical", BranchID: branches[3].ID},
	}
	for i := range courses {
		db.FirstOrCreate(&courses[i], models.Course{Name: courses[i].Name, BranchID: courses[i].BranchID})
	}
	fmt.Println("✔ Courses OK")

	// 5. Subjects
	subjects := []models.Subject{
		{Name: "Data Structures", CourseID: courses[0].ID, Semester: 3, MaxMarks: 100},
		{Name: "DBMS", CourseID: courses[0].ID, Semester: 3, MaxMarks: 100},
		{Name: "Computer Networks", CourseID: courses[0].ID, Semester: 4, MaxMarks: 100},
		{Name: "Operating Systems", CourseID: courses[0].ID, Semester: 4, MaxMarks: 100},
		{Name: "Programming in C", CourseID: courses[1].ID, Semester: 1, MaxMarks: 100},
		{Name: "Engineering Mechanics", CourseID: courses[2].ID, Semester: 1, MaxMarks: 100},
		{Name: "Machine Learning", CourseID: courses[3].ID, Semester: 5, MaxMarks: 100},
		{Name: "Thermodynamics", CourseID: courses[4].ID, Semester: 3, MaxMarks: 100},
	}
	for i := range subjects {
		db.FirstOrCreate(&subjects[i], models.Subject{Name: subjects[i].Name, CourseID: subjects[i].CourseID})
	}
	fmt.Println("✔ Subjects OK")

	// 6. Students
	students := []models.Student{
		{Name: "Arjun", Email: "arjun@student.com", Enrollment: "CSE21A001", CourseID: courses[0].ID, BranchID: branches[0].ID, CollegeID: colleges[0].ID, Semester: 3, Phone: "9876543210"},
		{Name: "Neha", Email: "neha@student.com", Enrollment: "CSE21A002", CourseID: courses[0].ID, BranchID: branches[0].ID, CollegeID: colleges[0].ID, Semester: 3, Phone: "8888877777"},
		{Name: "Rahul", Email: "rahul@student.com", Enrollment: "MECH22B001", CourseID: courses[4].ID, BranchID: branches[3].ID, CollegeID: colleges[1].ID, Semester: 3, Phone: "9998886666"},
	}
	for i := range students {
		db.FirstOrCreate(&students[i], models.Student{Enrollment: students[i].Enrollment})
	}
	fmt.Println("✔ Students OK")

	// 7. Users
	users := []models.User{
		{Email: "uni@admin.com", Password: hashPassword("123"), Role: "university", ReferenceID: university.ID},
		{Email: "college1@demo.com", Password: hashPassword("123"), Role: "college", ReferenceID: colleges[0].ID},
		{Email: "college2@demo.com", Password: hashPassword("123"), Role: "college", ReferenceID: colleges[1].ID},
		{Email: "arjun@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: students[0].ID},
		{Email: "neha@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: students[1].ID},
		{Email: "rahul@student.com", Password: hashPassword("123"), Role: "student", ReferenceID: students[2].ID},
	}
	for i := range users {
		db.FirstOrCreate(&users[i], models.User{Email: users[i].Email})
	}
	fmt.Println("✔ Users OK")

	// 8. Fee Structure
	feeStructures := []models.FeeStructure{
		{CourseID: courses[0].ID, Amount: 60000},
		{CourseID: courses[1].ID, Amount: 45000},
		{CourseID: courses[2].ID, Amount: 55000},
		{CourseID: courses[3].ID, Amount: 60000},
		{CourseID: courses[4].ID, Amount: 58000},
	}
	for i := range feeStructures {
		db.FirstOrCreate(&feeStructures[i], models.FeeStructure{CourseID: feeStructures[i].CourseID})
	}
	fmt.Println("✔ Fee Structure OK")

	// 9. Fee Payments
	feePayments := []models.FeePayment{
		{StudentID: students[0].ID, Amount: 30000, Mode: "UPI", TransID: "TXN-001"},
		{StudentID: students[0].ID, Amount: 30000, Mode: "UPI", TransID: "TXN-002"},
		{StudentID: students[1].ID, Amount: 30000, Mode: "Cash", TransID: "CASH-001"},
		{StudentID: students[2].ID, Amount: 20000, Mode: "Card", TransID: "CARD-001"},
		{StudentID: students[2].ID, Amount: 15000, Mode: "Card", TransID: "CARD-002"},
	}
	for i := range feePayments {
		db.FirstOrCreate(&feePayments[i], models.FeePayment{TransID: feePayments[i].TransID})
	}
	fmt.Println("✔ Fee Payments OK")

	internalMarks := []models.InternalMarks{
		// Arjun
		{StudentID: students[0].ID, SubjectID: subjects[0].ID, Marks: 26, ExamType: "Mid-1"},
		{StudentID: students[0].ID, SubjectID: subjects[0].ID, Marks: 28, ExamType: "Mid-2"},
		{StudentID: students[0].ID, SubjectID: subjects[0].ID, Marks: 86, ExamType: "Final"},

		{StudentID: students[0].ID, SubjectID: subjects[1].ID, Marks: 22, ExamType: "Mid-1"},
		{StudentID: students[0].ID, SubjectID: subjects[1].ID, Marks: 24, ExamType: "Mid-2"},
		{StudentID: students[0].ID, SubjectID: subjects[1].ID, Marks: 81, ExamType: "Final"},

		// Neha
		{StudentID: students[1].ID, SubjectID: subjects[0].ID, Marks: 21, ExamType: "Mid-1"},
		{StudentID: students[1].ID, SubjectID: subjects[0].ID, Marks: 23, ExamType: "Mid-2"},
		{StudentID: students[1].ID, SubjectID: subjects[0].ID, Marks: 73, ExamType: "Final"},

		// Rahul
		{StudentID: students[2].ID, SubjectID: subjects[7].ID, Marks: 28, ExamType: "Mid-1"},
		{StudentID: students[2].ID, SubjectID: subjects[7].ID, Marks: 27, ExamType: "Mid-2"},
		{StudentID: students[2].ID, SubjectID: subjects[7].ID, Marks: 69, ExamType: "Final"},
	}
	for _, m := range internalMarks {
		db.FirstOrCreate(&m, models.InternalMarks{StudentID: m.StudentID, SubjectID: m.SubjectID, ExamType: m.ExamType})
	}
	fmt.Println("✔ Internal Marks OK")

	fmt.Println("🌱 Seeder Completed")
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
