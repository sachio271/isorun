"use client";

import { showToast } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFamilyRef, getUserRefById } from "@/lib/api/userApi";
import { FamilyRef, UsersRef } from "@/types/response/userResponse";
import {
  Droplets,
  Edit,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Scale,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EMPTY_FAMILY_FORM = {
  name: "",
  ektp: "",
  type: "",
  relation: "",
  birthdate: "",
  birthplace: "",
  address: "",
  subDistrict: "",
  district: "",
  city: "",
  phone: "",
  email: "",
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || "-"}</p>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [user, setUser] = useState<UsersRef | undefined>(undefined);
  const [family, setFamily] = useState<FamilyRef[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [familyForm, setFamilyForm] = useState(EMPTY_FAMILY_FORM);

  const fetchData = async () => {
    if (!session?.accessToken || !id) return;
    try {
      const userData = await getUserRefById(session.accessToken, id as string);
      setUser(userData);
      setFamily(userData.family_ref || []);
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Tidak dapat memuat data pengguna.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [session, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => {
    setFamilyForm(EMPTY_FAMILY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (item: FamilyRef) => {
    setFamilyForm({
      name: item.name ?? "",
      ektp: item.EKTP ?? "",
      type: item.type ?? "",
      relation: item.relation ?? "",
      birthdate: item.birthdate ?? "",
      birthplace: item.birthplace ?? "",
      address: item.address ?? "",
      subDistrict: item.subdistrict ?? "",
      district: item.district ?? "",
      city: item.city ?? "",
      phone: item.phone ?? "",
      email: item.email ?? "",
    });
    setEditingId(item.id.toString());
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!session?.accessToken) return;
    setSaving(true);
    const formData = new FormData();
    Object.entries(familyForm).forEach(([k, v]) => formData.append(k, v));
    if (user?.EKTP) formData.append("users_refKtp", user.EKTP);
    try {
      await createFamilyRef(session.accessToken, formData);
      await fetchData();
      showToast({
        type: "success",
        title: "Berhasil",
        description: "Data keluarga berhasil disimpan.",
      });
      setDialogOpen(false);
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Tidak dapat menyimpan data keluarga.",
      });
    }
    setSaving(false);
  };

  const set = (key: keyof typeof EMPTY_FAMILY_FORM) => (val: string) =>
    setFamilyForm((prev) => ({ ...prev, [key]: val }));

  if (!user)
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#263C7D]" />
      </div>
    );

  const formatDate = (d?: string) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#263C7D]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#263C7D]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-sm text-gray-400">{user.EKTP}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          <InfoRow label="Tipe" value={user.type} />
          <InfoRow
            label="Jenis Kelamin"
            value={
              user.gender === "L"
                ? "Laki-laki"
                : user.gender === "P"
                  ? "Perempuan"
                  : user.gender
            }
          />
          <InfoRow label="Tempat Lahir" value={user.birthplace} />
          <InfoRow label="Tanggal Lahir" value={formatDate(user.birthdate)} />
          <InfoRow label="Struktur" value={user.struct} />

          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <InfoRow label="Telepon" value={user.phone} />
          </div>
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <InfoRow label="Email" value={user.email} />
          </div>

          <div className="flex items-start gap-2">
            <Scale className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <InfoRow
              label="Berat Badan"
              value={user.weight ? `${user.weight} kg` : undefined}
            />
          </div>
          <div className="flex items-start gap-2">
            <Ruler className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <InfoRow
              label="Tinggi Badan"
              value={user.height ? `${user.height} cm` : undefined}
            />
          </div>
          <div className="flex items-start gap-2">
            <Droplets className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <InfoRow label="Golongan Darah" value={user.bloodType} />
          </div>
          <div className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <InfoRow label="Agama" value={user.religion} />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Alamat</p>
              <p className="text-sm font-medium text-gray-800">
                {[user.address, user.subdistrict, user.district, user.city]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Family Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Data Keluarga</h2>
              <p className="text-sm text-gray-400">
                {family.length} anggota terdaftar
              </p>
            </div>
          </div>
          <Button
            onClick={openAdd}
            className="bg-[#263C7D] hover:bg-[#1e2f61] gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Tambah
          </Button>
        </div>

        {family.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            Belum ada data keluarga.
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">EKTP</th>
                  <th className="px-4 py-3 text-left">Hubungan</th>
                  <th className="px-4 py-3 text-left">Tgl Lahir</th>
                  <th className="px-4 py-3 text-left">Telepon</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {family.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-0 even:bg-gray-50 hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.name || "-"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {item.EKTP || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {item.relation || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(item.birthdate)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {item.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(item)}
                        className="h-8 w-8 p-0 cursor-pointer text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Family Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Data Keluarga" : "Tambah Data Keluarga"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label>Nama</Label>
              <Input
                placeholder="Nama lengkap"
                value={familyForm.name}
                onChange={(e) => set("name")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>EKTP</Label>
              <Input
                placeholder="No. EKTP"
                value={familyForm.ektp}
                onChange={(e) => set("ektp")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Tipe</Label>
              <Select value={familyForm.type} onValueChange={set("type")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  {["EKTP", "KTP"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Hubungan</Label>
              <Input
                placeholder="cth: Istri, Anak"
                value={familyForm.relation}
                onChange={(e) => set("relation")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Tempat Lahir</Label>
              <Input
                placeholder="Tempat lahir"
                value={familyForm.birthplace}
                onChange={(e) => set("birthplace")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Tanggal Lahir</Label>
              <Input
                type="date"
                value={familyForm.birthdate}
                onChange={(e) => set("birthdate")(e.target.value)}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Alamat</Label>
              <Input
                placeholder="Alamat lengkap"
                value={familyForm.address}
                onChange={(e) => set("address")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Kecamatan</Label>
              <Input
                placeholder="Kecamatan"
                value={familyForm.subDistrict}
                onChange={(e) => set("subDistrict")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Kelurahan</Label>
              <Input
                placeholder="Kelurahan"
                value={familyForm.district}
                onChange={(e) => set("district")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Kota</Label>
              <Input
                placeholder="Kota"
                value={familyForm.city}
                onChange={(e) => set("city")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Telepon</Label>
              <Input
                placeholder="No. telepon"
                value={familyForm.phone}
                onChange={(e) => set("phone")(e.target.value)}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={familyForm.email}
                onChange={(e) => set("email")(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#263C7D] hover:bg-[#1e2f61] cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
