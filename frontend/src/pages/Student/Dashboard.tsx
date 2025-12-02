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

interface DashboardData {
    total_subjects: number;
    total_marks: number;
    semester: number;
}

interface MarksRow {
    Subject: string;
    Marks: number;
}

export default function StudentDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [chartData, setChartData] = useState<MarksRow[]>([]);

    useEffect(() => {
        const load = async () => {
            const dashRes = await axiosClient.get<DashboardData>("/student/dashboard");
            setData(dashRes.data);

            const marksRes = await axiosClient.get<any[]>("/student/marks");
            const aggregated: Record<string, number> = {};
            marksRes.data.forEach((m) => {
                const subject = m.Subject;
                const marks = Number(m.Marks) || 0;
                aggregated[subject] = (aggregated[subject] || 0) + marks;
            });
            const arr: MarksRow[] = Object.entries(aggregated).map(([subject, marks]) => ({
                Subject: subject,
                Marks: marks,
            }));
            setChartData(arr);
        };
        load();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Student Dashboard</h2>

            {data ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card label="Subjects" value={data.total_subjects} />
                    <Card label="Total Marks" value={data.total_marks} />
                    <Card label="Semester" value={data.semester} />
                </div>
            ) : (
                <p>Loading summary...</p>
            )}

            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">Marks by Subject ({chartData.length} subjects)</h3>
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

function Card({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-white shadow rounded p-4">
            <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    );
}
