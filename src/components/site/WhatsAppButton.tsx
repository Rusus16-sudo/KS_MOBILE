"use client";

import { MessageCircle } from "lucide-react";
import { BOUTIQUE, lienWhatsApp } from "@/lib/boutique";

/**
 * Raccourci de contact permanent. WhatsApp est le canal de commande réel de
 * la boutique : il reste atteignable sans remonter en haut de page.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={lienWhatsApp(`Bonjour ${BOUTIQUE.nom}, j'aimerais un renseignement.`)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-whatsapp/20 bg-whatsapp px-4 py-3 text-sm font-semibold text-noir shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)]"
    >
      <MessageCircle size={18} aria-hidden="true" />
      <span className="hidden sm:inline">Écrire sur WhatsApp</span>
      <span className="sr-only sm:hidden">Écrire sur WhatsApp</span>
    </a>
  );
}
