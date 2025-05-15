'use client';

import { showToast } from "@/components/toast-notification";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    const [total, setTotal] = useState<{ trans: number; participant: number; total: Record<string, number> }>({
        trans: 0,
        participant: 0,
        total: {},
    });
    useEffect(() => {
        fetchDataTransaction()
    }, [session])
    
    const fetchDataTransaction = async () => {
        if(!session?.accessToken) return

        try {
            const trx = await getTransaction(session.accessToken)
            setDataTransaction(trx.trans)
            setTotal({ 
                trans: trx.total_transaction, 
                participant: trx.total_participant, 
                total: trx.total 
            });
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
                <CardTitle>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Transaction Data</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-medium text-gray-600">Total Transaction:</span>
                                    <span className="col-span-2">{total.trans}</span>

                                    <span className="font-medium text-gray-600">Total Participant:</span>
                                    <span className="col-span-2">{total.participant}</span>

                                    <div>
                                        <span className="text-black font-bold">Category total:</span>
                                        {Object.entries(total.total || {}).map(([category, count]) => (
                                            <div key={category} className="grid grid-cols-3 gap-2">
                                                <span className="font-medium text-gray-600">{category}:</span>
                                                <span className="col-span-2">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        </Accordion>
                </CardTitle>
            </CardHeader>
            <CardContent className="w-full overflow-x-auto px-2 sm:px-4 md:px-6">
                <div className="w-full overflow-x-auto">
                    <DataTable columns={columns} data={dataTransaction} />
                </div>
            </CardContent>
        </Card>
  );
}
