import dayjs from "dayjs"
import 'dayjs/locale/it';
import Stripe from "stripe";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PaymentsInfo({ paymentData }: any) {
  const endDate = new Date(paymentData.subscriptions[0].current_period_end * 1000);
  const getSubscriptionType = () => {
    switch (paymentData.subscriptions[0].plan.interval) {
      case "year":
        return "Annuale"
      case "month":
        return "Mensile"
    }
  }

  const getCreationDate = (date: number) => {
    const creationDate = new Date(date * 1000);
    return dayjs(creationDate).locale("it").format("DD MMMM YYYY")
  }

  const getStatusLabel = () => {
    switch (paymentData.subscriptions[0].status) {
      case "active":
        return "Attivo"
      case "canceled":
        return "Annullato (non si rinnoverà)"
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
        <div className="border p-4 rounded">
          <p className="text-sm font-medium">Rinnovo automatico:</p>
          <p className="text-lg font-semibold">{paymentData.subscriptions[0].cancel_at_period_end ? "NO" : "SI"}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm font-medium">Prossimo Pagamento:</p>
          <p className="text-lg font-semibold">{dayjs(endDate).format("DD/MM/YYYY")}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm font-medium">Storico Pagamenti:</p>
          <ul className="list-disc pl-6">
            {paymentData.payments.map((payment: Stripe.PaymentIntent) => (
              <li key={payment.id}>{getCreationDate(payment.created)} - {payment.amount / 100}€</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}