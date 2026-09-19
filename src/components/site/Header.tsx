"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { BOUTIQUE } from "@/lib/boutique";
import { cn } from "@/lib/utils";

const LIENS = [
  { href: "/", libelle: "Accueil" },
  { href: "/catalogue", libelle: "Catalogue" },
  { href: "/#boutique", libelle: "La boutique" },
  { href: "/#contact", libelle: "Contact" },
];

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { totalArticles } = useCart();
  const { user, signOut, setShowAuthModal } = useAuth();
  const pathname = usePathname();

  // Les ancres (/#boutique) ne sont jamais « page courante » : elles pointent
  // vers une section, pas vers une route.
  const estActif = (href: string) => {
    if (!pathname || href.startsWith("/#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-noir/40 backdrop-blur-xl shadow-lg shadow-black/20 supports-[backdrop-filter]:bg-noir/40 transition-all duration-300">
      {/* Bandeau boutique : ce qu'un client de Douala veut savoir en premier. */}
      <div className="hidden border-b border-line/60 md:block">
        <div className="container flex h-8 items-center gap-6 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={12} aria-hidden="true" />
            {BOUTIQUE.adresse}
          </span>
          <span>{BOUTIQUE.horaires}</span>
          <a href={`tel:${BOUTIQUE.whatsapp}`} className="ml-auto tabular hover:text-blanc">
            {BOUTIQUE.telephone}
          </a>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="display-md text-blanc"
          style={{ fontStretch: "118%", letterSpacing: "-0.02em" }}
        >
          {BOUTIQUE.nom}
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 md:flex">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              aria-current={estActif(lien.href) ? "page" : undefined}
              className={cn(
                "text-sm transition-colors hover:text-blanc",
                estActif(lien.href) ? "text-volt" : "text-muted-foreground"
              )}
            >
              {lien.libelle}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="max-w-[140px] truncate text-sm text-muted-foreground">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-muted-foreground transition-colors hover:text-destructive"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowAuthModal(true)}
              className="hidden text-sm md:inline-flex"
            >
              Se connecter
            </Button>
          )}

          <Link
            href="/cart"
            aria-label={
              totalArticles > 0
                ? `Panier, ${totalArticles} article${totalArticles > 1 ? "s" : ""}`
                : "Panier, vide"
            }
            className="relative inline-flex size-10 items-center justify-center rounded-md text-blanc transition-colors hover:bg-raised"
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {totalArticles > 0 && (
              <span className="tabular absolute right-1 top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-laiton px-1 text-[10px] font-bold text-noir">
                {totalArticles}
              </span>
            )}
          </Link>

          {/* Menu mobile — Radix gère le piège de focus et la touche Échap. */}
          <Sheet open={menuOuvert} onOpenChange={setMenuOuvert}>
            <SheetTrigger asChild>
              <button
                aria-label="Ouvrir le menu"
                className="inline-flex size-10 items-center justify-center rounded-md text-blanc transition-colors hover:bg-raised md:hidden"
              >
                <Menu size={20} aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(20rem,85vw)] flex-col gap-0 bg-surface p-0"
            >
              <SheetHeader className="border-b border-line">
                <SheetTitle className="display-md text-left text-blanc">
                  {BOUTIQUE.nom}
                </SheetTitle>
              </SheetHeader>

              <nav aria-label="Navigation mobile" className="flex flex-col p-2">
                {LIENS.map((lien) => (
                  <SheetClose asChild key={lien.href}>
                    <Link
                      href={lien.href}
                      aria-current={estActif(lien.href) ? "page" : undefined}
                      className={cn(
                        "rounded-md px-4 py-3 text-base transition-colors hover:bg-raised",
                        estActif(lien.href) ? "text-volt" : "text-blanc"
                      )}
                    >
                      {lien.libelle}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto space-y-4 border-t border-line p-4">
                {user ? (
                  <div className="space-y-2">
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setMenuOuvert(false);
                      }}
                    >
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setMenuOuvert(false);
                      setShowAuthModal(true);
                    }}
                  >
                    Se connecter
                  </Button>
                )}

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{BOUTIQUE.adresse}</p>
                  <p>{BOUTIQUE.horaires}</p>
                  <a href={`tel:${BOUTIQUE.whatsapp}`} className="tabular hover:text-blanc">
                    {BOUTIQUE.telephone}
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
