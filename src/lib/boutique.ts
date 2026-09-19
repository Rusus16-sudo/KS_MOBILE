/**
 * Informations de la boutique et utilitaires de commande.
 *
 * Source unique : nom, coordonnées, horaires et mise en forme des prix.
 * Avant, chaque page réécrivait le numéro WhatsApp et son propre format de
 * prix, ce qui produisait des « 1,299,000 FCFA FCFA » et des montants sans
 * devise dans le panier.
 */

export const BOUTIQUE = {
  nom: "KS Mobile",
  quartier: "Akwa",
  ville: "Douala",
  pays: "Cameroun",
  adresse: "Akwa, Douala — Cameroun",
  telephone: "+237 676 547 289",
  // Format international sans espaces ni « + », requis par les liens wa.me.
  whatsapp: "237676547289",
  email: "contact@ksmobile.cm",
  horaires: "Lundi au samedi, 8h30 – 19h",
} as const;

/** « 1 299 000 FCFA » — espaces insécables, chiffres tabulaires côté CSS. */
export function formatPrix(valeur: number | string | null | undefined): string {
  const n = toNombre(valeur);
  if (n === null) return "Prix sur demande";
  return `${n.toLocaleString("fr-FR").replace(/ | /g, " ")} FCFA`;
}

/**
 * Accepte aussi bien 1299000 que « 1,299,000 FCFA » : les produits Supabase
 * renvoient des nombres, les données de repli des chaînes déjà formatées.
 */
export function toNombre(valeur: number | string | null | undefined): number | null {
  if (typeof valeur === "number") return Number.isFinite(valeur) ? valeur : null;
  if (typeof valeur !== "string") return null;
  const chiffres = valeur.replace(/[^\d]/g, "");
  if (!chiffres) return null;
  const n = Number.parseInt(chiffres, 10);
  return Number.isFinite(n) ? n : null;
}

/** Lien wa.me avec message pré-rempli. */
export function lienWhatsApp(message: string): string {
  return `https://wa.me/${BOUTIQUE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function ouvrirWhatsApp(message: string): void {
  window.open(lienWhatsApp(message), "_blank", "noopener,noreferrer");
}

/** Message de renseignement sur un appareil précis. */
export function messageProduit(nom: string, prix?: number | string): string {
  const montant = prix === undefined ? "" : ` affiché à ${formatPrix(prix)}`;
  return `Bonjour ${BOUTIQUE.nom}, je suis intéressé par le ${nom}${montant}. Est-il disponible ?`;
}

/** Libellés d'état repris de l'énumération product_condition en base. */
export const ETATS: Record<string, string> = {
  NEW: "Neuf",
  USED: "Occasion",
  REFURBISHED: "Reconditionné",
};

export function libelleEtat(condition?: string | null): string {
  if (!condition) return ETATS.NEW;
  return ETATS[condition] ?? ETATS.NEW;
}

export const VISUEL_DEFAUT = "/appareil.svg";

/**
 * Extrait et nettoie l'URL de l'image d'un produit (gère les strings JSONifiés et les guillemets en trop)
 * pour éviter les plantages Next.js <Image /> (Failed to construct URL).
 */
export function getVisuel(produit: any): string {
  let visuel = VISUEL_DEFAUT;
  if (produit?.images && Array.isArray(produit.images) && produit.images.length > 0) {
    visuel = produit.images[0];
  } else if (typeof produit?.images === "string") {
    try {
      const parse = JSON.parse(produit.images);
      if (Array.isArray(parse) && parse.length > 0) visuel = parse[0];
      else visuel = produit.images;
    } catch {
      visuel = produit.images;
    }
  } else if (produit?.image) {
    visuel = produit.image;
  }

  if (typeof visuel !== "string" || !visuel) return VISUEL_DEFAUT;

  // Retire les guillemets au début et à la fin (cas fréquent avec postgres array en string)
  visuel = visuel.replace(/^["']|["']$/g, "");

  if (visuel.startsWith("http")) {
    try {
      new URL(visuel);
    } catch {
      return VISUEL_DEFAUT;
    }
  } else if (!visuel.startsWith("/")) {
    return VISUEL_DEFAUT;
  }
  return visuel;
}

