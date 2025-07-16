
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"
import { 
  Home, 
  Package, 
  ChefHat, 
  Calendar, 
  ShoppingCart, 
  TrendingUp,
  AlertTriangle,
  Users
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Ingredientes", href: "/ingredientes", icon: Package },
  { name: "Platos & Recetas", href: "/platos", icon: ChefHat },
  { name: "Planificación", href: "/menu", icon: Calendar },
  { name: "Lista de Compras", href: "/compras", icon: ShoppingCart },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Alertas", href: "/alertas", icon: AlertTriangle },
  { name: "Fidelización", href: "/clientes", icon: Users },
]

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  
  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Cocina Pro
              </h2>
              <p className="text-xs text-muted-foreground">Gestión Integral</p>
            </div>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "chef" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive 
                      ? "shadow-warm" 
                      : "hover:bg-accent/50"
                  )}
                  asChild
                >
                  <a href={item.href}>
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </a>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
