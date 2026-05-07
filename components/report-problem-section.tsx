"use client";

import { showToast } from "@/components/toast-notification";
import { createTroubleReport } from "@/lib/api/troubleReportApi";
import { Loader2, MessageSquareWarning, X } from "lucide-react";
import { useState } from "react";

const EMPTY_FORM = { name: "", wa: "", email: "", nik: "", title: "", description: "" };

export function ReportProblemSection() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTroubleReport(form);
      showToast({ type: "success", title: "Laporan Terkirim", description: "Admin akan segera menindaklanjuti." });
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      showToast({ type: "error", title: "Gagal", description: "Laporan tidak dapat dikirim. Coba lagi." });
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating bottom banner */}
      {!showForm && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <MessageSquareWarning className="w-4 h-4 flex-shrink-0" />
            Ada kendala? Laporkan ke admin
          </button>
        </div>
      )}

      {/* Modal overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-gray-800">Laporkan Masalah</span>
              </div>
              <button
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value.replace(/[^a-zA-Z\s]/g, "") })}
                    placeholder="John Doe"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">NIK</label>
                  <input
                    type="text"
                    value={form.nik}
                    onChange={e => setForm({ ...form, nik: e.target.value.replace(/\D/g, "") })}
                    inputMode="numeric"
                    maxLength={16}
                    placeholder="35012345..."
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="johndoe@example.com"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">No. WhatsApp</label>
                <input
                  type="text"
                  value={form.wa}
                  onChange={e => setForm({ ...form, wa: e.target.value.replace(/\D/g, "") })}
                  inputMode="numeric"
                  placeholder="08xxxxxxxxxx"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Judul Masalah</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Tidak bisa login / daftar..."
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Jelaskan masalah secara detail..."
                  rows={3}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim Laporan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
