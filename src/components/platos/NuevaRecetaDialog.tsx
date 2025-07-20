
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
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

interface NuevaRecetaDialogProps {
  onRecetaCreada: () => void
}

export function NuevaRecetaDialog({ onRecetaCreada }: NuevaRecetaDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    precio_base: 0,
    tiempo_preparacion: 0,
    porciones_por_receta: 1,
    es_combinable: false,
    incluye_arroz: true,
    dias_populares: ''
  })

  const categorias = [
    'Guisos', 'Salteados', 'Parrillas', 'Chifas', 'Pastas', 'Menús', 'Entradas', 'Bebidas'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.categoria) {
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
        .from('platos')
        .insert([formData])

      if (error) throw error

      toast({
        title: "Plato creado",
        description: "El plato se creó correctamente",
      })
      
      setFormData({
        nombre: '',
        categoria: '',
        descripcion: '',
        precio_base: 0,
        tiempo_preparacion: 0,
        porciones_por_receta: 1,
        es_combinable: false,
        incluye_arroz: true,
        dias_populares: ''
      })
      
      setOpen(false)
      onRecetaCreada()
      
    } catch (error) {
      console.error('Error creating plato:', error)
      toast({
        title: "Error",
        description: "No se pudo crear el plato",
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
          Nueva Receta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Receta</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre del Plato *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Arroz con Pollo"
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

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Descripción del plato..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="precio_base">Precio Base (S/)</Label>
              <Input
                id="precio_base"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio_base}
                onChange={(e) => setFormData({...formData, precio_base: Number(e.target.value)})}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="tiempo_preparacion">Tiempo (min)</Label>
              <Input
                id="tiempo_preparacion"
                type="number"
                min="0"
                value={formData.tiempo_preparacion}
                onChange={(e) => setFormData({...formData, tiempo_preparacion: Number(e.target.value)})}
                placeholder="20"
              />
            </div>
            
            <div>
              <Label htmlFor="porciones_por_receta">Porciones</Label>
              <Input
                id="porciones_por_receta"
                type="number"
                min="1"
                value={formData.porciones_por_receta}
                onChange={(e) => setFormData({...formData, porciones_por_receta: Number(e.target.value)})}
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dias_populares">Días Populares</Label>
            <Input
              id="dias_populares"
              value={formData.dias_populares}
              onChange={(e) => setFormData({...formData, dias_populares: e.target.value})}
              placeholder="Ej: LUNES,MARTES"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="es_combinable"
                checked={formData.es_combinable}
                onCheckedChange={(checked) => setFormData({...formData, es_combinable: !!checked})}
              />
              <Label htmlFor="es_combinable">Es Combinable</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="incluye_arroz"
                checked={formData.incluye_arroz}
                onCheckedChange={(checked) => setFormData({...formData, incluye_arroz: !!checked})}
              />
              <Label htmlFor="incluye_arroz">Incluye Arroz</Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creando...' : 'Crear Plato'}
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
