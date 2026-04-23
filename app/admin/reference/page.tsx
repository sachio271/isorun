'use client';

import AddUserDialog from "@/components/addUserDialog";
import { useLoading } from "@/components/loadingContext";
import { showToast } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import { addUser, getAllUserRefPaginated } from "@/lib/api/userApi";
import { PaginationMeta, UsersRef } from "@/types/response/userResponse";
import { UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table/data-table";

const DEFAULT_META: PaginationMeta = { totalItems: 0, itemsPerPage: 10, totalPages: 1, currentPage: 1 };

export default function ReferencePage() {
    const { data: session } = useSession();
    const { showLoading, hideLoading } = useLoading();
    const [dataUsers, setDataUsers] = useState<UsersRef[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [editUser, setEditUser] = useState<UsersRef | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchDataUser = async (p: number, s: string) => {
        if (!session?.accessToken) return;
        setIsLoading(true);
        try {
            const res = await getAllUserRefPaginated(session.accessToken, { page: p, limit: 10, search: s });
            setDataUsers(res.data);
            setMeta(res.meta);
        } catch {
            showToast({ type: "error", title: "Gagal", description: "Tidak dapat memuat data referensi." });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDataUser(page, search);
    }, [session, page, search]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePageChange = (newPage: number) => setPage(newPage);
    const handleSearchChange = (s: string) => { setSearch(s); setPage(1); };
    const handleEdit = (user: UsersRef) => { setEditUser(user); setDialogOpen(true); };
    const handleOpenAdd = () => { setEditUser(undefined); setDialogOpen(true); };

    const handleAddUser = async (formData: FormData) => {
        if (!session?.accessToken) return;
        showLoading();
        try {
            await addUser(session.accessToken, formData);
            setDialogOpen(false);
            fetchDataUser(page, search);
            showToast({ type: "success", title: "Berhasil", description: "Data pengguna berhasil disimpan." });
        } catch {
            showToast({ type: "error", title: "Gagal", description: "Tidak dapat menyimpan data pengguna." });
        }
        hideLoading();
    };

    return (
        <>
            <AddUserDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onAdd={handleAddUser}
                data={editUser ? { user: editUser } : undefined}
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Data Referensi Pengguna</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{meta.totalItems.toLocaleString("id-ID")} data terdaftar</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="bg-[#263C7D] hover:bg-[#1e2f61] gap-2 cursor-pointer">
                        <UserPlus className="w-4 h-4" /> Tambah Data
                    </Button>
                </div>

                <DataTable
                    data={dataUsers}
                    meta={meta}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onEdit={handleEdit}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
}
