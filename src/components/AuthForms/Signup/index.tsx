"use client"
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
import { registerUser } from "@/lib/strapi"
import Cookies from 'js-cookie';
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"


// Define validation schema using Zod
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Il nome deve contenere almeno due lettere' }),
    surname: z
      .string()
      .min(2, { message: 'Il cognome deve contenere almeno due lettere' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Le password non coincidono',
  })


export default function SignupForm() {
  const { refreshUser } = useUser();
  const router = useRouter();

  // const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const objToSend = {
        name: values.name,
        surname: values.surname,
        username: values.email,
        email: values.email,
        password: values.password
      }
      try {
        const response = await registerUser(objToSend);
        Cookies.set('jwt', response.jwt, { expires: 7 });
        // setError(null);
        await refreshUser();
        router.push('/statistiche-personali');
      } catch (err) {
        // setError('Username o password errati');
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
          <div className="grid gap-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-1 space-y-0">
                  <FormLabel htmlFor="name">Nome</FormLabel>
                  <FormControl>
                    <Input className="m-0" id="name" placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem className="grid gap-1 space-y-0">
                  <FormLabel htmlFor="name">Cognome</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Cognome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-1 space-y-0">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="johndoe@mail.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-1 space-y-0">
                  <FormLabel htmlFor="password">Password</FormLabel>
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

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid gap-1 space-y-0">
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

            <Button type="submit" className="w-full font-semibold">Registrati</Button>
          </div>
        </form>
      </Form>
    </>
  )
}