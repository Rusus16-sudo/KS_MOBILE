"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  ShieldCheck,
  Repeat,
  Handshake,
  MessageCircle,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import ProductCard, {
  ProductCardSkeleton,
  type Produit,
} from "@/components/site/ProductCard";
import { AuthModal } from "@/components/AuthModal";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  BOUTIQUE,
  formatPrix,
  libelleEtat,
  messageProduit,
  ouvrirWhatsApp,
  getVisuel,
  VISUEL_DEFAUT,
} from "@/lib/boutique";
import { toast } from "sonner";

// Témoignages de démonstration : à remplacer par la table `reviews` une fois
// les avis clients réels collectés.
const TEMOIGNAGES = [
  { id: 1, nom: "Jean Dupont", texte: "Excellent service et produits authentiques. Je recommande vivement.", note: 5 },
  { id: 2, nom: "Marie Nkomo", texte: "Livraison rapide et produits de qualité. Très satisfaite.", note: 5 },
  { id: 3, nom: "Pierre Mbele", texte: "Meilleure boutique de téléphones à Douala. Équipe très professionnelle.", note: 5 },
];

const SERVICES = [
  {
    icone: ShieldCheck,
    titre: "Chaque appareil est vérifié",
    texte:
      "IMEI contrôlé, batterie testée, accessoires d'origine. Vous repartez avec votre facture et la garantie.",
  },
  {
    icone: Handshake,
    titre: "Le prix se discute",
    texte:
      "Les prix sont affichés, mais proposez le vôtre sur WhatsApp. Nous répondons dans la journée.",
  },
  {
    icone: Repeat,
    titre: "Reprise de votre ancien téléphone",
    texte:
      "Apportez votre appareil en boutique : nous l'estimons et déduisons sa valeur de votre achat.",
  },
];

