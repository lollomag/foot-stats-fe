"use client"
import { Menu, LogOut, CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { logoutUser } from "@/lib/auth";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { isAuthenticated, refreshUser } = useUser();

  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isLoginPage = pathname === "/login";

  const handleLogout = async () => {
    logoutUser();
    await refreshUser();
    router.push('/');
  };

  const navigation = [
    { name: "Preferiti", href: "preferiti" },
    { name: "Giocatori", href: "giocatori" },
    { name: "Confronta giocatori", href: "confronta-giocatori" }
  ];

  return (
    <>
      <header className="sticky top-0 bg-green-800 text-white">
        <nav className="max-w-screen-2xl mx-auto px-4 py-4 lg:px-8 border-b-2 border-black flex items-center justify-between">
          <Link href={"/"}>
            <span className="sr-only">FootStats</span>
            <p className="text-3xl font-extrabold">FootStats</p>
          </Link>

          {isAuthenticated && (
            <button onClick={() => setIsOpen(!isOpen)} className="flex md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          )}

          {isAuthenticated && (
            <div className="hidden md:flex md:gap-x-12 items-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-md font-semibold transition-all hover:underline"
                >
                  {item.name}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    {/* <AvatarImage src={user?.picture || ""} /> */}
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={"/profilo"} className="w-100"><CircleUserRound /> Profilo</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut /> Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {!isAuthenticated && !isLoginPage && (
            <Link href={"/accedi"}>Accedi</Link>
          )}
        </nav>

        {/* mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side={"left"} className="w-80">
            <SheetHeader>
              <Link href="/">
                <span className="sr-only">FootStats</span>
                <p className="text-3xl font-extrabold">FootStats</p>
              </Link>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}