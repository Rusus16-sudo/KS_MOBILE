"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VentesAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .gt("stock_quantity", 0)
      .order("name");
    
    if (data) setProducts(data);
    if (error) console.error("Error fetching products", error);
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (quantity > selectedProduct.stock_quantity) {
      toast.error(`Quantité invalide. Stock disponible : ${selectedProduct.stock_quantity}`);
      return;
    }

    setLoading(true);
    try {
      const totalAmount = selectedProduct.price * quantity;

      // 1. Insert Sale
      const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert({
          total_amount: totalAmount,
          status: "PAID", // Paid physically
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // 2. Insert Sale Item
      const { error: itemError } = await supabase
        .from("sale_items")
        .insert({
          sale_id: saleData.id,
          product_id: selectedProduct.id,
          quantity: quantity,
          unit_price: selectedProduct.price,
          subtotal: totalAmount,
        });

      if (itemError) throw itemError;

      // 3. Decrement Stock
      const newStock = selectedProduct.stock_quantity - quantity;
      const { error: stockError } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", selectedProduct.id);

      if (stockError) throw stockError;

      toast.success("Vente enregistrée avec succès ! (Aucune facture générée)");
      
      // Reset form
      setSelectedProductId("");
      setQuantity(1);
      fetchProducts(); // Refresh stock
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement de la vente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-sm border border-border">
      <h1 className="text-3xl font-bold mb-6 text-accent">Enregistrer une vente</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium mb-2">Produit</label>
          <select 
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-secondary border border-border p-3 rounded-lg focus:outline-accent"
            required
          >
            <option value="" disabled>Sélectionnez un produit...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.price} FCFA (Stock: {p.stock_quantity})
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <div>
            <label className="block text-sm font-medium mb-2">Quantité</label>
            <input 
              type="number"
              min="1"
              max={selectedProduct.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-secondary border border-border p-3 rounded-lg focus:outline-accent"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Mode de paiement</label>
          <select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full bg-secondary border border-border p-3 rounded-lg focus:outline-accent"
            required
          >
            <option value="CASH">Espèces (Cash)</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="CREDIT_CARD">Carte Bancaire</option>
            <option value="INSTALLMENTS">Tranches (Crédit)</option>
          </select>
        </div>

        {selectedProduct && (
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex justify-between text-lg">
              <span>Total à payer :</span>
              <span className="font-bold text-accent">{(selectedProduct.price * quantity).toLocaleString()} FCFA</span>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading || !selectedProductId} 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6"
        >
          {loading ? "Enregistrement..." : "Valider la vente"}
        </Button>
      </form>
    </div>
  );
}
