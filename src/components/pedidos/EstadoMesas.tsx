
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Clock, 
  DollarSign,
  Plus
} from "lucide-react"

interface Mesa {
  id: string
  numero: number
  capacidad: number
  estado: "libre" | "ocupada" | "reservada"
  tiempoOcupacion?: number
  pedidoActual?: {
    numero: string
    total: number
    estado: string
  }
}

// Datos simulados - en producción vendrán de Supabase
const mesasSimuladas: Mesa[] = [
  {
    id: "1",
    numero: 1,
    capacidad: 4,
    estado: "libre"
  },
  {
    id: "2", 
    numero: 2,
    capacidad: 4,
    estado: "libre"
  },
  {
    id: "3",
    numero: 3,
    capacidad: 6,
    estado: "ocupada",
    tiempoOcupacion: 25,
    pedidoActual: {
      numero: "P-001",
      total: 52.00,
      estado: "pendiente"
    }
  },
  {
    id: "4",
    numero: 4,
    capacidad: 2,
    estado: "libre"
  },
  {
    id: "5",
    numero: 5,
    capacidad: 4,
    estado: "ocupada",
    tiempoOcupacion: 45,
    pedidoActual: {
      numero: "P-004",
      total: 38.00,
      estado: "preparando"
    }
  },
  {
    id: "6",
    numero: 6,
    capacidad: 8,
    estado: "reservada"
  }
]

export function EstadoMesas() {
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

  const asignarMesa = (mesaId: string) => {
    console.log(`Asignar mesa ${mesaId}`)
    // Aquí se implementará la lógica para asignar mesa
  }

  const liberarMesa = (mesaId: string) => {
    console.log(`Liberar mesa ${mesaId}`)
    // Aquí se implementará la lógica para liberar mesa
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mesasSimuladas.map((mesa) => (
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
            {mesa.estado === "ocupada" && mesa.pedidoActual && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pedido:</span>
                    <span className="text-sm">{mesa.pedidoActual.numero}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-sm font-semibold">S/ {mesa.pedidoActual.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge variant="outline" className="text-xs">
                      {mesa.pedidoActual.estado}
                    </Badge>
                  </div>
                </div>

                {mesa.tiempoOcupacion && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Ocupada {mesa.tiempoOcupacion} min
                  </div>
                )}

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => liberarMesa(mesa.id)}
                >
                  Liberar Mesa
                </Button>
              </>
            )}

            {mesa.estado === "libre" && (
              <Button 
                size="sm" 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => asignarMesa(mesa.id)}
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
                  onClick={() => asignarMesa(mesa.id)}
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
