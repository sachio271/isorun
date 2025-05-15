"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

import { changePassword } from "@/lib/api/userApi";
import { ChangePasswordSchema } from "@/lib/zod";
import { useState } from "react";
import { showToast } from "./toast-notification";

export default function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
    const {data: session} = useSession();
    const [form, setForm] = useState({
        oldPass: "",
        newPass: "",
        confPass: "",
    });

    const handleSubmit = async () => {
        const result = ChangePasswordSchema.safeParse({
            oldPassword: form.oldPass,
            newPassword: form.newPass,
            confirmPassword: form.confPass,
        });

        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => err.message).join("\n");
            showToast({
            title: "Validation Error",
            description: errorMessages,
            type: "error",
            });
            return;
        }
        const formData = new FormData();
        formData.append("oldPassword", form.oldPass);
        formData.append("newPassword", form.newPass);

        try {
            await changePassword(session?.accessToken || "", formData);
            showToast({
            title: "Success",
            description: "Password changed successfully!",
            type: "success",
            });
            setForm({
                oldPass: "",
                newPass: "",
                confPass: "",
            });
            onClose();
        } catch (error: any) {
            console.log(error);
            const backendMessage = error?.response?.data?.message || "Change password failed!";
            showToast({
                title: "Something went wrong!",
                description: backendMessage,
                type: "error",
            });
        }
    };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Masukan Password lama dan password yang baru</DialogDescription>
        </DialogHeader>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="old">
              Old Password
            </Label>
            <Input id="old" required type="password" placeholder="Password Lama" value={form.oldPass} onChange={(e) => setForm({ ...form, oldPass: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="new">
              New Password
            </Label>
            <Input id="new" required type="password" placeholder="Password Baru" value={form.newPass} onChange={(e) => setForm({ ...form, newPass: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="confirm">
              Confirm Password
            </Label>
            <Input id="confirm" required type="password" placeholder="Masukan ulang password baru" value={form.confPass} onChange={(e) => setForm({ ...form, confPass: e.target.value })} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-[#263c7d] hover: cursor-pointer">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
