import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import toast from "react-hot-toast";

interface Student {
    ID: number;
    Name: string;
    Enrollment: string;
    BranchID?: number;
    CourseID?: number;
    Semester: number;
}

interface NewStudentForm {
    Name: string;
    Enrollment: string;
    BranchID: string;
    CourseID: string;
    Semester: string;
}

export default function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [branchFilter, setBranchFilter] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("");
    const [form, setForm] = useState<NewStudentForm>({
        Name: "",
        Enrollment: "",
        BranchID: "",
        CourseID: "",
        Semester: "",
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
        if (!form.Name || !form.Enrollment) {
            toast.error("Name and Enrollment are required");
            return;
        }
        try {
            await axiosClient.post("/college/students", {
                Name: form.Name,
                Enrollment: form.Enrollment,
                BranchID: Number(form.BranchID),
                CourseID: Number(form.CourseID),
                Semester: Number(form.Semester),
            });
            toast.success("Student added");
            setForm({ Name: "", Enrollment: "", BranchID: "", CourseID: "", Semester: "" });
            fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add student");
        }
    };

    useEffect(() => {
        fetchStudents();
        // eslint-disable-next-line react-h ooks/exhaustive-deps
    }, []);

    const columns = useMemo<ColumnDef<Student, any>[]>(
        () => [
            { accessorKey: "ID", header: "ID" },
            { accessorKey: "Enrollment", header: "Enrollment" },
            { accessorKey: "Name", header: "Name" },
            {
                header: "Branch ID",
                cell: ({ row }) => row.original.BranchID ?? row.original.BranchID ?? "-",
            },
            {
                header: "Course ID",
                cell: ({ row }) => row.original.CourseID ?? row.original.CourseID ?? "-",
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
                        value={form.Name}
                        onChange={(e) => setForm({ ...form, Name: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Enrollment"
                        value={form.Enrollment}
                        onChange={(e) => setForm({ ...form, Enrollment: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Branch ID"
                        value={form.BranchID}
                        onChange={(e) => setForm({ ...form, BranchID: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Course ID"
                        value={form.CourseID}
                        onChange={(e) => setForm({ ...form, CourseID: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Semester"
                        value={form.Semester}
                        onChange={(e) => setForm({ ...form, Semester: e.target.value })}
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
