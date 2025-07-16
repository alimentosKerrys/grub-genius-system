
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar,
  ChefHat,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Eye,
  MoreVertical
} from "lucide-react"

// Mock data para el MVP
const menuSemanal = [
  {
    fecha: "2024-01-15",
    dia: "Lunes",
    platos: [
      { nombre: "Arroz con Pollo", tipo: "principal", porciones: 25, costo: 8.50 },
      { nombre: "Lomo Saltado", tipo: "principal", porciones: 20, costo: 12.80 },
      { nombre: "Causa Limeña", tipo: "entrada", porciones: 15, costo: 4.20 }
    ],
    costoTotal: 468.50,
    ventaEstimada: 850.00,
    margen: 81.2
  },
  {
    fecha: "2024-01-16", 
    dia: "Martes",
    platos: [
      { nombre: "Ají de Gallina", tipo: "principal", porciones: 30, costo: 9.20 },
      { nombre: "Tacu Tacu", tipo: "principal", porciones: 18, costo: 7.80 },
      { nombre: "Papa Rellena", tipo: "entrada", porciones: 20, costo: 3.50 }
    ],
    costoTotal: 486.40,
    ventaEstimada: 920.00,
    margen: 89.1
  },
  {
    fecha: "2024-01-17",
    dia: "Miércoles", 
    platos: [],
    costoTotal: 0,
    ventaEstimada: 0,
    margen: 0
  },
  {
    fecha: "2024-01-18",
    dia: "Jueves",
    platos: [],
    costoTotal: 0,
    ventaEstimada: 0,
    margen: 0
  },
  {
    fecha: "2024-01-19",
    dia: "Viernes",
    platos: [],
    costoTotal: 0,
    ventaEstimada: 0,
    margen: 0
  }
]

const Planificacion = () => {
  return (
    <AppLayout 
      title="Planificación de Menús" 
      description="Organiza tu menú semanal y optimiza tus costos"
    >
      {/* Métricas de la semana */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días Planificados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/5</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Semanal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ 955</div>
            <p className="text-xs text-success">
              -12% vs semana anterior
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venta Estimada</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ 1,770</div>
            <p className="text-xs text-success">
              Margen: 85.3%
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Porciones Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Planificadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button className="bg-gradient-warm hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Planificar Día
        </Button>
        
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Vista Mensual
        </Button>
        
        <Button variant="outline">
          Sugerencias IA
        </Button>
        
        <Button variant="outline">
          Generar Lista de Compras
        </Button>
      </div>

      {/* Calendario semanal */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Semana del 15 - 19 Enero 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {menuSemanal.map((dia, index) => (
                <Card key={dia.fecha} className={`transition-all duration-200 hover:shadow-subtle ${dia.platos.length === 0 ? 'border-dashed border-2' : ''} animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-fresh rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {dia.dia.substring(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{dia.dia}</h3>
                          <p className="text-sm text-muted-foreground">{dia.fecha}</p>
                        </div>
                        {dia.platos.length > 0 && (
                          <Badge variant="fresh" className="ml-2">
                            {dia.platos.length} platos
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {dia.platos.length > 0 ? (
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium">S/ {dia.costoTotal}</div>
                            <div className="text-xs text-success">Margen: {dia.margen}%</div>
                          </div>
                        ) : null}
                        
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {dia.platos.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {dia.platos.map((plato, platoIndex) => (
                            <div key={platoIndex} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                              <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
                                <ChefHat className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{plato.nombre}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{plato.porciones} porciones</span>
                                  <span>•</span>
                                  <span>S/ {plato.costo} c/u</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {plato.tipo}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        
                        {/* Resumen del día */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Total porciones: <span className="font-medium text-foreground">{dia.platos.reduce((sum, p) => sum + p.porciones, 0)}</span>
                            </span>
                            <span className="text-muted-foreground">
                              Venta estimada: <span className="font-medium text-success">S/ {dia.ventaEstimada}</span>
                            </span>
                          </div>
                          
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-2" />
                            Detalles
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ChefHat className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-3">No hay menú planificado para este día</p>
                        <Button size="sm" className="bg-gradient-fresh hover:opacity-90">
                          <Plus className="h-3 w-3 mr-2" />
                          Planificar Menú
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Planificacion
