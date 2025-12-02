import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import toast from "react-hot-toast";

interface Student {
    id: number;
    name: string;
    enrollment: string;
    branchID?: number;
    branch_id?: number;
    courseID?: number;
    course_id?: number;
    semester: number;
}

interface NewStudentForm {
    name: string;
    enrollment: string;
    branchID: string;
    courseID: string;
    semester: string;
}

export default function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [branchFilter, setBranchFilter] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("");
    const [form, setForm] = useState<NewStudentForm>({
        name: "",
        enrollment: "",
        branchID: "",
        courseID: "",
        semester: "",
    });

    const fetchStudents = async () => {
        try {
            const res = await axiosClient.get<Student[]>("/college/students", {
                params: {
                    branch: branchFilter || undefined,
                    semester: semesterFilter || undefined,
                },
            });
            setStudents(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load students");
        }
    };

    const addStudent = async () => {
        if (!form.name || !form.enrollment) {
            toast.error("Name and Enrollment are required");
            return;
        }
        try {
            await axiosClient.post("/college/students", {
                name: form.name,
                enrollment: form.enrollment,
                branchID: Number(form.branchID),
                courseID: Number(form.courseID),
                semester: Number(form.semester),
            });
            toast.success("Student added");
            setForm({ name: "", enrollment: "", branchID: "", courseID: "", semester: "" });
            fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add student");
        }
    };

    useEffect(() => {
        fetchStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = useMemo<ColumnDef<Student, any>[]>(
        () => [
            { accessorKey: "ID", header: "ID" },
            { accessorKey: "Enrollment", header: "Enrollment" },
            { accessorKey: "Name", header: "Name" },
            {
                header: "Branch ID",
                cell: ({ row }) => row.original.branchID ?? row.original.branch_id ?? "-",
            },
            {
                header: "Course ID",
                cell: ({ row }) => row.original.courseID ?? row.original.course_id ?? "-",
            },
            { accessorKey: "Semester", header: "Semester" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Students</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 bg-white p-4 rounded shadow">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Branch ID</label>
                    <input
                        className="border rounded px-3 py-1 text-sm"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        placeholder="e.g. 1"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Semester</label>
                    <input
                        className="border rounded px-3 py-1 text-sm"
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                        placeholder="e.g. 5"
                    />
                </div>
                <button
                    onClick={fetchStudents}
                    className="self-end bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
                >
                    Apply Filters
                </button>
            </div>

            {/* Add form */}
            <div className="bg-white rounded shadow p-4 space-y-3">
                <h3 className="font-semibold text-gray-700">Add New Student</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Enrollment"
                        value={form.enrollment}
                        onChange={(e) => setForm({ ...form, enrollment: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Branch ID"
                        value={form.branchID}
                        onChange={(e) => setForm({ ...form, branchID: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Course ID"
                        value={form.courseID}
                        onChange={(e) => setForm({ ...form, courseID: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Semester"
                        value={form.semester}
                        onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    />
                    <button
                        onClick={addStudent}
                        className="bg-green-600 text-white rounded px-3 py-1 text-sm"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Table */}
            <DataTable<Student>
                data={students}
                columns={columns}
                globalFilterPlaceholder="Search by name or enrollment..."
            />
        </div>
    );
}
