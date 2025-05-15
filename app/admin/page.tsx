'use client';

import { showToast } from "@/components/toast-notification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransaction } from "@/lib/api/transactionApi";
import { Transaction } from "@/types/response/transactionResponse";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns } from "./column";
import { DataTable } from "./data-table";

export default function Home() {
    const {data: session} = useSession()
    const [dataTransaction, setDataTransaction] = useState<Transaction[]>([])
    useEffect(() => {
        fetchDataTransaction()
    }, [session])
    
    const fetchDataTransaction = async () => {
        if(!session?.accessToken) return

        try {
            const trx = await getTransaction(session.accessToken)
            setDataTransaction(trx)
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
                <CardTitle>Transactions Data</CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto px-2 sm:px-4 md:px-6">
                <div className="w-full overflow-x-auto">
                    <DataTable columns={columns} data={dataTransaction} />
                </div>
            </CardContent>
        </Card>
  );
}
