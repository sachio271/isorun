'use client';

import { showToast } from "@/components/toast-notification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUser } from "@/lib/api/userApi";
import { UserResponse } from "@/types/response/userResponse";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns } from "./data-table/column";
import { DataTable } from "./data-table/data-table";

export default function Users() {
    const {data: session} = useSession()
    const [dataUsers, setDataUsers] = useState<UserResponse[]>([])
    useEffect(() => {
        fetchDataTransaction()
    }, [session])
    
    const fetchDataTransaction = async () => {
        if(!session?.accessToken) return

        try {
            const trx = await getAllUser(session.accessToken)
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
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Users Data</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto px-2 sm:px-4 md:px-6">
                <div className="w-full overflow-x-auto">
                    <DataTable columns={columns} data={dataUsers} />
                </div>
            </CardContent>
        </Card>
    );
}
