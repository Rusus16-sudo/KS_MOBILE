import type { Metadata } from "next";
import Catalogue from "@/pages/Catalogue";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Samsung, iPhone, Google Pixel et accessoires disponibles en boutique à Akwa, Douala. Prix affichés, appareils vérifiés.",
};

export default function CataloguePage() {
  return <Catalogue />;
}
