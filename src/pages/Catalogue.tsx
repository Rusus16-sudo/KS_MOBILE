"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import ProductCard, {
  ProductCardSkeleton,
  type Produit,
} from "@/components/site/ProductCard";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { BOUTIQUE, toNombre, ouvrirWhatsApp, VISUEL_DEFAUT, getVisuel } from "@/lib/boutique";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = ["Tous", "Samsung", "iPhone", "Google Pixel", "Accessoires"] as const;

const TRIS = [
  { cle: "recent", libelle: "Les plus récents" },
  { cle: "prix-croissant", libelle: "Prix croissant" },
  { cle: "prix-decroissant", libelle: "Prix décroissant" },
] as const;

type CleTri = (typeof TRIS)[number]["cle"];

export default function Catalogue() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  const [categorie, setCategorie] = useState<string>("Tous");
  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState<CleTri>("recent");
  const [favoris, setFavoris] = useState<Array<string | number>>([]);

  const { user, setShowAuthModal } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    let actif = true;

    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .gt("stock_quantity", 0)
        .order("created_at", { ascending: false });

      if (!actif) return;
      if (error) {
        console.error("Chargement du catalogue impossible", error);
        setErreur(true);
      }
      setProduits(data ?? []);
      setChargement(false);
    })();

    return () => {
      actif = false;
    };
  }, []);

  const resultats = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    const filtres = produits.filter((p) => {
      const famille = p.brand || p.category || "";
      const bonneCategorie = categorie === "Tous" || famille === categorie;
      if (!bonneCategorie) return false;
      if (!terme) return true;
      return `${p.name} ${famille} ${p.description ?? ""}`.toLowerCase().includes(terme);
    });

    if (tri === "recent") return filtres;

    const sens = tri === "prix-croissant" ? 1 : -1;
    return [...filtres].sort(
      (a, b) => ((toNombre(a.price) ?? 0) - (toNombre(b.price) ?? 0)) * sens
    );
  }, [produits, categorie, recherche, tri]);

  const basculerFavori = (id: Produit["id"]) =>
    setFavoris((liste) =>
      liste.includes(id) ? liste.filter((f) => f !== id) : [...liste, id]
    );

  const ajouterAuPanier = (produit: Produit) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    addToCart({
      id: produit.id,
      name: produit.name,
      price: produit.price,
      category: produit.brand || produit.category || "Téléphone",
      image: getVisuel(produit),
    });
    toast.success(`${produit.name} ajouté au panier`);
  };

  const filtresActifs = categorie !== "Tous" || recherche.trim() !== "";

  return (
    <div className="flex min-h-screen flex-col bg-noir text-foreground">
      <Header />

      <main id="contenu" className="flex-1">
        <section className="border-b border-line">
          <div className="container py-12 lg:py-16">
            <h1 className="display-lg text-blanc">Catalogue</h1>
            <p className="prose-ks mt-3 text-muted-foreground">
              Tout ce qui est en rayon aujourd&apos;hui à {BOUTIQUE.quartier}. Les prix sont
              fermes à l&apos;affichage et négociables sur WhatsApp.
            </p>
          </div>
        </section>

        {/* Barre de filtres : reste accessible pendant le défilement de la grille. */}
        <section className="sticky top-16 z-40 border-b border-white/5 bg-noir/40 backdrop-blur-xl shadow-md">
          <div className="container flex flex-col gap-3 py-4 lg:flex-row lg:items-center">
            <div className="relative lg:w-72">
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un modèle"
                aria-label="Rechercher un modèle"
                className="w-full rounded-md border border-line-strong bg-surface py-2.5 pl-9 pr-3 text-sm text-blanc placeholder:text-muted-foreground"
              />
            </div>

            <div
              role="group"
              aria-label="Filtrer par marque"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategorie(c)}
                  aria-pressed={categorie === c}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors",
                    categorie === c
                      ? "border-volt bg-volt text-noir"
                      : "border-line-strong text-muted-foreground hover:text-blanc"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="lg:ml-auto">
              <label htmlFor="tri" className="sr-only">
                Trier les résultats
              </label>
              <select
                id="tri"
                value={tri}
                onChange={(e) => setTri(e.target.value as CleTri)}
                className="w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-sm text-blanc lg:w-auto"
              >
                {TRIS.map((t) => (
                  <option key={t.cle} value={t.cle}>
                    {t.libelle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="container py-10 lg:py-14">
          {!chargement && !erreur && (
            <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
              <span className="tabular">{resultats.length}</span>{" "}
              {resultats.length > 1 ? "appareils disponibles" : "appareil disponible"}
              {filtresActifs && (
                <button
                  type="button"
                  onClick={() => {
                    setCategorie("Tous");
                    setRecherche("");
                  }}
                  className="ml-3 inline-flex items-center gap-1 text-volt hover:text-blanc"
                >
                  <X size={13} aria-hidden="true" />
                  Effacer les filtres
                </button>
              )}
            </p>
          )}

          {chargement ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : erreur ? (
            <EtatVide
              titre="Le catalogue ne répond pas"
              texte="La connexion à notre stock a échoué. Réessayez dans un instant, ou demandez-nous la disponibilité sur WhatsApp."
              action="Demander sur WhatsApp"
            />
          ) : resultats.length === 0 ? (
            <EtatVide
              titre={
                filtresActifs ? "Aucun appareil ne correspond" : "Le catalogue en ligne se remplit"
              }
              texte={
                filtresActifs
                  ? "Élargissez la recherche, ou dites-nous le modèle que vous cherchez : nous le trouvons souvent sous 48 h."
                  : "Nos appareils ne sont pas encore tous en ligne. Écrivez-nous pour connaître le stock du jour."
              }
              action="Dire ce que je cherche"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resultats.map((produit) => (
                <ProductCard
                  key={produit.id}
                  produit={produit}
                  favori={favoris.includes(produit.id)}
                  onFavori={basculerFavori}
                  onAjouter={ajouterAuPanier}
                  avecDescription
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <AuthModal />
    </div>
  );
}

function EtatVide({
  titre,
  texte,
  action,
}: {
  titre: string;
  texte: string;
  action: string;
}) {
  return (
    <div className="border border-line bg-surface p-10 text-center">
      <h2 className="display-md text-blanc">{titre}</h2>
      <p className="prose-ks mx-auto mt-3 text-sm text-muted-foreground">{texte}</p>
      <Button
        className="mt-6"
        onClick={() =>
          ouvrirWhatsApp(`Bonjour ${BOUTIQUE.nom}, je cherche un modèle précis :`)
        }
      >
        {action}
      </Button>
    </div>
  );
}
