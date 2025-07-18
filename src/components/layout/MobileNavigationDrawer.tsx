
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose 
} from "@/components/ui/drawer"
import { 
  Home, 
  Package, 
  ChefHat, 
  Calendar, 
  ShoppingCart, 
  TrendingUp,
  AlertTriangle,
  Users,
  ClipboardList,
  Menu,
  X
} from "lucide-react"
import { useLocation } from "react-router-dom"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Ingredientes", href: "/ingredientes", icon: Package },
  { name: "Platos & Recetas", href: "/platos", icon: ChefHat },
  { name: "Pedidos en Vivo", href: "/pedidos", icon: ClipboardList },
  { name: "Planificación", href: "/menu", icon: Calendar },
  { name: "Lista de Compras", href: "/compras", icon: ShoppingCart },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Alertas", href: "/alertas", icon: AlertTriangle },
  { name: "Fidelización", href: "/clientes", icon: Users },
]

export function MobileNavigationDrawer() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir navegación</span>
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <DrawerTitle className="text-lg font-bold">
                  Cocina Pro
                </DrawerTitle>
                <p className="text-xs text-muted-foreground">Gestión Integral</p>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="px-4 pb-6">
          <div className="grid gap-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <DrawerClose key={item.name} asChild>
                  <Button
                    variant={isActive ? "chef" : "ghost"}
                    className="w-full justify-start gap-3 h-12"
                    asChild
                  >
                    <a href={item.href}>
                      <Icon className="w-5 h-5" />
                      <span className="text-base">{item.name}</span>
                    </a>
                  </Button>
                </DrawerClose>
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
