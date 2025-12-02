import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";

interface MarksReportRow {
    StudentID?: number;
    Name: string;
    Subject: string;
    Marks: number;
    ExamType?: string;
}

export default function CollegeReports() {
    const [rows, setRows] = useState<MarksReportRow[]>([]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axiosClient.get<MarksReportRow[]>("/college/marks/report");
                setRows(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReport();
    }, []);

    const columns = useMemo<ColumnDef<MarksReportRow, any>[]>(
        () => [
            {
                header: "Student ID",
                cell: ({ row }) =>
                    row.original.StudentID ?? row.original.StudentID ?? "-",
            },
            { accessorKey: "Name", header: "Student Name" },
            { accessorKey: "Subject", header: "Subject" },
            { accessorKey: "Marks", header: "Marks" },
            {
                header: "Exam Type",
                cell: ({ row }) => row.original.ExamType ?? row.original.ExamType ?? "-",
            },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Marks Report</h2>
            <DataTable<MarksReportRow> data={rows} columns={columns} />
        </div>
    );
}
