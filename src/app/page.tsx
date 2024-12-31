"use client"
import HeroHome from "@/components/HeroHome";
import { PaymentStatusModal } from "@/components/PaymentStatusModal";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function PageContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const [showPaymentModal, setShowPaymentModal] = useState(!!status);

  return (
    <>
      <HeroHome />
      <PaymentStatusModal
        open={showPaymentModal}
        setOpen={setShowPaymentModal}
        status={status}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
