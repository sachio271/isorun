"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const initialGlobalFilter = searchParams.get("search") ?? ""
    const initialStatus = searchParams.get("status") ?? undefined
    const initialPageIndex = parseInt(searchParams.get("page") ?? "0")

    const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter)
    const [statusFilter, setStatusFilter] = useState(initialStatus)
    const [pageIndex, setPageIndex] = useState(initialPageIndex)

    useEffect(() => {
      const query = new URLSearchParams()
      if (globalFilter) query.set("search", globalFilter)
      if (statusFilter) query.set("status", statusFilter)
      if (pageIndex !== 0) query.set("page", String(pageIndex))

      router.replace(`?${query.toString()}`)
    }, [globalFilter, statusFilter, pageIndex])

    const table = useReactTable({
        data,
        columns,
        state: {
          globalFilter,
          pagination: {
            pageIndex,
            pageSize: 10,
          },
          columnFilters: statusFilter
            ? [{ id: "status", value: Number(statusFilter) }]
            : [],
        },
        onPaginationChange: (updater) => {
          const newPageIndex =
            typeof updater === "function"
              ? updater({ pageIndex, pageSize: 10 }).pageIndex
              : updater.pageIndex
          setPageIndex(newPageIndex)
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
    <>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <Input
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="p-2 font-lg shadow border"
            placeholder="Search all columns..."
          />

          <Select
            value={statusFilter ?? "all"}
            onValueChange={(value) => {
              const newValue = value === "all" ? undefined : value
              setStatusFilter(newValue)
              setPageIndex(0)
            }}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="1">Menunggu Konfirmasi Data</SelectItem>
              <SelectItem value="2">Menunggu Pembayaran</SelectItem>
              <SelectItem value="3">Menunggu Konfirmasi Pembayaran</SelectItem>
              <SelectItem value="4">Pembayaran Diterima</SelectItem>
              <SelectItem value="-1">Data Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border mt-2">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  )
}
