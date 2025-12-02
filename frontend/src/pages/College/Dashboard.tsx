import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface DashboardStats {
    students: number;
    branches: number;
    courses: number;
}

interface MarksRow {
    Subject: string;
    Marks: number;
}

export default function CollegeDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<MarksRow[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const statsRes = await axiosClient.get<DashboardStats>("/college/dashboard");
                setStats(statsRes.data);

                const reportRes = await axiosClient.get<any[]>("/college/marks/report");
                // group by subject -> average marks
                const map: Record<string, { total: number; count: number }> = {};
                reportRes.data.forEach((r) => {
                    const subject = r.Subject;
                    const marks = Number(r.Marks) || 0;
                    if (!map[subject]) map[subject] = { total: 0, count: 0 };
                    map[subject].total += marks;
                    map[subject].count += 1;
                });
                const arr: MarksRow[] = Object.entries(map).map(([subject, { total, count }]) => ({
                    Subject: subject,
                    Marks: count ? total / count : 0,
                }));
                setChartData(arr.slice(0, 7)); // top 7 subjects
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">College Dashboard</h2>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Students" value={stats.students} />
                    <StatCard label="Branches" value={stats.branches} />
                    <StatCard label="Courses" value={stats.courses} />
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">Average Marks by Subject ({chartData.length} subjects)</h3>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Subject" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="Marks" fill="#3b82f6" stroke="#1e40af" strokeWidth={1} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: 300 }} className="flex items-center justify-center text-gray-500">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs uppercase text-gray-500 mb-1">{label}</div>
            <div className="text-2xl font-semibold text-gray-800">{value}</div>
        </div>
    );
}
