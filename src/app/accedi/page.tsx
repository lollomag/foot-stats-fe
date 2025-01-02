import LoginForm from "@/components/AuthForms/Login";
import SignupForm from "@/components/AuthForms/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const LoginPage = () => {

  return (
    <div className="container max-w-[500px] mx-auto my-8">
      {/* <h1 className="text-2xl font-bold mb-4">Reimposta Password</h1> */}
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Accedi</TabsTrigger>
          <TabsTrigger value="signup">Registrati</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginPage;
