"use client";

import AddParticipantDialog from "@/components/addParticipantDialog";
import { ConfirmationDialog } from "@/components/confirmationDialog";
import Header from "@/components/header";
import { useLoading } from "@/components/loadingContext";
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
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function RegistrationPage() {
  const {showLoading, hideLoading} = useLoading();
  const [kabagFree, setKabagFree] = useState(0);
  const { data:session } = useSession();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [transaction, setTransaction] = useState<Transaction>();
  const [image, setImage] = useState<File | null>(null);
  const [isDialogConfirmOpen, setDialogConfirmOpen] = useState(false);

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

    showLoading();
    try {
      const trx = await getTransactionByUser(session.accessToken);
      setTransaction(trx);
      if (trx) {
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
        setActiveTab("register");
      }
    } catch (err) {
      console.error("Failed to fetch transaction:", err);
    }
    hideLoading();
  };

  useEffect(() => {
    fetchTransaction();
    if (session?.user?.role === "KABAG") {
      setKabagFree(2);
    }
    console.log("kabag free", kabagFree); 
  }, [session]);

  const handleAddParticipant = (formData: FormData) => {
    const isFreeUsed = formData.get("categoryPrice") === "0";

    if (isFreeUsed && kabagFree > 0) {
      setKabagFree(prev => prev - 1);
    }
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
      size: formData.get("size") as string,
      categoryId: parseInt(formData.get("categoryId") as string),
      categoryName: formData.get("categoryName") as string,
      categoryPrice: parseInt(formData.get("categoryPrice") as string),
      fullName: formData.get("fullName") as string,
      province: formData.get("province") as string,
      gender: formData.get("gender") as string,
      condition: formData.get("condition") as string,
    };

    // console.log("New participant added:", newParticipant);
  
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

    if (participants.length === 0) {
      showToast({
        title: "No participants added!",
        description: "Please add at least one participant.",
        type: "error",
      });
      return;
    }
    if (!transactionForm.pt || !transactionForm.divisi || !transactionForm.emergencyName || !transactionForm.emergencyPhone) {
      showToast({
        title: "Incomplete data!",
        description: "Please fill in all fields.",
        type: "error",
      });
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
        participantFormData.append("size", p.size);
        participantFormData.append("province", p.province);
        participantFormData.append("price", p.categoryPrice.toString());
        participantFormData.append("gender", p.gender.toString());
        participantFormData.append("condition", p.condition.toString());

        // console.log("Participant form data:", participantFormData);

        await createParticipant(participantFormData, session?.accessToken, transactionId);
      });
      showToast({
          title: "Data saved!",
          description: "Your data was saved.",
          type: "success",
      });
      fetchTransaction();
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

    if (!image) {
      showToast({
        title: "No image selected!",
        description: "Please select an image to upload.",
        type: "error",
      });
      return;
    }
    if(image.size > 2 * 1024 * 1024) {
      showToast({
        title: "File too large!",
        description: "Please select an image smaller than 2MB.",
        type: "error",
      });
      return;
    }
    if(image.type !== "image/jpeg" && image.type !== "image/png") {
      showToast({
        title: "Invalid file type!",
        description: "Please select a JPEG or PNG image.",
        type: "error",
      });
      return;
    }

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

  const handleDeleteParticipant = (index: number) => {
    console.log(participants[index]);
    if (participants[index].categoryPrice === 0) {
      setKabagFree(prev => prev + 1);
    }
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setDialogConfirmOpen(false);
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/banner.webp')" }}>
      <Header />
      <div className="backdrop-blur-xs min-h-screen bg-white/30 p-10 md:p-18">
      <ConfirmationDialog
        title="Action Confirmation" 
        description="Yakin Ingin Registrasi ? Karena setelah registrasi, pendaftaran akan menuju proses pembayaran dan data akan dikunci!" 
        handleConfirm={handleTransaction} 
        status={""} 
        isOpen={isDialogConfirmOpen} 
        onClose={handleCancel}
      />
      <AddParticipantDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddParticipant}
        participants={participants}
        free={kabagFree}
      />
        <Tabs value={activeTab} className="max-w-5xl mx-auto">
          <TabsList className="hidden md:flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
            <TabsTrigger value="register" disabled>Register</TabsTrigger>
            <TabsTrigger value="confirmation" disabled>Confirm</TabsTrigger>
            <TabsTrigger value="invoice" disabled>Payment</TabsTrigger>
            <TabsTrigger value="payment" disabled>Confirm</TabsTrigger>
            <TabsTrigger value="recap" disabled>Done</TabsTrigger>
          </TabsList>

          <div className="block md:hidden text-center mb-4">
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
              {(() => {
                switch (activeTab) {
                  case "register":
                    return "Step: Register";
                  case "confirmation":
                    return "Step: Confirm";
                  case "invoice":
                    return "Step: Payment";
                  case "payment":
                    return "Step: Confirm";
                  case "recap":
                    return "Step: Done";
                  default:
                    return "Step: Unknown";
                }
              })()}
            </span>
          </div>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Fill General and Personal Data</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* General Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pt">PT</Label>
                    <Input id="pt" required placeholder="Wings Surya" value={transactionForm.pt} onChange={(e) => setTransactionForm({ ...transactionForm, pt: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="divisi">Divisi</Label>
                    <Input id="divisi" required placeholder="HRD" value={transactionForm.divisi} onChange={(e) => setTransactionForm({ ...transactionForm, divisi: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                    <Input id="emergencyName" required placeholder="Jane Doe" value={transactionForm.emergencyName} onChange={(e) => setTransactionForm({ ...transactionForm, emergencyName: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Number</Label>
                    <Input id="emergencyPhone" required placeholder="08xxxxxxxxxx" value={transactionForm.emergencyPhone} onChange={(e) => setTransactionForm({ ...transactionForm, emergencyPhone: e.target.value })} />
                  </div>
                </div>

                <div className="mt-6">
                  <Button type="button" className="bg-[#263c7d] hover: cursor-pointer" onClick={addParticipant}>+ Add Participant</Button>
                </div>

                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((p, idx) => {
                      return (
                        <TableRow key={idx}>
                          <TableCell>{p.fname} {p.lname}</TableCell>
                          <TableCell>{p.categoryName || "-"}</TableCell>
                          <TableCell>Rp {p.categoryPrice}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteParticipant(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={2} className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">Rp {getTotal()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Button className="mt-4 bg-[#263c7d] hover: cursor-pointer"  onClick={() => setDialogConfirmOpen(true)}>
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
                <p>Details : </p>
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaction?.participants?.map((p, idx) => {
                      return (
                        <TableRow key={idx}>
                          <TableCell>{p.fname} {p.lname}</TableCell>
                          <TableCell>{p.master_category?.name || "-"}</TableCell>
                          <TableCell>Rp {p.price.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={2} className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">Rp {transaction?.total?.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <p>
                  Please transfer <strong>Rp {transaction?.total?.toLocaleString()}</strong> to
                  the following bank account:
                </p>
                <ul className="text-sm text-gray-800 list-disc pl-4">
                  <li>Bank: BCA</li>
                  <li>Account Number: 1234567890</li>
                  <li>Account Name: ISPlus Run</li>
                </ul>

                <p className="mt-4 text-red-700">
                 * After transferring, please upload the transfer proof below as an IMAGE.
                  Make sure to include your transaction ID in the proof.
                </p>


                <div className="grid gap-2">
                  <Label htmlFor="proof">Upload Transfer Proof</Label>
                  <Input id="proof" type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <Button onClick={handleUpload} className="bg-[#263c7d] hover:cursor-pointer">Submit Proof</Button>
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

                  <span className="font-medium text-gray-600">Total Paid:</span>
                  <span className="col-span-2">Rp {transaction?.total?.toLocaleString("id-ID")}</span>
                </div>
                <div className="overflow-x-auto mt-4">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transaction?.participants?.map((p, index) => (
                        <TableRow key={p.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{p.fname}</TableCell>
                          <TableCell>{p.lname}</TableCell>
                          <TableCell>{p.email}</TableCell>
                          <TableCell>{p.master_category?.name}</TableCell>
                          <TableCell>{p.size}</TableCell>
                          <TableCell>Rp {p.price?.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
