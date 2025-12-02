import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";

interface TopStudent {
    Name: string;
    TotalMarks: number;
}

interface BranchAvg {
    Branch: string;
    AvgMarks: number;
}

interface ReportsResponse {
    top_students: TopStudent[];
    branch_avg: BranchAvg[];
}

export default function UniversityReports() {
    const [data, setData] = useState<ReportsResponse | null>(null);

    useEffect(() => {
        (async () => {
            const res = await axiosClient.get<ReportsResponse>("/university/reports");
            setData(res.data);
        })();
    }, []);

    const topCols = useMemo<ColumnDef<TopStudent, any>[]>(
        () => [
            { accessorKey: "Name", header: "Student" },
            { accessorKey: "TotalMarks", header: "Total Marks" },
        ],
        []
    );

    const branchCols = useMemo<ColumnDef<BranchAvg, any>[]>(
        () => [
            { accessorKey: "Branch", header: "Branch" },
            { accessorKey: "AvgMarks", header: "Average Marks" },
        ],
        []
    );

    if (!data) return <p>Loading...</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">University Reports</h2>

            <div>
                <h3 className="font-semibold mb-2">Top Students</h3>
                <DataTable<TopStudent> data={data.top_students} columns={topCols} />
            </div>

            <div>
                <h3 className="font-semibold mb-2">Branch-wise Average Marks</h3>
                <DataTable<BranchAvg> data={data.branch_avg} columns={branchCols} />
            </div>
        </div>
    );
}