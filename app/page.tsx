"use client";

import Header from "@/components/header";
import { showToast } from "@/components/toast-notification";
import { createTroubleReport } from "@/lib/api/troubleReportApi";
import { BadgeCheck, BookUser, ClipboardList, CreditCard, Loader2, MessageSquareWarning, Phone, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const steps = [
  { icon: UserPlus, title: "Buka Registrasi", desc: "Masuk ke menu Registrasi melalui navigasi atas." },
  { icon: ClipboardList, title: "Isi Formulir", desc: "Lengkapi data diri dan submit untuk menyimpan pendaftaran." },
  { icon: BookUser, title: "Tunggu Konfirmasi Data", desc: "Admin akan memverifikasi data yang kamu isi." },
  { icon: CreditCard, title: "Lakukan Pembayaran", desc: "Selesaikan proses pembayaran sesuai kategori lomba." },
  { icon: BadgeCheck, title: "Konfirmasi Pembayaran", desc: "Admin akan mengkonfirmasi bukti pembayaranmu." },
  { icon: BadgeCheck, title: "Pendaftaran Selesai!", desc: "Kamu resmi terdaftar sebagai peserta. Selamat berlari!" },
];

const EMPTY_FORM = { name: "", wa: "", email: "", nik: "", title: "", description: "" };

export default function Home() {
  const [reportForm, setReportForm] = useState(EMPTY_FORM);
  const [reportLoading, setReportLoading] = useState(false);

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReportLoading(true);
    try {
      await createTroubleReport(reportForm);
      showToast({ type: "success", title: "Laporan Terkirim", description: "Laporan kamu telah diterima oleh admin." });
      setReportForm(EMPTY_FORM);
    } catch {
      showToast({ type: "error", title: "Gagal", description: "Laporan tidak dapat dikirim. Silakan coba lagi." });
    }
    setReportLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      <Header />

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/banner 2.webp"
          alt="Surabaya Isoplus Marathon 2026"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <div className="mb-6">
            <Image src="/isoplus.png" alt="Isoplus Logo" width={100} height={100} className="mx-auto drop-shadow-xl" />
          </div>
          <span className="uppercase tracking-widest text-sm font-semibold text-blue-300 mb-3">
            Wings Surya — Internal Registration
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg max-w-3xl">
            Surabaya Isoplus Marathon 2026
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/80 max-w-xl">
            Daftarkan dirimu sekarang dan jadilah bagian dari semangat Wings Surya berlari bersama.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/registration"
              className="px-8 py-3 rounded-full bg-[#263C7D] hover:bg-[#1e2f61] text-white font-semibold transition-all shadow-lg"
            >
              Daftar Sekarang
            </Link>
            <a
              href="#how-to-register"
              className="px-8 py-3 rounded-full border border-white/60 hover:bg-white/10 text-white font-semibold transition-all"
            >
              Cara Mendaftar
            </a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* How to Register */}
      <section className="py-20 px-4 md:px-16 max-w-5xl mx-auto" id="how-to-register">
        <div className="text-center mb-14">
          <span className="text-sm uppercase tracking-widest text-[#263C7D] font-semibold">Panduan</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">Cara Mendaftar</h2>
          <p className="mt-3 text-gray-500 max-w-md mx-auto text-sm">
            Ikuti 6 langkah mudah berikut untuk menyelesaikan pendaftaranmu.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#263C7D]/15 hidden md:block" />
          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-[#263C7D] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform z-10">
                  {i + 1}
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 group-hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon className="w-4 h-4 text-[#263C7D]" />
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Problem */}
      <section className="py-20 px-4 md:px-16 max-w-5xl mx-auto" id="report-problem">
        <div className="text-center mb-10">
          <span className="text-sm uppercase tracking-widest text-red-500 font-semibold">Bantuan</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">Ada Kendala?</h2>
          <p className="mt-3 text-gray-500 max-w-md mx-auto text-sm">
            Sampaikan laporanmu dan admin akan segera menindaklanjuti. Atau hubungi Helpdesk HRD secara langsung.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: form always visible */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquareWarning className="w-5 h-5 text-[#263C7D]" />
              <h3 className="font-semibold text-gray-800">Kirim Laporan</h3>
            </div>
            <form onSubmit={handleReportSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Nama Lengkap</label>
                  <input
                    type="text"
                    value={reportForm.name}
                    onChange={e => setReportForm({ ...reportForm, name: e.target.value.replace(/[^a-zA-Z\s]/g, "") })}
                    placeholder="John Doe"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#263C7D]/30 focus:border-[#263C7D] transition"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">NIK</label>
                  <input
                    type="text"
                    value={reportForm.nik}
                    onChange={e => setReportForm({ ...reportForm, nik: e.target.value.replace(/\D/g, "") })}
                    inputMode="numeric"
                    placeholder="35012345678901234"
                    maxLength={16}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#263C7D]/30 focus:border-[#263C7D] transition"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={reportForm.email}
                  onChange={e => setReportForm({ ...reportForm, email: e.target.value })}
                  placeholder="johndoe@example.com"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#263C7D]/30 focus:border-[#263C7D] transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">No. WhatsApp</label>
                <input
                  type="text"
                  value={reportForm.wa}
                  onChange={e => setReportForm({ ...reportForm, wa: e.target.value.replace(/\D/g, "") })}
                  inputMode="numeric"
                  placeholder="08xxxxxxxxxx"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#263C7D]/30 focus:border-[#263C7D] transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Judul Masalah</label>
                <input
                  type="text"
                  value={reportForm.title}
                  onChange={e => setReportForm({ ...reportForm, title: e.target.value })}
                  placeholder="Contoh: Tidak bisa upload bukti pembayaran"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#263C7D]/30 focus:border-[#263C7D] transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Deskripsi</label>
                <textarea
                  value={reportForm.description}
                  onChange={e => setReportForm({ ...reportForm, description: e.target.value })}
                  placeholder="Jelaskan masalah yang kamu alami secara detail..."
                  rows={4}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#263C7D]/30 focus:border-[#263C7D] transition resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={reportLoading}
                className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#263C7D] hover:bg-[#1e2f61] text-white font-semibold text-sm transition-all disabled:opacity-60"
              >
                {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim Laporan"}
              </button>
            </form>
          </div>

          {/* Right: helpdesk info */}
          <div className="flex flex-col gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-5 h-5 text-[#263C7D]" />
                <h3 className="font-semibold text-gray-800">Hubungi Helpdesk HRD</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Jika kamu membutuhkan bantuan lebih lanjut, silakan hubungi tim Helpdesk HRD kami secara langsung.
              </p>
              <a
                href="https://wa.me/6288210500000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all"
              >
                <Phone className="w-4 h-4" />
                +62-882-1050-0000
              </a>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-sm text-amber-700 font-medium mb-1">Catatan</p>
              <p className="text-sm text-amber-600">
                Laporan yang kamu kirim akan langsung diterima oleh admin dan ditindaklanjuti secepatnya pada jam kerja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="bg-[#263C7D] text-white/70 text-center text-xs py-5 mt-10">
        © 2026 Wings Surya — Surabaya Isoplus Marathon. All rights reserved.
      </footer>
    </main>
  );
}
