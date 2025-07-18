
import { AppLayout } from "@/components/layout/AppLayout"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { AlertCard } from "@/components/dashboard/AlertCard"
import { MenuToday } from "@/components/dashboard/MenuToday"
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Users,
  ShoppingCart,
  ChefHat,
  ClipboardList,
  Calendar,
  AlertTriangle
} from "lucide-react"

const Index = () => {
  return (
    <AppLayout 
      title="Dashboard - Cocina Pro" 
      description="Gestión integral de tu negocio de comida"
    >
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Menu Today - Takes 2 columns */}
        <MenuToday />
        
        {/* Alerts - Takes 1 column */}
        <AlertCard />
      </div>

      {/* Quick Actions Grid - Navegación rápida móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a 
          href="/pedidos"
          className="p-6 rounded-lg bg-gradient-warm text-white shadow-warm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up"
        >
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Pedidos en Vivo</h3>
          </div>
          <p className="text-white/80 text-sm">
            Gestiona pedidos en tiempo real - Mesas, Delivery y Para Llevar
          </p>
        </a>
        
        <a 
          href="/platos"
          className="p-6 rounded-lg bg-gradient-fresh text-white shadow-fresh hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up" 
          style={{ animationDelay: "0.1s" } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 mb-3">
            <ChefHat className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Platos & Recetas</h3>
          </div>
          <p className="text-white/80 text-sm">
            Gestiona tu carta de platos y recetas con cálculo de costos
          </p>
        </a>
        
        <a 
          href="/ingredientes"
          className="p-6 rounded-lg bg-gradient-spice text-black shadow-subtle hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up" 
          style={{ animationDelay: "0.2s" } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 mb-3">
            <Package className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Ingredientes</h3>
          </div>
          <p className="text-black/70 text-sm">
            Controla inventario y recibe alertas de stock bajo
          </p>
        </a>

        <a 
          href="/menu"
          className="p-6 rounded-lg bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up" 
          style={{ animationDelay: "0.3s" } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Planificación</h3>
          </div>
          <p className="text-white/80 text-sm">
            Planifica el menú semanal y optimiza compras
          </p>
        </a>
        
        <a 
          href="/compras"
          className="p-6 rounded-lg bg-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up" 
          style={{ animationDelay: "0.4s" } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 mb-3">
            <ShoppingCart className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Lista de Compras</h3>
          </div>
          <p className="text-white/80 text-sm">
            Genera automáticamente la lista basada en el menú
          </p>
        </a>
        
        <a 
          href="/alertas"
          className="p-6 rounded-lg bg-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-slide-up" 
          style={{ animationDelay: "0.5s" } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Alertas</h3>
          </div>
          <p className="text-white/80 text-sm">
            Monitorea stock bajo y alertas importantes
          </p>
        </a>
      </div>
    </AppLayout>
  )
}

export default Index;
