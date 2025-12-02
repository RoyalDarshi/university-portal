import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import UniversityDashboard from "./pages/University/Dashboard";
import Colleges from "./pages/University/Colleges";
import Branches from "./pages/University/Branches";
import Courses from "./pages/University/Courses";
import UniversitySubjects from "./pages/University/Subjects";
import UniversityReports from "./pages/University/Reports";
import CollegeDashboard from "./pages/College/Dashboard";
import CollegeStudents from "./pages/College/Students";
import CollegeSubjects from "./pages/College/Subjects";
import CollegeMarks from "./pages/College/Marks";
import CollegeReports from "./pages/College/Reports";
import StudentDashboard from "./pages/Student/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import StudentProfile from "./pages/Student/Profile";
import StudentSubjects from "./pages/Student/Subjects";
import StudentMarks from "./pages/Student/Marks";





export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          localStorage.getItem("role") === "university" ? (
            <Navigate to="/university/dashboard" />
          ) : localStorage.getItem("role") === "college" ? (
            <Navigate to="/college/dashboard" />
          ) : localStorage.getItem("role") === "student" ? (
            <Navigate to="/student/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="/login" element={<Login />} />

      {/* UNIVERSITY ROUTES */}
      <Route
        path="/university/dashboard"
        element={
          <ProtectedRoute allowed={["university"]}>
            <DashboardLayout>
              <UniversityDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/colleges"
        element={
          <ProtectedRoute allowed={["university"]}>
            <DashboardLayout>
              <Colleges />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/branches"
        element={
          <ProtectedRoute allowed={["university"]}>
            <DashboardLayout>
              <Branches />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/courses"
        element={
          <ProtectedRoute allowed={["university"]}>
            <DashboardLayout>
              <Courses />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/subjects"
        element={
          <ProtectedRoute allowed={["university"]}>
            <DashboardLayout>
              <UniversitySubjects />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/reports"
        element={
          <ProtectedRoute allowed={["university"]}>
            <DashboardLayout>
              <UniversityReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      {/* College */}
      <Route
        path="/college/dashboard"
        element={
          <ProtectedRoute allowed={["college"]}>
            <DashboardLayout>
              <CollegeDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/college/students"
        element={
          <ProtectedRoute allowed={["college"]}>
            <DashboardLayout>
              <CollegeStudents />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/college/subjects"
        element={
          <ProtectedRoute allowed={["college"]}>
            <DashboardLayout>
              <CollegeSubjects />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/college/marks"
        element={
          <ProtectedRoute allowed={["college"]}>
            <DashboardLayout>
              <CollegeMarks />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/college/reports"
        element={
          <ProtectedRoute allowed={["college"]}>
            <DashboardLayout>
              <CollegeReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      /* Student */
      <Route
        path="/student/dashboard"
        element={<ProtectedRoute allowed={["student"]}>
          <DashboardLayout><StudentDashboard /></DashboardLayout>
        </ProtectedRoute>}
      />
      <Route
        path="/student/profile"
        element={<ProtectedRoute allowed={["student"]}>
          <DashboardLayout><StudentProfile /></DashboardLayout>
        </ProtectedRoute>}
      />
      <Route
        path="/student/subjects"
        element={<ProtectedRoute allowed={["student"]}>
          <DashboardLayout><StudentSubjects /></DashboardLayout>
        </ProtectedRoute>}
      />
      <Route
        path="/student/marks"
        element={<ProtectedRoute allowed={["student"]}>
          <DashboardLayout><StudentMarks /></DashboardLayout>
        </ProtectedRoute>}
      />

    </Routes>
  );
}
