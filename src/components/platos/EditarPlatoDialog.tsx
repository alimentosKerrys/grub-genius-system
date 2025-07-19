import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Save, X } from "lucide-react"
import type { Plato } from "@/hooks/usePlatos"

interface EditarPlatoDialogProps {
  plato: Plato | null
  isOpen: boolean
  onClose: () => void
  onPlatoUpdated: () => void
}

export function EditarPlatoDialog({ plato, isOpen, onClose, onPlatoUpdated }: EditarPlatoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    precio_base: 0,
    costo_total: 0,
    margen_porcentaje: 0,
    tiempo_preparacion: 0,
    porciones_por_receta: 1,
    es_combinable: false,
    incluye_arroz: true,
    activo: true
  })
  const { toast } = useToast()

  useEffect(() => {
    if (plato) {
      setFormData({
        nombre: plato.nombre,
        categoria: plato.categoria,
        descripcion: plato.descripcion || "",
        precio_base: plato.precio_base,
        costo_total: plato.costo_total,
        margen_porcentaje: plato.margen_porcentaje,
        tiempo_preparacion: plato.tiempo_preparacion,
        porciones_por_receta: plato.porciones_por_receta,
        es_combinable: plato.es_combinable,
        incluye_arroz: plato.incluye_arroz,
        activo: plato.activo
      })
    }
  }, [plato])

  const calcularMargen = (precio: number, costo: number) => {
    if (precio === 0) return 0
    return Math.round(((precio - costo) / precio) * 100 * 10) / 10
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Recalcular margen automáticamente cuando cambie precio o costo
      if (field === 'precio_base' || field === 'costo_total') {
        newData.margen_porcentaje = calcularMargen(
          field === 'precio_base' ? value : newData.precio_base,
          field === 'costo_total' ? value : newData.costo_total
        )
      }
      
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plato) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('platos')
        .update({
          nombre: formData.nombre,
          categoria: formData.categoria,
          descripcion: formData.descripcion,
          precio_base: formData.precio_base,
          costo_total: formData.costo_total,
          margen_porcentaje: formData.margen_porcentaje,
          tiempo_preparacion: formData.tiempo_preparacion,
          porciones_por_receta: formData.porciones_por_receta,
          es_combinable: formData.es_combinable,
          incluye_arroz: formData.incluye_arroz,
          activo: formData.activo,
          updated_at: new Date().toISOString()
        })
        .eq('id', plato.id)

      if (error) throw error

      toast({
        title: "Plato actualizado",
        description: `${formData.nombre} ha sido actualizado correctamente.`
      })

      onPlatoUpdated()
      onClose()
    } catch (error) {
      console.error('Error actualizando plato:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el plato. Intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!plato) return null

  const categorias = [
    "Guisos", "Salteados", "Parrillas", "Chifas", "Pastas", 
    "Entradas", "Bebidas", "Menús", "Frituras"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Plato</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Plato</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Describe el plato..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Precios y costos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Precios y Costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="precio_base">Precio de Venta (S/)</Label>
                  <Input
                    id="precio_base"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio_base}
                    onChange={(e) => handleInputChange('precio_base', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="costo_total">Costo Total (S/)</Label>
                  <Input
                    id="costo_total"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costo_total}
                    onChange={(e) => handleInputChange('costo_total', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Margen Calculado</Label>
                  <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                    <Badge variant="secondary" className="text-success">
                      {formData.margen_porcentaje}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiempo_preparacion">Tiempo Preparación (min)</Label>
                  <Input
                    id="tiempo_preparacion"
                    type="number"
                    min="0"
                    value={formData.tiempo_preparacion}
                    onChange={(e) => handleInputChange('tiempo_preparacion', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="porciones_por_receta">Porciones por Receta</Label>
                  <Input
                    id="porciones_por_receta"
                    type="number"
                    min="1"
                    value={formData.porciones_por_receta}
                    onChange={(e) => handleInputChange('porciones_por_receta', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="es_combinable">Es Combinable</Label>
                  <Switch
                    id="es_combinable"
                    checked={formData.es_combinable}
                    onCheckedChange={(checked) => handleInputChange('es_combinable', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="incluye_arroz">Incluye Arroz</Label>
                  <Switch
                    id="incluye_arroz"
                    checked={formData.incluye_arroz}
                    onCheckedChange={(checked) => handleInputChange('incluye_arroz', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="activo">Activo</Label>
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => handleInputChange('activo', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}