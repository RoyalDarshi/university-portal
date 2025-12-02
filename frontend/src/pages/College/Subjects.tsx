import { useState, useMemo } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import toast from "react-hot-toast";

interface Subject {
    id: number;
    name: string;
    course_id?: number;
    courseID?: number;
    semester: number;
    max_marks?: number;
    maxMarks?: number;
}

export default function CollegeSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");

    const fetchSubjects = async () => {
        if (!course || !semester) {
            toast.error("Course and Semester are required");
            return;
        }
        try {
            const res = await axiosClient.get<Subject[]>("/college/subjects", {
                params: { course, semester },
            });
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load subjects");
        }
    };

    const columns = useMemo<ColumnDef<Subject, any>[]>(
        () => [
            { accessorKey: "ID", header: "ID" },
            { accessorKey: "Name", header: "Name" },
            {
                header: "Course ID",
                cell: ({ row }) => row.original.courseID ?? row.original.course_id ?? "-",
            },
            { accessorKey: "Semester", header: "Semester" },
            {
                header: "Max Marks",
                cell: ({ row }) => row.original.maxMarks ?? row.original.max_marks ?? "-",
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Subjects</h2>

            <div className="flex flex-wrap gap-3 bg-white p-4 rounded shadow">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Course ID</label>
                    <input
                        className="border rounded px-3 py-1 text-sm"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. 1"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Semester</label>
                    <input
                        className="border rounded px-3 py-1 text-sm"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        placeholder="e.g. 5"
                    />
                </div>
                <button
                    onClick={fetchSubjects}
                    className="self-end bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
                >
                    Load Subjects
                </button>
            </div>

            <DataTable<Subject> data={subjects} columns={columns} />
        </div>
    );
}
