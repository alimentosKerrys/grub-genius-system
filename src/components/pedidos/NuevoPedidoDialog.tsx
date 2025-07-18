
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
import { Plus, Minus, Users, Truck, ShoppingBag, UtensilsCrossed } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMenuData } from "@/hooks/useMenuData"
import { useMesas } from "@/hooks/useMesas"
import { supabase } from "@/integrations/supabase/client"

interface NuevoPedidoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipo: "local" | "delivery" | "para_llevar"
}

interface ItemPedido {
  plato_id: string
  plato_nombre: string
  plato_precio: number
  cantidad: number
  es_menu: boolean
  entrada_id?: string
  entrada_nombre?: string
  observaciones?: string
}

export function NuevoPedidoDialog({ open, onOpenChange, tipo }: NuevoPedidoDialogProps) {
  const { toast } = useToast()
  const { entradas, platos, menus } = useMenuData()
  const { mesas } = useMesas()
  
  const [items, setItems] = useState<ItemPedido[]>([])
  const [mesaSeleccionada, setMesaSeleccionada] = useState("")
  const [cliente, setCliente] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [guardando, setGuardando] = useState(false)

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

  const agregarPlato = (plato: any, esMenu: boolean = false, entradaId?: string) => {
    const nuevoItem: ItemPedido = {
      plato_id: plato.id,
      plato_nombre: plato.nombre,
      plato_precio: plato.precio_base,
      cantidad: 1,
      es_menu: esMenu,
      entrada_id: entradaId,
      entrada_nombre: entradaId ? entradas.find(e => e.id === entradaId)?.nombre : undefined
    }

    const itemExistente = items.find(item => 
      item.plato_id === plato.id && 
      item.es_menu === esMenu && 
      item.entrada_id === entradaId
    )
    
    if (itemExistente) {
      setItems(items.map(item => 
        item === itemExistente
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      setItems([...items, nuevoItem])
    }
  }

  // Función para agregar menú con entrada específica
  const agregarMenuConEntrada = (entradaId: string) => {
    // Como no tenemos platos aún, crear un plato temporal para el menú
    const platoTemporal = {
      id: 'menu-temp',
      nombre: 'Menú Ejecutivo',
      precio_base: 9.00
    }
    
    agregarPlato(platoTemporal, true, entradaId)
    
    toast({
      title: "Menú agregado",
      description: `Menú con ${entradas.find(e => e.id === entradaId)?.nombre} agregado al pedido`,
    })
  }

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      setItems(items.filter((_, i) => i !== index))
    } else {
      setItems(items.map((item, i) => 
        i === index ? { ...item, cantidad: nuevaCantidad } : item
      ))
    }
  }

  const calcularTotal = () => {
    return items.reduce((total, item) => {
      const precio = item.es_menu ? 9.00 : item.plato_precio
      return total + (precio * item.cantidad)
    }, 0)
  }

  const generarNumeroPedido = () => {
    const timestamp = Date.now().toString().slice(-6)
    return `P-${timestamp}`
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

    setGuardando(true)

    try {
      const total = calcularTotal()
      const numeroPedido = generarNumeroPedido()

      // Crear pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          numero_pedido: numeroPedido,
          tipo_pedido: tipo,
          mesa_id: tipo === "local" ? mesaSeleccionada : null,
          cliente_nombre: tipo !== "local" ? cliente : null,
          cliente_telefono: tipo !== "local" ? telefono : null,
          direccion_delivery: tipo === "delivery" ? direccion : null,
          subtotal: total,
          total: total,
          observaciones: observaciones || null
        })
        .select()
        .single()

      if (pedidoError) throw pedidoError

      // Para pedidos de menú, necesitamos crear un plato temporal o usar uno existente
      // Por ahora usaremos el primer plato disponible como placeholder
      const platoPlaceholder = platos.length > 0 ? platos[0] : null

      if (!platoPlaceholder && items.some(item => item.es_menu)) {
        throw new Error("No hay platos disponibles para crear el menú")
      }

      // Crear items del pedido
      const itemsData = items.map(item => ({
        pedido_id: pedido.id,
        plato_id: item.es_menu ? (platoPlaceholder?.id || item.plato_id) : item.plato_id,
        cantidad: item.cantidad,
        precio_unitario: item.es_menu ? 9.00 : item.plato_precio,
        es_menu: item.es_menu,
        entrada_id: item.entrada_id || null,
        precio_menu: item.es_menu ? 9.00 : null,
        observaciones: item.observaciones || null
      }))

      const { error: itemsError } = await supabase
        .from('pedido_items')
        .insert(itemsData)

      if (itemsError) throw itemsError

      // Actualizar estado de mesa si es local
      if (tipo === "local" && mesaSeleccionada) {
        await supabase
          .from('mesas')
          .update({ estado: 'ocupada' })
          .eq('id', mesaSeleccionada)
      }

      toast({
        title: "Pedido creado",
        description: `Pedido ${numeroPedido} registrado exitosamente`,
      })

      // Limpiar formulario
      setItems([])
      setMesaSeleccionada("")
      setCliente("")
      setTelefono("")
      setDireccion("")
      setObservaciones("")
      onOpenChange(false)

    } catch (error) {
      console.error('Error creando pedido:', error)
      toast({
        title: "Error",
        description: "No se pudo crear el pedido",
        variant: "destructive"
      })
    } finally {
      setGuardando(false)
    }
  }

  const mesasLibres = mesas.filter(m => m.estado === 'libre')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
                    {mesasLibres.map(mesa => (
                      <SelectItem key={mesa.id} value={mesa.id}>
                        Mesa {mesa.numero} ({mesa.capacidad} personas)
                      </SelectItem>
                    ))}
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
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        {item.es_menu ? (
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-1">
                              <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                              Menú Ejecutivo
                            </div>
                            <div className="text-sm text-muted-foreground">
                              • {item.entrada_nombre || 'Sin entrada'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              • Plato de fondo del día
                            </div>
                          </div>
                        ) : (
                          <div className="font-medium">{item.plato_nombre}</div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          S/ {item.es_menu ? '9.00' : item.plato_precio.toFixed(2)} c/u
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <div className="w-20 text-right font-semibold">
                          S/ {((item.es_menu ? 9.00 : item.plato_precio) * item.cantidad).toFixed(2)}
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

          {/* Panel Derecho - Menú */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Menú del Día</h3>
            
            {/* Sección MENÚS */}
            {menus.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-orange-600 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4" />
                  MENÚS (S/ 9.00)
                </h4>
                {menus.map((menu) => (
                  <Card key={menu.id} className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium flex items-center gap-2">
                              <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                              {menu.nombre}
                            </h4>
                            <p className="text-sm text-muted-foreground">{menu.descripcion}</p>
                          </div>
                          <div className="font-semibold text-lg text-orange-600">
                            S/ {menu.precio_menu.toFixed(2)}
                          </div>
                        </div>
                        
                        {/* Selector de Entrada */}
                        <div className="space-y-2">
                          <Label className="text-sm">Seleccionar Entrada:</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {entradas.map(entrada => (
                              <div key={entrada.id} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">{entrada.nombre}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => agregarMenuConEntrada(entrada.id)}
                                  className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Sección PLATOS INDIVIDUALES */}
            <div className="space-y-3">
              <h4 className="font-medium">PLATOS INDIVIDUALES</h4>
              {platos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay platos disponibles. Agregue platos en la sección de Platos.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {platos.map((plato) => (
                    <Card key={plato.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{plato.nombre}</h4>
                              {plato.es_combinable && (
                                <Badge variant="secondary" className="text-xs">
                                  Combinable
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {plato.descripcion}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {plato.tiempo_preparacion} min • {plato.categoria}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg mb-2">
                              S/ {plato.precio_base.toFixed(2)}
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => agregarPlato(plato, false)}
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
              )}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button 
            onClick={guardarPedido}
            className="bg-green-600 hover:bg-green-700"
            disabled={items.length === 0 || guardando}
          >
            {guardando ? "Creando..." : "Crear Pedido"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
