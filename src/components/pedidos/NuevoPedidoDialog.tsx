
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Users, Truck, ShoppingBag, UtensilsCrossed, Edit3 } from "lucide-react"
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
  tipo_menu?: 'completo' | 'solo_entrada' | 'solo_plato'
  entrada_id?: string
  entrada_nombre?: string
  observaciones?: string
}

export function NuevoPedidoDialog({ open, onOpenChange, tipo }: NuevoPedidoDialogProps) {
  const { toast } = useToast()
  const { entradas, platos, menus, loading } = useMenuData()
  const { mesas } = useMesas()
  
  const [items, setItems] = useState<ItemPedido[]>([])
  const [mesaSeleccionada, setMesaSeleccionada] = useState("")
  const [cliente, setCliente] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [editandoCapacidad, setEditandoCapacidad] = useState<string | null>(null)
  const [nuevaCapacidad, setNuevaCapacidad] = useState("")

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

  const mesaSeleccionadaInfo = mesas.find(m => m.id === mesaSeleccionada)

  // Encontrar el plato genérico "Plato del Día" para usar en menús
  const platoDelDia = platos.find(p => p.nombre === 'Plato del Día') || platos[0]

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

  // Funciones para agregar diferentes tipos de menú
  const agregarMenuCompleto = (entradaId: string) => {
    if (!platoDelDia) {
      toast({
        title: "Error",
        description: "No se encontró plato base para el menú",
        variant: "destructive"
      })
      return
    }

    const menuItem: ItemPedido = {
      plato_id: platoDelDia.id,
      plato_nombre: 'Menú Ejecutivo',
      plato_precio: 9.00,
      cantidad: 1,
      es_menu: true,
      tipo_menu: 'completo',
      entrada_id: entradaId,
      entrada_nombre: entradas.find(e => e.id === entradaId)?.nombre
    }
    
    setItems([...items, menuItem])
    toast({
      title: "Menú agregado",
      description: `Menú completo con ${entradas.find(e => e.id === entradaId)?.nombre} agregado`,
    })
  }

  const agregarSoloEntrada = (entradaId: string) => {
    if (!platoDelDia) {
      toast({
        title: "Error",
        description: "No se encontró plato base para la entrada",
        variant: "destructive"
      })
      return
    }

    const entradaItem: ItemPedido = {
      plato_id: platoDelDia.id,
      plato_nombre: 'Solo Entrada',
      plato_precio: 3.00,
      cantidad: 1,
      es_menu: true,
      tipo_menu: 'solo_entrada',
      entrada_id: entradaId,
      entrada_nombre: entradas.find(e => e.id === entradaId)?.nombre
    }
    
    setItems([...items, entradaItem])
    toast({
      title: "Entrada agregada",
      description: `${entradas.find(e => e.id === entradaId)?.nombre} agregada por S/ 3.00`,
    })
  }

  const agregarSoloPlato = () => {
    if (!platoDelDia) {
      toast({
        title: "Error",
        description: "No se encontró plato base",
        variant: "destructive"
      })
      return
    }

    const platoItem: ItemPedido = {
      plato_id: platoDelDia.id,
      plato_nombre: 'Solo Plato de Fondo',
      plato_precio: 8.00,
      cantidad: 1,
      es_menu: true,
      tipo_menu: 'solo_plato'
    }
    
    setItems([...items, platoItem])
    toast({
      title: "Plato agregado",
      description: "Plato de fondo del día agregado por S/ 8.00",
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
      return total + (item.plato_precio * item.cantidad)
    }, 0)
  }

  const generarNumeroPedido = () => {
    const timestamp = Date.now().toString().slice(-6)
    return `P-${timestamp}`
  }

  const actualizarCapacidadMesa = async (mesaId: string, nuevaCapacidadNum: number) => {
    try {
      const { error } = await supabase
        .from('mesas')
        .update({ capacidad: nuevaCapacidadNum })
        .eq('id', mesaId)

      if (error) throw error

      toast({
        title: "Capacidad actualizada",
        description: `Mesa actualizada a ${nuevaCapacidadNum} personas`,
      })
      
      setEditandoCapacidad(null)
      setNuevaCapacidad("")
    } catch (error) {
      console.error('Error updating mesa capacity:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la capacidad",
        variant: "destructive"
      })
    }
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

      console.log('Creando pedido con items:', items)

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

      // Crear items del pedido
      const itemsData = items.map(item => ({
        pedido_id: pedido.id,
        plato_id: item.plato_id,
        cantidad: item.cantidad,
        precio_unitario: item.plato_precio,
        es_menu: item.es_menu,
        entrada_id: item.entrada_id || null,
        precio_menu: item.es_menu ? item.plato_precio : null,
        observaciones: item.observaciones || null
      }))

      console.log('Creando items del pedido:', itemsData)

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

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Cargando menú...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTipoIcon()}
            {getTipoTitulo()}
          </DialogTitle>
          <DialogDescription>
            Crear un nuevo pedido para {tipo === "local" ? "mesa" : tipo === "delivery" ? "delivery" : "para llevar"}
          </DialogDescription>
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
                        <div className="flex items-center justify-between w-full">
                          <span>Mesa {mesa.numero}</span>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-sm text-muted-foreground">
                              {mesa.capacidad} personas
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditandoCapacidad(mesa.id)
                                setNuevaCapacidad(mesa.capacidad.toString())
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Editor de capacidad */}
                {editandoCapacidad && (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      value={nuevaCapacidad}
                      onChange={(e) => setNuevaCapacidad(e.target.value)}
                      placeholder="Nueva capacidad"
                      className="w-32"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        const capacidad = parseInt(nuevaCapacidad)
                        if (capacidad > 0) {
                          actualizarCapacidadMesa(editandoCapacidad, capacidad)
                        }
                      }}
                    >
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditandoCapacidad(null)
                        setNuevaCapacidad("")
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
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
                  <CardTitle className="text-lg">
                    Resumen del Pedido
                    {tipo === "local" && mesaSeleccionadaInfo && (
                      <div className="text-sm font-normal text-muted-foreground">
                        Mesa {mesaSeleccionadaInfo.numero} ({mesaSeleccionadaInfo.capacidad} personas)
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        {item.es_menu ? (
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-1">
                              <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                              {item.plato_nombre}
                            </div>
                            {item.tipo_menu === 'completo' && (
                              <>
                                <div className="text-sm text-muted-foreground">
                                  • {item.entrada_nombre}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  • Plato de fondo del día
                                </div>
                              </>
                            )}
                            {item.tipo_menu === 'solo_entrada' && (
                              <div className="text-sm text-muted-foreground">
                                • {item.entrada_nombre}
                              </div>
                            )}
                            {item.tipo_menu === 'solo_plato' && (
                              <div className="text-sm text-muted-foreground">
                                • Plato de fondo del día
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="font-medium">{item.plato_nombre}</div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          S/ {item.plato_precio.toFixed(2)} c/u
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
                          S/ {(item.plato_precio * item.cantidad).toFixed(2)}
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
                  OPCIONES DE MENÚ
                </h4>
                {menus.map((menu) => (
                  <Card key={menu.id} className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Botón para solo plato de fondo */}
                        <div className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <span className="font-medium">Solo Plato de Fondo</span>
                            <div className="text-sm text-muted-foreground">Plato del día</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-600">S/ 8.00</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={agregarSoloPlato}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Opciones de entrada */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Entradas Disponibles:</Label>
                          <div className="grid grid-cols-1 gap-2">
                            {entradas.map(entrada => (
                              <div key={entrada.id} className="space-y-1">
                                {/* Solo entrada */}
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <div>
                                    <span className="text-sm font-medium">{entrada.nombre}</span>
                                    <div className="text-xs text-muted-foreground">Solo entrada</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-blue-600">S/ 3.00</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => agregarSoloEntrada(entrada.id)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Menú completo */}
                                <div className="flex items-center justify-between p-2 border rounded bg-orange-50">
                                  <div>
                                    <span className="text-sm font-medium">{entrada.nombre} + Plato de Fondo</span>
                                    <div className="text-xs text-muted-foreground">Menú completo</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-orange-600">S/ 9.00</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => agregarMenuCompleto(entrada.id)}
                                      className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
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
                  <p>Cargando platos...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {platos.filter(p => p.nombre !== 'Plato del Día').map((plato) => (
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
