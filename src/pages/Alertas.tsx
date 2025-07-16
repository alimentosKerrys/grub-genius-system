
import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Bell, Shield, Zap } from "lucide-react"

const Alertas = () => {
  return (
    <AppLayout 
      title="Centro de Alertas" 
      description="Mantente informado de todo lo importante en tu negocio"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="animate-scale-in border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">5</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in border-warning/20" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Importantes</CardTitle>
            <Bell className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">8</div>
            <p className="text-xs text-muted-foreground">
              Para revisar hoy
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in border-primary/20" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Informativas</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">
              Para conocimiento
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in border-success/20" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automatizadas</CardTitle>
            <Zap className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">25</div>
            <p className="text-xs text-muted-foreground">
              Ya resueltas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Sistema de Alertas Inteligente</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Recibe notificaciones automáticas sobre stock bajo, vencimientos, costos elevados y oportunidades de mejora
        </p>
      </div>
    </AppLayout>
  )
}

export default Alertas
