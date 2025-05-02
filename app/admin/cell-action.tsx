"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Transaction } from "@/types/response/transactionResponse"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"

interface CellActionProps {
  transaction: Transaction
}

export const CellAction: React.FC<CellActionProps> = ({ transaction }) => {
  const router = useRouter()

  return (
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
          onClick={() => navigator.clipboard.writeText(transaction.id)}
        >
          Copy payment ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/admin/${transaction.id}`)}>
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
