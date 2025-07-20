
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Filter } from 'lucide-react'

interface FiltrosIngredientesDialogProps {
  onFiltrosChange: (filtros: {
    categoria: string
    estado: string
    proveedor: string
    precioMin: string
    precioMax: string
  }) => void
  categorias: string[]
  proveedores: string[]
}

export function FiltrosIngredientesDialog({ 
  onFiltrosChange, 
  categorias, 
  proveedores 
}: FiltrosIngredientesDialogProps) {
  const [open, setOpen] = useState(false)
  const [filtros, setFiltros] = useState({
    categoria: 'todos',
    estado: 'todos',
    proveedor: 'todos',
    precioMin: '',
    precioMax: ''
  })

  const handleAplicarFiltros = () => {
    onFiltrosChange(filtros)
    setOpen(false)
  }

  const handleLimpiarFiltros = () => {
    const filtrosLimpios = {
      categoria: 'todos',
      estado: 'todos',
      proveedor: 'todos',
      precioMin: '',
      precioMax: ''
    }
    setFiltros(filtrosLimpios)
    onFiltrosChange(filtrosLimpios)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrar Ingredientes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Select value={filtros.categoria} onValueChange={(value) => setFiltros({...filtros, categoria: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las categorías</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="estado">Estado de Stock</Label>
            <Select value={filtros.estado} onValueChange={(value) => setFiltros({...filtros, estado: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="bajo">Stock Bajo</SelectItem>
                <SelectItem value="normal">Stock Normal</SelectItem>
                <SelectItem value="optimo">Stock Óptimo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="proveedor">Proveedor</Label>
            <Select value={filtros.proveedor} onValueChange={(value) => setFiltros({...filtros, proveedor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los proveedores</SelectItem>
                {proveedores.map((proveedor) => (
                  <SelectItem key={proveedor} value={proveedor}>
                    {proveedor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="precioMin">Precio Mín (S/)</Label>
              <Input
                id="precioMin"
                type="number"
                step="0.01"
                value={filtros.precioMin}
                onChange={(e) => setFiltros({...filtros, precioMin: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="precioMax">Precio Máx (S/)</Label>
              <Input
                id="precioMax"
                type="number"
                step="0.01"
                value={filtros.precioMax}
                onChange={(e) => setFiltros({...filtros, precioMax: e.target.value})}
                placeholder="100.00"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleAplicarFiltros} className="flex-1">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={handleLimpiarFiltros} className="flex-1">
              Limpiar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
