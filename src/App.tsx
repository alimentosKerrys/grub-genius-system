
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Ingredientes from "./pages/Ingredientes";
import Platos from "./pages/Platos";
import Pedidos from "./pages/Pedidos";
import Planificacion from "./pages/Planificacion";
import Compras from "./pages/Compras";
import Analytics from "./pages/Analytics";
import Alertas from "./pages/Alertas";
import Clientes from "./pages/Clientes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ingredientes" element={<Ingredientes />} />
          <Route path="/platos" element={<Platos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/menu" element={<Planificacion />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
