import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import { recordPayment } from "../../api/fees";
import type { FeeSummaryItem } from "../../api/fees";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import axiosClient from "../../api/axiosClient";

const STATUS_COLORS: Record<string, string> = {
    Paid: "#22c55e",
    Partial: "#eab308",
    Pending: "#ef4444",
    "No Fee": "#6b7280",
};

export default function CollegeFeeSummary() {
    const [data, setData] = useState<FeeSummaryItem[]>([]);
    const [payStudentId, setPayStudentId] = useState<number | null>(null);
    const [payAmount, setPayAmount] = useState("");
    const [payMode, setPayMode] = useState("CASH");
    const [payRef, setPayRef] = useState("");


    const loadFees = async () => {

        const result = await axiosClient.get("/college/fees/summary");
        setData(result.data);
    };

    useEffect(() => {
        loadFees();
    }, []);

    const columns = useMemo<ColumnDef<FeeSummaryItem, any>[]>(
        () => [
            { accessorKey: "student_name", header: "Student" },
            { accessorKey: "enrollment", header: "Enrollment" },
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
                cell: ({ row }) => {
                    const status = row.original.status;
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
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <button
                        className="text-xs px-2 py-1 rounded bg-blue-600 text-white"
                        onClick={() => setPayStudentId(row.original.student_id)}
                    >
                        Record Payment
                    </button>
                ),
            },
        ],
        []
    );

    const pieData = useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach((row) => {
            counts[row.status] = (counts[row.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    const handleSubmitPayment = async () => {
        if (!payStudentId || !payAmount || !payRef) {
            toast.error("Select student, amount, and reference");
            return;
        }
        try {
            await recordPayment({
                student_id: payStudentId,
                amount: Number(payAmount),
                mode: payMode,
                trans_id: payRef,
            });
            toast.success("Payment recorded");
            setPayAmount("");
            setPayRef("");
            setPayStudentId(null);
            loadFees();
        } catch (err) {
            console.error(err);
            toast.error("Failed to record payment");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Fee Summary (My College)</h2>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-4 max-w-xl">
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

            {/* Record Payment Panel */}
            <div className="bg-white rounded-lg shadow p-4 space-y-3 max-w-xl">
                <h3 className="font-semibold text-sm">Record Payment</h3>
                {payStudentId ? (
                    <p className="text-xs text-gray-600">
                        For Student ID: <span className="font-semibold">{payStudentId}</span>
                    </p>
                ) : (
                    <p className="text-xs text-gray-400">
                        Click "Record Payment" in the table to select a student.
                    </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <input
                        type="number"
                        placeholder="Amount"
                        className="border rounded px-2 py-1"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                    />
                    <select
                        className="border rounded px-2 py-1"
                        value={payMode}
                        onChange={(e) => setPayMode(e.target.value)}
                    >
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">Card</option>
                        <option value="NETBANKING">Net Banking</option>
                    </select>
                    <input
                        placeholder="Reference / Txn ID"
                        className="border rounded px-2 py-1"
                        value={payRef}
                        onChange={(e) => setPayRef(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleSubmitPayment}
                    className="px-4 py-1.5 rounded bg-green-600 text-white text-sm"
                >
                    Save Payment
                </button>
            </div>

            <DataTable<FeeSummaryItem>
                data={data}
                columns={columns}
                globalFilterPlaceholder="Search student or enrollment..."
            />
        </div>
    );
}
