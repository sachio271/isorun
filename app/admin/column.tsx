"use client"

import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/types/response/transactionResponse"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID Transaction",
  },
  {
    accessorKey: "pt",
    header: "PT",
  },
  {
    accessorKey: "divisi",
    header: "Divisi",
  },
  {
    header: "Employee Name",
    accessorFn: (row) => row.users?.name || "-",
    id: "employeeName",
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, columnId, filterValue) => {
      return row.getValue<number>(columnId) === filterValue;
    },
    cell: ({ row }) => {
        const status = row.original.status.toString();
        let message = "";
        let color = "";
        if(status === "1") {
            message = "Menunggu Konfirmasi Data";
            color = "bg-gray-800";
        }
        else if(status === "2") {
            message = "Menunggu Pembayaran";
            color = "bg-blue-600";
        }
        else if(status === "3") {
            message = "Menunggu Konfirmasi Pembayaran";
            color = "bg-yellow-600";
        }
        else if(status === "4") {
            message = "Pembayaran Diterima";
            color = "bg-green-600";
        }
        else if(status === "-1") {
            message = "Data Ditolak";
            color = "bg-red-600";
        }
        return (
            <Badge
                className={`capitalize ${color} text-white`}
            >
            {message}
            </Badge>
        );
        },
    },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction transaction={row.original} />,
  },
]
