"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { BOUTIQUE, formatPrix, ouvrirWhatsApp } from "@/lib/boutique";
import { VISUEL_DEFAUT } from "@/lib/boutique";

export default function Cart() {
  const { cartItems, totalArticles, totalFCFA, removeFromCart, setQuantity, clearCart } =
    useCart();

  const envoyerCommande = () => {
    const lignes = cartItems
      .map(
        (a, i) =>
          `${i + 1}. ${a.name} — ${a.quantity} × ${formatPrix(a.price)} = ${formatPrix(
            a.price * a.quantity
          )}`
      )
      .join("\n");

    ouvrirWhatsApp(
      `Bonjour ${BOUTIQUE.nom}, je souhaite commander :\n\n${lignes}\n\nTotal : ${formatPrix(
        totalFCFA
      )}\n\nMerci de me confirmer la disponibilité.`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-noir text-foreground">
      <Header />

      <main id="contenu" className="container flex-1 py-12 lg:py-16">
        <h1 className="display-lg text-blanc">Mon panier</h1>

        {cartItems.length === 0 ? (
          <div className="mt-10 border border-line bg-surface p-10 text-center">
            <h2 className="display-md text-blanc">Votre panier est vide</h2>
            <p className="prose-ks mx-auto mt-3 text-sm text-muted-foreground">
              Parcourez le stock disponible en boutique, ajoutez ce qui vous intéresse, puis
              envoyez la commande sur WhatsApp.
            </p>
            <Button asChild className="mt-6">
              <Link href="/catalogue">Voir le catalogue</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
            <ul className="divide-y divide-line border border-line bg-surface">
              {cartItems.map((article) => (
                <li key={article.id} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                  <div className="relative size-20 shrink-0 overflow-hidden bg-raised sm:size-24">
                    <Image
                      src={article.image || VISUEL_DEFAUT}
                      alt={article.name}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{article.category}</p>
                    <h2 className="mt-0.5 truncate font-semibold text-blanc">
                      {article.name}
                    </h2>
                    <p className="prix mt-1.5 text-lg text-laiton">
                      {formatPrix(article.price)}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-md border border-line-strong">
                        <button
                          type="button"
                          onClick={() => setQuantity(article.id, article.quantity - 1)}
                          aria-label={`Retirer un ${article.name}`}
                          className="inline-flex size-8 items-center justify-center text-blanc hover:bg-raised"
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span
                          className="tabular w-8 text-center text-sm text-blanc"
                          aria-live="polite"
                          aria-label={`Quantité : ${article.quantity}`}
                        >
                          {article.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(article.id, article.quantity + 1)}
                          aria-label={`Ajouter un ${article.name}`}
                          className="inline-flex size-8 items-center justify-center text-blanc hover:bg-raised"
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(article.id)}
                        aria-label={`Supprimer ${article.name} du panier`}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <p className="prix hidden self-center whitespace-nowrap text-lg text-blanc sm:block">
                    {formatPrix(article.price * article.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Récapitulatif : sticky sur grand écran, il suit la liste. */}
            <aside className="border border-line bg-surface p-6 lg:sticky lg:top-28">
              <h2 className="display-md text-blanc">Récapitulatif</h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Articles</dt>
                  <dd className="tabular text-blanc">{totalArticles}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3">
                  <dt className="text-blanc">Total</dt>
                  <dd className="prix text-xl text-laiton">{formatPrix(totalFCFA)}</dd>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Le paiement se fait en boutique ou à la livraison. Envoyez la commande pour
                réserver les appareils et convenir du règlement.
              </p>

              <Button
                size="lg"
                className="mt-5 h-auto w-full whitespace-normal bg-whatsapp py-3 text-noir hover:bg-whatsapp/90"
                onClick={envoyerCommande}
              >
                <MessageCircle size={18} aria-hidden="true" />
                Envoyer la commande sur WhatsApp
              </Button>

              <Button asChild variant="outline" className="mt-3 w-full border-line-strong">
                <Link href="/catalogue">Continuer mes achats</Link>
              </Button>

              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full text-center text-sm text-muted-foreground transition-colors hover:text-destructive"
              >
                Vider le panier
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
