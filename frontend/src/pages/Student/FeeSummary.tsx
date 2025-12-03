import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface FeeSummary {
    student_id: number;
    name: string;
    enrollment: string;
    course: string;
    college: string;
    total_fee: number;
    paid_amount: number;
    pending_amount: number;
    status: string;
}

interface FeePayment {
    ID: number;
    Amount: number;
    Mode: string;
    TransID: string;
    PaidAt: string;
}

export default function StudentFeeSummaryPage() {
    const [summary, setSummary] = useState<FeeSummary | null>(null);
    const [history, setHistory] = useState<FeePayment[]>([]);


    useEffect(() => {

        (async () => {
            const s = await axiosClient.get("/student/fees/summary");
            setSummary(s.data);

            const h = await axiosClient.get("/student/fees/history");
            setHistory(h.data);
        })();
    }, []);

    // chart data: cumulative payments over time
    const chartData = history
        .slice()
        .reverse()
        .reduce<{ paidAt: string; amount: number; cumulative: number }[]>(
            (acc, p) => {
                const prev = acc[acc.length - 1]?.cumulative || 0;
                const next = prev + p.Amount;
                acc.push({
                    paidAt: new Date(p.PaidAt).toLocaleDateString(),
                    amount: p.Amount,
                    cumulative: next,
                });
                return acc;
            },
            []
        );


    if (!summary) {
        return <p>Loading fee details...</p>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Fees</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InfoCard label="Total Fee" value={`₹${summary.total_fee.toLocaleString()}`} />
                <InfoCard label="Paid" value={`₹${summary.paid_amount.toLocaleString()}`} />
                <InfoCard label="Pending" value={`₹${summary.pending_amount.toLocaleString()}`} />
                <InfoCard label="Status" value={summary.status} />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2 text-sm">Payment History (Cumulative)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="paidAt" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="cumulative" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3 text-sm">Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Amount</th>
                                <th className="p-2 border">Mode</th>
                                <th className="p-2 border">Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((p) => (
                                <tr key={p.ID}>
                                    <td className="p-2 border">
                                        {new Date(p.PaidAt).toLocaleString()}
                                    </td>
                                    <td className="p-2 border">₹{p.Amount.toLocaleString()}</td>
                                    <td className="p-2 border">{p.Mode}</td>
                                    <td className="p-2 border">{p.TransID}</td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-3 text-center text-gray-400">
                                        No payments yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
}
