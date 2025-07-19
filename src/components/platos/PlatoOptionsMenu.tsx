import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { MoreVertical, DollarSign, Calculator, Settings, Trash2, Copy, Archive } from "lucide-react"
import type { Plato } from "@/hooks/usePlatos"

interface PlatoOptionsMenuProps {
  plato: Plato
  onPlatoUpdated: () => void
}

export function PlatoOptionsMenu({ plato, onPlatoUpdated }: PlatoOptionsMenuProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [isEditingCost, setIsEditingCost] = useState(false)
  const [newPrice, setNewPrice] = useState(plato.precio_base)
  const [newCost, setNewCost] = useState(plato.costo_total)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdatePrice = async () => {
    setLoading(true)
    try {
      const margen = newPrice > 0 ? Math.round(((newPrice - plato.costo_total) / newPrice) * 100 * 10) / 10 : 0
      
      const { error } = await supabase
        .from('platos')
        .update({ 
          precio_base: newPrice,
          margen_porcentaje: margen,
          updated_at: new Date().toISOString()
        })
        .eq('id', plato.id)

      if (error) throw error

      toast({
        title: "Precio actualizado",
        description: `El precio de ${plato.nombre} se actualizó a S/ ${newPrice.toFixed(2)}`
      })

      onPlatoUpdated()
      setIsEditingPrice(false)
    } catch (error) {
      console.error('Error updating price:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el precio",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCost = async () => {
    setLoading(true)
    try {
      const margen = plato.precio_base > 0 ? Math.round(((plato.precio_base - newCost) / plato.precio_base) * 100 * 10) / 10 : 0
      
      const { error } = await supabase
        .from('platos')
        .update({ 
          costo_total: newCost,
          margen_porcentaje: margen,
          updated_at: new Date().toISOString()
        })
        .eq('id', plato.id)

      if (error) throw error

      toast({
        title: "Costo actualizado",
        description: `El costo de ${plato.nombre} se actualizó a S/ ${newCost.toFixed(2)}`
      })

      onPlatoUpdated()
      setIsEditingCost(false)
    } catch (error) {
      console.error('Error updating cost:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el costo",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('platos')
        .update({ 
          activo: !plato.activo,
          updated_at: new Date().toISOString()
        })
        .eq('id', plato.id)

      if (error) throw error

      toast({
        title: plato.activo ? "Plato desactivado" : "Plato activado",
        description: `${plato.nombre} ha sido ${plato.activo ? 'desactivado' : 'activado'}`
      })

      onPlatoUpdated()
    } catch (error) {
      console.error('Error toggling active status:', error)
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del plato",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('platos')
        .insert({
          nombre: `${plato.nombre} (Copia)`,
          categoria: plato.categoria,
          descripcion: plato.descripcion,
          precio_base: plato.precio_base,
          costo_total: plato.costo_total,
          margen_porcentaje: plato.margen_porcentaje,
          tiempo_preparacion: plato.tiempo_preparacion,
          porciones_por_receta: plato.porciones_por_receta,
          es_combinable: plato.es_combinable,
          incluye_arroz: plato.incluye_arroz,
          activo: true
        })

      if (error) throw error

      toast({
        title: "Plato duplicado",
        description: `Se creó una copia de ${plato.nombre}`
      })

      onPlatoUpdated()
    } catch (error) {
      console.error('Error duplicating dish:', error)
      toast({
        title: "Error",
        description: "No se pudo duplicar el plato",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setIsEditingPrice(true)}>
            <DollarSign className="h-4 w-4 mr-2" />
            Editar Precio
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditingCost(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Editar Costo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar Plato
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleActive}>
            <Archive className="h-4 w-4 mr-2" />
            {plato.activo ? 'Desactivar' : 'Activar'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para editar precio */}
      <Dialog open={isEditingPrice} onOpenChange={setIsEditingPrice}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Precio de Venta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-price">Nuevo precio para: {plato.nombre}</Label>
              <Input
                id="new-price"
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditingPrice(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdatePrice} disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar costo */}
      <Dialog open={isEditingCost} onOpenChange={setIsEditingCost}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Costo Total</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-cost">Nuevo costo para: {plato.nombre}</Label>
              <Input
                id="new-cost"
                type="number"
                step="0.01"
                min="0"
                value={newCost}
                onChange={(e) => setNewCost(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditingCost(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateCost} disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}