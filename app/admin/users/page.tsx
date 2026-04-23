'use client';

import { showToast } from "@/components/toast-notification";
import { getAllUserPaginated } from "@/lib/api/userApi";
import { PaginationMeta, UserResponse } from "@/types/response/userResponse";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table/data-table";

const DEFAULT_META: PaginationMeta = { totalItems: 0, itemsPerPage: 10, totalPages: 1, currentPage: 1 };

export default function Users() {
    const { data: session } = useSession();
    const [dataUsers, setDataUsers] = useState<UserResponse[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchDataUsers = async (p: number, s: string) => {
        if (!session?.accessToken) return;
        setIsLoading(true);
        try {
            const res = await getAllUserPaginated(session.accessToken, { page: p, limit: 10, search: s });
            setDataUsers(res.data);
            setMeta(res.meta);
        } catch {
            showToast({ type: "error", title: "Gagal", description: "Tidak dapat memuat data pengguna." });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDataUsers(page, search);
    }, [session, page, search]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePageChange = (newPage: number) => setPage(newPage);
    const handleSearchChange = (s: string) => { setSearch(s); setPage(1); };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
                <h1 className="text-xl font-bold text-gray-800">Data Pengguna</h1>
                <p className="text-sm text-gray-400 mt-0.5">{meta.totalItems.toLocaleString("id-ID")} pengguna terdaftar</p>
            </div>

            <DataTable
                data={dataUsers}
                meta={meta}
                onPageChange={handlePageChange}
                onSearchChange={handleSearchChange}
                isLoading={isLoading}
            />
        </div>
    );
}
