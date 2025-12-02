import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import toast from "react-hot-toast";

interface Branch {
    id: number;
    name: string;
    college_id: number;
}

interface BranchForm {
    name: string;
    collegeID: string;
}

export default function Branches() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [collegeFilter, setCollegeFilter] = useState("");
    const [form, setForm] = useState<BranchForm>({ name: "", collegeID: "" });

    const load = async () => {
        try {
            const res = await axiosClient.get<Branch[]>("/university/branches", {
                params: { college: collegeFilter || undefined },
            });
            setBranches(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load branches");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async () => {
        if (!form.name || !form.collegeID) {
            toast.error("Name & College ID required");
            return;
        }
        try {
            await axiosClient.post("/university/branches", {
                name: form.name,
                college_id: Number(form.collegeID),
            });
            toast.success("Branch added");
            setForm({ name: "", collegeID: "" });
            load();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add branch");
        }
    };

    const columns = useMemo<ColumnDef<Branch, any>[]>(
        () => [
            { accessorKey: "ID", header: "ID" },
            { accessorKey: "Name", header: "Name" },
            { accessorKey: "CollegeID", header: "College ID" },
        ],
        []
    );

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold">Branches</h2>

            <div className="flex flex-wrap gap-3 bg-white p-4 rounded shadow">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">College ID filter</label>
                    <input
                        className="border rounded px-3 py-1 text-sm"
                        placeholder="e.g. 1"
                        value={collegeFilter}
                        onChange={(e) => setCollegeFilter(e.target.value)}
                    />
                </div>
                <button
                    onClick={load}
                    className="self-end bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
                >
                    Apply
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow space-y-2">
                <h3 className="font-semibold text-gray-700">Add Branch</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Branch name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="College ID"
                        value={form.collegeID}
                        onChange={(e) => setForm({ ...form, collegeID: e.target.value })}
                    />
                    <button
                        onClick={submit}
                        className="bg-green-600 text-white rounded px-3 py-1 text-sm"
                    >
                        Add
                    </button>
                </div>
            </div>

            <DataTable<Branch>
                data={branches}
                columns={columns}
                globalFilterPlaceholder="Search branches..."
            />
        </div>
    );
}
