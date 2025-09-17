import { LoadingProvider } from "@/components/loadingContext";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // metadataBase: new URL('http://localhost:3000'),
  metadataBase: new URL('https://isoplusrun.wingssurya.com/apis'),
  title: 'Isoplus Run',
  description: 'Your app description',
  icons: {
    icon: '/isoplus.png', // Favicon
    shortcut: '/isoplus.png',
    apple: '/isoplus.png', // iOS homescreen
  },
  openGraph: {
    title: 'Isoplus Run',
    description: 'Isoplus Run Registration',
    images: [
      {
        url: '/isoplus.png', // OG Image
        width: 1200,
        height: 630,
        alt: 'Your App Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider refetchOnWindowFocus={false}>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </SessionProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
