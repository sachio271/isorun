import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, BookUser, ClipboardList, CreditCard, UserPlus } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      <Header />
      <section className="relative h-[300px] w-full overflow-hidden">
        <Image
          src="/banner 2.jpg"
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold">Welcome to ISOPLUS</h1>
          <p className="mt-2 text-lg">Website pendaftaran internal karyawan wings surya</p>
        </div>
      </section>

      <section className="py-16 px-4 md:px-10" id="how-to-register">
        <h2 className="text-3xl font-bold text-center mb-10">How to Register</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: UserPlus, title: "Step 1", desc: "Open registration menu" },
            { icon: ClipboardList, title: "Step 2", desc: "Input all required fields" },
            { icon: BookUser, title: "Step 3", desc: "Wait admin to confirm your data" },
            { icon: BadgeCheck, title: "Step 4", desc: "Proceed to payment" },
            { icon: CreditCard, title: "Step 5", desc: "Wait admin to confirm your payment" },
            { icon: "✅", title: "Step 6", desc: "Done! You're registered." },
          ].map((step, index) => (
            <Card key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#263C7D] font-bold">
                  {typeof step.icon === "string" ? (
                    <span className="text-xl">{step.icon}</span>
                  ) : (
                    <step.icon className="w-5 h-5 text-[#263C7D]" />
                  )}
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>{step.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="p-6 md:p-12 grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Quick Access</h2>
          <ul className="space-y-2">
            <li><a href="/register" className="text-blue-600 hover:underline">Register Account</a></li>
            <li><a href="/findwork" className="text-blue-600 hover:underline">Find Work</a></li>
            <li><a href="/post" className="text-blue-600 hover:underline">Post a Job</a></li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Contact & Support</h2>
          <p className="text-gray-600">Need help? Reach out to our support team for assistance.</p>
          <a href="/contact" className="mt-2 inline-block text-blue-600 hover:underline">Contact Us</a>
        </div>
      </section>
    </main>
  );
}
