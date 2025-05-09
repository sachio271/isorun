"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import { UsersRef } from "@/types/response/userResponse";
import { useEffect, useState } from "react";
import { showToast } from "./toast-notification";

export default function AddUserDialog({
  open,
  onClose,
  onAdd,
  data,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => void;
  data?: { user: UsersRef };
}) {
  const [form, setForm] = useState({
    EKTP: "",
    type: "",
    name: "",
    birthplace: "",
    birthdate: "",
    phone: "",
    address: "",
    subdistrict: "",
    district: "",
    city: "",
    email: "",
    gender: "",
    weight: 0,
    height: 0,
    bloodType: "",
    religion: "",
  });

  useEffect(() => {
    console.log("data", data);
    preFillFormData();
  }, [data?.user]);

  const preFillFormData = () => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        EKTP: data.user.EKTP,
        type: data.user.type,
        name: data.user.name,
        birthplace: data.user.birthplace,
        birthdate: formatDate(data.user.birthdate),
        address: data.user.address,
        subdistrict: data.user.subdistrict,
        district: data.user.district,
        city: data.user.city,
        email: data.user.email,
        phone: data.user.phone,
        gender: data.user.gender,
        weight: data.user.weight,
        height: data.user.height,
        bloodType: data.user.bloodType,
        religion: data.user.religion,
      }));
    }
  }

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toISOString().split("T")[0]; // returns 'yyyy-MM-dd'
  };

  const handleSubmit = () => {
    if (
        !form.EKTP ||
        !form.type ||
        !form.name ||
        !form.birthplace ||
        !form.birthdate ||
        !form.phone ||
        !form.address ||
        !form.city ||
        !form.email ||
        !form.subdistrict ||
        !form.district ||
        !form.bloodType ||
        !form.religion ||
        !form.gender
    ) {
      showToast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
    const formData = new FormData();
    formData.append("EKTP", form.EKTP);
    formData.append("type", form.type);
    formData.append("name", form.name);
    formData.append("birthplace", form.birthplace);
    formData.append("birthdate", form.birthdate);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("subdistrict", form.subdistrict);
    formData.append("district", form.district);
    formData.append("city", form.city);
    formData.append("email", form.email);
    formData.append("gender", form.gender);
    formData.append("weight", form.weight.toString());
    formData.append("height", form.height.toString());
    formData.append("bloodType", form.bloodType);
    formData.append("religion", form.religion);

    onAdd(formData);
    setForm({
        EKTP: "",
        type: "",
        name: "",
        birthplace: "",
        birthdate: "",
        phone: "",
        address: "",
        subdistrict: "",
        district: "",
        city: "",
        email: "",
        gender: "",
        weight: 0,
        height: 0,
        bloodType: "",
        religion: "",
    });
    onClose();
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add User Reference</DialogTitle>
          <DialogDescription>Fill in user data</DialogDescription>
        </DialogHeader>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="ektp">
              EKTP
            </Label>
            <Input id="ektp" required placeholder="EKTP" value={form.EKTP} onChange={(e) => setForm({ ...form, EKTP: e.target.value })} />
        </div>
        
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="type">
                Type
            </Label>
            <Select
              value={form.type}
              required
              onValueChange={(val) => setForm({ ...form, type: val })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                {["EKTP", "KTP"].map((type) => (
                    <SelectItem key={type} value={type}>
                    {type}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="name">
              Name
            </Label>
            <Input id="name" required placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="birthplace">
              Birthplace
            </Label>
            <Input id="birthplace" required placeholder="Tempat Lahir" value={form.birthplace} onChange={(e) => setForm({ ...form, birthplace: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="birthdate">
              Birthdate
            </Label>
            <Input id="birthdate" required type="date" placeholder="Tanggal Lahir" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="address">
              Address
            </Label>
            <Input id="address" required placeholder="Alamat" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="subdistrict">
              Subdistrict
            </Label>
            <Input id="subdistrict" required placeholder="Kecamatan" value={form.subdistrict} onChange={(e) => setForm({ ...form, subdistrict: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="district">
              District
            </Label>
            <Input id="district" required placeholder="Kelurahan" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="city">
                City
            </Label>
            <Input id="city" required placeholder="Kota" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="phone">
              Phone
            </Label>
            <Input id="phone" required placeholder="No. Telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="email">
              Email
            </Label>
            <Input id="email" type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="gender">
              Gender
            </Label>
            <Select
              value={form.gender}
              required
              onValueChange={(val) => setForm({ ...form, gender: val })}
            >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              {["L", "P"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="weight">
              Weight
            </Label>
            <Input id="weight" required type="number" placeholder="Berat Badan" value={form.weight} onChange={(e) => setForm({ ...form, weight: parseInt(e.target.value.toString()) })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="height">
              Height
            </Label>
            <Input id="height" required type="number" placeholder="Tinggi Badan" value={form.height} onChange={(e) => setForm({ ...form, height: parseInt(e.target.value.toString()) })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="bloodType">
              Blood Type
            </Label>
            <Select
              value={form.bloodType}
              required
              onValueChange={(val) => setForm({ ...form, bloodType: val })}
            >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Blood Type" />
            </SelectTrigger>
            <SelectContent>
              {["A", "B", "AB", "O"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="religion">
              Religion
            </Label>
            <Select
              value={form.religion}
              required
              onValueChange={(val) => setForm({ ...form, religion: val })}
            >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Religion" />
            </SelectTrigger>
            <SelectContent>
              {["Katholik", "Kristen", "Islam", "Budha", "Hindu", "Khonghuchu"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-[#263c7d] hover: cursor-pointer">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
