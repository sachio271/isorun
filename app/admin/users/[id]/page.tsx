"use client";

import { showToast } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/api/userApi";
import { UserResponse } from "@/types/response/userResponse";
import {
    ArrowLeft,
    Droplets,
    Heart,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Ruler,
    Scale,
    Shield,
    User,
    Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div>
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value || "-"}</p>
        </div>
    );
}

const ROLE_STYLE: Record<string, string> = {
    admin: "bg-red-100 text-red-700",
    support: "bg-yellow-100 text-yellow-700",
};

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState<UserResponse | undefined>(undefined);

    useEffect(() => {
        if (!session?.accessToken || !id) return;
        getUserById(session.accessToken, id as string)
            .then(data => setUser(Array.isArray(data) ? data[0] : data))
            .catch(() => showToast({ type: "error", title: "Gagal", description: "Tidak dapat memuat data pengguna." }));
    }, [session, id]);

    const formatDate = (d?: string | null) => {
        if (!d) return "-";
        try { return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }); }
        catch { return d; }
    };

    if (!user) return (
        <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#263C7D]" />
        </div>
    );

    const ref = user.users_ref;
    const roleStyle = ROLE_STYLE[user.role] ?? "bg-blue-100 text-blue-700";

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 cursor-pointer text-gray-500 hover:text-gray-800 -ml-2">
                <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>

            {/* Account Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#263C7D]/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#263C7D]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{user.username}</h1>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyle}`}>
                            {user.role}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 text-sm">
                    <InfoRow label="ID Pengguna" value={user.id} />
                    <InfoRow label="Dibuat" value={formatDate(user.createdAt)} />
                    <InfoRow label="Diperbarui" value={formatDate(user.updatedAt)} />
                </div>
            </div>

            {/* Personal Info Card */}
            {ref && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{ref.name}</h2>
                            <p className="text-sm text-gray-400">{ref.EKTP}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                        <InfoRow label="Tipe" value={ref.type} />
                        <InfoRow label="Jenis Kelamin" value={ref.gender === "L" ? "Laki-laki" : ref.gender === "P" ? "Perempuan" : ref.gender} />
                        <InfoRow label="Tempat Lahir" value={ref.birthplace} />
                        <InfoRow label="Tanggal Lahir" value={formatDate(ref.birthdate)} />
                        <InfoRow label="Struktur" value={ref.struct} />

                        <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <InfoRow label="Telepon" value={ref.phone} />
                        </div>
                        <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <InfoRow label="Email" value={ref.email} />
                        </div>
                        <div className="flex items-start gap-2">
                            <Scale className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <InfoRow label="Berat Badan" value={ref.weight ? `${ref.weight} kg` : undefined} />
                        </div>
                        <div className="flex items-start gap-2">
                            <Ruler className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <InfoRow label="Tinggi Badan" value={ref.height ? `${ref.height} cm` : undefined} />
                        </div>
                        <div className="flex items-start gap-2">
                            <Droplets className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <InfoRow label="Golongan Darah" value={ref.bloodType} />
                        </div>
                        <div className="flex items-start gap-2">
                            <Heart className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <InfoRow label="Agama" value={ref.religion} />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3 flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Alamat</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {[ref.address, ref.subdistrict, ref.district, ref.city].filter(Boolean).join(", ") || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Family Card */}
            {ref?.family_ref && ref.family_ref.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Data Keluarga</h2>
                            <p className="text-sm text-gray-400">{ref.family_ref.length} anggota terdaftar</p>
                        </div>
                    </div>

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
                                </tr>
                            </thead>
                            <tbody>
                                {ref.family_ref.map((item, i) => (
                                    <tr key={item.id} className="border-b last:border-0 even:bg-gray-50 hover:bg-blue-50/40 transition-colors">
                                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{item.name || "-"}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.EKTP || "-"}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {item.relation || "-"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{formatDate(item.birthdate)}</td>
                                        <td className="px-4 py-3 text-gray-600">{item.phone || "-"}</td>
                                        <td className="px-4 py-3 text-gray-500">{item.email || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
