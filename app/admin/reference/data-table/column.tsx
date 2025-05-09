"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UsersRef } from "@/types/response/userResponse"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"


export const columns = (onEdit: (user: UsersRef) => void): ColumnDef<UsersRef>[] => [
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
    header: "Name",
    accessorFn: (row) => row.name || "-",
    id: "Name",
  },
  {
    header: "EKTP",
    accessorFn: (row) => row.EKTP || "-",
    id: "ektp",
  },
  {
    header: "Email",
    accessorFn: (row) => row.email || "-",
    id: "email",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => 
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
                onClick={() => onEdit(row.original)}
            >
                Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Link href={`/admin/reference/${row.original.EKTP}`}>
                    View Details
                </Link>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
  },
]
