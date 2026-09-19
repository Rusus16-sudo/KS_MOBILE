# Contexte du Projet : Boutique Téléphones Douala (KS_MOBILE)

## 🎯 Objectif du Projet
Créer un site vitrine et e-commerce premium pour une boutique de téléphones située à Akwa, Douala (Cameroun). Le site permet aux clients de consulter le catalogue (Samsung, iPhone, Google Pixel, Accessoires), d'ajouter des produits à un panier, et de finaliser leur commande facilement via WhatsApp.

## 🛠️ Stack Technique
- **Framework :** Next.js (version 16) / React 19
- **Style & UI :** Tailwind CSS v4, composants Radix UI (shadcn/ui), Framer Motion (animations), Embla Carousel
- **Backend & Base de données :** Supabase (Authentication & PostgreSQL)
- **Langage :** TypeScript / JavaScript

## ✅ Ce qui a déjà été fait (Terminé)
- **Interface Utilisateur (UI) :** Pages d'accueil (avec slider HD automatique), Catalogue avec filtrage, "Qui sommes-nous", et Contact.
- **Expérience Utilisateur (UX) :** Design responsive, thème premium (noir, bleu électrique, blanc), animations fluides.
- **Fonctionnalités Front-end :**
  - Système de panier complet géré par un `CartContext` (ajout, suppression, compteur).
  - Génération d'un message de commande formaté avec le contenu du panier.
  - Redirection automatique vers WhatsApp (+237 676547289) pour valider l'achat.

## 🚧 En cours (Où nous nous sommes arrêtés)
- **Migration Back-end (Dernier commit) :** Le projet est passé sur une architecture Next.js + Supabase pour gérer dynamiquement les données au lieu d'utiliser des données statiques.
- **Authentification :** Composants `AuthModal.tsx` et `AuthContext.tsx` en cours de création pour gérer la connexion des utilisateurs/administrateurs.
- **Base de données :** Scripts préparés pour injecter le catalogue initial dans Supabase (`seed.js`, `seed.sql`, `generate_seed_sql.js`).
- **Espace Admin :** Le layout de l'interface d'administration (`src/app/admin/layout.tsx`) est en cours d'adaptation.

## 📋 Prochaines étapes (À faire)
1. **Finaliser Supabase :** Connecter complètement l'authentification et l'affichage dynamique des produits depuis la base de données.
2. **Performances :** S'assurer de la fluidité du site et optimiser le chargement des images (indiqué dans le `todo.md`).
3. **Tests :** Vérifier minutieusement le responsive design sur tous les terminaux.
