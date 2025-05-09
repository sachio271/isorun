'use client';

import AddUserDialog from "@/components/addUserDialog";
import { useLoading } from "@/components/loadingContext";
import { showToast } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addUser, getAllUserRef } from "@/lib/api/userApi";
import { UsersRef } from "@/types/response/userResponse";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns } from "./data-table/column";
import { DataTable } from "./data-table/data-table";

export default function Users() {
    const {data: session} = useSession()
    const {showLoading, hideLoading} = useLoading()
    const [dataUsers, setDataUsers] = useState<UsersRef[]>([])
    const [user, setUser] = useState<UsersRef | undefined>(undefined)
    const [dialogOpen, setDialogOpen] = useState(false)
    useEffect(() => {
        fetchDataUser()
    }, [session])
    
    const fetchDataUser = async () => {
        if(!session?.accessToken) return
        showLoading()
        try {
            const trx = await getAllUserRef(session.accessToken)
            setDataUsers(trx)
            console.log(trx)   
        } catch (error) {
            console.error("Error fetching data:", error);
            showToast({
                type: "error",
                title: "Data Fetch Error",
                description: "Failed to fetch data",
            });
        }
        hideLoading()
    }

    const handleAddUser = async (formData: FormData) => {
        if(!session?.accessToken) return
        showLoading()
        try {
            await addUser(session.accessToken, formData)
            setDialogOpen(false)
            fetchDataUser()
            showToast({
                type: "success",
                title: "Success",
                description: "User added successfully",
            });
        } catch (error) {
            console.error("Error adding user:", error);
            showToast({
                type: "error",
                title: "User Add Error",
                description: "Failed to add user",
            });
        }
        hideLoading()
    }

    const handleEdit = (user: UsersRef) => {
        setUser(user);
        setDialogOpen(true);
    };
      
    return (
        <>
            <AddUserDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onAdd={handleAddUser}
                data={user ? { user } : undefined}
            />
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold">Users Reference Data</h1>
                            <Button variant="outline" onClick={() => setDialogOpen(true)}>
                                Add User
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <DataTable columns={columns(handleEdit)} data={dataUsers} />
                </CardContent>
            </Card>
        </>
    );
}
