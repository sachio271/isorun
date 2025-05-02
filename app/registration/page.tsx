"use client";

import AddParticipantDialog from "@/components/addParticipantDialog";
import Header from "@/components/header";
import { showToast } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createParticipant, createTransaction, getTransactionByUser, uploadTransactionImage } from "@/lib/api/transactionApi";
import { Participant } from "@/types/helper/participant";
import { Transaction } from "@/types/response/transactionResponse";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function RegistrationPage() {
  const { data:session } = useSession();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [transaction, setTransaction] = useState<Transaction>();
  const [transactionStatus, setTransactionStatus] = useState<number>(0);  
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage(file);
    };

  const [transactionForm, setTransactionForm] = useState({
    pt: "",
    divisi: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  const fetchTransaction = async () => {
    if (!session?.accessToken) return;

    try {
      const trx = await getTransactionByUser(session.accessToken);
      setTransaction(trx);
      if (trx) {
        setTransactionStatus(trx.status);
        switch (trx.status) {
          case 1:
            setActiveTab("confirmation");
            break;
          case 2:
            setActiveTab("invoice");
            break;
          case 3:
            setActiveTab("payment");
            break;
          case 4:
            setActiveTab("recap");
            break;
          default:
            setActiveTab("register");
        }
      } else {
        // No transaction found
        setActiveTab("register");
      }
    } catch (err) {
      console.error("Failed to fetch transaction:", err);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [session]);

  const handleAddParticipant = (formData: FormData) => {
    const newParticipant = {
      fname: formData.get("fname") as string,
      lname: formData.get("lname") as string,
      bibname: formData.get("bibname") as string,
      email: formData.get("email") as string,
      identityId: formData.get("identityId") as string,
      birthplace: formData.get("birthplace") as string,
      birthdate: formData.get("birthdate") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      zipcode: formData.get("zipcode") as string,
      country: formData.get("country") as string,
      city: formData.get("city") as string,
      bloodType: formData.get("bloodType") as string,
      categoryId: parseInt(formData.get("categoryId") as string),
      categoryName: formData.get("categoryName") as string,
      categoryPrice: parseInt(formData.get("categoryPrice") as string),
      fullName: formData.get("fullName") as string,
    };
  
    setParticipants((prev) => [...prev, newParticipant]);
  };

  const addParticipant = () => {
    setDialogOpen(true);
  };

  const getTotal = () => {
    return participants.reduce((sum, p) => {
      return sum + p.categoryPrice;
    }, 0);
  };

  const handleTransaction = async () => {
    if (!session?.accessToken) {
      console.error("No access token");
      return;
    }

    const total = getTotal();
    const formData = new FormData();
    formData.append("pt", transactionForm.pt);
    formData.append("divisi", transactionForm.divisi);
    formData.append("emergencyName", transactionForm.emergencyName);
    formData.append("emergencyPhone", transactionForm.emergencyPhone);
    formData.append("total", total.toString());

    try {
      const transactionResponse = await createTransaction(formData, session.accessToken);
      const transactionId = transactionResponse.id;
      participants.forEach(async (p) => {
        const participantFormData = new FormData();
        participantFormData.append("fname", p.fname);
        participantFormData.append("lname", p.lname);
        participantFormData.append("bibname", p.bibname);
        participantFormData.append("email", p.email);
        participantFormData.append("identityId", p.identityId);
        participantFormData.append("birthplace", p.birthplace);
        participantFormData.append("birthdate", p.birthdate);
        participantFormData.append("phone", p.phone);
        participantFormData.append("address", p.address);
        participantFormData.append("zipcode", p.zipcode);
        participantFormData.append("country", p.country);
        participantFormData.append("city", p.city);
        participantFormData.append("bloodType", p.bloodType);
        participantFormData.append("category", p.categoryId.toString());

        await createParticipant(participantFormData, session?.accessToken, transactionId);
      });
      showToast({
          title: "Data saved!",
          description: "Your data was saved.",
          type: "success",
      });
    } catch (error) {
        console.error(error);
        showToast({
            title: "Something went wrong!",
            description: "Can't save data.",
            type: "error",
        });
    }
  };

  const handleUpload = async () => {
    if (!session?.accessToken) {
      console.error("No access token");
      return;
    }

    console.log("Uploading image:", image);

    const formData = new FormData();
    if (image) {
      formData.append("src", image);
    }

    try {
        await uploadTransactionImage(formData, session.accessToken, transaction?.id as string);
        await fetchTransaction();
        showToast({
            title: "Data saved!",
            description: "Your data was saved.",
            type: "success",
        });
    } catch (error) {
        console.error(error);
        showToast({
            title: "Something went wrong!",
            description: "Can't save data.",
            type: "error",
        });
    }
  };


  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/banner.jpg')" }}>
      <Header />
      <div className="backdrop-blur-sm min-h-screen bg-white/30 p-10 md:p-18">
      <AddParticipantDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddParticipant}
        participants={participants}
      />
        <Tabs value={activeTab} className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-5 mb-6 space-x-5">
            <TabsTrigger value="register" disabled>Register</TabsTrigger>
            <TabsTrigger value="confirmation" disabled>Confirm</TabsTrigger>
            <TabsTrigger value="invoice" disabled>Payment</TabsTrigger>
            <TabsTrigger value="payment" disabled>Confirm</TabsTrigger>
            <TabsTrigger value="recap" disabled>Done</TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Fill General and Personal Data</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* General Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pt">PT</Label>
                    <Input id="pt" placeholder="Wings Surya" value={transactionForm.pt} onChange={(e) => setTransactionForm({ ...transactionForm, pt: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="divisi">Divisi</Label>
                    <Input id="divisi" placeholder="HRD" value={transactionForm.divisi} onChange={(e) => setTransactionForm({ ...transactionForm, divisi: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                    <Input id="emergencyName" placeholder="Jane Doe" value={transactionForm.emergencyName} onChange={(e) => setTransactionForm({ ...transactionForm, emergencyName: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Number</Label>
                    <Input id="emergencyPhone" placeholder="08xxxxxxxxxx" value={transactionForm.emergencyPhone} onChange={(e) => setTransactionForm({ ...transactionForm, emergencyPhone: e.target.value })} />
                  </div>
                </div>

                <div className="mt-6">
                  <Button type="button" onClick={addParticipant}>+ Add Participant</Button>
                </div>

                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((p, idx) => {
                      return (
                        <TableRow key={idx}>
                          <TableCell>{p.fname} {p.lname}</TableCell>
                          <TableCell>{p.categoryName || "-"}</TableCell>
                          <TableCell>Rp {p.categoryPrice}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={2} className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">Rp {getTotal()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Button className="mt-4" onClick={handleTransaction}>
                  Submit & Continue
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmation">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Wait for Admin Confirmation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Your registration data is being verified by our admin. Please
                  check back later or wait for a confirmation email.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Payment</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p>
                  Please transfer <strong>Rp {transaction?.total}</strong> to
                  the following bank account:
                </p>
                <ul className="text-sm text-gray-800 list-disc pl-4">
                  <li>Bank: BCA</li>
                  <li>Account Number: 1234567890</li>
                  <li>Account Name: ISPlus Run</li>
                </ul>

                <div className="grid gap-2">
                  <Label htmlFor="proof">Upload Transfer Proof</Label>
                  <Input id="proof" type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <Button onClick={handleUpload} >Submit Proof</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Wait for Payment Confirmation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Your payment is being verified by our admin. Please
                  check back later.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recap">
            <Card>
              <CardHeader>
                <CardTitle>Step 5: Registration Recap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Please show this information to admin on the event day:</p>
                <ul className="text-sm text-gray-800 space-y-2">
                  <li><strong>Transaction ID:</strong> {transaction?.id}</li>
                  <li><strong>PT:</strong> {transaction?.pt}</li>
                  <li><strong>Divisi:</strong> {transaction?.divisi}</li>
                  <li><strong>Total Paid:</strong> Rp. {transaction?.total} </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
