import Header from "@/components/header";
import { BadgeCheck, BookUser, ClipboardList, CreditCard, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const steps = [
  { icon: UserPlus, title: "Buka Registrasi", desc: "Masuk ke menu Registrasi melalui navigasi atas." },
  { icon: ClipboardList, title: "Isi Formulir", desc: "Lengkapi data diri dan submit untuk menyimpan pendaftaran." },
  { icon: BookUser, title: "Tunggu Konfirmasi Data", desc: "Admin akan memverifikasi data yang kamu isi." },
  { icon: CreditCard, title: "Lakukan Pembayaran", desc: "Selesaikan proses pembayaran sesuai kategori lomba." },
  { icon: BadgeCheck, title: "Konfirmasi Pembayaran", desc: "Admin akan mengkonfirmasi bukti pembayaranmu." },
  { icon: BadgeCheck, title: "Pendaftaran Selesai!", desc: "Kamu resmi terdaftar sebagai peserta. Selamat berlari!" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      <Header />

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/banner 2.webp"
          alt="Surabaya Isoplus Marathon 2025"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <div className="mb-6">
            <Image src="/logo.png" alt="Isoplus Logo" width={100} height={100} className="mx-auto drop-shadow-xl" />
          </div>
          <span className="uppercase tracking-widest text-sm font-semibold text-blue-300 mb-3">
            Wings Surya — Internal Registration
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg max-w-3xl">
            Surabaya Isoplus Marathon 2025
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
          {/* vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#263C7D]/15 hidden md:block" />

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 group">
                {/* Number bubble */}
                <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-[#263C7D] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform z-10">
                  {i + 1}
                </div>
                {/* Card */}
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

      {/* Footer strip */}
      <footer className="bg-[#263C7D] text-white/70 text-center text-xs py-5 mt-10">
        © 2025 Wings Surya — Surabaya Isoplus Marathon. All rights reserved.
      </footer>
    </main>
  );
}
