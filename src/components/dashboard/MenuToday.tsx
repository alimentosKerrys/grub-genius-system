import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  cost: number
  price: number
  estimatedPortions: number
  soldPortions: number
  category: "principal" | "entrada"
}

const todayMenu: MenuItem[] = [
  {
    id: "1",
    name: "Arroz con Pollo",
    cost: 8.50,
    price: 15.00,
    estimatedPortions: 50,
    soldPortions: 32,
    category: "principal"
  },
  {
    id: "2", 
    name: "Lomo Saltado",
    cost: 12.00,
    price: 18.00,
    estimatedPortions: 30,
    soldPortions: 25,
    category: "principal"
  },
  {
    id: "3",
    name: "Ensalada César",
    cost: 4.50,
    price: 8.00,
    estimatedPortions: 25,
    soldPortions: 18,
    category: "entrada"
  }
]

export function MenuToday() {
  const totalCost = todayMenu.reduce((sum, item) => sum + (item.cost * item.soldPortions), 0)
  const totalRevenue = todayMenu.reduce((sum, item) => sum + (item.price * item.soldPortions), 0)
  const totalMargin = totalRevenue - totalCost

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Menú de Hoy
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="font-medium">
            Lunes, 16 Jul
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-muted-foreground">Costo Total</span>
            </div>
            <span className="text-lg font-bold text-destructive">S/ {totalCost.toFixed(2)}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Ingresos</span>
            </div>
            <span className="text-lg font-bold text-success">S/ {totalRevenue.toFixed(2)}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Margen</span>
            </div>
            <span className="text-lg font-bold text-primary">S/ {totalMargin.toFixed(2)}</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {todayMenu.map((item) => {
            const salesProgress = (item.soldPortions / item.estimatedPortions) * 100
            const margin = ((item.price - item.cost) / item.price) * 100
            
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <Badge 
                      variant={item.category === "principal" ? "chef" : "fresh"}
                      className="text-xs"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Vendidas / Estimadas</span>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {item.soldPortions} / {item.estimatedPortions}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Costo → Precio (Margen)</span>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          S/ {item.cost.toFixed(2)} → S/ {item.price.toFixed(2)} ({margin.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progreso de ventas</span>
                      <span className="font-medium">{salesProgress.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={salesProgress} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="chef" size="sm">
            Editar Menú
          </Button>
          <Button variant="outline" size="sm">
            Ver Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}