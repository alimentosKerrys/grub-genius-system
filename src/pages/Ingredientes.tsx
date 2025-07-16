
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
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  MoreVertical
} from "lucide-react"

// Mock data para el MVP
const ingredientes = [
  {
    id: 1,
    nombre: "Cebolla Blanca",
    stock: 2.5,
    stockMinimo: 5,
    unidad: "kg",
    precio: 4.50,
    proveedor: "Mercado Central",
    categoria: "Verduras",
    estado: "bajo" as const,
    ultimaCompra: "2024-01-15"
  },
  {
    id: 2,
    nombre: "Pollo (Pechuga)",
    stock: 8.2,
    stockMinimo: 10,
    unidad: "kg",
    precio: 18.00,
    proveedor: "Avícola San Juan",
    categoria: "Carnes",
    estado: "normal" as const,
    ultimaCompra: "2024-01-14"
  },
  {
    id: 3,
    nombre: "Arroz Blanco",
    stock: 15.0,
    stockMinimo: 8,
    unidad: "kg",
    precio: 3.20,
    proveedor: "Distribuidora Norte",
    categoria: "Granos",
    estado: "optimo" as const,
    ultimaCompra: "2024-01-13"
  },
  {
    id: 4,
    nombre: "Aceite Vegetal",
    stock: 3.8,
    stockMinimo: 6,
    unidad: "litros",
    precio: 12.50,
    proveedor: "Comercial Lima",
    categoria: "Aceites",
    estado: "bajo" as const,
    ultimaCompra: "2024-01-12"
  }
]

const estadoColors = {
  bajo: "destructive",
  normal: "warning", 
  optimo: "secondary"
} as const

const Ingredientes = () => {
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
            <div className="text-2xl font-bold">{ingredientes.length}</div>
            <p className="text-xs text-muted-foreground">
              3 con stock bajo
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ 420</div>
            <p className="text-xs text-success">
              +8% vs semana anterior
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
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
            <div className="text-2xl font-bold">8</div>
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
            {ingredientes.map((ingrediente, index) => (
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
                          <Badge variant={estadoColors[ingrediente.estado]} className="text-xs">
                            {ingrediente.estado}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Stock: {ingrediente.stock} {ingrediente.unidad}</span>
                          <span>Mín: {ingrediente.stockMinimo} {ingrediente.unidad}</span>
                          <span>S/ {ingrediente.precio} por {ingrediente.unidad}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{ingrediente.proveedor}</span>
                          <span>•</span>
                          <span>Últ. compra: {ingrediente.ultimaCompra}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {ingrediente.estado === 'bajo' && (
                        <Button size="sm" variant="outline" className="text-warning border-warning hover:bg-warning/10">
                          Reabastecer
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Barra de progreso de stock */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Nivel de Stock</span>
                      <span>{Math.round((ingrediente.stock / ingrediente.stockMinimo) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          ingrediente.estado === 'bajo' ? 'bg-destructive' :
                          ingrediente.estado === 'normal' ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ 
                          width: `${Math.min((ingrediente.stock / ingrediente.stockMinimo) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="mt-6">
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Vista por Categorías</h3>
            <p className="text-muted-foreground">Organiza tus ingredientes por categorías para mejor gestión</p>
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
