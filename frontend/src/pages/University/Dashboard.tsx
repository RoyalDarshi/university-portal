import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface UniStats {
    colleges: number;
    branches: number;
    courses: number;
    students: number;
}

interface TopStudent {
    name: string;
    total_marks: number;
}

interface BranchAvg {
    branch: string;
    avg_marks: number;
}

interface ReportsResponse {
    top_students: TopStudent[];
    branch_avg: BranchAvg[];
}

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#e11d48"];

export default function UniversityDashboard() {
    const [stats, setStats] = useState<UniStats | null>(null);
    const [report, setReport] = useState<ReportsResponse | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, reportRes] = await Promise.all([
                    axiosClient.get<UniStats>("/university/dashboard"),
                    axiosClient.get<ReportsResponse>("/university/reports"),
                ]);
                setStats(statsRes.data);
                setReport(reportRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">University Dashboard</h2>

            {/* Stats cards */}
            {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Colleges" value={stats.colleges} />
                    <StatCard label="Branches" value={stats.branches} />
                    <StatCard label="Courses" value={stats.courses} />
                    <StatCard label="Students" value={stats.students} />
                </div>
            ) : (
                <p>Loading stats...</p>
            )}

            {/* Charts */}
            {report && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top students bar chart */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-2">Top Performing Students</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={report.top_students}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="total_marks" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Branch average pie chart */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-2">Average Marks by Branch</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={report.branch_avg as any[]}
                                        dataKey="avg_marks"
                                        nameKey="branch"
                                        outerRadius={90}
                                        label
                                    >
                                        {report.branch_avg.map((entry, index) => (
                                            <Cell
                                                key={entry.branch}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
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
