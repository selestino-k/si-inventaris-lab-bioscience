import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SI Inventaris Lab Bioscience",
  description: "Sistem Informasi Inventaris Lab Bioscience - UPT Laboratorium Terpadu Universitas Nusa Cendana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
   
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>  
          <main className="gap-3 w-full">
            <div className="flex w-full min-h-screen items-center justify-items-center">
              {children}
            </div>
          </main>
      </body>
    </html>
    

  );
}


