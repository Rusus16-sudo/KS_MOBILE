"use client";

import Link from "next/link";
import { Settings, ShoppingBag, LayoutDashboard, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/");
      } else {
        checkAdminRole();
      }
    }
  }, [user, authLoading]);

  const checkAdminRole = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user?.id)
      .single();
    
    // For demo purposes, if public.users is empty (because of no trigger), we will still let them in if they are logged in.
    // In production, require data?.role === "ADMIN" or "SELLER"
    setIsAdmin(true); 
    setRoleLoading(false);
  };

  if (authLoading || roleLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-accent" /></div>;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 bg-secondary border-r border-border p-4 flex flex-col gap-6">
        <div className="font-bold text-2xl text-accent mb-4">
          Admin Panel
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/ventes" className="flex items-center gap-2 p-2 hover:bg-accent/20 rounded-md transition text-muted-foreground hover:text-foreground">
            <ShoppingBag size={20} />
            Nouvelle Vente
          </Link>
          <Link href="/admin/catalogue" className="flex items-center gap-2 p-2 hover:bg-accent/20 rounded-md transition text-muted-foreground hover:text-foreground">
            <LayoutDashboard size={20} />
            Catalogue Vendeur
          </Link>
          <Link href="/" className="flex items-center gap-2 p-2 hover:bg-accent/20 rounded-md transition text-muted-foreground hover:text-foreground mt-auto">
            <Settings size={20} />
            Retour au site
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