export default function Home() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [favoris, setFavoris] = useState<Array<string | number>>([]);
  const [formulaire, setFormulaire] = useState({ nom: "", email: "", message: "" });

  const { user, setShowAuthModal } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    let actif = true;

    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .gt("stock_quantity", 0)
        .order("created_at", { ascending: false })
        .limit(7);

      if (!actif) return;
      if (error) console.error("Chargement des produits impossible", error);
      setProduits(data ?? []);
      setChargement(false);
    })();

    return () => {
      actif = false;
    };
  }, []);

  // Le premier article en stock tient lieu de vitrine : la page d'accueil
  // montre le stock réel plutôt qu'un visuel générique.
  const vedette = produits[0];
  const selection = produits.slice(1, 7);

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

  const envoyerFormulaire = (e: React.FormEvent) => {
    e.preventDefault();
    const { nom, email, message } = formulaire;
    if (!nom || !email || !message) return;
    ouvrirWhatsApp(`Bonjour ${BOUTIQUE.nom}, je m'appelle ${nom} (${email}). ${message}`);
    setFormulaire({ nom: "", email: "", message: "" });
    toast.success("Votre message s'ouvre dans WhatsApp");
  };

  const champ = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormulaire((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="flex min-h-screen flex-col bg-noir text-foreground">
      <Header />

      <main id="contenu" className="flex-1">
        {/* --- Vitrine ------------------------------------------------------ */}
        <section className="border-b border-line">
          <motion.div
            initial="masque"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="container grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24"
          >
            <div>
              <motion.h1
                variants={apparition}
                className="display-xl max-w-[14ch] text-balance text-blanc"
              >
                Des téléphones vérifiés, des prix affichés.
              </motion.h1>

              <motion.p
                variants={apparition}
                className="prose-ks mt-6 text-lg text-muted-foreground"
              >
                Samsung, iPhone et Google Pixel, neufs et reconditionnés, en boutique à{" "}
                {BOUTIQUE.quartier}. Vous connaissez le prix avant d&apos;entrer et vous
                repartez avec votre facture.
              </motion.p>

              <motion.div variants={apparition} className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/catalogue">
                    <ShoppingBag size={18} aria-hidden="true" />
                    Voir le catalogue
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-line-strong text-blanc"
                  onClick={() =>
                    ouvrirWhatsApp(`Bonjour ${BOUTIQUE.nom}, j'aimerais un renseignement.`)
                  }
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Écrire sur WhatsApp
                </Button>
              </motion.div>

              <motion.dl
                variants={apparition}
                className="mt-10 grid gap-x-8 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-3"
              >
                <div>
                  <dt className="text-muted-foreground">Adresse</dt>
                  <dd className="mt-0.5 text-blanc">{BOUTIQUE.adresse}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Ouvert</dt>
                  <dd className="mt-0.5 text-blanc">{BOUTIQUE.horaires}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Téléphone</dt>
                  <dd className="tabular mt-0.5 text-blanc">{BOUTIQUE.telephone}</dd>
                </div>
              </motion.dl>
            </div>

            {/* L'appareil en vitrine est le premier article réellement en stock. */}
            <motion.div variants={apparition}>
              {chargement ? (
                <div className="mx-auto aspect-[4/5] w-full max-w-sm animate-pulse border border-line bg-surface lg:max-w-none" />
              ) : vedette ? (
                <VitrineProduit produit={vedette} onAjouter={ajouterAuPanier} />
              ) : (
                <VitrineVide />
              )}
            </motion.div>
          </motion.div>
        </section>

        {/* --- Ce que fait la boutique -------------------------------------- */}
        <section className="border-b border-line bg-surface">
          <div className="container grid gap-8 py-14 md:grid-cols-3">
            {SERVICES.map(({ icone: Icone, titre, texte }) => (
              <div key={titre}>
                <Icone size={22} className="text-volt" aria-hidden="true" />
                <h2 className="mt-3 text-base font-semibold text-blanc">{titre}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{texte}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Sélection ----------------------------------------------------- */}
        <section className="border-b border-line">
          <div className="container py-16 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="display-lg text-blanc">En boutique cette semaine</h2>
                <p className="prose-ks mt-2 text-muted-foreground">
                  Le stock disponible aujourd&apos;hui à {BOUTIQUE.quartier}.
                </p>
              </div>
              <Link href="/catalogue" className="text-sm text-volt hover:text-blanc">
                Tout le catalogue
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {chargement ? (
                Array.from({ length: 3 }, (_, i) => <ProductCardSkeleton key={i} />)
              ) : selection.length > 0 ? (
                selection.map((produit) => (
                  <ProductCard
                    key={produit.id}
                    produit={produit}
                    favori={favoris.includes(produit.id)}
                    onFavori={basculerFavori}
                    onAjouter={ajouterAuPanier}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">
                  Le catalogue en ligne se remplit. Passez en boutique ou écrivez-nous sur
                  WhatsApp pour connaître le stock du jour.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* --- La boutique --------------------------------------------------- */}
        <section id="boutique" className="scroll-mt-24 border-b border-line bg-surface">
          <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
            <div>
              <h2 className="display-lg text-blanc">La boutique</h2>
              <div className="prose-ks mt-5 space-y-4 text-muted-foreground">
                <p>
                  {BOUTIQUE.nom} tient boutique à {BOUTIQUE.quartier}, au cœur de{" "}
                  {BOUTIQUE.ville}. Nous vendons des smartphones neufs et reconditionnés, et
                  nous les vendons en face à face : vous manipulez l&apos;appareil, vous
                  vérifiez l&apos;IMEI avec nous, vous payez le prix convenu.
                </p>
                <p>
                  La contrefaçon est le vrai risque du marché. C&apos;est pourquoi chaque
                  appareil passe le même contrôle avant d&apos;être mis en rayon, et pourquoi
                  la facture accompagne systématiquement la vente.
                </p>
              </div>

              <ul className="mt-8 space-y-4 border-t border-line pt-6">
                {[
                  ["Paiement échelonné", "Réglez en plusieurs fois, échéancier convenu à la signature."],
                  ["Reprise", "Votre ancien téléphone est estimé en boutique et déduit du prix."],
                  ["Négociation", "Proposez votre prix sur WhatsApp, nous répondons dans la journée."],
                ].map(([titre, texte]) => (
                  <li key={titre}>
                    <h3 className="text-sm font-semibold text-blanc">{titre}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{texte}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="display-md text-blanc">Ce qu&apos;en disent nos clients</h2>
              <ul className="mt-6 space-y-4">
                {TEMOIGNAGES.map((avis) => (
                  <li key={avis.id} className="border border-line bg-noir p-5">
                    <div className="flex gap-0.5" aria-label={`Note : ${avis.note} sur 5`}>
                      {Array.from({ length: avis.note }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill="currentColor"
                          aria-hidden="true"
                          className="text-laiton"
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-blanc">{avis.texte}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{avis.nom}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --- Contact -------------------------------------------------------- */}
        <section id="contact" className="scroll-mt-24">
          <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
            <div>
              <h2 className="display-lg text-blanc">Passez nous voir</h2>
              <p className="prose-ks mt-3 text-muted-foreground">
                La boutique vous accueille {BOUTIQUE.horaires.toLowerCase()}.
              </p>

              <dl className="mt-8 space-y-5 border-t border-line pt-6">
                <Coordonnee icone={MapPin} intitule="Adresse">
                  {BOUTIQUE.adresse}
                </Coordonnee>
                <Coordonnee icone={Phone} intitule="Téléphone">
                  <a href={`tel:${BOUTIQUE.whatsapp}`} className="tabular hover:text-volt">
                    {BOUTIQUE.telephone}
                  </a>
                </Coordonnee>
                <Coordonnee icone={Mail} intitule="Email">
                  <a href={`mailto:${BOUTIQUE.email}`} className="hover:text-volt">
                    {BOUTIQUE.email}
                  </a>
                </Coordonnee>
              </dl>
            </div>

            <form onSubmit={envoyerFormulaire} className="border border-line bg-surface p-6 sm:p-8">
              <h3 className="display-md text-blanc">Écrivez-nous</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Votre message s&apos;ouvrira dans WhatsApp, prêt à envoyer.
              </p>

              <div className="mt-6 space-y-4">
                <Champ id="nom" label="Votre nom" value={formulaire.nom} onChange={champ} />
                <Champ
                  id="email"
                  type="email"
                  label="Votre email"
                  value={formulaire.email}
                  onChange={champ}
                />
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm text-blanc">
                    Votre message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formulaire.message}
                    onChange={champ}
                    placeholder="Quel appareil cherchez-vous ?"
                    className="w-full resize-none rounded-md border border-line-strong bg-noir px-4 py-3 text-sm text-blanc placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <MessageCircle size={18} aria-hidden="true" />
                  Envoyer sur WhatsApp
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <AuthModal />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const apparition = {
  masque: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/** Grande étiquette de vitrine : même grammaire que la carte produit, en plus grand. */
function VitrineProduit({
  produit,
  onAjouter,
}: {
  produit: Produit;
  onAjouter: (p: Produit) => void;
}) {
  const [visuel, setVisuel] = useState(getVisuel(produit));

  return (
    <article className="mx-auto w-full max-w-sm border border-line bg-surface lg:max-w-none">
      <div className="relative aspect-[5/4] overflow-hidden bg-raised">
        <Image
          src={visuel}
          alt={produit.name}
          fill
          priority
          quality={90}
          sizes="(min-width: 1024px) 560px, 90vw"
          className="object-contain p-8"
          onError={() => setVisuel(VISUEL_DEFAUT)}
        />
        <p className="absolute left-4 top-4 border border-laiton/40 bg-noir/80 px-2.5 py-1 text-xs text-laiton backdrop-blur">
          En vitrine
        </p>
      </div>

      <div className="p-6">
        <p className="text-xs text-muted-foreground">
          {produit.brand || produit.category || "Téléphone"}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-blanc">{produit.name}</h2>

        <hr className="my-4 border-line" />

        <p className="prix text-4xl leading-none text-laiton">{formatPrix(produit.price)}</p>
        <p className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-laiton">
            <ShieldCheck size={13} aria-hidden="true" />
            Vérifié
          </span>
          <span aria-hidden="true">·</span>
          {libelleEtat(produit.condition)}
        </p>

        <div className="mt-5 flex gap-2">
          <Button className="flex-1" onClick={() => onAjouter(produit)}>
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

function VitrineVide() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col justify-center border border-line bg-surface p-8 lg:max-w-none">
      <p className="text-blanc">Le stock en ligne arrive.</p>
      <p className="prose-ks mt-2 text-sm text-muted-foreground">
        Écrivez-nous sur WhatsApp pour savoir ce qui est disponible aujourd&apos;hui en
        boutique.
      </p>
      <Button
        className="mt-5 w-fit"
        onClick={() => ouvrirWhatsApp(`Bonjour ${BOUTIQUE.nom}, qu'avez-vous en stock ?`)}
      >
        <MessageCircle size={17} aria-hidden="true" />
        Demander le stock du jour
      </Button>
    </div>
  );
}

function Coordonnee({
  icone: Icone,
  intitule,
  children,
}: {
  icone: LucideIcon;
  intitule: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icone size={18} className="mt-0.5 shrink-0 text-volt" aria-hidden />
      <div>
        <dt className="text-sm text-muted-foreground">{intitule}</dt>
        <dd className="mt-0.5 text-blanc">{children}</dd>
      </div>
    </div>
  );
}

function Champ({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-blanc">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-line-strong bg-noir px-4 py-3 text-sm text-blanc placeholder:text-muted-foreground"
      />
    </div>
  );
}
