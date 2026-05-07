'use client';

import { showToast } from "@/components/toast-notification";
import { getAllTroubleReports, TroubleReport, TroubleReportMeta } from "@/lib/api/troubleReportApi";
import { MessageSquareWarning, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const DEFAULT_META: TroubleReportMeta = { totalItems: 0, itemsPerPage: 10, totalPages: 1, currentPage: 1 };

export default function AdminReportsPage() {
    const { data: session } = useSession();
    const [reports, setReports] = useState<TroubleReport[]>([]);
    const [meta, setMeta] = useState<TroubleReportMeta>(DEFAULT_META);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchReports = async (p: number, s: string) => {
        if (!session?.accessToken) return;
        setIsLoading(true);
        try {
            const res = await getAllTroubleReports(session.accessToken, { page: p, limit: 10, search: s });
            setReports(res.data);
            setMeta(res.meta);
        } catch {
            showToast({ type: "error", title: "Gagal", description: "Tidak dapat memuat data laporan." });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchReports(page, search);
    }, [session, page, search]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handlePageChange = (next: number) => setPage(next);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Laporan Masalah</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{meta.totalItems.toLocaleString("id-ID")} laporan diterima</p>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Cari judul atau nama..."
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#263C7D]/30 focus:border-[#263C7D] transition w-64"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm bg-[#263C7D] text-white rounded-xl hover:bg-[#1e2f61] transition font-medium"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Cards */}
            {isLoading && (
                <div className="text-center py-16 text-gray-400 text-sm">Memuat data...</div>
            )}
            {!isLoading && reports.length === 0 && (
                <div className="flex flex-col items-center gap-2 text-gray-400 py-16">
                    <MessageSquareWarning className="w-8 h-8" />
                    <span className="text-sm">Belum ada laporan masalah.</span>
                </div>
            )}
            {!isLoading && reports.length > 0 && (
                <div className="grid gap-4">
                    {reports.map((report) => (
                        <div key={report.id} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#263C7D]/10 flex items-center justify-center flex-shrink-0">
                                        <MessageSquareWarning className="w-4 h-4 text-[#263C7D]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{report.user?.name ?? "—"}</p>
                                        <p className="text-xs text-gray-400">{report.user?.username ?? ""}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {report.createdAt
                                        ? new Date(report.createdAt).toLocaleString("id-ID", {
                                            day: "2-digit", month: "short", year: "numeric",
                                            hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
                                          })
                                        : "—"}
                                </span>
                            </div>
                            <div className="border-t border-gray-100 pt-3">
                                <p className="font-semibold text-gray-800 mb-1">{report.title}</p>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{report.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{meta.totalItems.toLocaleString("id-ID")} laporan ditemukan</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Sebelumnya
                    </button>
                    <span className="px-2">{page} / {Math.max(meta.totalPages, 1)}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= meta.totalPages}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
        </div>
    );
}
