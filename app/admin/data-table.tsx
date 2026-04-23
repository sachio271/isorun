"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Transaction } from "@/types/response/transactionResponse"
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { Fragment, useMemo, useState } from "react"

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  "1":  { label: "Menunggu Konfirmasi Data",       className: "bg-gray-500 text-white" },
  "2":  { label: "Menunggu Pembayaran",             className: "bg-blue-600 text-white" },
  "3":  { label: "Menunggu Konfirmasi Pembayaran",  className: "bg-yellow-500 text-white" },
  "4":  { label: "Pembayaran Diterima",             className: "bg-green-600 text-white" },
  "-1": { label: "Data Ditolak",                    className: "bg-red-600 text-white" },
}

function StatusBadge({ status }: { status: number }) {
  const s = STATUS_MAP[status.toString()] ?? { label: "Unknown", className: "bg-gray-300" }
  return <Badge className={`text-xs whitespace-nowrap ${s.className}`}>{s.label}</Badge>
}

interface Props {
  data: Transaction[]
}

export function DataTable({ data }: Props) {
  const router = useRouter()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10

  const toggle = (id: string) =>
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter(t => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.pt.toLowerCase().includes(q) ||
        t.divisi.toLowerCase().includes(q) ||
        (t.users?.name ?? "").toLowerCase().includes(q) ||
        (t.users?.users_refId ?? "").toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || t.status.toString() === statusFilter
      return matchSearch && matchStatus
    })
  }, [data, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleSearch = (v: string) => { setSearch(v); setPage(0) }
  const handleStatus = (v: string) => { setStatusFilter(v); setPage(0) }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Cari ID, PT, divisi, karyawan..."
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={handleStatus}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="1">Menunggu Konfirmasi Data</SelectItem>
            <SelectItem value="2">Menunggu Pembayaran</SelectItem>
            <SelectItem value="3">Menunggu Konfirmasi Pembayaran</SelectItem>
            <SelectItem value="4">Pembayaran Diterima</SelectItem>
            <SelectItem value="-1">Data Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-500 text-xs uppercase tracking-wide">
              <th className="w-8 px-3 py-3" />
              <th className="px-4 py-3 text-left">Karyawan</th>
              <th className="px-4 py-3 text-left">PT / Divisi</th>
              <th className="px-4 py-3 text-left">Tgl Transaksi</th>
              <th className="px-4 py-3 text-center">Peserta</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">Tidak ada data.</td>
              </tr>
            )}
            {paged.map(trx => {
              const expanded = expandedIds.has(trx.id)
              return (
                <Fragment key={trx.id}>
                  <tr
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggle(trx.id)}
                  >
                    {/* Expand chevron */}
                    <td className="px-3 py-3 text-gray-400">
                      {expanded
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />}
                    </td>

                    {/* Karyawan */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{trx.users?.name ?? "-"}</p>
                      <p className="text-xs text-gray-400">{trx.users?.users_refId ?? ""}</p>
                    </td>

                    {/* PT / Divisi */}
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{trx.pt}</p>
                      <p className="text-xs text-gray-400">{trx.divisi}</p>
                    </td>

                    {/* Tanggal Transaksi */}
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {trx.createdAt ? new Date(trx.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }) : "-"}
                    </td>

                    {/* Peserta count */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#263C7D]/10 text-[#263C7D] font-semibold text-xs">
                        {trx.participants?.length ?? 0}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      Rp {trx.total?.toLocaleString("id-ID")}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={trx.status} />
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs cursor-pointer"
                        onClick={() => router.push(`/admin/${trx.id}`)}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Detail
                      </Button>
                    </td>
                  </tr>

                  {/* Expanded: participant rows */}
                  {expanded && (
                    <tr className="bg-blue-50/40 border-b">
                      <td colSpan={8} className="px-6 py-4">
                        {(!trx.participants || trx.participants.length === 0) ? (
                          <p className="text-sm text-gray-400 text-center py-2">Belum ada peserta.</p>
                        ) : (
                          <div className="rounded-lg border border-blue-100 overflow-hidden">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-[#263C7D]/5 text-[#263C7D] text-xs">
                                  <th className="px-3 py-2 text-left font-semibold">Nama</th>
                                  <th className="px-3 py-2 text-left font-semibold">Kategori</th>
                                  <th className="px-3 py-2 text-center font-semibold">Jersey</th>
                                  <th className="px-3 py-2 text-right font-semibold">Harga</th>
                                  <th className="px-3 py-2 text-center font-semibold">Registrasi</th>
                                  <th className="px-3 py-2 text-center font-semibold">Race Pack</th>
                                </tr>
                              </thead>
                              <tbody>
                                {trx.participants.map((p, i) => (
                                  <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/30"}>
                                    <td className="px-3 py-2">
                                      <p className="font-medium text-gray-800">{p.fname} {p.lname}</p>
                                      <p className="text-gray-400">{p.email}</p>
                                    </td>
                                    <td className="px-3 py-2 text-gray-600">{p.master_category?.name ?? "-"}</td>
                                    <td className="px-3 py-2 text-center">
                                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{p.size}</Badge>
                                    </td>
                                    <td className="px-3 py-2 text-right text-gray-700">
                                      Rp {Number(p.price).toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      {p.registration
                                        ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Check-in</Badge>
                                        : <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">Belum</Badge>}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      {p.racePack
                                        ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Diambil</Badge>
                                        : <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">Belum</Badge>}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{filtered.length} transaksi ditemukan</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
            Sebelumnya
          </Button>
          <span className="px-2">{page + 1} / {Math.max(totalPages, 1)}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  )
}
