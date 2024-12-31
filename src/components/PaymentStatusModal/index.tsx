import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { CardContent, CardHeader } from "../ui/card"
import Link from "next/link";

interface PaymentStatusModalInterface {
  open: boolean,
  setOpen?: (value: boolean) => void,
  status: string | null
}

export function PaymentStatusModal({ open, setOpen, status }: PaymentStatusModalInterface) {
  const ConfirmPayment = () => {
    return (
      <>
        <p>Pagamento andato a buon fine !</p>
        <Link href={"/statistiche-personali"}>Vai alle tue statistiche</Link>
      </>
    )
  }

  const ErrorPayment = () => {
    return (
      <>
        <p>Errore nel pagamento !</p>
        <Link href={"/iscriviti"}>Riprova</Link>
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <CardHeader className="p-0">
          <DialogTitle className="text-2xl">Pagamento concluso</DialogTitle>
        </CardHeader>
        <CardContent className="p-0">
          {status === "OK" && <ConfirmPayment />}
          {status === "KO" && <ErrorPayment />}
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}
