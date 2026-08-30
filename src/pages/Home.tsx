import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, MessageCircle, MapPin, Phone, Mail, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

const SLIDER_IMAGES = [
  { id: 1, src: "/samsung-s24.jpg", alt: "Samsung Galaxy S24 Ultra", title: "Samsung Galaxy S24 Ultra" },
  { id: 2, src: "/iphone-15-pro.jpg", alt: "iPhone 15 Pro Max", title: "iPhone 15 Pro Max" },
  { id: 3, src: "/pixel-8-pro.jpg", alt: "Google Pixel 8 Pro", title: "Google Pixel 8 Pro" },
];

const PRODUCTS_NEW = [
  {
    id: 1,
    name: "Samsung Galaxy S24 Ultra",
    category: "Samsung",
    price: "1,299,000 FCFA",
    image: "/samsung-s24.jpg",
    badge: "Nouveau",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    category: "iPhone",
    price: "1,599,000 FCFA",
    image: "/iphone-15-pro.jpg",
    badge: "Nouveau",
  },
  {
    id: 3,
    name: "Google Pixel 8 Pro",
    category: "Google Pixel",
    price: "999,000 FCFA",
    image: "/pixel-8-pro.jpg",
    badge: "Nouveau",
  },
];

const PRODUCTS_BEST = [
  {
    id: 4,
    name: "Samsung Galaxy A54",
    category: "Samsung",
    price: "599,000 FCFA",
    image: "/samsung-s24.jpg",
    rating: 4.8,
  },
  {
    id: 5,
    name: "iPhone 14 Pro",
    category: "iPhone",
    price: "999,000 FCFA",
    image: "/iphone-15-pro.jpg",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Google Pixel 7a",
    category: "Google Pixel",
    price: "499,000 FCFA",
    image: "/pixel-8-pro.jpg",
    rating: 4.7,
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Jean Dupont",
    text: "Excellent service et produits authentiques. Je recommande vivement!",
    rating: 5,
  },
  {
    id: 2,
    name: "Marie Nkomo",
    text: "Livraison rapide et produits de qualité. Très satisfait!",
    rating: 5,
  },
  {
    id: 3,
    name: "Pierre Mbele",
    text: "Meilleure boutique de téléphones à Douala. Équipe très professionnelle.",
    rating: 5,
  },
];

