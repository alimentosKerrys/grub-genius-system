
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FiltrosPlatosDialog } from "@/components/platos/FiltrosPlatosDialog"
import { NuevaRecetaDialog } from "@/components/platos/NuevaRecetaDialog"
import { usePlatos } from "@/hooks/usePlatos"
import { 
  Search, 
  Plus, 
  Filter,
  ChefHat,
  Clock,
  DollarSign,
  TrendingUp,
  Star
} from "lucide-react"
import { useState } from "react"

const Platos = () => {
  const { 
    platos, 
    loading, 
    getMetricas, 
    getPlatosByCategoria,
    refreshData
  } = usePlatos()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("todos")
  const [filtros, setFiltros] = useState({
    categoria: 'todos',
    precioMin: '',
    precioMax: '',
    tiempoMax: '',
    esCombinables: 'todos'
  })
  
  const metricas = getMetricas()
  
  // Aplicar filtros
  let platosFiltrados = platos.filter(plato => {
    // Filtro de búsqueda
    const matchSearch = plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       plato.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtro de categoría
    const matchCategoria = filtros.categoria === 'todos' || plato.categoria === filtros.categoria
    
    // Filtro de precio
    const precio = plato.precio_base
    const matchPrecio = (!filtros.precioMin || precio >= Number(filtros.precioMin)) &&
                       (!filtros.precioMax || precio <= Number(filtros.precioMax))
    
    // Filtro de tiempo
    const matchTiempo = !filtros.tiempoMax || plato.tiempo_preparacion <= Number(filtros.tiempoMax)
    
    // Filtro de combinables
    const matchCombinables = filtros.esCombinables === 'todos' || 
                            (filtros.esCombinables === 'true' && plato.es_combinable) ||
                            (filtros.esCombinables === 'false' && !plato.es_combinable)
    
    return matchSearch && matchCategoria && matchPrecio && matchTiempo && matchCombinables
  })

  // Si hay filtro de categoría del tab, aplicarlo también
  if (categoriaFilter !== "todos") {
    platosFiltrados = getPlatosByCategoria(categoriaFilter).filter(plato =>
      plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plato.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Obtener categorías únicas para filtros
  const categorias = Array.from(new Set(platos.map(p => p.categoria)))

  if (loading) {
    return (
      <AppLayout title="Platos & Recetas">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout 
      title="Platos & Recetas" 
      description="Administra tu menú, controla costos y optimiza la rentabilidad"
    >
      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platos</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalPlatos}</div>
            <p className="text-xs text-muted-foreground">
              {metricas.categorias} categorías
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.margenPromedio}%</div>
            <p className="text-xs text-success">
              Rentabilidad media
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.tiempoPromedio} min</div>
            <p className="text-xs text-warning">
              Tiempo de preparación
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ 25.00</div>
            <p className="text-xs text-muted-foreground">
              Calculado automáticamente
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.ratingPromedio}</div>
            <p className="text-xs text-warning">
              Valoración de clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar platos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <FiltrosPlatosDialog 
            onFiltrosChange={setFiltros}
            categorias={categorias}
          />
          
          <NuevaRecetaDialog onRecetaCreada={refreshData} />
        </div>
      </div>

      {/* Tabs de contenido - Actualizadas para incluir "Sopas" */}
      <Tabs defaultValue="todos" className="w-full" onValueChange={setCategoriaFilter}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="todos">Todos los Platos</TabsTrigger>
          <TabsTrigger value="principales">Principales</TabsTrigger>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
          <TabsTrigger value="sopas">Sopas</TabsTrigger>
          <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
        </TabsList>

        {/* Componente reutilizable para renderizar platos */}
        {["todos", "principales", "entradas", "sopas", "bebidas"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="mt-6">
            <div className="grid gap-4">
              {platosFiltrados.map((plato, index) => (
                <Card key={plato.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-spice rounded-lg flex items-center justify-center">
                          <ChefHat className="w-6 h-6 text-black" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {plato.nombre}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {plato.categoria}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground truncate">
                            {plato.descripcion || 'Sin descripción'}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>Precio: S/ {plato.precio_base}</span>
                            <span>•</span>
                            <span>{plato.tiempo_preparacion} min</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </AppLayout>
  )
}

export default Platos
