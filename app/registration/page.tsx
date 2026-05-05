"use client";

import AddParticipantDialog from "@/components/addParticipantDialog";
import { ConfirmationDialog } from "@/components/confirmationDialog";
import Header from "@/components/header";
import { useLoading } from "@/components/loadingContext";
import { showToast } from "@/components/toast-notification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  createParticipant,
  createTransaction,
  getRegistrationSettings,
  getTransactionByUser,
  uploadTransactionImage,
} from "@/lib/api/transactionApi";
import { Participant } from "@/types/helper/participant";
import {
  IParticipant,
  Transaction,
} from "@/types/response/transactionResponse";
import {
  BadgeCheck,
  Building,
  Check,
  ClipboardList,
  Contact,
  CreditCard,
  Hash,
  Loader2,
  PhoneCall,
  QrCode,
  ShieldCheck,
  Trash,
  Upload,
  UserPlus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

const STEPS = [
  { key: "register", label: "Register", icon: UserPlus },
  { key: "confirmation", label: "Verifikasi", icon: ClipboardList },
  { key: "invoice", label: "Pembayaran", icon: CreditCard },
  { key: "payment", label: "Konfirmasi", icon: ShieldCheck },
  { key: "recap", label: "Selesai", icon: BadgeCheck },
];

function StepIndicator({ active }: { active: string }) {
  const activeIdx = STEPS.findIndex((s) => s.key === active);
  return (
    <div className="flex items-center justify-center mb-10 px-2">
      {STEPS.map((step, i) => {
        const done = i < activeIdx;
        const current = i === activeIdx;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                  ${done ? "bg-green-500 text-white" : current ? "bg-[#263C7D] text-white ring-4 ring-[#263C7D]/20" : "bg-gray-200 text-gray-400"}`}
              >
                {done ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`hidden md:block text-xs font-medium ${current ? "text-[#263C7D]" : done ? "text-green-600" : "text-gray-400"}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-10 md:w-16 mx-1 mb-4 rounded ${i < activeIdx ? "bg-green-400" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RegistrationPage() {
  const { showLoading, hideLoading } = useLoading();
  const [kabagFree, setKabagFree] = useState(0);
  const { data: session } = useSession();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDialogErrorOpen, setDialogErrorOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [transaction, setTransaction] = useState<Transaction>();
  const [image, setImage] = useState<File | null>(null);
  const [isDialogConfirmOpen, setDialogConfirmOpen] = useState(false);
  const [isDialogConfirmUploadOpen, setDialogConfirmUploadOpen] =
    useState(false);
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(
    null,
  );

  const handleCancelUpload = () => setDialogConfirmUploadOpen(false);

  const participantsRecap = transaction?.participants || [];
  const totalParticipants = participantsRecap.length;
  const registeredCount = participantsRecap.filter(
    (p) => p.registration === true,
  ).length;
  const racePackTakenCount = participantsRecap.filter(
    (p) => p.racePack === true,
  ).length;
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<IParticipant | null>(null);

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
            // setDialogErrorOpen(true);
            break;
          case 3:
            setActiveTab("payment");
            break;
          case 4:
            setActiveTab("recap");
            break;
          default:
            setActiveTab("register");
          // setDialogErrorOpen(true);
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
    if (!session?.accessToken) return;
    fetchTransaction();
    if (session?.user?.role === "KABAG") setKabagFree(1);
    getRegistrationSettings(session.accessToken)
      .then((s) => setRegistrationOpen(s.OPEN_REGISTRATION === 1))
      .catch(() => setRegistrationOpen(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const [loading, setLoading] = useState(false);

  const handleAddParticipant = (formData: FormData) => {
    const isFreeUsed = formData.get("categoryPrice") === "0";
    if (isFreeUsed && kabagFree > 0) setKabagFree((prev) => prev - 1);
    setParticipants((prev) => [
      ...prev,
      {
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
      },
    ]);
  };

  const getTotal = () =>
    participants.reduce((sum, p) => sum + p.categoryPrice, 0);

  const handleTransaction = async () => {
    if (!session?.accessToken) return;
    if (participants.length === 0) {
      showToast({
        title: "No participants added!",
        description: "Please add at least one participant.",
        type: "error",
      });
      return;
    }
    if (
      !transactionForm.pt ||
      !transactionForm.divisi ||
      !transactionForm.emergencyName ||
      !transactionForm.emergencyPhone
    ) {
      showToast({
        title: "Incomplete data!",
        description: "Please fill in all fields.",
        type: "error",
      });
      return;
    }
    const formData = new FormData();
    formData.append("pt", transactionForm.pt);
    formData.append("divisi", transactionForm.divisi);
    formData.append("emergencyName", transactionForm.emergencyName);
    formData.append("emergencyPhone", transactionForm.emergencyPhone);
    formData.append("total", getTotal().toString());
    try {
      const transactionResponse = await createTransaction(
        formData,
        session.accessToken,
      );
      const transactionId = transactionResponse.id;
      participants.forEach(async (p) => {
        const pf = new FormData();
        pf.append("fname", p.fname);
        pf.append("lname", p.lname);
        pf.append("bibname", p.bibname);
        pf.append("email", p.email);
        pf.append("identityId", p.identityId);
        pf.append("birthplace", p.birthplace);
        pf.append("birthdate", p.birthdate);
        pf.append("phone", p.phone);
        pf.append("address", p.address);
        pf.append("zipcode", p.zipcode);
        pf.append("country", p.country);
        pf.append("city", p.city);
        pf.append("bloodType", p.bloodType);
        pf.append("category", p.categoryId.toString());
        pf.append("size", p.size);
        pf.append("province", p.province);
        pf.append("price", p.categoryPrice.toString());
        pf.append("gender", p.gender.toString());
        pf.append("condition", p.condition.toString());
        await createParticipant(pf, session?.accessToken, transactionId);
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
    if (!session?.accessToken) return;
    setLoading(true);
    if (!image) {
      showToast({
        title: "No image selected!",
        description: "Please select an image.",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (image.size > 2 * 1024 * 1024) {
      showToast({
        title: "File too large!",
        description: "Max 2MB.",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (image.type !== "image/jpeg" && image.type !== "image/png") {
      showToast({
        title: "Invalid file type!",
        description: "JPEG or PNG only.",
        type: "error",
      });
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("src", image);
    try {
      await uploadTransactionImage(
        formData,
        session.accessToken,
        transaction?.id as string,
      );
      await fetchTransaction();
      showToast({
        title: "Uploaded!",
        description: "Bukti transfer berhasil diupload.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Something went wrong!",
        description: "Can't upload.",
        type: "error",
      });
    }
    setLoading(false);
  };

  const handleDeleteParticipant = (index: number) => {
    if (participants[index].categoryPrice === 0)
      setKabagFree((prev) => prev + 1);
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const router = useRouter();
  const handleErrorCancel = () => {
    setDialogErrorOpen(false);
    router.push("/");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/banner 2.webp')" }}
    >
      <div className="min-h-screen bg-white/60 backdrop-blur-sm">
        <Header />

        {/* Dialogs */}
        <ConfirmationDialog
          title="Registration on Maintenance"
          description="Pendaftaran sedang dalam proses penyesuaian harga, mohon maaf atas ketidaknyamanannya."
          handleConfirm={handleErrorCancel}
          status={""}
          isOpen={isDialogErrorOpen}
          onClose={handleErrorCancel}
        />
        <ConfirmationDialog
          title="Konfirmasi Registrasi"
          description="Yakin ingin registrasi? Data akan dikunci dan masuk ke proses pembayaran."
          handleConfirm={handleTransaction}
          status={""}
          isOpen={isDialogConfirmOpen}
          onClose={() => setDialogConfirmOpen(false)}
        />
        <ConfirmationDialog
          title="Konfirmasi Upload"
          description="Apakah anda yakin ingin mengupload bukti transfer?"
          handleConfirm={handleUpload}
          status={""}
          isOpen={isDialogConfirmUploadOpen}
          onClose={handleCancelUpload}
        />
        <AddParticipantDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAdd={handleAddParticipant}
          participants={participants}
          free={kabagFree}
        />

        {/* Page body */}
        <div className="pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
          {/* Page title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Pendaftaran Peserta
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Surabaya Isoplus Marathon 2025 — Wings Surya
            </p>
          </div>

          {/* Registration closed gate */}
          {registrationOpen === false && activeTab !== "recap" ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Pendaftaran Ditutup
              </h2>
              <p className="text-gray-500 max-w-sm text-sm">
                Pendaftaran sedang tidak dibuka. Silakan hubungi admin untuk
                informasi lebih lanjut.
              </p>
            </div>
          ) : (
            <>
              <StepIndicator active={activeTab} />

              <Tabs value={activeTab}>
                {/* ── STEP 1: Register ── */}
                <TabsContent value="register">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        Informasi Umum
                      </h2>
                      <p className="text-sm text-gray-400">
                        Isi data PT, divisi, dan kontak darurat.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="pt"
                          className="flex items-center gap-1.5 text-sm font-medium"
                        >
                          <Building className="w-3.5 h-3.5 text-[#263C7D]" /> PT
                        </Label>
                        <Input
                          id="pt"
                          placeholder="Wings Surya"
                          value={transactionForm.pt}
                          onChange={(e) =>
                            setTransactionForm({
                              ...transactionForm,
                              pt: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="divisi"
                          className="flex items-center gap-1.5 text-sm font-medium"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#263C7D]" />{" "}
                          Divisi
                        </Label>
                        <Input
                          id="divisi"
                          placeholder="HRD"
                          value={transactionForm.divisi}
                          onChange={(e) =>
                            setTransactionForm({
                              ...transactionForm,
                              divisi: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="emergencyName"
                          className="flex items-center gap-1.5 text-sm font-medium"
                        >
                          <Contact className="w-3.5 h-3.5 text-[#263C7D]" />{" "}
                          Nama Kontak Darurat
                        </Label>
                        <Input
                          id="emergencyName"
                          placeholder="Jane Doe"
                          value={transactionForm.emergencyName}
                          onChange={(e) =>
                            setTransactionForm({
                              ...transactionForm,
                              emergencyName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="emergencyPhone"
                          className="flex items-center gap-1.5 text-sm font-medium"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-[#263C7D]" />{" "}
                          No. Telepon Darurat
                        </Label>
                        <Input
                          id="emergencyPhone"
                          placeholder="08xxxxxxxxxx"
                          value={transactionForm.emergencyPhone}
                          onChange={(e) =>
                            setTransactionForm({
                              ...transactionForm,
                              emergencyPhone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                          Daftar Peserta
                        </h2>
                        <Button
                          onClick={() => setDialogOpen(true)}
                          className="bg-[#263C7D] hover:bg-[#1e2f61] text-white rounded-lg gap-2 cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4" /> Tambah Peserta
                        </Button>
                      </div>

                      {participants.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          <UserPlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">
                            Belum ada peserta. Klik tombol di atas untuk
                            menambah.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-xl border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead>Peserta</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead className="w-12" />
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {participants.map((p, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-medium">
                                    {p.fname} {p.lname}
                                  </TableCell>
                                  <TableCell>{p.categoryName || "-"}</TableCell>
                                  <TableCell>
                                    Rp {p.categoryPrice.toLocaleString("id-ID")}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteParticipant(idx)
                                      }
                                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                      <Trash className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="bg-blue-50">
                                <TableCell
                                  colSpan={2}
                                  className="font-bold text-gray-700"
                                >
                                  Total
                                </TableCell>
                                <TableCell className="font-bold text-[#263C7D]">
                                  Rp {getTotal().toLocaleString("id-ID")}
                                </TableCell>
                                <TableCell />
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => setDialogConfirmOpen(true)}
                      className="w-full bg-[#263C7D] hover:bg-[#1e2f61] text-white rounded-xl py-6 text-base font-semibold cursor-pointer"
                    >
                      Submit &amp; Lanjutkan →
                    </Button>
                  </div>
                </TabsContent>

                {/* ── STEP 2: Waiting confirmation ── */}
                <TabsContent value="confirmation">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
                      <ClipboardList className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Menunggu Verifikasi Admin
                    </h2>
                    <p className="text-gray-500 max-w-sm text-sm">
                      Data registrasi Anda sedang diperiksa oleh admin. Silakan
                      tunggu konfirmasi. Jika ada pertanyaan, hubungi admin.
                    </p>
                  </div>
                </TabsContent>

                {/* ── STEP 3: Payment / Invoice ── */}
                <TabsContent value="invoice">
                  <div className="space-y-5">
                    {/* Invoice detail */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#263C7D]" /> Detail
                        Pembayaran
                      </h2>
                      <div className="rounded-xl border overflow-hidden mb-5">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Peserta</TableHead>
                              <TableHead>Kategori</TableHead>
                              <TableHead className="text-right">
                                Harga
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transaction?.participants?.map((p, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">
                                  {p.fname} {p.lname}
                                </TableCell>
                                <TableCell>
                                  {p.master_category?.name || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  Rp {p.price?.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-blue-50">
                              <TableCell
                                colSpan={2}
                                className="font-bold text-gray-700"
                              >
                                Total
                              </TableCell>
                              <TableCell className="text-right font-bold text-[#263C7D]">
                                Rp {transaction?.total?.toLocaleString("id-ID")}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      {/* Bank info */}
                      <div className="bg-[#263C7D]/5 border border-[#263C7D]/20 rounded-xl p-5 space-y-2">
                        <p className="text-sm font-semibold text-[#263C7D] mb-3">
                          Transfer ke rekening berikut:
                        </p>
                        <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
                          <span className="text-gray-400">Bank</span>
                          <span className="font-medium">BRI</span>
                          <span className="text-gray-400">No. Rekening</span>
                          <span className="font-mono font-semibold tracking-wide">
                            115601000191306
                          </span>
                          <span className="text-gray-400">Atas Nama</span>
                          <span className="font-medium">PT. WINGS SURYA</span>
                          <span className="text-gray-400">Jumlah</span>
                          <span className="font-bold text-[#263C7D]">
                            Rp {transaction?.total?.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-red-500">
                        * Upload bukti transfer sebagai gambar (JPEG/PNG, maks
                        2MB). Pastikan gambar jelas agar admin dapat
                        memverifikasi dengan cepat.
                      </p>
                    </div>

                    {/* Upload */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[#263C7D]" /> Upload
                        Bukti Transfer
                      </h2>
                      <label
                        htmlFor="proof"
                        className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <Upload className="w-7 h-7 text-gray-300 mb-2" />
                        <span className="text-sm text-gray-400">
                          {image ? image.name : "Klik untuk memilih file"}
                        </span>
                        <Input
                          id="proof"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <Button
                        onClick={() => setDialogConfirmUploadOpen(true)}
                        className="w-full bg-[#263C7D] hover:bg-[#1e2f61] text-white rounded-xl py-5 text-base font-semibold cursor-pointer"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                          "Kirim Bukti Transfer"
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* ── STEP 4: Waiting payment confirmation ── */}
                <TabsContent value="payment">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Menunggu Konfirmasi Pembayaran
                    </h2>
                    <p className="text-gray-500 max-w-sm text-sm">
                      Bukti transfer Anda sedang diperiksa oleh admin. Silakan
                      tunggu konfirmasi. Jika ada pertanyaan, hubungi admin.
                    </p>
                  </div>
                </TabsContent>

                {/* ── STEP 5: Recap ── */}
                <TabsContent value="recap">
                  <div className="space-y-5">
                    {/* Success banner */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-green-800">
                          Pendaftaran Berhasil!
                        </h2>
                        <p className="text-sm text-green-600">
                          Tunjukan kode QR kepada panitia saat check-in di hari
                          H.
                        </p>
                      </div>
                    </div>

                    {/* Detail & stats */}
                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h3 className="font-semibold text-gray-800 border-b pb-2">
                          Detail Registrasi
                        </h3>
                        {[
                          {
                            icon: Hash,
                            label: "ID Registrasi",
                            value: (
                              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">
                                {transaction?.id}
                              </span>
                            ),
                          },
                          {
                            icon: Building,
                            label: "PT",
                            value: transaction?.pt,
                          },
                          {
                            icon: ShieldCheck,
                            label: "Divisi",
                            value: transaction?.divisi,
                          },
                          {
                            icon: Contact,
                            label: "Kontak Darurat",
                            value: `${transaction?.emergencyName} (${transaction?.emergencyPhone})`,
                          },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-3">
                            <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-500 w-36 flex-shrink-0">
                              {label}
                            </span>
                            <span className="text-sm text-gray-800">
                              {value}
                            </span>
                          </div>
                        ))}
                        <div className="bg-blue-50 rounded-xl p-4 text-center mt-4">
                          <p className="text-xs text-blue-500 mb-1">
                            Total Pembayaran
                          </p>
                          <p className="text-2xl font-bold text-[#263C7D]">
                            Rp {transaction?.total?.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
                        <h3 className="font-semibold text-gray-800 text-center">
                          Status
                        </h3>
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <p className="text-xs text-blue-500 mb-1">
                            Peserta Terdaftar
                          </p>
                          <p className="text-3xl font-bold text-blue-900">
                            {registeredCount}
                            <span className="text-lg text-gray-400 font-medium">
                              {" "}
                              / {totalParticipants}
                            </span>
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <p className="text-xs text-green-500 mb-1">
                            Race Pack Diambil
                          </p>
                          <p className="text-3xl font-bold text-green-900">
                            {racePackTakenCount}
                            <span className="text-lg text-gray-400 font-medium">
                              {" "}
                              / {totalParticipants}
                            </span>
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 text-center">
                          Tunjukan halaman ini saat pengambilan race pack.
                        </p>
                      </div>
                    </div>

                    {/* Participants table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Detail Peserta
                      </h3>
                      <div className="overflow-x-auto rounded-xl border">
                        <Table className="min-w-[700px]">
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="w-10">#</TableHead>
                              <TableHead>Nama</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Kategori</TableHead>
                              <TableHead className="text-center">
                                Jersey
                              </TableHead>
                              <TableHead className="text-right">
                                Biaya
                              </TableHead>
                              <TableHead className="text-center">QR</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transaction?.participants?.map((p, index) => (
                              <TableRow key={p.id} className="even:bg-gray-50">
                                <TableCell className="text-gray-400">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {p.fname} {p.lname}
                                </TableCell>
                                <TableCell className="text-gray-500">
                                  {p.email}
                                </TableCell>
                                <TableCell>{p.master_category?.name}</TableCell>
                                <TableCell className="text-center">
                                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-semibold">
                                    {p.size}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  Rp {p.price?.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 cursor-pointer"
                                    onClick={() => {
                                      setSelectedParticipant(p);
                                      setIsQrModalOpen(true);
                                    }}
                                  >
                                    <QrCode className="w-4 h-4" /> Tampilkan
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  {/* QR Modal */}
                  <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Kode QR Peserta
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="p-4 border rounded-xl bg-white shadow-sm">
                          <QRCodeCanvas
                            id="qr-code-participant"
                            value={selectedParticipant?.uuid || ""}
                            size={220}
                            level="H"
                            includeMargin={false}
                          />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-gray-800">
                            {selectedParticipant?.fname}{" "}
                            {selectedParticipant?.lname}
                          </p>
                          <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 text-gray-500">
                            {selectedParticipant?.id}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
