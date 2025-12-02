import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import toast from "react-hot-toast";

interface Subject {
    id: number;
    name: string;
    course_id: number;
    semester: number;
    max_marks: number;
}

interface SubjectForm {
    name: string;
    courseID: string;
    semester: string;
    maxMarks: string;
}

export default function UniversitySubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [courseFilter, setCourseFilter] = useState("");
    const [form, setForm] = useState<SubjectForm>({
        name: "",
        courseID: "",
        semester: "",
        maxMarks: "",
    });

    const load = async () => {
        try {
            const res = await axiosClient.get<Subject[]>("/university/subjects", {
                params: { course: courseFilter || undefined },
            });
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load subjects");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async () => {
        if (!form.name || !form.courseID || !form.semester || !form.maxMarks) {
            toast.error("All fields required");
            return;
        }
        try {
            await axiosClient.post("/university/subjects", {
                name: form.name,
                course_id: Number(form.courseID),
                semester: Number(form.semester),
                max_marks: Number(form.maxMarks),
            });
            toast.success("Subject added");
            setForm({ name: "", courseID: "", semester: "", maxMarks: "" });
            load();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add subject");
        }
    };

    const columns = useMemo<ColumnDef<Subject, any>[]>(
        () => [
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "course_id", header: "Course ID" },
            { accessorKey: "semester", header: "Semester" },
            { accessorKey: "max_marks", header: "Max Marks" },
        ],
        []
    );

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold">Subjects</h2>

            <div className="flex flex-wrap gap-3 bg-white p-4 rounded shadow">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Course ID filter</label>
                    <input
                        className="border rounded px-3 py-1 text-sm"
                        placeholder="e.g. 1"
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
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
                <h3 className="font-semibold text-gray-700">Add Subject</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Subject name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Max Marks"
                        value={form.maxMarks}
                        onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
                    />
                    <button
                        onClick={submit}
                        className="bg-green-600 text-white rounded px-3 py-1 text-sm"
                    >
                        Add
                    </button>
                </div>
            </div>

            <DataTable<Subject>
                data={subjects}
                columns={columns}
                globalFilterPlaceholder="Search subjects..."
            />
        </div>
    );
}
