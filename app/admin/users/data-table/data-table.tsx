"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PaginationMeta, UserResponse } from "@/types/response/userResponse"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { CellAction } from "./cell-action"

interface DataTableProps {
  data: UserResponse[]
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onSearchChange: (search: string) => void
  isLoading?: boolean
}

export function DataTable({ data, meta, onPageChange, onSearchChange, isLoading }: DataTableProps) {
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
          placeholder="Cari nama, username, role, EKTP, email..."
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left w-10">#</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">EKTP</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
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
                <tr key={user.id} className="border-b last:border-0 even:bg-gray-50 hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3 text-gray-400">
                    {(meta.currentPage - 1) * meta.itemsPerPage + i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{user.username || "-"}</td>
                  <td className="px-4 py-3 text-gray-700">{user.users_ref?.name || "-"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{user.users_ref?.EKTP || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{user.users_ref?.email || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : user.role === "support"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <CellAction user={user} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{meta.totalItems.toLocaleString("id-ID")} pengguna &mdash; halaman {meta.currentPage} / {meta.totalPages}</span>
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
