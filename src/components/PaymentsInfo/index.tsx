import dayjs from "dayjs"
import 'dayjs/locale/it';
import Stripe from "stripe";
import { Button } from "../ui/button";
import ConfirmActionModal from "../Modals/ConfirmActionModal";
import { useState } from "react";
import { postChangeRenew } from "@/lib/strapi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PaymentsInfo({ paymentData }: any) {
  const [showAutoRenewModal, setShowAutoRenewModal] = useState<boolean>(false);
  const [autoRenewStatus, setAutoRenewStatus] = useState<boolean>(paymentData?.subscriptions[0]?.cancel_at_period_end);

  const getSubscriptionType = () => {
    switch (paymentData.subscriptions[0].plan.interval) {
      case "year":
        return "Annuale"
      case "month":
        return "Mensile"
    }
  }

  const getFormatDate = (date: number) => {
    const creationDate = new Date(date * 1000);
    return dayjs(creationDate).locale("it").format("DD MMMM YYYY")
  }

  const getStatusLabel = () => {
    switch (paymentData?.subscriptions[0]?.status) {
      case "active":
        return "Attivo"
      case "canceled":
        return "Annullato (non si rinnoverà)"
    }
  }

  const changeRenew = async () => {
    try {
      const result = await postChangeRenew(paymentData.subscriptions[0].id, paymentData.subscriptions[0].cancel_at_period_end);
      setAutoRenewStatus(result.subscription.cancel_at_period_end);
      setShowAutoRenewModal(false);
    } catch (error) {
      console.error("error:", error);
    }
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Riepilogo Abbonamento</h2>
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <p className="text-sm font-medium">Stato:</p>
          <p className="text-lg font-semibold">{getStatusLabel()}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm font-medium">Tipo di Abbonamento:</p>
          <p className="text-lg font-semibold">{getSubscriptionType()}</p>
        </div>
        <div className="border p-4 rounded flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Rinnovo automatico:</p>
            <p className="text-lg font-semibold">{autoRenewStatus ? "NO" : "SI"}</p>
          </div>
          <Button className="font-semibold" onClick={() => setShowAutoRenewModal(true)}>Modifica</Button>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm font-medium">Prossimo Pagamento:</p>
          <p className="text-lg font-semibold">{getFormatDate(paymentData.subscriptions[0].current_period_end)}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm font-medium">Storico Pagamenti:</p>
          <ul className="list-disc pl-6">
            {paymentData.payments.map((payment: Stripe.PaymentIntent) => (
              <li key={payment.id}>{getFormatDate(payment.created)} - {payment.amount / 100}€</li>
            ))}
          </ul>
        </div>
      </div>
      <ConfirmActionModal
        title="Modifica rinnovo automatico"
        description={`Sei sicuro di voler ${paymentData.subscriptions[0].cancel_at_period_end ? "aggiungere" : "rimuovere"} il rinnovo automatico del tuo abbonamento ?`}
        open={showAutoRenewModal}
        setOpen={setShowAutoRenewModal}
        onConfirm={changeRenew}
      />
    </>
  )
}