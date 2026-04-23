"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { PaginationMeta, UsersRef } from "@/types/response/userResponse"
import { ExternalLink, MoreHorizontal, Pencil, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DataTableProps {
  data: UsersRef[]
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onSearchChange: (search: string) => void
  onEdit: (user: UsersRef) => void
  isLoading?: boolean
}

export function DataTable({ data, meta, onPageChange, onSearchChange, onEdit, isLoading }: DataTableProps) {
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    const t = setTimeout(() => onSearchChange(searchInput), 400)
    return () => clearTimeout(t)
  }, [searchInput]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Cari EKTP, nama, telepon, email, kota, perusahaan..."
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left w-10">#</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">EKTP</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Telepon</th>
              <th className="px-4 py-3 text-left">Tipe</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">Tidak ada data.</td>
              </tr>
            ) : (
              data.map((user, i) => (
                <tr key={user.EKTP} className="border-b last:border-0 even:bg-gray-50 hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3 text-gray-400">
                    {(meta.currentPage - 1) * meta.itemsPerPage + i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{user.name || "-"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{user.EKTP || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{user.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.type === "employee"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {user.type || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onEdit(user)}>
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/reference/${user.EKTP}`} className="flex items-center gap-2 cursor-pointer">
                            <ExternalLink className="w-3.5 h-3.5" /> Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{meta.totalItems.toLocaleString("id-ID")} data &mdash; halaman {meta.currentPage} / {meta.totalPages}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(meta.currentPage - 1)} disabled={meta.currentPage <= 1}>
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(meta.currentPage + 1)} disabled={meta.currentPage >= meta.totalPages}>
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  )
}
