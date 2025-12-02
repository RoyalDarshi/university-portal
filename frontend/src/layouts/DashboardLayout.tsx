import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
    children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const menu = {
        university: [
            ["Dashboard", "/university/dashboard"],
            ["Colleges", "/university/colleges"],
            ["Branches", "/university/branches"],
            ["Courses", "/university/courses"],
            ["Subjects", "/university/subjects"],
            ["Reports", "/university/reports"],
        ],
        college: [
            ["Dashboard", "/college/dashboard"],
            ["Students", "/college/students"],
            ["Subjects", "/college/subjects"],
            ["Marks", "/college/marks"],
            ["Reports", "/college/reports"],
        ],
        student: [
            ["Dashboard", "/student/dashboard"],
            ["Profile", "/student/profile"],
            ["Subjects", "/student/subjects"],
            ["Marks", "/student/marks"],
        ],
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-blue-700 text-white flex flex-col">
                <h2 className="text-2xl font-bold p-6 border-b border-blue-500">
                    University Portal
                </h2>
                <nav className="flex-1 p-4 space-y-3 text-lg">
                    {menu[role as keyof typeof menu]?.map(([label, path]) => (
                        <Link key={path} className="block hover:text-yellow-300" to={path}>
                            {label}
                        </Link>
                    ))}
                </nav>
                <button onClick={logout} className="p-4 bg-red-500 hover:bg-red-600 font-semibold">
                    Logout
                </button>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow p-4 font-bold text-xl capitalize">
                    {role} Panel
                </header>
                <main className="p-6 overflow-y-auto flex-1">{children}</main>
            </div>
        </div>
    );
}
