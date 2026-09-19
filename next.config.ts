import type { NextConfig } from "next";

/**
 * Les photos produits vivent dans le bucket Supabase `product-images`.
 * next/image refuse tout hôte distant non déclaré, on autorise donc
 * uniquement le projet Supabase configuré — pas de joker ouvert.
 */
const hoteSupabase = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: [
      ...(hoteSupabase
        ? [
            {
              protocol: "https" as const,
              hostname: hoteSupabase,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      // Visuels de remplacement tant que la boutique n'a pas photographié
      // son propre stock. À retirer une fois les vraies photos en place.
      {
        protocol: "https" as const,
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
