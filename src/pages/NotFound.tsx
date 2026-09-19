"use client";

import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { BOUTIQUE, ouvrirWhatsApp } from "@/lib/boutique";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-noir text-foreground">
      <Header />

      <main id="contenu" className="container flex flex-1 items-center py-20">
        <div className="max-w-xl">
          <p className="prix text-6xl leading-none text-laiton">404</p>
          <h1 className="display-lg mt-4 text-blanc">Cette page n&apos;existe pas</h1>
          <p className="prose-ks mt-4 text-muted-foreground">
            Le lien est peut-être ancien, ou l&apos;appareil que vous cherchiez a quitté le
            catalogue. Le stock du jour est dans le catalogue, et nous répondons sur WhatsApp
            si vous cherchez un modèle précis.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/catalogue">Voir le catalogue</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-line-strong text-blanc"
              onClick={() =>
                ouvrirWhatsApp(`Bonjour ${BOUTIQUE.nom}, je cherche un modèle précis :`)
              }
            >
              Demander un modèle
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
