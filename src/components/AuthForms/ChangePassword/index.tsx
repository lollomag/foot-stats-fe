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
import { PasswordInput } from "../../ui/password-input"
import Cookies from 'js-cookie';
import { changeUserPassword } from "@/lib/strapi"

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export default function ChangePasswordForm() {
  const jwt = Cookies.get('jwt');
  const [success, setSuccess] = useState(false)

  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const objToSend = {
        currentPassword: values.currentPassword,
        password: values.password,
        passwordConfirmation: values.confirmPassword
      }
      try {
        await changeUserPassword(jwt || "", objToSend);
        
        setError(null);
        form.reset();
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 2000);
      } catch (err) {
        setError('Errore, riprova');
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
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="currentPassword">Password attuale</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="currentPassword"
                    placeholder="******"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="password">New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className={`w-full font-semibold ${success && "bg-green-800"}`}>
            {success ? "Password cambiata correttamente" : "Cambia password"}
          </Button>
          {error && <p className="text-red-600 text-center text-md font-semibold">{error}</p>}
        </form>
      </Form>
    </>
  )
}