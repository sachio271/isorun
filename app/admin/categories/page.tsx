"use client";

import { ConfirmationDialog } from "@/components/confirmationDialog";
import { showToast } from "@/components/toast-notification";
import { Badge } from "@/components/ui/badge";
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
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "@/lib/api/categoryApi";
import { CategoryResponse } from "@/types/response/categoryResponse";
import { Layers, Pencil, Plus, PowerOff, Tag, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const EMPTY_FORM = { name: "", type: "", price: "" };

export default function CategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Create / Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryResponse | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<Partial<typeof EMPTY_FORM>>({});

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponse | null>(
    null,
  );

  const fetchCategories = async () => {
    if (!session?.accessToken) return;
    try {
      const data = await getCategory(session.accessToken);
      setCategories(data);
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Tidak dapat memuat kategori.",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError({});
    setDialogOpen(true);
  };

  const openEdit = (cat: CategoryResponse) => {
    setEditTarget(cat);
    setForm({ name: cat.name, type: cat.type, price: cat.price.toString() });
    setFormError({});
    setDialogOpen(true);
  };

  const validate = () => {
    const errors: Partial<typeof EMPTY_FORM> = {};
    if (!form.name.trim()) errors.name = "Nama wajib diisi.";
    if (!form.type.trim()) errors.type = "Tipe wajib diisi.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      errors.price = "Harga harus berupa angka positif.";
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !session?.accessToken) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("type", form.type.trim());
    fd.append("price", form.price);
    try {
      if (editTarget) {
        await updateCategory(editTarget.id, fd, session.accessToken);
        showToast({
          type: "success",
          title: "Berhasil",
          description: "Kategori berhasil diperbarui.",
        });
      } else {
        await createCategory(fd, session.accessToken);
        showToast({
          type: "success",
          title: "Berhasil",
          description: "Kategori berhasil ditambahkan.",
        });
      }
      setDialogOpen(false);
      fetchCategories();
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Tidak dapat menyimpan kategori.",
      });
    }
    setLoading(false);
  };

  const handleToggleStatus = async (cat: CategoryResponse) => {
    if (!session?.accessToken) return;
    const fd = new FormData();
    fd.append("status", cat.status === 1 ? "0" : "1");
    try {
      await updateCategory(cat.id, fd, session.accessToken);
      showToast({
        type: "success",
        title: cat.status === 1 ? "Dinonaktifkan" : "Diaktifkan",
        description: `Kategori "${cat.name}" berhasil diperbarui.`,
      });
      fetchCategories();
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Tidak dapat mengubah status kategori.",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !session?.accessToken) return;
    try {
      await deleteCategory(deleteTarget.id, session.accessToken);
      showToast({
        type: "success",
        title: "Dihapus",
        description: "Kategori berhasil dihapus.",
      });
      fetchCategories();
    } catch {
      showToast({
        type: "error",
        title: "Gagal",
        description: "Tidak dapat menghapus kategori.",
      });
    }
  };

  return (
    <>
      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="flex items-center gap-1.5 text-sm"
              >
                <Tag className="w-3.5 h-3.5 text-[#263C7D]" /> Nama Kategori
              </Label>
              <Input
                id="name"
                placeholder="e.g. 5K Fun Run"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              {formError.name && (
                <p className="text-xs text-red-500">{formError.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm">
                <Layers className="w-3.5 h-3.5 text-[#263C7D]" /> Tipe
              </Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
              {formError.type && (
                <p className="text-xs text-red-500">{formError.type}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="price"
                className="flex items-center gap-1.5 text-sm"
              >
                <span className="text-[#263C7D] font-bold text-xs">Rp</span>{" "}
                Harga
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                placeholder="e.g. 150000"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />
              {formError.price && (
                <p className="text-xs text-red-500">{formError.price}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#263C7D] hover:bg-[#1e2f61] cursor-pointer"
            >
              {loading
                ? "Menyimpan..."
                : editTarget
                  ? "Simpan Perubahan"
                  : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmationDialog
        title="Hapus Kategori"
        description={`Yakin ingin menghapus kategori "${deleteTarget?.name}"? Aksi ini tidak dapat dibatalkan.`}
        handleConfirm={handleDelete}
        status=""
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Kategori Lomba</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {categories.length} kategori terdaftar
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-[#263C7D] hover:bg-[#1e2f61] gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Kategori
          </Button>
        </div>

        {/* Category grid */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 flex flex-col items-center gap-3 text-gray-400">
            <Layers className="w-10 h-10" />
            <p className="text-sm">
              Belum ada kategori. Klik tombol di atas untuk menambah.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800">{cat.name}</p>
                    <Badge className="mt-1.5 bg-[#263C7D]/10 text-[#263C7D] hover:bg-[#263C7D]/10 text-xs">
                      {cat.type}
                    </Badge>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">Harga</p>
                    <p className="font-bold text-[#263C7D]">
                      {cat.price === 0
                        ? "Gratis"
                        : `Rp ${cat.price.toLocaleString("id-ID")}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 cursor-pointer"
                    onClick={() => openEdit(cat)}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 gap-1.5 cursor-pointer ${cat.status === 1 ? "text-amber-500 border-amber-100 hover:bg-amber-50 hover:text-amber-600" : "text-green-600 border-green-100 hover:bg-green-50 hover:text-green-700"}`}
                    onClick={() => handleToggleStatus(cat)}
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    {cat.status === 1 ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    onClick={() => {
                      setDeleteTarget(cat);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="w-3.5 h-3.5" /> Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
