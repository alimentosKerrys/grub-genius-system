
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface NuevoIngredienteDialogProps {
  onIngredienteCreado: () => void
}

export function NuevoIngredienteDialog({ onIngredienteCreado }: NuevoIngredienteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    unidad_medida: '',
    precio_unitario: 0,
    stock_actual: 0,
    stock_minimo: 0,
    merma_porcentaje: 0,
    proveedor_principal: '',
    notas: ''
  })

  const categorias = [
    'Verduras', 'Carnes', 'Pescados', 'Pollo', 'Cereales', 'Legumbres',
    'Especias', 'Condimentos', 'Aceites', 'Lácteos', 'Otros'
  ]

  const unidades = [
    'kg', 'g', 'unidad', 'litro', 'ml', 'bolsa', 'paquete', 'lata', 'sobre'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.categoria || !formData.unidad_medida) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('ingredientes')
        .insert([formData])

      if (error) throw error

      toast({
        title: "Ingrediente creado",
        description: "El ingrediente se creó correctamente",
      })
      
      setFormData({
        nombre: '',
        categoria: '',
        unidad_medida: '',
        precio_unitario: 0,
        stock_actual: 0,
        stock_minimo: 0,
        merma_porcentaje: 0,
        proveedor_principal: '',
        notas: ''
      })
      
      setOpen(false)
      onIngredienteCreado()
      
    } catch (error) {
      console.error('Error creating ingrediente:', error)
      toast({
        title: "Error",
        description: "No se pudo crear el ingrediente",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-warm hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ingrediente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Ingrediente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Pollo entero"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="categoria">Categoría *</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unidad_medida">Unidad de Medida *</Label>
              <Select value={formData.unidad_medida} onValueChange={(value) => setFormData({...formData, unidad_medida: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((unidad) => (
                    <SelectItem key={unidad} value={unidad}>
                      {unidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="precio_unitario">Precio Unitario (S/)</Label>
              <Input
                id="precio_unitario"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio_unitario}
                onChange={(e) => setFormData({...formData, precio_unitario: Number(e.target.value)})}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stock_actual">Stock Actual</Label>
              <Input
                id="stock_actual"
                type="number"
                step="0.1"
                min="0"
                value={formData.stock_actual}
                onChange={(e) => setFormData({...formData, stock_actual: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
            
            <div>
              <Label htmlFor="stock_minimo">Stock Mínimo</Label>
              <Input
                id="stock_minimo"
                type="number"
                step="0.1"
                min="0"
                value={formData.stock_minimo}
                onChange={(e) => setFormData({...formData, stock_minimo: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
            
            <div>
              <Label htmlFor="merma_porcentaje">Merma (%)</Label>
              <Input
                id="merma_porcentaje"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.merma_porcentaje}
                onChange={(e) => setFormData({...formData, merma_porcentaje: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="proveedor_principal">Proveedor Principal</Label>
            <Input
              id="proveedor_principal"
              value={formData.proveedor_principal}
              onChange={(e) => setFormData({...formData, proveedor_principal: e.target.value})}
              placeholder="Ej: Mercado Central"
            />
          </div>

          <div>
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({...formData, notas: e.target.value})}
              placeholder="Observaciones sobre el ingrediente..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creando...' : 'Crear Ingrediente'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
