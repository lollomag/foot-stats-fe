"use client"
import { Menu, LogOut, CircleUserRound, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { logoutUser } from "@/lib/auth";
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";

export default function Header() {
  const { user, isAuthenticated, refreshUser } = useUser();

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
    { name: "Giocatori", href: "/giocatori" },
    { name: "Tornei", href: "/tornei" },
    { name: "Ranking", href: "/ranking" }
  ];

  return (
    <>
      <header className="sticky top-0 bg-green-800 text-white z-50">
        <nav className="max-w-screen-2xl mx-auto px-4 py-4 lg:px-8 border-b-2 border-black flex items-center justify-between">
          <Link href={"/"}>
            <span className="sr-only">FootStats</span>
            <p className="text-3xl font-extrabold">FootStats</p>
          </Link>

          <button onClick={() => setIsOpen(!isOpen)} className="flex md:hidden">
            <Menu className="w-6 h-6" />
          </button>

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
            {isAuthenticated && (
              <Link href={"/preferiti"} className="text-md font-semibold transition-all hover:underline">Preferiti</Link>
            )}
            {!isAuthenticated && !isLoginPage && (
              <Link href={"/accedi"} className="text-md font-semibold transition-all hover:underline">Accedi</Link>
            )}
            {isAuthenticated && (
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
                  {user.role.name === "SuperAdmin" && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={"/carica-torneo"} className="w-100"><Upload /> Torneo</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={"/carica-giocatori"} className="w-100"><Upload /> Giocatori</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={"/carica-ranking"} className="w-100"><Upload /> Ranking</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut /> Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>

        {/* mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side={"left"} className="w-80">
            <SheetHeader className="text-left h-full">
              <Link href="/" className="mb-10">
                <span className="sr-only">FootStats</span>
                <p className="text-3xl font-extrabold">FootStats</p>
              </Link>
              <SheetTitle className="sr-only">Menù di navigazione laterale</SheetTitle>
              <div className="flex flex-col gap-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-md font-semibold transition-all hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {isAuthenticated && (
                  <>
                    <Link href={"/preferiti"} className="text-md font-semibold transition-all hover:underline">Preferiti</Link>
                    <Link href={"/profilo"} className="text-md font-semibold transition-all hover:underline">Profilo</Link>
                  </>
                )}
              </div>
              {!isAuthenticated && !isLoginPage ? (
                <Link href={"/accedi"} className="!mt-auto text-md font-semibold transition-all hover:underline">Accedi</Link>
              ) : (
                <Button onClick={() => handleLogout()} className="!mt-auto"><LogOut /> Esci</Button>
              )}

            </SheetHeader>
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}