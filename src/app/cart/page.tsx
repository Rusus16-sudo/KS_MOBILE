import type { Metadata } from "next";
import Cart from "@/pages/Cart";

export const metadata: Metadata = {
  title: "Mon panier",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <Cart />;
}
