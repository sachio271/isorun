'use client';

import { ConfirmationDialog } from "@/components/confirmationDialog";
import { showToast } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteParticipant, deleteTransaction, getTransactionById, updateTransactionStatus } from "@/lib/api/transactionApi";
import { Transaction } from "@/types/response/transactionResponse";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TransactionDetails = () => {
  const params = useParams();
  const { id } = params as { id: string };
  const { data: session } = useSession();
  const [transaction, setTransaction] = useState<Transaction>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [participantId, setParticipantId] = useState("");
  const handleCancelDelete = () => {
    setIsDialogDeleteOpen(false);
  };
  const handleOpenDialogDeleteOpen = (participantId: string) => {
    setIsDialogDeleteOpen(true);
    setParticipantId(participantId);
  }

  useEffect(() => {
    fetchTransaction();
  }, [session]);

  const fetchTransaction = async () => {
    if (!session?.accessToken) return;
    try {
      const data = await getTransactionById(session.accessToken, id);
      setTransaction(data);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      showToast({
        type: "error",
        title: "Transaction Fetch Error",
        description: "Failed to fetch transaction data",
      });
    }
  };

  const handleDeleteParticipant = async () => {
    if (!session?.accessToken) return;
    try {
      await deleteParticipant(session.accessToken, participantId);
      fetchTransaction();
      showToast({
        type: "success",
        title: "Participant Deleted",
        description: "The participant was deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting participant:", error);
      showToast({
        type: "error",
        title: "Participant Delete Error",
        description: "Failed to delete participant",
      });
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!session?.accessToken) return;
    let newStatus;
    if (status === "1") {
        newStatus = 2; // Confirm Data
    }
    else if (status === "3") {
        newStatus = 4; // Confirm Payment
    }
    if (status === "-1") {
        await handleDelete();
        setIsDialogOpen(false);
        return;
    }
    else if (status === "-2") {
      newStatus = 2;
    }
    try {
        await updateTransactionStatus(session.accessToken, id, newStatus?.toString() ?? '1');
        fetchTransaction();
    }
    catch (error) {
        console.error("Error updating transaction status:", error);
        showToast({
          type: "error",
          title: "Transaction Update Error",
          description: "Failed to update transaction status",
        });
        return;
    }
    showToast({
      type: "success",
      title: "Status Updated",
      description: "The transaction status was updated successfully",
    });
  };

  const handleActionClick = (status: string) => {
    setStatus(status);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!session?.accessToken) return;
    try {
      await deleteTransaction(session.accessToken, id);
      router.push("/admin");
      showToast({
        type: "success",
        title: "Data Rejected",
        description: "The transaction data was rejected successfully",
      });
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      showToast({
        type: "error",
        title: "Transaction Reject Error",
        description: "Failed to reject transaction data",
      });
    }
  };

  return (
    <div className="p-3md:p-9 space-y-6">
      <ConfirmationDialog 
        title="Action Confirmation" 
        description="Are you sure you want to proceed with this action?" 
        handleConfirm={handleStatusChange} 
        status={status} 
        isOpen={isDialogOpen} 
        onClose={handleCancel}
      />
      <ConfirmationDialog 
        title="Delete Participant" 
        description="Are you sure you want to delete this participant?" 
        handleConfirm={handleDeleteParticipant} 
        status="" 
        isOpen={isDialogDeleteOpen} 
        onClose={handleCancelDelete}
      />

        {/* Status Section */}
        <Card className="border-l-4 border-blue-500 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">Transaction Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
            <span className="text-sm font-medium">
              {transaction?.status === 1
                ? "✅ Waiting Data Confirmation"
                : transaction?.status === 2
                ? "⏳ Waiting Transfer"
                : transaction?.status === 3
                ? "✅ Waiting Payment Confirmation"
                : transaction?.status === 4
                ? "✅ Payment Confirmed"
                : transaction?.status === -1
                ? "❌ Data Rejected"
                : "⏳ Pending"}
            </span>

            {(transaction?.status === 1) && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="bg-red-800 hover:cursor-pointer" onClick={() => handleActionClick("-1")}>
                  Reject Data
                </Button>
                <Button className="hover:cursor-pointer" onClick={() => handleActionClick(transaction.status.toString())}>
                  Confirm Data
                </Button>
              </div>
            )}

            {(transaction?.status === 3) && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="bg-amber-600 hover:cursor-pointer" onClick={() => handleActionClick("-2")}>
                  Reupload
                </Button>
                <Button className="hover:cursor-pointer" onClick={() => handleActionClick(transaction.status.toString())}>
                  Confirm Payment
                </Button>
              </div>
            )}
          </CardContent>

        </Card>

        {/* Info + Transfer Proof */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Transaction Info (left) */}
          <Card className="w-full md:w-2/3 shadow-md rounded-2xl border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Transaction Info</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-gray-700">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-gray-600">ID:</span>
                <span className="col-span-2">{transaction?.id}</span>

                <span className="font-medium text-gray-600">PT:</span>
                <span className="col-span-2">{transaction?.pt}</span>

                <span className="font-medium text-gray-600">Divisi:</span>
                <span className="col-span-2">{transaction?.divisi}</span>

                <span className="font-medium text-gray-600">Emergency Contact:</span>
                <span className="col-span-2">
                  {transaction?.emergencyName} ({transaction?.emergencyPhone})
                </span>

                <span className="font-medium text-gray-600">Total:</span>
                <span className="col-span-2">Rp {transaction?.total.toLocaleString("id-ID")}</span>

                <span className="font-medium text-gray-600">Date:</span>
                <span className="col-span-2">
                  {transaction?.createdAt ? new Date(transaction.createdAt).toLocaleString() : "-"}
                </span>
              </div>
            </CardContent>
          </Card>


          {/* Transfer Proof (right) */}
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle>Transfer Proof</CardTitle>
            </CardHeader>
            <CardContent>
              {transaction?.transferProof !== '-' ? (
                <a href={transaction?.transferProof || "#"} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={transaction?.transferProof || "/user.png"}
                    alt="Transfer Proof"
                    width={500}
                    height={300}
                    className="rounded shadow-md object-contain max-h-60 w-full"
                  />
                </a>
              ) : (
                <p className="text-sm text-gray-600">No transfer proof yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Participants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Umur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction?.participants.map((p, index) => (
                  <TableRow key={p.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{p.fname}</TableCell>
                    <TableCell>{p.lname}</TableCell>
                    <TableCell>{p.umur}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.phone}</TableCell>
                    <TableCell>{p.master_category?.name}</TableCell>
                    <TableCell>{p.size}</TableCell>
                    <TableCell>Rp {p.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialogDeleteOpen(p.id.toString())}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
};

export default TransactionDetails;
