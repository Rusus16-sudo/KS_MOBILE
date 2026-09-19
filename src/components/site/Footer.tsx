import Link from "next/link";
import { BOUTIQUE, lienWhatsApp } from "@/lib/boutique";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="display-md text-blanc" style={{ fontStretch: "118%" }}>
            {BOUTIQUE.nom}
          </p>
          <p className="prose-ks mt-3 text-sm text-muted-foreground">
            Boutique de téléphones à {BOUTIQUE.quartier}, {BOUTIQUE.ville}. Chaque appareil est
            vérifié avant la vente, le prix est affiché, et vous repartez avec votre facture.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-blanc">Boutique</h2>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link href="/catalogue" className="hover:text-blanc">
                Catalogue
              </Link>
            </li>
            <li>
              <Link href="/#boutique" className="hover:text-blanc">
                La boutique
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-blanc">
                Nous écrire
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-blanc">
                Mon panier
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-blanc">Nous joindre</h2>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>{BOUTIQUE.adresse}</li>
            <li>{BOUTIQUE.horaires}</li>
            <li>
              <a href={`tel:${BOUTIQUE.whatsapp}`} className="tabular hover:text-blanc">
                {BOUTIQUE.telephone}
              </a>
            </li>
            <li>
              <a href={`mailto:${BOUTIQUE.email}`} className="hover:text-blanc">
                {BOUTIQUE.email}
              </a>
            </li>
            <li>
              <a
                href={lienWhatsApp(`Bonjour ${BOUTIQUE.nom}, j'ai une question.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blanc"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BOUTIQUE.nom} — {BOUTIQUE.ville}, {BOUTIQUE.pays}
          </p>
          <p>Prix en francs CFA, taxes comprises</p>
        </div>
      </div>
    </footer>
  );
}
