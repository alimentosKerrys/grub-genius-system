
import { AppLayout } from "@/components/layout/AppLayout"
import { PedidosEnVivo } from "@/components/pedidos/PedidosEnVivo"

export default function Pedidos() {
  return (
    <AppLayout 
      title="Pedidos en Vivo" 
      description="Gestión en tiempo real de pedidos - Mesas, Delivery y Para Llevar"
    >
      <PedidosEnVivo />
    </AppLayout>
  )
}
