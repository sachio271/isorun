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
            <CardContent className="grid gap-4">
                <DataTable columns={columns} data={dataTransaction} />
            </CardContent>
        </Card>
  );
}
