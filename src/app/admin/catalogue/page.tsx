"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Plus, Upload, X } from "lucide-react";

export default function CatalogueAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Samsung");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [condition, setCondition] = useState("NEW");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setProducts(data);
    if (error) console.error(error);
    setLoading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = null;
      if (file) {
        // Generate random string for image name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
          
        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("products").insert({
        name,
        brand,
        price: parseFloat(price),
        stock_quantity: parseInt(stock, 10),
        condition,
        images: imageUrl ? [imageUrl] : [],
      });

      if (error) throw error;
      toast.success("Produit ajouté au catalogue !");
      
      // Reset form
      setName(""); setPrice(""); setStock(""); setFile(null); setIsAdding(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de l'ajout du produit.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Produit supprimé.");
      fetchProducts();
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleOutOfStock = async (id: string) => {
    try {
      const { error } = await supabase.from("products").update({ stock_quantity: 0 }).eq("id", id);
      if (error) throw error;
      toast.success("Produit marqué en rupture de stock.");
      fetchProducts();
    } catch (err) {
      toast.error("Erreur de mise à jour.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-accent">Gestion du Catalogue</h1>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-accent hover:bg-accent/90">
          {isAdding ? <><X size={18} className="mr-2"/> Annuler</> : <><Plus size={18} className="mr-2"/> Ajouter un Produit</>}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-card p-6 rounded-xl border border-border">
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du Produit</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-secondary border border-border p-2 rounded focus:outline-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marque</label>
              <select value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-secondary border border-border p-2 rounded focus:outline-accent">
                <option value="Samsung">Samsung</option>
                <option value="iPhone">iPhone</option>
                <option value="Google Pixel">Google Pixel</option>
                <option value="Accessoires">Accessoires</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
              <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-secondary border border-border p-2 rounded focus:outline-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantité en Stock</label>
              <input type="number" required value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-secondary border border-border p-2 rounded focus:outline-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">État</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full bg-secondary border border-border p-2 rounded focus:outline-accent">
                <option value="NEW">Neuf</option>
                <option value="REFURBISHED">Reconditionné</option>
                <option value="USED">Occasion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image du Produit</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full bg-secondary border border-border p-1.5 rounded focus:outline-accent file:bg-accent file:text-accent-foreground file:border-0 file:py-1 file:px-3 file:rounded cursor-pointer" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={uploading} className="w-full bg-accent hover:bg-accent/90">
                {uploading ? "Enregistrement..." : "Créer le produit"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement des produits...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-card rounded-lg overflow-hidden border border-border flex flex-col">
              <div className="h-48 bg-secondary flex items-center justify-center overflow-hidden">
                {p.images && p.images[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-muted-foreground">Pas d'image</span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${p.stock_quantity > 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                    Stock: {p.stock_quantity}
                  </span>
                </div>
                <p className="text-accent font-bold text-xl mb-4">{p.price.toLocaleString()} FCFA</p>
                
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={() => handleOutOfStock(p.id)}
                    disabled={p.stock_quantity === 0}
                  >
                    <AlertTriangle size={16} className="mr-1" /> Rupture
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 size={16} className="mr-1" /> Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-secondary/30 rounded-lg">
              Aucun produit dans le catalogue. Commencez par en ajouter un.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
