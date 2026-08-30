import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { Trash2, ArrowLeft, MessageCircle } from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const setLocation = router.push;

  // Extraire les prix numériques
  const extractPrice = (priceString: string | number): number => {
    if (typeof priceString === "number") return priceString;
    const digits = priceString.replace(/[^\d]/g, "");
    return parseInt(digits, 10) || 0;
  };

  // Calculer le total
  const total = cartItems.reduce((sum, item) => sum + extractPrice(item.price), 0);

  // Formater le total avec séparateurs de milliers
  const formatPrice = (price: number): string => {
    return price.toLocaleString("fr-FR");
  };

  // Créer le message WhatsApp avec tous les produits
  const createWhatsAppMessage = (): string => {
    let message = "Bonjour! Je souhaite commander les produits suivants:\n\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.category})\n   Prix: ${item.price}\n\n`;
    });
    message += `\nTotal: ${formatPrice(total)} FCFA\n\nMerci!`;
    return message;
  };

  const handleSendOrder = () => {
    const message = createWhatsAppMessage();
    const whatsappUrl = `https://wa.me/237676547289?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:text-accent transition"
          >
            <ArrowLeft size={24} />
            <span>Retour</span>
          </button>
          <div className="text-2xl font-bold text-accent">📱 TeleBoutique</div>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          🛒 Mon Panier
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-6">Votre panier est vide</p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Continuer vos achats
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="grid gap-4 mb-8">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-secondary rounded-lg border border-border hover:border-accent transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-accent font-semibold">{item.category}</p>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-accent text-lg font-semibold">{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="p-2 hover:bg-destructive/20 rounded-lg transition text-destructive"
                    title="Supprimer du panier"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-secondary p-6 rounded-lg border border-border mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Nombre d'articles:</span>
                <span className="text-2xl font-bold text-accent">{cartItems.length}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-3xl font-bold text-accent">{formatPrice(total)} FCFA</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={handleSendOrder}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground py-4 md:py-6 text-sm md:text-base lg:text-lg font-semibold flex items-center justify-center gap-2 whitespace-normal"
              >
                <MessageCircle size={18} className="md:w-5 md:h-5" />
                <span className="text-center">Envoyer la commande via WhatsApp</span>
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="flex-1 py-4 md:py-6 text-sm md:text-base lg:text-lg font-semibold whitespace-normal"
              >
                Continuer vos achats
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
