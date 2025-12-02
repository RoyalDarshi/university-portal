import { useEffect, useState, useMemo } from "react";
import { getStudents } from "../../api/university";
import axiosClient from "../../api/axiosClient";
import { DataTable } from "../../components/DataTable"; // Ensure this path matches where you saved DataTable.tsx
import type { ColumnDef } from "@tanstack/react-table";

interface College {
    ID: number;
    Name: string;
    Code: string;
    Email: string;
    Phone?: string;
    Address?: string;
}

interface Student {
    ID: number;
    Name: string;
    Enrollment: string;
    College: string;
    Course: string;
    Branch: string;
    Semester: number;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [filterCollege, setFilterCollege] = useState("");

    const fetchStudents = async () => {
        // Ensure filterCollege is passed correctly (convert to number if present)
        const data = await getStudents(filterCollege ? Number(filterCollege) : undefined);
        setStudents(data);
    };

    useEffect(() => {
        fetchStudents();
    }, [filterCollege]);

    useEffect(() => {
        (async () => {
            const res = await axiosClient.get<College[]>("/university/colleges");
            setColleges(res.data);
        })();
    }, []);

    // Define columns for TanStack Table
    const columns = useMemo<ColumnDef<Student>[]>(
        () => [
            {
                header: "Student",
                accessorKey: "Name",
            },
            {
                header: "Enrollment",
                accessorKey: "Enrollment",
            },
            {
                header: "College",
                accessorKey: "College",
            },
            {
                header: "Course",
                accessorKey: "Course",
            },
            {
                header: "Branch",
                accessorKey: "Branch",
            },
            {
                header: "Semester",
                accessorKey: "Semester",
            },
        ],
        []
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-5">All Students</h1>

            {/* Filter Dropdown (Server-side filter) */}
            <div className="mb-6">
                <select
                    className="border p-2 rounded w-full max-w-xs"
                    value={filterCollege}
                    onChange={(e) => setFilterCollege(e.target.value)}
                >
                    <option value="">All Colleges</option>
                    {colleges.map((clg) => (
                        <option key={clg.ID} value={clg.ID}>
                            {clg.Name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reusable Data Table (Client-side sorting/filtering) */}
            <DataTable
                columns={columns}
                data={students}
                globalFilterPlaceholder="Search students..."
            />
        </div>
    );
}