import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [cartNotification, setCartNotification] = useState<string | null>(null);
  
  // Real data state
  const [productsNew, setProductsNew] = useState<any[]>([]);
  const [productsBest, setProductsBest] = useState<any[]>([]);
  
  const { cartItems, addToCart } = useCart();
  const router = useRouter();
  const setLocation = router.push;

  useEffect(() => {
    fetchProducts();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .gt("stock_quantity", 0)
      .order("created_at", { ascending: false })
      .limit(6);
      
    if (data) {
      // Split mock data logic for New vs Best (e.g. first 3 are new, next 3 are best)
      setProductsNew(data.slice(0, 3));
      setProductsBest(data.slice(3, 6));
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      const message = `Bonjour, je m'appelle ${formData.name}. ${formData.message}`;
      const whatsappUrl = `https://wa.me/237676547289?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      setFormData({ name: "", email: "", message: "" });
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 3000);
    }
  };

  const handleWhatsApp = (productName: string) => {
    const message = `Bonjour, je suis intéressé par le ${productName}. Pouvez-vous me donner plus d'informations?`;
    const whatsappUrl = `https://wa.me/237676547289?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    });
    setCartNotification(`${product.name} ajoute au panier!`);
    setTimeout(() => setCartNotification(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cart Notification */}
      {cartNotification && (
        <div className="fixed top-20 right-4 bg-accent text-accent-foreground px-4 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top">
          {cartNotification}
        </div>
      )}
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-accent">📱 TeleBoutique</div>
          <div className="hidden md:flex gap-8">
            <a href="/" className="hover:text-accent transition">Accueil</a>
            <a href="/catalogue" className="hover:text-accent transition">Catalogue</a>
            <a href="/#about" className="hover:text-accent transition">À propos</a>
            <a href="/#contact" className="hover:text-accent transition">Contact</a>
          </div>
          <button
            onClick={() => setLocation("/cart")}
            className="relative p-2 hover:bg-secondary rounded-lg transition"
          >
            <ShoppingCart size={24} className="text-accent" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Slider */}
      <section id="home" className="relative h-screen max-h-96 md:max-h-screen overflow-hidden bg-secondary">
        <div className="relative w-full h-full">
          {SLIDER_IMAGES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Les meilleurs smartphones premium à Douala
                </p>
                <a href="/catalogue">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Voir nos produits
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
        >
          →
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDER_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentSlide ? "bg-accent w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Nouveautés Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Nouveautés
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Découvrez les derniers modèles de smartphones premium
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productsNew.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20"
              >
                <div className="relative h-64 overflow-hidden bg-secondary">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {product.badge || "Nouveau"}
                  </div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
                  >
                    <Heart
                      size={20}
                      fill={favorites.includes(product.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-accent mb-2">{product.brand}</p>
                  <h3 className="text-xl font-bold mb-4">{product.name}</h3>
                  <p className="text-2xl font-bold text-accent mb-4">{product.price.toLocaleString()} FCFA</p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => handleWhatsApp(product.name)}
                    >
                      <MessageCircle size={18} className="mr-2" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meilleures Ventes Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Meilleures Ventes
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Les modèles les plus populaires et appréciés par nos clients
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productsBest.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20"
              >
                <div className="relative h-64 overflow-hidden bg-background">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
                  >
                    <Heart
                      size={20}
                      fill={favorites.includes(product.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-accent mb-2">{product.brand}</p>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"}
                        className="text-accent"
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">({product.rating || 5})</span>
                  </div>
                  <p className="text-2xl font-bold text-accent mb-4">{product.price.toLocaleString()} FCFA</p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => handleWhatsApp(product.name)}
                    >
                      <MessageCircle size={18} className="mr-2" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avis Clients */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Avis Clients
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Ce que nos clients pensent de nous
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="bg-card rounded-lg p-8 border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" className="text-accent" />
                  ))}
                </div>
                <p className="text-lg mb-6 text-muted-foreground italic">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À Propos */}
      <section id="about" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Qui Sommes-Nous?</h2>
              <p className="text-lg text-muted-foreground mb-4">
                TeleBoutique est votre partenaire de confiance pour l'achat de smartphones premium à Douala. Depuis 2018, nous proposons les meilleures marques mondiales avec un service irréprochable.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Situés à Akwa, nous offrons une expérience d'achat unique avec des produits authentiques garantis et une équipe d'experts prête à vous conseiller.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-accent text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Produits Authentiques</h3>
                    <p className="text-muted-foreground">Tous nos produits sont garantis 100% authentiques</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-accent text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Service Rapide</h3>
                    <p className="text-muted-foreground">Livraison et service après-vente rapides</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-accent text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Fiabilité</h3>
                    <p className="text-muted-foreground">Des années d'expérience et de confiance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-8 border border-border">
              <h3 className="text-2xl font-bold mb-6">Nos Marques</h3>
              <div className="space-y-4">
                {["Samsung", "iPhone", "Google Pixel", "Accessoires Premium"].map((brand) => (
                  <div key={brand} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-lg">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Nous Contacter
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Posez-nous vos questions, nous sommes là pour vous aider
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="text-accent mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">Localisation</h3>
                  <p className="text-muted-foreground">Akwa, Douala - Cameroun</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-accent mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">Téléphone</h3>
                  <p className="text-muted-foreground">+237 676 547 289</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-accent mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">Email</h3>
                  <p className="text-muted-foreground">contact@teleboutique.cm</p>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => handleWhatsApp("information")}
              >
                <MessageCircle size={20} className="mr-2" />
                Contactez-nous sur WhatsApp
              </Button>
            </div>

            <form className="space-y-4 bg-card rounded-lg p-8 border border-border" onSubmit={handleFormSubmit}>
              {formSubmitted && (
                <div className="bg-accent/20 border border-accent text-accent p-3 rounded-lg text-sm">
                  Envoyé avec succès sur WhatsApp!
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Votre nom"
                  className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-accent outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-accent outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Votre message..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-accent outline-none transition"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TeleBoutique</h3>
              <p className="text-muted-foreground">Votre boutique de téléphones premium à Douala</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navigation</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#home" className="hover:text-accent transition">Accueil</a></li>
                <li><a href="#catalogue" className="hover:text-accent transition">Catalogue</a></li>
                <li><a href="#about" className="hover:text-accent transition">À propos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>+237 676 547 289</li>
                <li>contact@teleboutique.cm</li>
                <li>Akwa, Douala</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Réseaux Sociaux</h4>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition">Instagram</a>
                <a href="https://wa.me/237676547289" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition">WhatsApp</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TeleBoutique. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
