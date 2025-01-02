import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ConfirmActionModalInterface {
  title: string,
  description: string,
  open: boolean,
  setOpen: (value: boolean) => void,
  onConfirm: () => void
}

export default function ConfirmActionModal({ title, description, open, setOpen, onConfirm }: ConfirmActionModalInterface) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-lg font-medium my-4">{description}</p>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="font-semibold">
              Annulla
            </Button>
          </DialogClose>
          <Button type="button" variant="default" className="font-semibold" onClick={onConfirm}>
            Conferma
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}