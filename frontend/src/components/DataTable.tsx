import React from "react";
import type {
    ColumnDef,
} from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, any>[];
    globalFilterPlaceholder?: string;
}

export function DataTable<T extends object>({
    data,
    columns,
    globalFilterPlaceholder = "Search...",
}: DataTableProps<T>) {
    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-3">
            {/* Global filter */}
            <div>
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder={globalFilterPlaceholder}
                    className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort();
                                    const sorted = header.column.getIsSorted();
                                    return (
                                        <th
                                            key={header.id}
                                            className="px-3 py-2 text-left font-semibold border-b border-gray-200 cursor-pointer select-none"
                                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {canSort && (
                                                    <span className="text-xs text-gray-500">
                                                        {sorted === "asc" ? "▲" : sorted === "desc" ? "▼" : "↕"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => {
                                        // Add this console log to check browser console
                                        console.log("Cell Value:", row.getAllCells()[0].getValue());

                                        return (
                                            <td key={cell.id} className="px-3 py-2 align-top">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-3 py-4 text-center text-gray-500" colSpan={columns.length}>
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
