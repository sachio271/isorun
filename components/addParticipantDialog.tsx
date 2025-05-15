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

import { getCategory } from "@/lib/api/categoryApi";
import { getUserRef } from "@/lib/api/userApi";
import { CategoryResponse } from "@/types/response/categoryResponse";
import { UserData } from "@/types/response/userResponse";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { showToast } from "./toast-notification";
import { Checkbox } from "./ui/checkbox";

export default function AddParticipantDialog({
  open,
  onClose,
  onAdd,
  participants,
  free
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => void;
  participants: { fullName: string }[]; // or adjust shape as needed
  free: number;
}) {
  const { data: session } = useSession();
  const [selectedUserIndex, setSelectedUserIndex] = useState("0");
  const [userList, setUserList] = useState<UserData[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);  
  const availableUsers = userList.filter(
    (user) => !participants.some((p) => p.fullName === user.name)
  );
  const [manualFreeClaimChecked, setManualFreeClaimChecked] = useState(false);
  const selectedUser = availableUsers[parseInt(selectedUserIndex)] || availableUsers[0];
  const isEmployee = selectedUser?.status === "employee";
  const isFreeClaimChecked = (isEmployee && free > 0) || manualFreeClaimChecked;

  const filteredCategories = categories.filter(
    (cat) => cat.type === (selectedUser?.status === "employee" ? "employee" : "family")
  );

  const [form, setForm] = useState({
    fullName: "",
    fname: "",
    lname: "",
    categoryId: "",
    categoryName: "",
    categoryPrice: "",
    bibname: "",
    size: "",
    email: "",
    identityId: "",
    birthplace: "",
    birthdate: "",
    phone: "",
    address: "",
    zipcode: "",
    country: "",
    city: "",
    bloodType: "",
    province: "",
    gender: "",
    condition: "",
  });

  // useEffect(() => {
  //   if (open && availableUsers.length > 0) {
  //     setSelectedUserIndex(availableUsers[0].name); // reset to first
  //     preFillFormData();
  //   }
  // }, [open, availableUsers]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchUser(session.user?.id);
      fetchCategories();
    }
  }, [session]);

  const preFillFormData = () => {
    if (open && availableUsers.length > 0) {
      const selectedUser = availableUsers[parseInt(selectedUserIndex)] || availableUsers[0];
      const nameParts = selectedUser.name.trim().split(" ");
  
      let fname = "";
      let lname = "";
  
      if (nameParts.length === 1) {
        fname = lname = nameParts[0];
      } else {
        fname = nameParts[0];
        lname = nameParts.slice(1).join(" ");
      }
  
      setForm((prev) => ({
        ...prev,
        fullName: selectedUser.name,
        fname,
        lname,
        categoryId: "",
        categoryName: "",
        categoryPrice: "",
        size: "",
        email: selectedUser.email || "",
        identityId: selectedUser.ektp || "",
        birthplace: selectedUser.birthPlace || "",
        birthdate: formatDate(selectedUser.birthDate) || "",
        phone: selectedUser.phone || "",
        address: selectedUser.address || "",
        city: selectedUser.city || "",
        bloodType: selectedUser.bloodType || "",
        gender: selectedUser.gender || "",
      }));
    }
  }

  useEffect(() => {
    preFillFormData();
  }, [open, selectedUserIndex, userList]);
  

  const fetchUser = async (id: string) => {
    try {
      const data = await getUserRef(session?.accessToken || "", id);
      setUserList(data);
    } catch (error) {
      console.error(error);
      showToast({
        title: "Something went wrong!",
        description: "Can't show user data.",
        type: "error",
      });
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toISOString().split("T")[0]; // returns 'yyyy-MM-dd'
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategory(session?.accessToken || "");
      setCategories(data);
    } catch (error) {
      console.error(error);
      showToast({
        title: "Something went wrong!",
        description: "Can't show categories.",
        type: "error",
      });
    }
  };

  const handleSubmit = () => {
    if (
      !form.fullName ||
      !form.fname ||
      !form.lname ||
      !form.bibname ||
      !form.size ||
      !form.email ||
      !form.identityId ||
      !form.birthplace ||
      !form.birthdate ||
      !form.phone ||
      !form.address ||
      !form.zipcode ||
      !form.country ||
      !form.city ||
      !form.bloodType ||
      !form.categoryId ||
      !form.categoryName ||
      !form.categoryPrice ||
      !form.province ||
      !form.gender
    ) {
      showToast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
    let price = form.categoryPrice;
    if (isFreeClaimChecked) {
      price = "0";
    }
    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("fname", form.fname);
    formData.append("lname", form.lname);
    formData.append("bibname", form.bibname);
    formData.append("email", form.email);
    formData.append("identityId", form.identityId);
    formData.append("birthplace", form.birthplace);
    formData.append("birthdate", form.birthdate);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("zipcode", form.zipcode);
    formData.append("country", form.country);
    formData.append("city", form.city);
    formData.append("bloodType", form.bloodType);
    formData.append("size", form.size);
    formData.append("categoryId", form.categoryId || "");
    formData.append("categoryName", form.categoryName || "");
    formData.append("categoryPrice", price);
    formData.append("province", form.province || "");
    formData.append("gender", form.gender);
    formData.append("condition", form.condition || "Good Condition");

    onAdd(formData);
    setForm({
      fullName: "",
      fname: "",
      lname: "",
      categoryId: "",
      categoryName: "",
      categoryPrice: "",
      bibname: "",
      size: "",
      email: "",
      identityId: "",
      birthplace: "",
      birthdate: "",
      phone: "",
      address: "",
      zipcode: "",
      country: "",
      city: "",
      bloodType: "",
      province: "",
      gender: "",
      condition: "",
    });
    setSelectedUserIndex("0");
    setManualFreeClaimChecked(false);
    onClose();
  };
  
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
          <DialogDescription>Fill in participant data</DialogDescription>
        </DialogHeader>

        <div className="mb-2">
          <Label className="mb-2">Register As</Label>
          <Select
            value={selectedUserIndex}
            onValueChange={(val) => {
              setSelectedUserIndex(val);
              setManualFreeClaimChecked(false); // reset when new user is selected
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map((user, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            {free <= 0 ? (
              <div className="text-red-500 text-sm mt-2">Tidak ada slot gratis yang tersedia</div>
            ) : (
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="terms"
                  checked={isFreeClaimChecked}
                  disabled={isEmployee}
                  onCheckedChange={(val) => {
                    if (!isEmployee && typeof val === "boolean") {
                      setManualFreeClaimChecked(val);
                    }
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Klaim slot gratis pada user ini
                </label>
              </div>
          )}
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="category">
                Categori
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
          </div>
          <Select
            value={form.categoryName || ""}
            required
            onValueChange={(val) => {
              const selectedCategory = filteredCategories.find(cat => cat.name.toString() === val);
              setForm({ ...form, categoryId: selectedCategory?.id.toString() ?? '', categoryName: selectedCategory?.name || "", categoryPrice: selectedCategory?.price.toString() || "" });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="fname">
              Front Name
            </Label>
            <Input id="fname" disabled required placeholder="Nama" value={form.fname} onChange={(e) => setForm({ ...form, fname: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="lname">
              Back Name
            </Label>
            <Input id="lname" disabled required placeholder="Nama Belakang" value={form.lname} onChange={(e) => setForm({ ...form, lname: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="bibname">
                Bib Name (nama di jersey)
              </Label>
              <span className="text-xs text-red-700">
              * required (max 8 char)
              </span>
            </div>
            <Input id="bibname" required placeholder="Nama Bib" maxLength={8} value={form.bibname} onChange={(e) => setForm({ ...form, bibname: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="size">
                Size Jersey
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Select
              value={form.size}
              required
              onValueChange={(val) => setForm({ ...form, size: val })}
            >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {["S (48cm x 66cm)", "M (50cm x 68cm)", "L (52cm x 70cm)", "XL (54cm x 72cm)", "XXL (56cm x 74cm)"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="email">
                Email
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="email" type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="identityId">
                Nomor EKTP
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="identityId" required placeholder="Identity ID" value={form.identityId} onChange={(e) => setForm({ ...form, identityId: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="birthplace">
                Tempat Lahir
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="birthplace" required placeholder="Tempat Lahir" value={form.birthplace} onChange={(e) => setForm({ ...form, birthplace: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="birthdate">
                Tanggal Lahir
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="birthdate" required type="date" placeholder="Tanggal Lahir" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="gender">
                Jenis Kelamin
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
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
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="phone">
                Nomor Telepon
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="phone" required placeholder="No. Telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="address">
                Alamat
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="address" required placeholder="Alamat" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="zipcode">
                Kode Pos
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="zipcode" required placeholder="Kode Pos" value={form.zipcode} onChange={(e) => setForm({ ...form, zipcode: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="province">
                Provinsi
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="province" required placeholder="Provinsi" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="city">
                Kota
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="city" required placeholder="Kota" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="country">
                Negara
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="country" required placeholder="Negara" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
        <div className="mb-2">
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="bloodType">
                Golongan Darah
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
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
            <div className="flex items-center justify-between">
              <Label className="capitalize mb-2" htmlFor="condition">
                Kondisi
              </Label>
              <span className="text-xs text-red-700">
              * required
              </span>
            </div>
            <Input id="condition" placeholder="Kondisi" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} />
            <div className="text-sm text-gray-600">contoh: jantung, gangguan pernafasan, hamil</div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-[#263c7d] hover: cursor-pointer">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
