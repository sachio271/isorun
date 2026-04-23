'use client';

import { ParticipantDetail } from "@/components/detailParticipantDialog";
import { showToast } from "@/components/toast-notification";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getRegistrationSettings, getTransaction, updateRegistrationSettings } from "@/lib/api/transactionApi";
import { EnrichParticipant, Transaction } from "@/types/response/transactionResponse";
import { Layers, Loader2, LockKeyhole, UnlockKeyhole, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";

export default function AdminRegistrationPage() {
    const { data: session } = useSession();
    const [dataTransaction, setDataTransaction] = useState<Transaction[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [status, setStatus] = useState<EnrichParticipant[]>([]);
    const [registrationOpen, setRegistrationOpen] = useState<boolean>(true);
    const [settingsLoading, setSettingsLoading] = useState(false);

    const [total, setTotal] = useState<{
        trans: number;
        participant: number;
        categories: Record<string, { count: number; participants: EnrichParticipant[] }>;
    }>({ trans: 0, participant: 0, categories: {} });

    const handleCancel = () => { setIsDialogOpen(false); setStatus([]); };
    const handleOpen = (participants: EnrichParticipant[]) => { setIsDialogOpen(true); setStatus(participants); };

    const fetchDataTransaction = async () => {
        if (!session?.accessToken) return;
        try {
            const trx = await getTransaction(session.accessToken);
            setDataTransaction(trx.trans);
            setTotal({ trans: trx.total_transaction, participant: trx.total_participant, categories: trx.categories });
        } catch {
            showToast({ type: "error", title: "Gagal memuat data", description: "Tidak dapat mengambil data transaksi." });
        }
    };

    const fetchSettings = async () => {
        if (!session?.accessToken) return;
        try {
            const s = await getRegistrationSettings(session.accessToken);
            setRegistrationOpen(s.OPEN_REGISTRATION === 1);
        } catch { /* keep default */ }
    };

    useEffect(() => {
        fetchDataTransaction();
        fetchSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const handleToggleRegistration = async (value: boolean) => {
        if (!session?.accessToken) return;
        setSettingsLoading(true);
        try {
            await updateRegistrationSettings(session.accessToken, value);
            setRegistrationOpen(value);
            showToast({
                type: "success",
                title: value ? "Pendaftaran Dibuka" : "Pendaftaran Ditutup",
                description: value ? "Peserta sekarang dapat mendaftar." : "Pendaftaran telah ditutup.",
            });
        } catch {
            showToast({ type: "error", title: "Gagal", description: "Tidak dapat mengubah status pendaftaran." });
        }
        setSettingsLoading(false);
    };

    return (
        <>
            <ParticipantDetail users={status} isOpen={isDialogOpen} onClose={handleCancel} />

            <div className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#263C7D]/10 flex items-center justify-center flex-shrink-0">
                            <Layers className="w-6 h-6 text-[#263C7D]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Transaksi</p>
                            <p className="text-3xl font-bold text-gray-800">{total.trans}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Peserta</p>
                            <p className="text-3xl font-bold text-gray-800">{total.participant}</p>
                        </div>
                    </div>
                </div>

                {/* Category breakdown */}
                {Object.keys(total.categories).length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Peserta per Kategori</h2>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(total.categories).map(([name, { count, participants }]) => (
                                <button
                                    key={name}
                                    onClick={() => handleOpen(participants)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#263C7D]/5 hover:bg-[#263C7D]/10 border border-[#263C7D]/10 transition-colors group"
                                >
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#263C7D]">{name}</span>
                                    <Badge className="bg-[#263C7D] text-white text-xs px-2 py-0.5">{count}</Badge>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Registration toggle */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${registrationOpen ? "bg-green-50" : "bg-red-50"}`}>
                                {registrationOpen
                                    ? <UnlockKeyhole className="w-5 h-5 text-green-600" />
                                    : <LockKeyhole className="w-5 h-5 text-red-400" />}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Status Pendaftaran</p>
                                <p className="text-sm text-gray-400">
                                    {registrationOpen ? "Pendaftaran sedang dibuka — peserta dapat mendaftar." : "Pendaftaran ditutup — peserta tidak dapat mendaftar."}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${registrationOpen ? "text-green-600" : "text-red-400"}`}>
                                {registrationOpen ? "Buka" : "Tutup"}
                            </span>
                            {settingsLoading
                                ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                : <Switch checked={registrationOpen} onCheckedChange={handleToggleRegistration} className="data-[state=checked]:bg-green-500" />}
                        </div>
                    </div>
                </div>

                {/* Data table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Daftar Transaksi</h2>
                    <div className="w-full overflow-x-auto">
                        <DataTable data={dataTransaction} />
                    </div>
                </div>
            </div>
        </>
    );
}
