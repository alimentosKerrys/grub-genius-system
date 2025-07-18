
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Pedido {
  id: string
  numero_pedido: string
  tipo_pedido: 'local' | 'delivery' | 'para_llevar'
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado'
  mesa_id?: string
  mesa?: { numero: number }
  cliente_nombre?: string
  cliente_telefono?: string
  direccion_delivery?: string
  subtotal: number
  total: number
  hora_pedido: string
  tiempo_preparacion?: number
  observaciones?: string
  items: PedidoItem[]
}

export interface PedidoItem {
  id: string
  plato: { nombre: string; precio_base: number }
  entrada?: { nombre: string }
  cantidad: number
  precio_unitario: number
  es_menu: boolean
  precio_menu?: number
  observaciones?: string
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          mesa:mesas(numero),
          items:pedido_items(
            *,
            plato:platos(nombre, precio_base),
            entrada:entradas(nombre)
          )
        `)
        .neq('estado', 'entregado')
        .order('hora_pedido', { ascending: false })

      if (error) throw error
      
      // Mapear y validar datos correctamente
      const pedidosTyped = (data || []).map(pedido => ({
        ...pedido,
        tipo_pedido: pedido.tipo_pedido as 'local' | 'delivery' | 'para_llevar',
        estado: pedido.estado as 'pendiente' | 'preparando' | 'listo' | 'entregado',
        items: (pedido.items || []).map((item: any) => ({
          id: item.id,
          plato: {
            nombre: item.plato?.nombre || 'Plato no encontrado',
            precio_base: item.plato?.precio_base || 0
          },
          entrada: item.entrada ? { nombre: item.entrada.nombre } : undefined,
          cantidad: item.cantidad || 1,
          precio_unitario: item.precio_unitario || 0,
          es_menu: item.es_menu || false,
          precio_menu: item.precio_menu || undefined,
          observaciones: item.observaciones || undefined
        }))
      })) as Pedido[]
      
      setPedidos(pedidosTyped)
    } catch (error) {
      console.error('Error fetching pedidos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstadoPedido = async (pedidoId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ 
          estado: nuevoEstado,
          hora_entrega: nuevoEstado === 'entregado' ? new Date().toISOString() : null
        })
        .eq('id', pedidoId)

      if (error) throw error

      toast({
        title: "Estado actualizado",
        description: `Pedido marcado como ${nuevoEstado}`,
      })

      fetchPedidos() // Refrescar lista
    } catch (error) {
      console.error('Error updating pedido:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchPedidos()

    // Suscripción a tiempo real
    const channel = supabase
      .channel('pedidos-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pedidos'
      }, () => {
        fetchPedidos()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    pedidos,
    loading,
    cambiarEstadoPedido,
    refetch: fetchPedidos
  }
}
