import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingCart, Heart, Star, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabaseClient";

const CATEGORIES = ["Tous", "Samsung", "iPhone", "Google Pixel", "Accessoires"];

export default function Catalogue() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Real data state
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart } = useCart();
  const router = useRouter();
  const setLocation = router.push;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .gt("stock_quantity", 0)
      .order("created_at", { ascending: false });
    
    if (data) setProducts(data);
    if (error) console.error("Error fetching products", error);
    setLoading(false);
  };

  const filteredProducts = selectedCategory === "Tous"
    ? products
    : products.filter((p) => p.brand === selectedCategory || p.category === selectedCategory);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
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
      price: `${product.price.toLocaleString()} FCFA`,
      category: product.category || product.brand,
      image: product.images?.[0] || "/placeholder.jpg",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="text-2xl font-bold text-accent">📱 TeleBoutique</a>
          <div className="hidden md:flex gap-8">
            <a href="/" className="hover:text-accent transition">Accueil</a>
            <a href="/catalogue" className="text-accent">Catalogue</a>
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

      {/* Header */}
      <section className="bg-secondary border-b border-border py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notre Catalogue</h1>
          <p className="text-lg text-muted-foreground">
            Découvrez notre large gamme de smartphones premium et accessoires
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-background border-b border-border py-6 sticky top-16 z-40">
        <div className="container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Catégories</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 text-accent"
            >
              <Filter size={20} />
              Filtres
            </button>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-5 gap-2 ${showFilters ? "block" : "hidden md:grid"}`}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border hover:border-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-secondary">
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

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-accent mb-2">{product.category}</p>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>

                  {/* Specs */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Caractéristiques:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.specs?.slice(0, 3).map((spec: string, i: number) => (
                        <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"}
                          className="text-accent"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating || 5} ({product.reviews || 0} avis)
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-2xl font-bold text-accent mb-4">{product.price.toLocaleString()} FCFA</p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
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

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Aucun produit trouvé dans cette catégorie</p>
            </div>
          )}
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
                <li><a href="/" className="hover:text-accent transition">Accueil</a></li>
                <li><a href="/catalogue" className="hover:text-accent transition">Catalogue</a></li>
                <li><a href="/#about" className="hover:text-accent transition">À propos</a></li>
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
