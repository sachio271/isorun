"use client"

import { UserResponse } from "@/types/response/userResponse"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


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
      <CellAction user={row.original} />
  },
]
