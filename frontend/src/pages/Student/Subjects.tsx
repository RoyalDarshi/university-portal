import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";

interface Subject {
    id: number;
    name: string;
    max_marks: number;
}

export default function StudentSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        (async () => {
            const res = await axiosClient.get("/student/subjects");
            setSubjects(res.data);
        })();
    }, []);

    const columns = useMemo<ColumnDef<Subject, any>[]>(
        () => [
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Subject" },
            { accessorKey: "max_marks", header: "Max Marks" },
        ],
        []
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Subjects</h2>
            <DataTable<Subject> data={subjects} columns={columns} globalFilterPlaceholder="Search subjects..." />
        </div>
    );
}
