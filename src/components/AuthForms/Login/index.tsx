"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import { PasswordInput } from "../../ui/password-input"
import { loginUser } from "@/lib/strapi"
import Cookies from 'js-cookie';
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

const formSchema = z.object({
  email: z.string(),
  password: z.string()
});

export default function LoginForm() {
  const { refreshUser } = useUser();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const objToSend = {
        identifier: values.email,
        password: values.password
      }
      try {
        const response = await loginUser(objToSend);
        Cookies.set('jwt', response.jwt, { expires: 7 });
        setError(null);
        await refreshUser();
        router.push('/giocatori');
      } catch (err) {
        setError('Username o password errati');
        console.log(err);
      }
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-0">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inserire email"

                    type="email"
                    {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )} />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          {error && <p className="text-red-600 text-center text-md font-semibold">{error}</p>}
          <Button type="submit" className="w-full font-semibold bg-green-800">Accedi</Button>
          <p className="text-sm text-center">Password dimenticata ? <Link href={"/password-dimenticata"} className="underline hover:no-underline">Recupera password</Link></p>
        </form>
      </Form>
    </>
  )
}