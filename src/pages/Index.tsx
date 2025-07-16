import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { AlertCard } from "@/components/dashboard/AlertCard"
import { MenuToday } from "@/components/dashboard/MenuToday"
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Users,
  ShoppingCart,
  ChefHat
} from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block fixed inset-y-0 z-50 w-64">
          <div className="flex h-full flex-col bg-sidebar-background border-r border-sidebar-border">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex-1">
          <Header />
          
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
                Dashboard - Cocina Pro
              </h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Gestión integral de tu negocio de comida
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Ventas del Día"
                value="S/ 1,248"
                description="75 platos vendidos"
                icon={DollarSign}
                trend={{ value: "12%", isPositive: true }}
                variant="warm"
                className="animate-scale-in"
              />
              
              <MetricCard
                title="Margen Bruto"
                value="64%"
                description="Promedio semanal"
                icon={TrendingUp}
                trend={{ value: "3%", isPositive: true }}
                variant="fresh"
                className="animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              />
              
              <MetricCard
                title="Stock Activo"
                value="127"
                description="Ingredientes disponibles"
                icon={Package}
                trend={{ value: "5", isPositive: false }}
                variant="spice"
                className="animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              />
              
              <MetricCard
                title="Clientes Hoy"
                value="89"
                description="Nuevos: 12"
                icon={Users}
                trend={{ value: "8%", isPositive: true }}
                variant="default"
                className="animate-scale-in"
                style={{ animationDelay: "0.3s" }}
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Today - Takes 2 columns */}
              <MenuToday />
              
              {/* Alerts - Takes 1 column */}
              <AlertCard />
            </div>

            {/* Quick Actions Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-gradient-warm text-white shadow-warm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up">
                <div className="flex items-center gap-3 mb-3">
                  <ChefHat className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Crear Nuevo Plato</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Agrega un nuevo plato al menú con cálculo automático de costos
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-gradient-fresh text-white shadow-fresh hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up" style={{ animationDelay: "0.1s" } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingCart className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Lista de Compras</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Genera automáticamente la lista basada en el menú planificado
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-gradient-spice text-black shadow-subtle hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up" style={{ animationDelay: "0.2s" } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Gestionar Stock</h3>
                </div>
                <p className="text-black/70 text-sm">
                  Controla inventario y recibe alertas de stock bajo
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Index;
