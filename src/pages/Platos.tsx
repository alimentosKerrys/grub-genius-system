
import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Plus, 
  Filter,
  ChefHat,
  DollarSign,
  Clock,
  Star,
  MoreVertical,
  Eye,
  Loader2
} from "lucide-react"
import { usePlatos } from "@/hooks/usePlatos"

const Platos = () => {
  const { platos, loading, getMetricas, getPlatosByCategoria, getRecetasByPlato } = usePlatos()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  
  const metricas = getMetricas()
  const platosFiltered = getPlatosByCategoria(activeTab)
  
  // Filtrar por búsqueda
  const platosToShow = platosFiltered.filter(plato =>
    plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plato.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función para obtener etiquetas basadas en los datos reales
  const getEtiquetasPlato = (plato: any) => {
    const etiquetas = []
    if (plato.precio_base > 15) etiquetas.push("Premium")
    if (plato.tiempo_preparacion <= 20) etiquetas.push("Rápido")
    if (plato.es_combinable) etiquetas.push("Combinable")
    if (!etiquetas.length) etiquetas.push("Tradicional")
    return etiquetas
  }

  // Función para calcular margen basado en precio_base y costo_total
  const calcularMargen = (precio: number, costo: number) => {
    if (costo === 0) return 0
    return Math.round(((precio - costo) / precio) * 100 * 10) / 10
  }

  if (loading) {
    return (
      <AppLayout 
        title="Platos & Recetas" 
        description="Gestiona tu menú, recetas y calcula costos automáticamente"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando platos...</span>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout 
      title="Platos & Recetas" 
      description="Gestiona tu menú, recetas y calcula costos automáticamente"
    >
      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platos</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalPlatos}</div>
            <p className="text-xs text-muted-foreground">
              {metricas.categorias} categorías activas
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.margenPromedio}%</div>
            <p className="text-xs text-success">
              Calculado automáticamente
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Prep. Prom.</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.tiempoPromedio} min</div>
            <p className="text-xs text-muted-foreground">
              Tiempo promedio real
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.ratingPromedio}</div>
            <p className="text-xs text-muted-foreground">
              Promedio de satisfacción
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar platos por nombre, categoría..."
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
            Nueva Receta
          </Button>
        </div>
      </div>

      {/* Tabs de contenido */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="todos">Todos los Platos</TabsTrigger>
          <TabsTrigger value="principales">Principales</TabsTrigger>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
          <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-6">
          {platosToShow.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? 'No se encontraron platos' : 'No hay platos disponibles'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer plato con el botón "Nueva Receta"'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {platosToShow.map((plato, index) => {
                const etiquetas = getEtiquetasPlato(plato)
                const recetasPlato = getRecetasByPlato(plato.id)
                const ingredientesPrincipales = recetasPlato
                  .filter(r => r.es_principal)
                  .map(r => r.ingrediente?.nombre || 'Ingrediente')
                  .slice(0, 3)
                
                // Si no hay ingredientes principales, tomar los primeros 3
                const ingredientesAMostrar = ingredientesPrincipales.length > 0 
                  ? ingredientesPrincipales 
                  : recetasPlato.map(r => r.ingrediente?.nombre || 'Ingrediente').slice(0, 3)

                const margen = calcularMargen(plato.precio_base, plato.costo_total)

                return (
                  <Card key={plato.id} className="animate-slide-up hover:shadow-subtle transition-all duration-200 hover:-translate-y-1" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="p-0">
                      <div className="relative">
                        <div className="w-full h-48 bg-gradient-to-br from-orange-400 via-red-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                          <ChefHat className="h-12 w-12 text-white/80" />
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          {etiquetas.map((etiqueta) => (
                            <Badge key={etiqueta} variant="secondary" className="text-xs bg-white/90 text-gray-800">
                              {etiqueta}
                            </Badge>
                          ))}
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            {plato.categoria}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-lg leading-tight">
                          {plato.nombre}
                        </h3>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Métricas principales */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-lg font-bold text-foreground">S/ {plato.costo_total.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Costo</div>
                        </div>
                        <div className="text-center p-2 bg-success/10 rounded-lg">
                          <div className="text-lg font-bold text-success">{margen}%</div>
                          <div className="text-xs text-muted-foreground">Margen</div>
                        </div>
                      </div>
                      
                      {/* Información adicional */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{plato.tiempo_preparacion} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span>4.8</span>
                        </div>
                        <div className="text-xs">
                          S/ {plato.precio_base.toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Ingredientes principales */}
                      <div className="mb-4">
                        <div className="text-xs text-muted-foreground mb-2">Ingredientes principales:</div>
                        <div className="flex flex-wrap gap-1">
                          {ingredientesAMostrar.map((ingrediente, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ingrediente}
                            </Badge>
                          ))}
                          {recetasPlato.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{recetasPlato.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-2" />
                          Ver Receta
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-fresh hover:opacity-90">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="principales" className="mt-6">
          {platosToShow.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Platos Principales</h3>
              <p className="text-muted-foreground">Los protagonistas de tu menú</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {platosToShow.map((plato, index) => {
                const etiquetas = getEtiquetasPlato(plato)
                const recetasPlato = getRecetasByPlato(plato.id)
                const ingredientesAMostrar = recetasPlato.map(r => r.ingrediente?.nombre || 'Ingrediente').slice(0, 3)
                const margen = calcularMargen(plato.precio_base, plato.costo_total)

                return (
                  <Card key={plato.id} className="animate-slide-up hover:shadow-subtle transition-all duration-200 hover:-translate-y-1" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="p-0">
                      <div className="relative">
                        <div className="w-full h-48 bg-gradient-to-br from-orange-400 via-red-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                          <ChefHat className="h-12 w-12 text-white/80" />
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          {etiquetas.map((etiqueta) => (
                            <Badge key={etiqueta} variant="secondary" className="text-xs bg-white/90 text-gray-800">
                              {etiqueta}
                            </Badge>
                          ))}
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            {plato.categoria}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-lg leading-tight">
                          {plato.nombre}
                        </h3>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-lg font-bold text-foreground">S/ {plato.costo_total.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Costo</div>
                        </div>
                        <div className="text-center p-2 bg-success/10 rounded-lg">
                          <div className="text-lg font-bold text-success">{margen}%</div>
                          <div className="text-xs text-muted-foreground">Margen</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{plato.tiempo_preparacion} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span>4.8</span>
                        </div>
                        <div className="text-xs">
                          S/ {plato.precio_base.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-xs text-muted-foreground mb-2">Ingredientes principales:</div>
                        <div className="flex flex-wrap gap-1">
                          {ingredientesAMostrar.map((ingrediente, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ingrediente}
                            </Badge>
                          ))}
                          {recetasPlato.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{recetasPlato.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-2" />
                          Ver Receta
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-fresh hover:opacity-90">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="entradas" className="mt-6">
          {platosToShow.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Entradas</h3>
              <p className="text-muted-foreground">Perfectas para abrir el apetito</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {platosToShow.map((plato, index) => {
                const etiquetas = getEtiquetasPlato(plato)
                const recetasPlato = getRecetasByPlato(plato.id)
                const ingredientesAMostrar = recetasPlato.map(r => r.ingrediente?.nombre || 'Ingrediente').slice(0, 3)
                const margen = calcularMargen(plato.precio_base, plato.costo_total)

                return (
                  <Card key={plato.id} className="animate-slide-up hover:shadow-subtle transition-all duration-200 hover:-translate-y-1" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="p-0">
                      <div className="relative">
                        <div className="w-full h-48 bg-gradient-to-br from-green-400 via-blue-400 to-teal-500 rounded-t-lg flex items-center justify-center">
                          <ChefHat className="h-12 w-12 text-white/80" />
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          {etiquetas.map((etiqueta) => (
                            <Badge key={etiqueta} variant="secondary" className="text-xs bg-white/90 text-gray-800">
                              {etiqueta}
                            </Badge>
                          ))}
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            {plato.categoria}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-lg leading-tight">
                          {plato.nombre}
                        </h3>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-lg font-bold text-foreground">S/ {plato.costo_total.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Costo</div>
                        </div>
                        <div className="text-center p-2 bg-success/10 rounded-lg">
                          <div className="text-lg font-bold text-success">{margen}%</div>
                          <div className="text-xs text-muted-foreground">Margen</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{plato.tiempo_preparacion} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span>4.8</span>
                        </div>
                        <div className="text-xs">
                          S/ {plato.precio_base.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-xs text-muted-foreground mb-2">Ingredientes principales:</div>
                        <div className="flex flex-wrap gap-1">
                          {ingredientesAMostrar.map((ingrediente, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ingrediente}
                            </Badge>
                          ))}
                          {recetasPlato.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{recetasPlato.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-2" />
                          Ver Receta
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-fresh hover:opacity-90">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bebidas" className="mt-6">
          <div className="text-center py-12">
            <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Bebidas</h3>
            <p className="text-muted-foreground">Complementa la experiencia gastronómica</p>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}

export default Platos
