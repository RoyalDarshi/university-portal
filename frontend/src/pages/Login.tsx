import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = async () => {
        try {
            const res = await axiosClient.post("/auth/login", { email, password });
            dispatch(loginSuccess(res.data));
            const role = res.data.role;
            navigate(`/${role}/dashboard`);
        } catch {
            toast.error("Invalid email or password");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white w-96 shadow-lg p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                <input className="border w-full p-2 mb-3 rounded" placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)} />
                <input className="border w-full p-2 mb-5 rounded" type="password" placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} />

                <button onClick={submit}
                    className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </div>
        </div>
    );
}
