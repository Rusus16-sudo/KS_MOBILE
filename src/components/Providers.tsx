"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <CartProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
