"use client"
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <>
      <Button variant={"link"} onClick={() => router.back()} className="p-0 mb-5"><ArrowLeftCircle /> Indietro</Button>
      {children}
    </>
  );
}
