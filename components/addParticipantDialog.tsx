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

export default function AddParticipantDialog({
  open,
  onClose,
  onAdd,
  participants,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => void;
  participants: { fullName: string }[]; // or adjust shape as needed
}) {
  const { data: session } = useSession();
  const [selectedUserIndex, setSelectedUserIndex] = useState("0");
  const [userList, setUserList] = useState<UserData[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);  
  const availableUsers = userList.filter(
    (user) => !participants.some((p) => p.fullName === user.name)
  );
  
  const selectedUser = availableUsers[parseInt(selectedUserIndex)];
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
        email: selectedUser.email || "",
        identityId: selectedUser.ektp || "",
        birthplace: selectedUser.birthPlace || "",
        birthdate: formatDate(selectedUser.birthDate) || "",
        phone: selectedUser.phone || "",
        address: selectedUser.address || "",
        city: selectedUser.city || "",
        bloodType: selectedUser.bloodType || "",
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
      !form.categoryPrice
    ) {
      showToast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        type: "error",
      });
      return;
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
    formData.append("categoryId", form.categoryId || "");
    formData.append("categoryName", form.categoryName || "");
    formData.append("categoryPrice", form.categoryPrice || "");

    onAdd(formData);
    setForm({
      fullName: "",
      fname: "",
      lname: "",
      categoryId: "",
      categoryName: "",
      categoryPrice: "",
      bibname: "",
      email: "",
      identityId: "",
      birthplace: "",
      birthdate: "",
      phone: "",
      address: "",
      zipcode: "",
      country: "",
      city: "",
      bloodType: ""
    });
    setSelectedUserIndex("0");
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
            required
            value={selectedUserIndex}
            onValueChange={(val) => {
              setSelectedUserIndex(val)
              // preFillFormData();
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
        </div>

        <div className="mb-2">
          <Label className="mb-2">Category</Label>
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
            <Input id="fname" required placeholder="Nama" value={form.fname} onChange={(e) => setForm({ ...form, fname: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="lname">
              Back Name
            </Label>
            <Input id="lname" required placeholder="Nama Belakang" value={form.lname} onChange={(e) => setForm({ ...form, lname: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="bibname">
              Bib Name
            </Label>
            <Input id="bibname" required placeholder="Nama Bib" maxLength={8} value={form.bibname} onChange={(e) => setForm({ ...form, bibname: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="email">
              Email
            </Label>
            <Input id="email" type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="identityId">
              Identity ID
            </Label>
            <Input id="identityId" required placeholder="Identity ID" value={form.identityId} onChange={(e) => setForm({ ...form, identityId: e.target.value })} />
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
            <Label className="capitalize mb-2" htmlFor="phone">
              Phone
            </Label>
            <Input id="phone" required placeholder="No. Telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="address">
              Address
            </Label>
            <Input id="address" required placeholder="Alamat" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="zipcode">
              Zipcode
            </Label>
            <Input id="zipcode" required placeholder="Kode Pos" value={form.zipcode} onChange={(e) => setForm({ ...form, zipcode: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="country">
              Country
            </Label>
            <Input id="country" required placeholder="Negara" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
        <div className="mb-2">
            <Label className="capitalize mb-2" htmlFor="city">
              City
            </Label>
            <Input id="city" required placeholder="Kota" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
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

        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
