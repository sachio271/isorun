"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import ChangePasswordDialog from "./changePasswordDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Profile() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  return (
    <>
    <ChangePasswordDialog
      open={isOpen}
      onClose={handleClose}
    />
    <DropdownMenu>
      <div className="flex items-center gap-4">
        <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage src="https://www.gravatar.com/avatar/?d=mp" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.data?.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.data?.user.username}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
            Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}

export default Profile;