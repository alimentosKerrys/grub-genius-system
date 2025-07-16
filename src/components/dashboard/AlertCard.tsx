import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package, TrendingDown, Clock } from "lucide-react"

interface Alert {
  id: string
  type: "stock_low" | "cost_increase" | "expiring"
  title: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: string
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "stock_low",
    title: "Stock bajo: Cebolla",
    description: "Quedan 2 kg para 1 día de operación",
    severity: "high",
    timestamp: "Hace 2 horas"
  },
  {
    id: "2", 
    type: "cost_increase",
    title: "Aumento de precio: Pollo",
    description: "Precio subió 15% en la última semana",
    severity: "medium",
    timestamp: "Ayer"
  },
  {
    id: "3",
    type: "expiring",
    title: "Próximo a vencer: Yogurt",
    description: "Vence en 2 días - 5 unidades",
    severity: "medium", 
    timestamp: "Hace 4 horas"
  }
]

const alertIcons = {
  stock_low: Package,
  cost_increase: TrendingDown,
  expiring: Clock
}

const severityColors = {
  low: "secondary",
  medium: "warning",
  high: "destructive"
} as const

export function AlertCard() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Alertas Activas
        </CardTitle>
        <Badge variant="destructive" className="font-medium">
          {alerts.length}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alertIcons[alert.type]
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {alert.title}
                    </p>
                    <Badge 
                      variant={severityColors[alert.severity]}
                      className="text-xs px-1.5 py-0.5"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      Resolver
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Button variant="outline" className="w-full mt-4" size="sm">
          Ver todas las alertas
        </Button>
      </CardContent>
    </Card>
  )
}