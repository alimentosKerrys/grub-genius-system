
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Clock,
  Plus
} from "lucide-react"
import { useMesas } from "@/hooks/useMesas"

export function EstadoMesas() {
  const { mesas, loading, cambiarEstadoMesa, getTiempoOcupacion } = useMesas()

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "libre":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "ocupada":
        return "bg-red-50 border-red-200"
      case "reservada":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "libre":
        return <Badge className="bg-green-500 text-white">Libre</Badge>
      case "ocupada":
        return <Badge className="bg-red-500 text-white">Ocupada</Badge>
      case "reservada":
        return <Badge className="bg-yellow-500 text-white">Reservada</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const handleAsignarMesa = (mesaId: string) => {
    // Por ahora solo cambia el estado, más adelante se integrará con crear pedido
    cambiarEstadoMesa(mesaId, "ocupada")
  }

  const handleLiberarMesa = (mesaId: string) => {
    cambiarEstadoMesa(mesaId, "libre")
  }

  const formatHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return <div className="text-center py-8">Cargando mesas...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mesas.map((mesa) => (
        <Card 
          key={mesa.id} 
          className={`transition-colors ${getEstadoColor(mesa.estado)}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Mesa {mesa.numero}</CardTitle>
              {getEstadoBadge(mesa.estado)}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {mesa.capacidad} personas
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {mesa.estado === "ocupada" && mesa.pedido_actual && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pedido:</span>
                    <span className="text-sm">{mesa.pedido_actual.numero_pedido}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-sm font-semibold">S/ {mesa.pedido_actual.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge variant="outline" className="text-xs">
                      {mesa.pedido_actual.estado}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hora:</span>
                    <span className="text-sm">{formatHora(mesa.pedido_actual.hora_pedido)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Ocupada {getTiempoOcupacion(mesa.pedido_actual.hora_pedido)} min
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleLiberarMesa(mesa.id)}
                >
                  Liberar Mesa
                </Button>
              </>
            )}

            {mesa.estado === "libre" && (
              <Button 
                size="sm" 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleAsignarMesa(mesa.id)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Asignar Mesa
              </Button>
            )}

            {mesa.estado === "reservada" && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Mesa reservada
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => cambiarEstadoMesa(mesa.id, "ocupada")}
                >
                  Confirmar Llegada
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
