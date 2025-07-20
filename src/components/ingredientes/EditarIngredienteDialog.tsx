
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Ingrediente } from '@/hooks/useIngredientes'
import { Edit, Package, DollarSign, TrendingUp } from 'lucide-react'

interface EditarIngredienteDialogProps {
  ingrediente: Ingrediente
  onUpdateStock: (id: string, nuevoStock: number) => void
  onUpdatePrecio: (id: string, nuevoPrecio: number) => void
  trigger?: React.ReactNode
}

export function EditarIngredienteDialog({ 
  ingrediente, 
  onUpdateStock, 
  onUpdatePrecio, 
  trigger 
}: EditarIngredienteDialogProps) {
  const [open, setOpen] = useState(false)
  const [nuevoStock, setNuevoStock] = useState(ingrediente.stock_actual)
  const [nuevoPrecio, setNuevoPrecio] = useState(ingrediente.precio_unitario)

  const handleUpdateStock = () => {
    if (nuevoStock !== ingrediente.stock_actual) {
      onUpdateStock(ingrediente.id, nuevoStock)
    }
    setOpen(false)
  }

  const handleUpdatePrecio = () => {
    if (nuevoPrecio !== ingrediente.precio_unitario) {
      onUpdatePrecio(ingrediente.id, nuevoPrecio)
    }
    setOpen(false)
  }

  const estadoStock = () => {
    if (ingrediente.stock_actual <= ingrediente.stock_minimo * 0.5) {
      return { color: 'destructive', text: 'Crítico' }
    } else if (ingrediente.stock_actual <= ingrediente.stock_minimo) {
      return { color: 'warning', text: 'Bajo' }
    } else {
      return { color: 'secondary', text: 'Normal' }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Editar Ingrediente: {ingrediente.nombre}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Categoría</Label>
              <Badge variant="secondary" className="mt-1">
                {ingrediente.categoria}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Unidad de Medida</Label>
              <p className="text-sm text-muted-foreground mt-1">{ingrediente.unidad_medida}</p>
            </div>
          </div>

          {/* Estado actual */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Stock Actual</p>
              <p className="text-2xl font-bold">{ingrediente.stock_actual}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Stock Mínimo</p>
              <p className="text-2xl font-bold">{ingrediente.stock_minimo}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Precio Unitario</p>
              <p className="text-2xl font-bold">S/ {ingrediente.precio_unitario}</p>
            </div>
          </div>

          {/* Estado de stock */}
          <div className="flex items-center gap-2">
            <Label>Estado del Stock:</Label>
            <Badge variant={estadoStock().color as any}>
              {estadoStock().text}
            </Badge>
          </div>

          {/* Editar stock */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="stock">Actualizar Stock</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="stock"
                  type="number"
                  value={nuevoStock}
                  onChange={(e) => setNuevoStock(Number(e.target.value))}
                  step="0.1"
                  min="0"
                />
                <Button onClick={handleUpdateStock} className="px-6">
                  Actualizar Stock
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="precio">Actualizar Precio (S/)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="precio"
                  type="number"
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(Number(e.target.value))}
                  step="0.01"
                  min="0"
                />
                <Button onClick={handleUpdatePrecio} className="px-6">
                  Actualizar Precio
                </Button>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          {ingrediente.proveedor_principal && (
            <div>
              <Label className="text-sm font-medium">Proveedor Principal</Label>
              <p className="text-sm text-muted-foreground mt-1">{ingrediente.proveedor_principal}</p>
            </div>
          )}

          {ingrediente.notas && (
            <div>
              <Label className="text-sm font-medium">Notas</Label>
              <Textarea
                value={ingrediente.notas}
                readOnly
                className="mt-1 resize-none"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
