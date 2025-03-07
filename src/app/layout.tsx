import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FootGolfStats",
  description: "Piattaforma che ti permette di monitorare le tue statistiche",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <UserProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          <CustomBreadcrumb />
          <main className="container max-w-screen-2xl mx-auto px-4 py-6 lg:px-8 min-h-[calc(100svh-150px)]">
            {children}
          </main>
        </body>
      </UserProvider>
    </html>
  );
}
