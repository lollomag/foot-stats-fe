"use client"
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const isLoginPage = pathname === "/login";

  const navigation = [
    { name: "Features", href: "#" },
    { name: "Resources", href: "#" },
    { name: "Docs", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6 lg:px-8">
      <nav className="flex items-center justify-between">
        <Link href="/">
          <span className="sr-only">FootStats</span>
          <p className="text-3xl font-extrabold">FootStats</p>
        </Link>

        {isLogged && (
          <button onClick={() => setIsOpen(!isOpen)} className="flex md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        )}

        {isLogged && (
          <div className="hidden md:flex md:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground transition-all hover:text-foreground/80"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {!isLogged && !isLoginPage && (
          <div className="">
            <Button asChild>
              <Link href={"/login"}>Accedi</Link>
            </Button>
          </div>
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
  )
}