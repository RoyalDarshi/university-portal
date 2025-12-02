import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import toast from "react-hot-toast";

interface Course {
    id: number;
    name: string;
    branch_id: number;
}

interface CourseForm {
    name: string;
    branchID: string;
}

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [branchFilter, setBranchFilter] = useState("");
    const [form, setForm] = useState<CourseForm>({ name: "", branchID: "" });

    const load = async () => {
        try {
            const res = await axiosClient.get<Course[]>("/university/courses", {
                params: { branch: branchFilter || undefined },
            });
            setCourses(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load courses");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async () => {
        if (!form.name || !form.branchID) {
            toast.error("Name & Branch ID required");
            return;
        }
        try {
            await axiosClient.post("/university/courses", {
                name: form.name,
                branch_id: Number(form.branchID),
            });
            toast.success("Course added");
            setForm({ name: "", branchID: "" });
            load();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add course");
        }
    };

    const columns = useMemo<ColumnDef<Course, any>[]>(
        () => [
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "branch_id", header: "Branch ID" },
        ],
        []
    );

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold">Courses</h2>

            <div className="flex flex-wrap gap-3 bg-white p-4 rounded shadow">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Branch ID filter</label>
                    <input
                        className="border rounded px-3 py-1 text-sm"
                        placeholder="e.g. 1"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                    />
                </div>
                <button
                    onClick={load}
                    className="self-end bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
                >
                    Apply
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow space-y-2">
                <h3 className="font-semibold text-gray-700">Add Course</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Course name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Branch ID"
                        value={form.branchID}
                        onChange={(e) => setForm({ ...form, branchID: e.target.value })}
                    />
                    <button
                        onClick={submit}
                        className="bg-green-600 text-white rounded px-3 py-1 text-sm"
                    >
                        Add
                    </button>
                </div>
            </div>

            <DataTable<Course>
                data={courses}
                columns={columns}
                globalFilterPlaceholder="Search courses..."
            />
        </div>
    );
}
