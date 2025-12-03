import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import { getUniversityFeeSummary } from "../../api/fees";
import type { FeeSummaryItem } from "../../api/fees";
import axiosClient from "../../api/axiosClient";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";

interface College {
    ID: number;
    Name: string;
}

const STATUS_COLORS: Record<string, string> = {
    Paid: "#22c55e",
    Partial: "#eab308",
    Pending: "#ef4444",
    "No Fee": "#6b7280",
};

export default function UniversityFeeSummary() {
    const [data, setData] = useState<FeeSummaryItem[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [collegeFilter, setCollegeFilter] = useState<string>("");

    const loadColleges = async () => {
        const res = await axiosClient.get<College[]>("/university/colleges");
        setColleges(res.data);
    };

    const loadFees = async () => {
        const collegeId = collegeFilter ? Number(collegeFilter) : undefined;
        const result = await getUniversityFeeSummary(collegeId);
        setData(result);
    };

    useEffect(() => {
        loadColleges();
        loadFees();
    }, []);

    useEffect(() => {
        loadFees();
    }, [collegeFilter]);

    const columns = useMemo<ColumnDef<FeeSummaryItem, any>[]>(
        () => [
            { accessorKey: "student_name", header: "Student" },
            { accessorKey: "enrollment", header: "Enrollment" },
            { accessorKey: "college_name", header: "College" },
            { accessorKey: "course_name", header: "Course" },
            {
                accessorKey: "total_fee",
                header: "Total Fee",
                cell: ({ getValue }) => `₹${getValue<number>()?.toLocaleString()}`,
            },
            {
                accessorKey: "paid_amount",
                header: "Paid",
                cell: ({ getValue }) => `₹${getValue<number>()?.toLocaleString()}`,
            },
            {
                accessorKey: "pending_amount",
                header: "Pending",
                cell: ({ getValue }) => `₹${getValue<number>()?.toLocaleString()}`,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    const color = STATUS_COLORS[status] || "#6b7280";
                    return (
                        <span
                            className="px-2 py-1 rounded-full text-xs text-white"
                            style={{ backgroundColor: color }}
                        >
                            {status}
                        </span>
                    );
                },
            },
        ],
        []
    );

    // Chart: status distribution
    const pieData = useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach((row) => {
            counts[row.status] = (counts[row.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    // Chart: paid vs pending total
    const barData = useMemo(() => {
        let totalPaid = 0;
        let totalPending = 0;
        data.forEach((row) => {
            totalPaid += row.paid_amount || 0;
            totalPending += row.pending_amount || 0;
        });
        return [
            { name: "Paid", amount: totalPaid },
            { name: "Pending", amount: totalPending },
        ];
    }, [data]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Fee Summary (All Students)</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filter by College:</span>
                    <select
                        value={collegeFilter}
                        onChange={(e) => setCollegeFilter(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value="">All</option>
                        {colleges.map((c) => (
                            <option key={c.ID} value={c.ID}>
                                {c.Name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold mb-2 text-sm">Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={90}
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={entry.name}
                                            fill={
                                                STATUS_COLORS[entry.name] ||
                                                Object.values(STATUS_COLORS)[index % 4]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold mb-2 text-sm">Total Paid vs Pending</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill={STATUS_COLORS["Paid"]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable<FeeSummaryItem>
                data={data}
                columns={columns}
                globalFilterPlaceholder="Search student, enrollment, course..."
            />
        </div>
    );
}
