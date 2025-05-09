"use client"

import { UserResponse } from "@/types/response/userResponse"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"


export const columns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: "#",
    header: "#",
    cell: ({ row }) => {
      const index = row.index + 1;
      return (
        <div className="text-center">
                {index}
            </div>
        )
    }
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    header: "Name",
    accessorFn: (row) => row.users_ref?.name || "-",
    id: "Name",
  },
  {
    header: "EKTP",
    accessorFn: (row) => row.users_ref?.EKTP || "-",
    id: "ektp",
  },
  {
    header: "Email",
    accessorFn: (row) => row.users_ref?.email || "-",
    id: "email",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => 
      <Link href={`/admin/users/${row.original.id}`}>
        <MoreHorizontal className="h-4 w-4" />
      </Link>
  },
]
