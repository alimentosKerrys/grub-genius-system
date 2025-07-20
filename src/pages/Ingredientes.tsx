
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditarIngredienteDialog } from "@/components/ingredientes/EditarIngredienteDialog"
import { useIngredientes } from "@/hooks/useIngredientes"
import { 
  Search, 
  Plus, 
  Filter,
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  MoreVertical,
  ShoppingCart
} from "lucide-react"
import { useState } from "react"

const estadoColors = {
  bajo: "destructive",
  normal: "warning", 
  optimo: "secondary"
} as const

const Ingredientes = () => {
  const { 
    ingredientes, 
    loading, 
    getMetricas, 
    getEstadoStock, 
    getIngredientesByCategoria,
    updateStock,
    updatePrecio
  } = useIngredientes()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("todos")
  
  const metricas = getMetricas()
  
  // Filtrar ingredientes por búsqueda
  const ingredientesFiltrados = ingredientes.filter(ingrediente =>
    ingrediente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingrediente.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Obtener categorías únicas
  const categorias = Array.from(new Set(ingredientes.map(i => i.categoria)))

  if (loading) {
    return (
      <AppLayout title="Gestión de Ingredientes">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout 
      title="Gestión de Ingredientes" 
      description="Controla tu inventario, precios y proveedores en tiempo real"
    >
      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingredientes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalIngredientes}</div>
            <p className="text-xs text-muted-foreground">
              {metricas.stockBajo} con stock bajo
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {metricas.valorTotal}</div>
            <p className="text-xs text-success">
              Calculado automáticamente
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.stockBajo}</div>
            <p className="text-xs text-warning">
              Stock bajo crítico
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.proveedores}</div>
            <p className="text-xs text-muted-foreground">
              Activos este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ingredientes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Button className="bg-gradient-warm hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Ingrediente
          </Button>
        </div>
      </div>

      {/* Tabs de contenido */}
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="lista">Lista de Ingredientes</TabsTrigger>
          <TabsTrigger value="categorias">Por Categorías</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-6">
          <div className="grid gap-4">
            {ingredientesFiltrados.map((ingrediente, index) => {
              const estado = getEstadoStock(ingrediente)
              return (
                <Card key={ingrediente.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-spice rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-black" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {ingrediente.nombre}
                            </h3>
                            <Badge variant={estadoColors[estado]} className="text-xs">
                              {estado}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Stock: {ingrediente.stock_actual} {ingrediente.unidad_medida}</span>
                            <span>Mín: {ingrediente.stock_minimo} {ingrediente.unidad_medida}</span>
                            <span>S/ {ingrediente.precio_unitario} por {ingrediente.unidad_medida}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{ingrediente.categoria}</span>
                            {ingrediente.proveedor_principal && (
                              <>
                                <span>•</span>
                                <span>{ingrediente.proveedor_principal}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {estado === 'bajo' && (
                          <Button size="sm" variant="outline" className="text-warning border-warning hover:bg-warning/10">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Reabastecer
                          </Button>
                        )}
                        
                        <EditarIngredienteDialog
                          ingrediente={ingrediente}
                          onUpdateStock={updateStock}
                          onUpdatePrecio={updatePrecio}
                          trigger={
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </div>
                    
                    {/* Barra de progreso de stock */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Nivel de Stock</span>
                        <span>{Math.round((ingrediente.stock_actual / ingrediente.stock_minimo) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            estado === 'bajo' ? 'bg-destructive' :
                            estado === 'normal' ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ 
                            width: `${Math.min((ingrediente.stock_actual / ingrediente.stock_minimo) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="mt-6">
          <div className="grid gap-6">
            {categorias.map((categoria) => {
              const ingredientesCategoria = ingredientes.filter(i => i.categoria === categoria)
              return (
                <Card key={categoria} className="animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {categoria}
                      <Badge variant="secondary" className="ml-2">
                        {ingredientesCategoria.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ingredientesCategoria.map((ingrediente) => (
                        <div key={ingrediente.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{ingrediente.nombre}</span>
                            <Badge variant={estadoColors[getEstadoStock(ingrediente)]} className="text-xs">
                              {getEstadoStock(ingrediente)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Stock: {ingrediente.stock_actual} {ingrediente.unidad_medida}</div>
                            <div>Precio: S/ {ingrediente.precio_unitario}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="proveedores" className="mt-6">
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Gestión de Proveedores</h3>
            <p className="text-muted-foreground">Administra tus proveedores y compara precios</p>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}

export default Ingredientes
