
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Truck, 
  ShoppingBag, 
  Clock, 
  ChefHat,
  Plus
} from "lucide-react"
import { NuevoPedidoDialog } from "./NuevoPedidoDialog"
import { ListaPedidos } from "./ListaPedidos"
import { EstadoMesas } from "./EstadoMesas"

export function PedidosEnVivo() {
  const [nuevoPedidoOpen, setNuevoPedidoOpen] = useState(false)
  const [tipoNuevoPedido, setTipoNuevoPedido] = useState<"local" | "delivery" | "para_llevar">("local")

  // Datos simulados - en producción vendrán de la base de datos
  const estadisticas = {
    pedidosPendientes: 3,
    pedidosPreparando: 2,
    pedidosListos: 1,
    tiempoPromedioPreparacion: 18
  }

  const handleNuevoPedido = (tipo: "local" | "delivery" | "para_llevar") => {
    setTipoNuevoPedido(tipo)
    setNuevoPedidoOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Panel de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.pedidosPendientes}</div>
            <p className="text-xs text-muted-foreground">Esperando preparación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparando</CardTitle>
            <ChefHat className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.pedidosPreparando}</div>
            <p className="text-xs text-muted-foreground">En cocina</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listos</CardTitle>
            <Badge className="bg-green-500">●</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.pedidosListos}</div>
            <p className="text-xs text-muted-foreground">Para entregar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.tiempoPromedioPreparacion}m</div>
            <p className="text-xs text-muted-foreground">Preparación</p>
          </CardContent>
        </Card>
      </div>

      {/* Botones de Acción Rápida */}
      <div className="flex gap-3">
        <Button 
          onClick={() => handleNuevoPedido("local")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Users className="w-4 h-4" />
          <Plus className="w-4 h-4" />
          Mesa
        </Button>
        
        <Button 
          onClick={() => handleNuevoPedido("delivery")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Truck className="w-4 h-4" />
          <Plus className="w-4 h-4" />
          Delivery
        </Button>
        
        <Button 
          onClick={() => handleNuevoPedido("para_llevar")}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
        >
          <ShoppingBag className="w-4 h-4" />
          <Plus className="w-4 h-4" />
          Para Llevar
        </Button>
      </div>

      {/* Contenido Principal en Tabs */}
      <Tabs defaultValue="pedidos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pedidos">Lista de Pedidos</TabsTrigger>
          <TabsTrigger value="mesas">Estado de Mesas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pedidos" className="space-y-4">
          <ListaPedidos />
        </TabsContent>
        
        <TabsContent value="mesas" className="space-y-4">
          <EstadoMesas />
        </TabsContent>
      </Tabs>

      {/* Dialog para Nuevo Pedido */}
      <NuevoPedidoDialog 
        open={nuevoPedidoOpen}
        onOpenChange={setNuevoPedidoOpen}
        tipo={tipoNuevoPedido}
      />
    </div>
  )
}
