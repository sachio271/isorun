"use client"

import { ConfirmationDialog } from "@/components/confirmationDialog"
import { showToast } from "@/components/toast-notification"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { resetPassword } from "@/lib/api/userApi"
import { UserResponse } from "@/types/response/userResponse"
import { MoreHorizontal } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CellActionProps {
  user: UserResponse
}

export const CellAction: React.FC<CellActionProps> = ({ user }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const handleClose = () => setIsOpen(false)
  const handleResetPassword = async () => {
    if (!session?.accessToken) return

    try {
        await resetPassword(session.accessToken, user.id.toString())
        showToast({
            title: "Success",
            description: "Password reset successfully!",
            type: "success",
        })
    } catch (error) {
        console.error("Error:", error)
        showToast({
            type: "error",
            title: "Error",
            description: "An error occurred while processing your request.",
        })
            
    }
    }

  return (
    <>
    <ConfirmationDialog
        isOpen={isOpen}
        onClose={handleClose}
        title="Reset Password"
        description="Are you sure you want to reset this user's password?"
        status=""
        handleConfirm={handleResetPassword}
    />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
            className="cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Reset Password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}
