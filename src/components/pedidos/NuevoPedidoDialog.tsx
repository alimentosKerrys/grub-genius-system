
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Users, Truck, ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NuevoPedidoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipo: "local" | "delivery" | "para_llevar"
}

interface PlatoMenu {
  id: string
  nombre: string
  categoria: string
  precio: number
  descripcion?: string
  tiempoPreparacion: number
  combinable: boolean
}

interface ItemPedido {
  plato: PlatoMenu
  cantidad: number
  observaciones?: string
}

// Datos simulados del menú del día - en producción vendrán de Supabase
const menuDelDia: PlatoMenu[] = [
  {
    id: "1",
    nombre: "Olluquito con Carne",
    categoria: "guisos",
    precio: 18.00,
    descripcion: "Con carne de res y olluco fresco",
    tiempoPreparacion: 25,
    combinable: true
  },
  {
    id: "2", 
    nombre: "Ají de Pollo",
    categoria: "guisos",
    precio: 16.00,
    descripcion: "Pollo en salsa de ají amarillo",
    tiempoPreparacion: 20,
    combinable: true
  },
  {
    id: "3",
    nombre: "Chicharrón de Pollo",
    categoria: "frituras",
    precio: 19.00,
    descripcion: "Pollo crocante y jugoso",
    tiempoPreparacion: 15,
    combinable: false
  },
  {
    id: "4",
    nombre: "Tallarín Saltado",
    categoria: "tallarines",
    precio: 15.00,
    descripcion: "Con pollo y verduras",
    tiempoPreparacion: 18,
    combinable: true
  },
  {
    id: "5",
    nombre: "Seco de Pollo",
    categoria: "guisos", 
    precio: 17.00,
    descripcion: "Con culantro y frejoles",
    tiempoPreparacion: 30,
    combinable: true
  }
]

export function NuevoPedidoDialog({ open, onOpenChange, tipo }: NuevoPedidoDialogProps) {
  const { toast } = useToast()
  const [items, setItems] = useState<ItemPedido[]>([])
  const [mesaSeleccionada, setMesaSeleccionada] = useState("")
  const [cliente, setCliente] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [observaciones, setObservaciones] = useState("")

  const getTipoIcon = () => {
    switch (tipo) {
      case "local":
        return <Users className="w-5 h-5 text-blue-600" />
      case "delivery":
        return <Truck className="w-5 h-5 text-green-600" />
      case "para_llevar":
        return <ShoppingBag className="w-5 h-5 text-orange-600" />
    }
  }

  const getTipoTitulo = () => {
    switch (tipo) {
      case "local":
        return "Nuevo Pedido - Mesa"
      case "delivery":
        return "Nuevo Pedido - Delivery"
      case "para_llevar":
        return "Nuevo Pedido - Para Llevar"
    }
  }

  const agregarItem = (plato: PlatoMenu) => {
    const itemExistente = items.find(item => item.plato.id === plato.id)
    
    if (itemExistente) {
      setItems(items.map(item => 
        item.plato.id === plato.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      setItems([...items, { plato, cantidad: 1 }])
    }
  }

  const actualizarCantidad = (platoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      setItems(items.filter(item => item.plato.id !== platoId))
    } else {
      setItems(items.map(item => 
        item.plato.id === platoId 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ))
    }
  }

  const calcularTotal = () => {
    return items.reduce((total, item) => total + (item.plato.precio * item.cantidad), 0)
  }

  const guardarPedido = async () => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un plato al pedido",
        variant: "destructive"
      })
      return
    }

    if (tipo === "local" && !mesaSeleccionada) {
      toast({
        title: "Error", 
        description: "Debe seleccionar una mesa",
        variant: "destructive"
      })
      return
    }

    if (tipo !== "local" && !cliente) {
      toast({
        title: "Error",
        description: "Debe ingresar el nombre del cliente",
        variant: "destructive"
      })
      return
    }

    // Aquí se implementará la lógica para guardar en Supabase
    console.log("Guardar pedido:", {
      tipo,
      mesa: mesaSeleccionada,
      cliente,
      telefono,
      direccion,
      items,
      total: calcularTotal(),
      observaciones
    })

    toast({
      title: "Pedido creado",
      description: `Pedido ${tipo} registrado exitosamente`,
    })

    // Limpiar formulario y cerrar
    setItems([])
    setMesaSeleccionada("")
    setCliente("")
    setTelefono("")
    setDireccion("")
    setObservaciones("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTipoIcon()}
            {getTipoTitulo()}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel Izquierdo - Información del Pedido */}
          <div className="space-y-4">
            {tipo === "local" && (
              <div className="space-y-2">
                <Label htmlFor="mesa">Mesa</Label>
                <Select value={mesaSeleccionada} onValueChange={setMesaSeleccionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mesa 1 (4 personas)</SelectItem>
                    <SelectItem value="2">Mesa 2 (4 personas)</SelectItem>
                    <SelectItem value="4">Mesa 4 (2 personas)</SelectItem>
                    <SelectItem value="6">Mesa 6 (8 personas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {tipo !== "local" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Número de teléfono"
                  />
                </div>
              </>
            )}

            {tipo === "delivery" && (
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Dirección completa para delivery"
                  rows={2}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Observaciones especiales del pedido"
                rows={3}
              />
            </div>

            {/* Resumen del Pedido */}
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={item.plato.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium">{item.plato.nombre}</div>
                        <div className="text-sm text-muted-foreground">
                          S/ {item.plato.precio.toFixed(2)} c/u
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => actualizarCantidad(item.plato.id, item.cantidad - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => actualizarCantidad(item.plato.id, item.cantidad + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <div className="w-20 text-right font-semibold">
                          S/ {(item.plato.precio * item.cantidad).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>S/ {calcularTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Panel Derecho - Menú del Día */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Menú del Día</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {menuDelDia.map((plato) => (
                <Card key={plato.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{plato.nombre}</h4>
                          {plato.combinable && (
                            <Badge variant="secondary" className="text-xs">
                              Combinable
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {plato.descripcion}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {plato.tiempoPreparacion} min • {plato.categoria}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg mb-2">
                          S/ {plato.precio.toFixed(2)}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => agregarItem(plato)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={guardarPedido}
            className="bg-green-600 hover:bg-green-700"
            disabled={items.length === 0}
          >
            Crear Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
