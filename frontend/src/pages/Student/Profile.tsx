import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

// Updated interface to match the lowercase JSON keys and String types from the Go backend
interface Student {
    id: number;
    name: string;
    enrollment: string;
    course: string;   // Changed from number (ID) to string (Name)
    branch: string;   // Changed from number (ID) to string (Name)
    college: string;  // Changed from number (ID) to string (Name)
    semester: number;
    email?: string;
    phone?: string;
}

export default function StudentProfile() {
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosClient.get("/student/profile");
                setStudent(res.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        })();
    }, []);

    if (!student) return <p>Loading...</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Profile</h2>

            <div className="bg-white shadow rounded p-6 space-y-2">
                {/* Updated value accessors to use lowercase keys */}
                <Row label="Name" value={student.name} />
                <Row label="Enrollment" value={student.enrollment} />

                {/* No need for .toString() anymore as these are now strings */}
                <Row label="Course" value={student.course} />
                <Row label="Branch" value={student.branch} />
                <Row label="College" value={student.college} />

                <Row label="Semester" value={student.semester.toString()} />

                {student.email && <Row label="Email" value={student.email} />}
                {student.phone && <Row label="Phone" value={student.phone} />}
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <p>
            <span className="font-semibold">{label}:</span> {value}
        </p>
    );
}