
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
  Eye,
  UtensilsCrossed
} from "lucide-react"
import { usePedidos } from "@/hooks/usePedidos"

export function ListaPedidos() {
  const { pedidos, loading, cambiarEstadoPedido } = usePedidos()

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

  const formatHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return <div className="text-center py-8">Cargando pedidos...</div>
  }

  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => (
        <Card key={pedido.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTipoIcon(pedido.tipo_pedido)}
                <div>
                  <CardTitle className="text-lg">{pedido.numero_pedido}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pedido.tipo_pedido === "local" && pedido.mesa && `Mesa ${pedido.mesa.numero}`}
                    {pedido.tipo_pedido !== "local" && pedido.cliente_nombre}
                    {pedido.cliente_telefono && ` • ${pedido.cliente_telefono}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getEstadoBadge(pedido.estado)}
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatHora(pedido.hora_pedido)}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Items del Pedido */}
            <div className="space-y-2">
              {pedido.items.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {item.es_menu ? (
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                            {item.cantidad}x Menú Ejecutivo
                          </div>
                          <div className="text-sm text-muted-foreground ml-6">
                            • Entrada: {item.entrada?.nombre || 'Por seleccionar'}
                          </div>
                          <div className="text-sm text-muted-foreground ml-6">
                            • Plato: {item.plato.nombre}
                          </div>
                        </div>
                      ) : (
                        <div className="font-medium">{item.cantidad}x {item.plato.nombre}</div>
                      )}
                      {item.observaciones && (
                        <div className="text-sm text-orange-600 italic">{item.observaciones}</div>
                      )}
                    </div>
                    <div className="font-semibold">
                      S/ {item.es_menu ? 
                        (item.precio_menu! * item.cantidad).toFixed(2) : 
                        (item.precio_unitario * item.cantidad).toFixed(2)
                      }
                    </div>
                  </div>
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
                    onClick={() => cambiarEstadoPedido(pedido.id, "preparando")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ChefHat className="w-4 h-4 mr-1" />
                    Iniciar
                  </Button>
                )}
                
                {pedido.estado === "preparando" && (
                  <Button 
                    size="sm" 
                    onClick={() => cambiarEstadoPedido(pedido.id, "listo")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Listo
                  </Button>
                )}
                
                {pedido.estado === "listo" && (
                  <Button 
                    size="sm" 
                    onClick={() => cambiarEstadoPedido(pedido.id, "entregado")}
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
            {pedido.tiempo_preparacion && pedido.tiempo_preparacion > 0 && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Tiempo estimado: {pedido.tiempo_preparacion} minutos
              </div>
            )}

            {/* Observaciones del pedido */}
            {pedido.observaciones && (
              <div className="text-sm bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                <strong>Observaciones:</strong> {pedido.observaciones}
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
