'use client';

import { ConfirmationDialog } from "@/components/confirmationDialog";
import { showToast } from "@/components/toast-notification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteParticipant, deleteTransaction, getTransactionById, updateTransactionStatus } from "@/lib/api/transactionApi";
import { Transaction } from "@/types/response/transactionResponse";
import {
  ArrowLeft,
  BadgeCheck,
  Building,
  CalendarDays,
  Check,
  ClipboardList,
  Contact,
  CreditCard,
  Hash,
  ShieldCheck,
  Trash,
  UserPlus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STATUS_STEPS = [
  { key: 1,  label: "Konfirmasi Data",       icon: ClipboardList },
  { key: 2,  label: "Menunggu Transfer",      icon: CreditCard },
  { key: 3,  label: "Konfirmasi Pembayaran",  icon: ShieldCheck },
  { key: 4,  label: "Selesai",               icon: BadgeCheck },
];

function StatusTimeline({ status }: { status: number }) {
  if (status === -1) {
    return (
      <div className="flex items-center gap-3 text-red-500">
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
          <Trash className="w-4 h-4" />
        </div>
        <span className="font-semibold">Data Ditolak</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STATUS_STEPS.map((step, i) => {
        const done = status > step.key;
        const current = status === step.key;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                ${done ? "bg-green-500 text-white" : current ? "bg-[#263C7D] text-white ring-4 ring-[#263C7D]/20" : "bg-gray-200 text-gray-400"}`}>
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`hidden md:block text-xs font-medium ${current ? "text-[#263C7D]" : done ? "text-green-600" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 w-8 md:w-14 mx-1 mb-4 rounded ${status > step.key ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const TransactionDetails = () => {
  const params = useParams();
  const { id } = params as { id: string };
  const { data: session } = useSession();
  const [transaction, setTransaction] = useState<Transaction>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [participantId, setParticipantId] = useState("");

  useEffect(() => { fetchTransaction(); }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTransaction = async () => {
    if (!session?.accessToken) return;
    try {
      const data = await getTransactionById(session.accessToken, id);
      setTransaction(data);
    } catch {
      showToast({ type: "error", title: "Fetch Error", description: "Gagal memuat data transaksi." });
    }
  };

  const handleDeleteParticipant = async () => {
    if (!session?.accessToken) return;
    try {
      await deleteParticipant(session.accessToken, participantId);
      fetchTransaction();
      showToast({ type: "success", title: "Peserta Dihapus", description: "Data peserta berhasil dihapus." });
    } catch {
      showToast({ type: "error", title: "Gagal", description: "Tidak dapat menghapus peserta." });
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!session?.accessToken) return;
    let newStatus;
    if (status === "1") newStatus = 2;
    else if (status === "3") newStatus = 4;
    if (status === "-1") { await handleDelete(); setIsDialogOpen(false); return; }
    else if (status === "-2") newStatus = 2;
    try {
      await updateTransactionStatus(session.accessToken, id, newStatus?.toString() ?? "1");
      fetchTransaction();
      showToast({ type: "success", title: "Status Diperbarui", description: "Status transaksi berhasil diubah." });
    } catch {
      showToast({ type: "error", title: "Gagal", description: "Tidak dapat mengubah status transaksi." });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!session?.accessToken) return;
    try {
      await deleteTransaction(session.accessToken, id);
      router.push("/admin");
      showToast({ type: "success", title: "Data Ditolak", description: "Transaksi berhasil ditolak." });
    } catch {
      showToast({ type: "error", title: "Gagal", description: "Tidak dapat menolak transaksi." });
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmationDialog
        title="Konfirmasi Aksi"
        description="Apakah anda yakin ingin melanjutkan aksi ini?"
        handleConfirm={handleStatusChange}
        status={status}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      <ConfirmationDialog
        title="Hapus Peserta"
        description="Apakah anda yakin ingin menghapus peserta ini?"
        handleConfirm={handleDeleteParticipant}
        status=""
        isOpen={isDialogDeleteOpen}
        onClose={() => setIsDialogDeleteOpen(false)}
      />

      {/* Back + title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin")} className="rounded-xl hover:bg-white/60 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Detail Transaksi</h1>
          <p className="text-xs text-gray-400 font-mono">{id}</p>
        </div>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Status Transaksi</p>
            <StatusTimeline status={transaction?.status ?? 1} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            {transaction?.status === 1 && (
              <Button className="bg-[#263C7D] hover:bg-[#1e2f61] cursor-pointer" onClick={() => { setStatus("1"); setIsDialogOpen(true); }}>
                Konfirmasi Data
              </Button>
            )}
            {transaction?.status === 3 && (
              <>
                <Button variant="outline" className="border-amber-200 text-amber-600 hover:bg-amber-50 cursor-pointer" onClick={() => { setStatus("-2"); setIsDialogOpen(true); }}>
                  Minta Reupload
                </Button>
                <Button className="bg-[#263C7D] hover:bg-[#1e2f61] cursor-pointer" onClick={() => { setStatus("3"); setIsDialogOpen(true); }}>
                  Konfirmasi Pembayaran
                </Button>
              </>
            )}
            {transaction?.status === 4 && (
              <Badge className="bg-green-100 text-green-700 px-4 py-2 text-sm">Transaksi Selesai</Badge>
            )}
            {transaction?.status !== -1 && (
              <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 cursor-pointer" onClick={() => { setStatus("-1"); setIsDialogOpen(true); }}>
                Cancel Transaction
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Info + Transfer proof */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Transaction info */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-3">Informasi Transaksi</h2>

          {[
            { icon: Hash,        label: "ID Transaksi",      value: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">{transaction?.id}</span> },
            { icon: UserPlus,    label: "Karyawan",          value: transaction?.users?.name ?? "-" },
            { icon: Building,    label: "PT",                value: transaction?.pt },
            { icon: ShieldCheck, label: "Divisi",            value: transaction?.divisi },
            { icon: Contact,     label: "Kontak Darurat",    value: `${transaction?.emergencyName} (${transaction?.emergencyPhone})` },
            { icon: CreditCard,  label: "Total",             value: <span className="font-bold text-[#263C7D]">Rp {transaction?.total?.toLocaleString("id-ID")}</span> },
            { icon: CalendarDays,label: "Tanggal",           value: transaction?.createdAt ? new Date(transaction.createdAt).toLocaleString("id-ID") : "-" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-500 w-36 flex-shrink-0">{label}</span>
              <span className="text-sm text-gray-800">{value}</span>
            </div>
          ))}
        </div>

        {/* Transfer proof */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
          <h2 className="font-semibold text-gray-800 border-b pb-3">Bukti Transfer</h2>
          {transaction?.transferProof && transaction.transferProof !== "-" ? (
            <a href={transaction.transferProof} target="_blank" rel="noopener noreferrer" className="block group">
              <div className="relative rounded-xl overflow-hidden border border-gray-100">
                <Image
                  src={transaction.transferProof}
                  alt="Bukti Transfer"
                  width={500}
                  height={400}
                  className="w-full object-contain max-h-64 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                  <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Lihat penuh</span>
                </div>
              </div>
            </a>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl py-10">
              <CreditCard className="w-8 h-8" />
              <p className="text-sm">Belum ada bukti transfer</p>
            </div>
          )}
        </div>
      </div>

      {/* Participants */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Peserta <span className="text-gray-400 font-normal text-sm">({transaction?.participants?.length ?? 0})</span></h2>
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 text-xs">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Umur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-center">Jersey</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-center">Check-in</TableHead>
                <TableHead className="text-center">Race Pack</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction?.participants?.map((p, index) => (
                <TableRow key={p.id} className="even:bg-gray-50 text-sm">
                  <TableCell className="text-gray-400">{index + 1}</TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-800">{p.fname} {p.lname}</p>
                    <p className="text-xs text-gray-400">{p.bibname}</p>
                  </TableCell>
                  <TableCell>{p.umur}</TableCell>
                  <TableCell className="text-gray-500">{p.email}</TableCell>
                  <TableCell className="text-gray-500">{p.phone}</TableCell>
                  <TableCell>{p.master_category?.name ?? "-"}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{p.size}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">Rp {Number(p.price).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-center">
                    {p.registration
                      ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ya</Badge>
                      : <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">Belum</Badge>}
                  </TableCell>
                  <TableCell className="text-center">
                    {p.racePack
                      ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Diambil</Badge>
                      : <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">Belum</Badge>}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setParticipantId(p.id.toString()); setIsDialogDeleteOpen(true); }}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
