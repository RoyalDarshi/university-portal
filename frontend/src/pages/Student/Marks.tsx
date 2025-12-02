import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";

interface Marks {
    subject: string;
    exam_type: string;
    marks: number;
    max_marks: number;
}

export default function StudentMarks() {
    const [rows, setRows] = useState<Marks[]>([]);

    useEffect(() => {
        (async () => {
            const res = await axiosClient.get("/student/marks");
            setRows(res.data);
        })();
    }, []);

    const columns = useMemo<ColumnDef<Marks, any>[]>(
        () => [
            { accessorKey: "subject", header: "Subject" },
            { accessorKey: "exam_type", header: "Exam Type" },
            { accessorKey: "marks", header: "Marks" },
            { accessorKey: "max_marks", header: "Max Marks" },
        ],
        []
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Marks</h2>
            <DataTable<Marks> data={rows} columns={columns} globalFilterPlaceholder="Search marks..." />
        </div>
    );
}
