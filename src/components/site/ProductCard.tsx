"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShieldCheck, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrix, libelleEtat, messageProduit, ouvrirWhatsApp, getVisuel, VISUEL_DEFAUT } from "@/lib/boutique";
import { cn } from "@/lib/utils";

/** Forme tolérante : les colonnes Supabase et les données de repli cohabitent. */
export interface Produit {
  id: string | number;
  name: string;
  brand?: string | null;
  category?: string | null;
  price: number | string;
  condition?: string | null;
  stock_quantity?: number | null;
  description?: string | null;
  images?: string[] | null;
  image?: string | null;
}

interface Props {
  produit: Produit;
  favori?: boolean;
  onFavori?: (id: Produit["id"]) => void;
  onAjouter?: (produit: Produit) => void;
  /** Le catalogue affiche la description, l'accueil non. */
  avecDescription?: boolean;
}

export default function ProductCard({
  produit,
  favori = false,
  onFavori,
  onAjouter,
  avecDescription = false,
}: Props) {
  const [visuel, setVisuel] = useState(getVisuel(produit));

  const marque = produit.brand || produit.category || "Téléphone";
  const etat = libelleEtat(produit.condition);
  const stock = produit.stock_quantity;
  const stockFaible = typeof stock === "number" && stock > 0 && stock <= 3;

  return (
    <article className="group flex flex-col border border-line bg-surface transition-colors hover:border-line-strong">
      <div className="relative aspect-[4/5] overflow-hidden bg-raised">
        <Image
          src={visuel}
          alt={produit.name}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setVisuel(VISUEL_DEFAUT)}
        />

        {onFavori && (
          <button
            type="button"
            onClick={() => onFavori(produit.id)}
            aria-pressed={favori}
            aria-label={
              favori
                ? `Retirer ${produit.name} des favoris`
                : `Ajouter ${produit.name} aux favoris`
            }
            className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-noir/70 text-blanc backdrop-blur transition-colors hover:bg-noir"
          >
            <Heart
              size={17}
              aria-hidden="true"
              fill={favori ? "currentColor" : "none"}
              className={favori ? "text-destructive" : ""}
            />
          </button>
        )}
      </div>

      {/* Le corps de l'étiquette : identification au-dessus du filet, prix en dessous. */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-muted-foreground">{marque}</p>
        <h3 className="mt-1 text-base font-semibold leading-snug text-blanc">{produit.name}</h3>

        {avecDescription && produit.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {produit.description}
          </p>
        )}

        <hr className="my-4 border-line" />

        <p className="prix text-[1.75rem] leading-none text-laiton">
          {formatPrix(produit.price)}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-laiton">
            <ShieldCheck size={13} aria-hidden="true" />
            Vérifié
          </span>
          <span aria-hidden="true">·</span>
          <span>{etat}</span>
          {typeof stock === "number" && (
            <>
              <span aria-hidden="true">·</span>
              <span className={cn("tabular", stockFaible && "text-blanc")}>
                {stockFaible ? `Plus que ${stock} en stock` : "En stock"}
              </span>
            </>
          )}
        </div>

        <div className="mt-5 flex gap-2 pt-1">
          <Button
            className="flex-1"
            onClick={() => onAjouter?.(produit)}
            disabled={!onAjouter}
          >
            <ShoppingBag size={17} aria-hidden="true" />
            Ajouter au panier
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Demander ${produit.name} sur WhatsApp`}
            onClick={() => ouvrirWhatsApp(messageProduit(produit.name, produit.price))}
            className="border-line-strong text-blanc hover:bg-whatsapp hover:text-noir"
          >
            <MessageCircle size={17} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}

/** Squelette de chargement — même gabarit que la carte, pas de saut de mise en page. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col border border-line bg-surface" aria-hidden="true">
      <div className="aspect-[4/5] animate-pulse bg-raised" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-3 w-16 animate-pulse rounded bg-raised" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-raised" />
        <hr className="my-1 border-line" />
        <div className="h-7 w-2/3 animate-pulse rounded bg-raised" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-raised" />
        <div className="mt-2 h-9 w-full animate-pulse rounded bg-raised" />
      </div>
    </div>
  );
}
