import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { CardContent, CardHeader } from "../ui/card"
import LoginForm from "../AuthForms/Login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SignupForm from "../AuthForms/Signup";


interface AuthModalInterface {
  open: boolean,
  setOpen: (value: boolean) => void
}

export function AuthModal({ open, setOpen }: AuthModalInterface) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <CardHeader className="p-0">
          <DialogTitle className="text-2xl">Accedi</DialogTitle>
          <DialogDescription>
            Compila i campi per accedere al tuo account
          </DialogDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Accedi</TabsTrigger>
              <TabsTrigger value="signup">Registrati</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm setModalOpen={setOpen} />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm setModalOpen={setOpen} />
            </TabsContent>
          </Tabs>

        </CardContent>
      </DialogContent>
    </Dialog>
  )
}
