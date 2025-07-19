import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, ChefHat, Package } from "lucide-react"
import type { Plato, Receta } from "@/hooks/usePlatos"

interface VerRecetaDialogProps {
  plato: Plato | null
  recetas: Receta[]
  isOpen: boolean
  onClose: () => void
}

export function VerRecetaDialog({ plato, recetas, isOpen, onClose }: VerRecetaDialogProps) {
  if (!plato) return null

  const ingredientesPrincipales = recetas.filter(r => r.es_principal)
  const ingredientesSecundarios = recetas.filter(r => !r.es_principal)

  const calcularCostoTotal = () => {
    return recetas.reduce((total, receta) => {
      const precio = receta.ingrediente?.precio_unitario || 0
      return total + (precio * receta.cantidad)
    }, 0)
  }

  const calcularMargen = () => {
    const costo = calcularCostoTotal()
    if (costo === 0) return 0
    return Math.round(((plato.precio_base - costo) / plato.precio_base) * 100 * 10) / 10
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ChefHat className="h-5 w-5" />
            Receta: {plato.nombre}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Información general */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{plato.tiempo_preparacion} min</div>
                      <div className="text-xs text-muted-foreground">Tiempo prep.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{plato.porciones_por_receta}</div>
                      <div className="text-xs text-muted-foreground">Porciones</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">S/ {calcularCostoTotal().toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Costo total</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-success">{calcularMargen()}%</div>
                      <div className="text-xs text-muted-foreground">Margen</div>
                    </div>
                  </div>
                </div>
                
                {plato.descripcion && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Descripción</h4>
                    <p className="text-muted-foreground">{plato.descripcion}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{plato.categoria}</Badge>
                  {plato.es_combinable && <Badge variant="outline">Combinable</Badge>}
                  {plato.incluye_arroz && <Badge variant="outline">Incluye Arroz</Badge>}
                </div>
              </CardContent>
            </Card>

            {/* Ingredientes principales */}
            {ingredientesPrincipales.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Ingredientes Principales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ingredientesPrincipales.map((receta) => (
                      <div key={receta.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{receta.ingrediente?.nombre || 'Ingrediente'}</div>
                          <div className="text-sm text-muted-foreground">
                            {receta.cantidad} {receta.unidad}
                          </div>
                          {receta.notas && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Nota: {receta.notas}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            S/ {((receta.ingrediente?.precio_unitario || 0) * receta.cantidad).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            S/ {(receta.ingrediente?.precio_unitario || 0).toFixed(2)}/{receta.unidad}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ingredientes secundarios */}
            {ingredientesSecundarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ingredientes Secundarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ingredientesSecundarios.map((receta) => (
                      <div key={receta.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <div className="font-medium">{receta.ingrediente?.nombre || 'Ingrediente'}</div>
                          <div className="text-sm text-muted-foreground">
                            {receta.cantidad} {receta.unidad}
                          </div>
                          {receta.notas && (
                            <div className="text-xs text-muted-foreground">
                              {receta.notas}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            S/ {((receta.ingrediente?.precio_unitario || 0) * receta.cantidad).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {recetas.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sin receta definida</h3>
                  <p className="text-muted-foreground">
                    Este plato aún no tiene ingredientes definidos en su receta.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Resumen de costos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Costos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Costo total de ingredientes:</span>
                    <span className="font-semibold">S/ {calcularCostoTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio de venta:</span>
                    <span className="font-semibold">S/ {plato.precio_base.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span>Margen de ganancia:</span>
                    <span className="font-bold text-success">
                      S/ {(plato.precio_base - calcularCostoTotal()).toFixed(2)} ({calcularMargen()}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}