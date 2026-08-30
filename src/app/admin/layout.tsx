import Link from "next/link";
import { Settings, ShoppingBag, LayoutDashboard } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
