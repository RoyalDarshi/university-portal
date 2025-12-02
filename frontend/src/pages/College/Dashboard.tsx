import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface DashboardStats {
    students: number;
    branches: number;
    courses: number;
}

interface MarksRow {
    subject: string;
    marks: number;
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
                    const subject = r.subject;
                    const marks = Number(r.marks) || 0;
                    if (!map[subject]) map[subject] = { total: 0, count: 0 };
                    map[subject].total += marks;
                    map[subject].count += 1;
                });
                const arr: MarksRow[] = Object.entries(map).map(([subject, { total, count }]) => ({
                    subject,
                    marks: count ? total / count : 0,
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
                <h3 className="font-semibold mb-2">Average Marks by Subject</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="marks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
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
