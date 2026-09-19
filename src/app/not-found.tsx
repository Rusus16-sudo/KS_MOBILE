import type { Metadata } from "next";
import NotFound from "@/pages/NotFound";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFoundPage() {
  return <NotFound />;
}
