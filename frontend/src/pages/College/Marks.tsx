import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

interface MarksRow {
    student_id: string;
    subject_id: string;
    marks: string;
    exam_type: string;
}

export default function CollegeMarks() {
    const [rows, setRows] = useState<MarksRow[]>([
        { student_id: "", subject_id: "", marks: "", exam_type: "Internal-1" },
    ]);
    const [submitting, setSubmitting] = useState(false);

    const updateRow = (index: number, key: keyof MarksRow, value: string) => {
        const copy = [...rows];
        copy[index] = { ...copy[index], [key]: value };
        setRows(copy);
    };

    const addRow = () => {
        setRows([
            ...rows,
            { student_id: "", subject_id: "", marks: "", exam_type: "Internal-1" },
        ]);
    };

    const submit = async () => {
        const payload = rows
            .filter((r) => r.student_id && r.subject_id && r.marks)
            .map((r) => ({
                student_id: Number(r.student_id),
                subject_id: Number(r.subject_id),
                marks: Number(r.marks),
                exam_type: r.exam_type,
            }));

        if (!payload.length) {
            toast.error("Enter at least one valid row");
            return;
        }

        setSubmitting(true);
        try {
            await axiosClient.post("/college/marks", payload);
            toast.success("Marks submitted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit marks");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Marks Entry</h2>

            <button
                onClick={addRow}
                className="bg-green-600 text-white px-4 py-1.5 rounded text-sm"
            >
                Add Row
            </button>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Student ID</th>
                            <th className="px-3 py-2 text-left">Subject ID</th>
                            <th className="px-3 py-2 text-left">Marks</th>
                            <th className="px-3 py-2 text-left">Exam Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i} className="border-b last:border-0">
                                <td className="px-3 py-2">
                                    <input
                                        className="border rounded px-2 py-1 w-28"
                                        value={r.student_id}
                                        onChange={(e) => updateRow(i, "student_id", e.target.value)}
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <input
                                        className="border rounded px-2 py-1 w-28"
                                        value={r.subject_id}
                                        onChange={(e) => updateRow(i, "subject_id", e.target.value)}
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <input
                                        className="border rounded px-2 py-1 w-20"
                                        value={r.marks}
                                        onChange={(e) => updateRow(i, "marks", e.target.value)}
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <input
                                        className="border rounded px-2 py-1 w-32"
                                        value={r.exam_type}
                                        onChange={(e) => updateRow(i, "exam_type", e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={submit}
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded text-sm"
            >
                {submitting ? "Submitting..." : "Submit Marks"}
            </button>
        </div>
    );
}
