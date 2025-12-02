import { Navigate } from "react-router-dom";
import type { JSX } from "react";

interface Props {
    allowed: string[];
    children: JSX.Element;
}

export default function ProtectedRoute({ allowed, children }: Props) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" />;
    if (!allowed.includes(role ?? "")) return <Navigate to="/login" />;

    return children;
}
