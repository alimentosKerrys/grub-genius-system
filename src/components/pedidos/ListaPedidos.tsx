
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Clock, 
  Users, 
  Truck, 
  ShoppingBag, 
  ChefHat,
  CheckCircle,
  Eye
} from "lucide-react"

interface Pedido {
  id: string
  numero: string
  tipo: "local" | "delivery" | "para_llevar"
  estado: "pendiente" | "preparando" | "listo" | "entregado"
  mesa?: number
  cliente?: string
  telefono?: string
  hora: string
  items: Array<{
    plato: string
    cantidad: number
    precio: number
    observaciones?: string
  }>
  total: number
  tiempoEstimado: number
}

// Datos simulados - en producción vendrán de Supabase
const pedidosSimulados: Pedido[] = [
  {
    id: "1",
    numero: "P-001",
    tipo: "local",
    estado: "pendiente",
    mesa: 3,
    hora: "12:15",
    items: [
      { plato: "Olluquito con Carne", cantidad: 2, precio: 18.00 },
      { plato: "Ají de Pollo", cantidad: 1, precio: 16.00, observaciones: "+huevo" }
    ],
    total: 52.00,
    tiempoEstimado: 25
  },
  {
    id: "2", 
    numero: "P-002",
    tipo: "delivery",
    estado: "preparando",
    cliente: "María González",
    telefono: "987654321",
    hora: "12:08",
    items: [
      { plato: "Seco de Pollo", cantidad: 3, precio: 17.00 },
      { plato: "Chicharrón de Pollo", cantidad: 1, precio: 19.00 }
    ],
    total: 70.00,
    tiempoEstimado: 15
  },
  {
    id: "3",
    numero: "P-003", 
    tipo: "para_llevar",
    estado: "listo",
    cliente: "Carlos Mendoza",
    telefono: "123456789",
    hora: "11:55",
    items: [
      { plato: "Tallarín Saltado", cantidad: 2, precio: 15.00 }
    ],
    total: 30.00,
    tiempoEstimado: 0
  }
]

export function ListaPedidos() {
  const [pedidos] = useState<Pedido[]>(pedidosSimulados)

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pendiente</Badge>
      case "preparando":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Preparando</Badge>
      case "listo":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Listo</Badge>
      case "entregado":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Entregado</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "local":
        return <Users className="w-4 h-4 text-blue-600" />
      case "delivery":
        return <Truck className="w-4 h-4 text-green-600" />
      case "para_llevar":
        return <ShoppingBag className="w-4 h-4 text-orange-600" />
      default:
        return null
    }
  }

  const cambiarEstado = (pedidoId: string, nuevoEstado: string) => {
    console.log(`Cambiar pedido ${pedidoId} a ${nuevoEstado}`)
    // Aquí se implementará la lógica para actualizar en Supabase
  }

  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => (
        <Card key={pedido.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTipoIcon(pedido.tipo)}
                <div>
                  <CardTitle className="text-lg">{pedido.numero}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pedido.tipo === "local" && `Mesa ${pedido.mesa}`}
                    {pedido.tipo !== "local" && pedido.cliente}
                    {pedido.telefono && ` • ${pedido.telefono}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getEstadoBadge(pedido.estado)}
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pedido.hora}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Items del Pedido */}
            <div className="space-y-2">
              {pedido.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">{item.cantidad}x {item.plato}</div>
                    {item.observaciones && (
                      <div className="text-sm text-orange-600 italic">{item.observaciones}</div>
                    )}
                  </div>
                  <div className="font-semibold">S/ {item.precio.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Total y Acciones */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">
                Total: S/ {pedido.total.toFixed(2)}
              </div>
              
              <div className="flex gap-2">
                {pedido.estado === "pendiente" && (
                  <Button 
                    size="sm" 
                    onClick={() => cambiarEstado(pedido.id, "preparando")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ChefHat className="w-4 h-4 mr-1" />
                    Iniciar
                  </Button>
                )}
                
                {pedido.estado === "preparando" && (
                  <Button 
                    size="sm" 
                    onClick={() => cambiarEstado(pedido.id, "listo")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Listo
                  </Button>
                )}
                
                {pedido.estado === "listo" && (
                  <Button 
                    size="sm" 
                    onClick={() => cambiarEstado(pedido.id, "entregado")}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Entregado
                  </Button>
                )}

                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => console.log("Ver detalles", pedido.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tiempo Estimado */}
            {pedido.tiempoEstimado > 0 && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Tiempo estimado: {pedido.tiempoEstimado} minutos
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {pedidos.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay pedidos activos</h3>
            <p className="text-muted-foreground">Los nuevos pedidos aparecerán aquí automáticamente</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
