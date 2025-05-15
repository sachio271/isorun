'use client';

import { ParticipantDetail } from "@/components/detailParticipantDialog";
import { showToast } from "@/components/toast-notification";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransaction } from "@/lib/api/transactionApi";
import { EnrichParticipant, Transaction } from "@/types/response/transactionResponse";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { columns } from "./column";
import { DataTable } from "./data-table";

export default function Home() {
    const {data: session} = useSession()
    const [dataTransaction, setDataTransaction] = useState<Transaction[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [status, setStatus] = useState<EnrichParticipant[]>([]);
    const handleCancel = () => {
        setIsDialogOpen(false);
        setStatus([]);
    };
    const handleOpen = (status: EnrichParticipant[]) => {
        setIsDialogOpen(true);
        setStatus(status);
    };
    const [total, setTotal] = useState<{
        trans: number;
        participant: number;
        categories: Record<string, {
            count: number;
            participants: EnrichParticipant[];
        }>;
        }>({
        trans: 0,
        participant: 0,
        categories: {},
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
                categories: trx.categories,
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
        <>
        <ParticipantDetail 
          users={status} 
          isOpen={isDialogOpen} 
          onClose={handleCancel}
        />
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
                                        {Object.entries(total.categories).map(([categoryName, { count, participants }]) => (
                                            <div key={categoryName} className="grid grid-cols-3 gap-2">
                                                <span className="font-medium text-gray-600 hover: cursor-pointer" onClick={() => handleOpen(participants)}>{categoryName}:</span>
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
        </>
  );
}
