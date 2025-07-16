
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
  Eye
} from "lucide-react"

// Mock data para el MVP
const platos = [
  {
    id: 1,
    nombre: "Arroz con Pollo Clásico",
    categoria: "Platos Principales",
    costo: 8.50,
    precioVenta: 15.00,
    margen: 76.5,
    tiempoPrep: 35,
    popularidad: 4.8,
    ventasSemanales: 45,
    imagen: "/placeholder.svg",
    ingredientes: ["Arroz", "Pollo", "Cebolla", "Aceite"],
    etiquetas: ["Popular", "Tradicional"]
  },
  {
    id: 2,
    nombre: "Lomo Saltado",
    categoria: "Platos Principales", 
    costo: 12.80,
    precioVenta: 22.00,
    margen: 71.8,
    tiempoPrep: 25,
    popularidad: 4.9,
    ventasSemanales: 38,
    imagen: "/placeholder.svg",
    ingredientes: ["Carne", "Papa", "Cebolla", "Tomate"],
    etiquetas: ["Premium", "Rápido"]
  },
  {
    id: 3,
    nombre: "Causa Limeña",
    categoria: "Entradas",
    costo: 4.20,
    precioVenta: 8.00,
    margen: 90.5,
    tiempoPrep: 20,
    popularidad: 4.6,
    ventasSemanales: 28,
    imagen: "/placeholder.svg", 
    ingredientes: ["Papa", "Pollo", "Mayonesa", "Limón"],
    etiquetas: ["Vegetariano", "Frío"]
  }
]

const Platos = () => {
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
            <div className="text-2xl font-bold">{platos.length}</div>
            <p className="text-xs text-muted-foreground">
              2 categorías activas
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79.6%</div>
            <p className="text-xs text-success">
              +5% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Prep. Prom.</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27 min</div>
            <p className="text-xs text-muted-foreground">
              Óptimo para operación
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Basado en feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar platos por nombre, ingrediente..."
            className="pl-10"
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
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="todos">Todos los Platos</TabsTrigger>
          <TabsTrigger value="principales">Principales</TabsTrigger>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
          <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {platos.map((plato, index) => (
              <Card key={plato.id} className="animate-slide-up hover:shadow-subtle transition-all duration-200 hover:-translate-y-1" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={plato.imagen} 
                      alt={plato.nombre}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {plato.etiquetas.map((etiqueta) => (
                        <Badge key={etiqueta} variant="chef" className="text-xs">
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
                      <div className="text-lg font-bold text-foreground">S/ {plato.costo}</div>
                      <div className="text-xs text-muted-foreground">Costo</div>
                    </div>
                    <div className="text-center p-2 bg-success/10 rounded-lg">
                      <div className="text-lg font-bold text-success">{plato.margen}%</div>
                      <div className="text-xs text-muted-foreground">Margen</div>
                    </div>
                  </div>
                  
                  {/* Información adicional */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{plato.tiempoPrep} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span>{plato.popularidad}</span>
                    </div>
                    <div className="text-xs">
                      {plato.ventasSemanales} vendidos/sem
                    </div>
                  </div>
                  
                  {/* Ingredientes principales */}
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-2">Ingredientes principales:</div>
                    <div className="flex flex-wrap gap-1">
                      {plato.ingredientes.slice(0, 3).map((ingrediente) => (
                        <Badge key={ingrediente} variant="outline" className="text-xs">
                          {ingrediente}
                        </Badge>
                      ))}
                      {plato.ingredientes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{plato.ingredientes.length - 3}
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="principales" className="mt-6">
          <div className="text-center py-12">
            <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Platos Principales</h3>
            <p className="text-muted-foreground">Los protagonistas de tu menú</p>
          </div>
        </TabsContent>

        <TabsContent value="entradas" className="mt-6">
          <div className="text-center py-12">
            <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Entradas</h3>
            <p className="text-muted-foreground">Perfectas para abrir el apetito</p>
          </div>
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
