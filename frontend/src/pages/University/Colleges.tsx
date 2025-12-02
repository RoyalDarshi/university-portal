import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import toast from "react-hot-toast";

interface College {
    id: number;
    name: string;
    code: string;
    email: string;
    phone?: string;
    address?: string;
}

interface CollegeForm {
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
}

export default function Colleges() {
    const [colleges, setColleges] = useState<College[]>([]);
    const [form, setForm] = useState<CollegeForm>({
        name: "",
        code: "",
        email: "",
        phone: "",
        address: "",
    });

    const load = async () => {
        try {
            const res = await axiosClient.get<College[]>("/university/colleges");
            setColleges(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load colleges");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async () => {
        if (!form.name || !form.code || !form.email) {
            toast.error("Name, Code, Email required");
            return;
        }
        try {
            await axiosClient.post("/university/colleges", form);
            toast.success("College added");
            setForm({ name: "", code: "", email: "", phone: "", address: "" });
            load();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add college");
        }
    };

    const columns = useMemo<ColumnDef<College, any>[]>(
        () => [
            { accessorKey: "ID", header: "ID" },
            { accessorKey: "Code", header: "Code" },
            { accessorKey: "Name", header: "Name" },
            { accessorKey: "Email", header: "Email" },
            { accessorKey: "Phone", header: "Phone" },
            { accessorKey: "Address", header: "Address" },
        ],
        []
    );

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold">Colleges</h2>

            <div className="bg-white rounded shadow p-4 space-y-3">
                <h3 className="font-semibold">Add College</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 text-sm">
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Code"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                    <button
                        onClick={submit}
                        className="bg-blue-600 text-white rounded px-3 py-1 text-sm"
                    >
                        Add
                    </button>
                </div>
            </div>

            <DataTable<College>
                data={colleges}
                columns={columns}
                globalFilterPlaceholder="Search colleges..."
            />
        </div>
    );
}
