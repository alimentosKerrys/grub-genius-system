
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Mesa {
  id: string
  numero: number
  capacidad: number
  estado: 'libre' | 'ocupada' | 'reservada'
  activa: boolean
  pedido_actual?: {
    id: string
    numero_pedido: string
    total: number
    estado: string
    hora_pedido: string
  }
}

export function useMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchMesas = async () => {
    try {
      const { data: mesasData, error } = await supabase
        .from('mesas')
        .select('*')
        .eq('activa', true)
        .order('numero')

      if (error) throw error

      // Obtener pedidos activos por mesa
      const { data: pedidosData, error: pedidosError } = await supabase
        .from('pedidos')
        .select('id, numero_pedido, total, estado, hora_pedido, mesa_id')
        .in('estado', ['pendiente', 'preparando', 'listo'])

      if (pedidosError) throw pedidosError

      // Combinar datos
      const mesasConPedidos = mesasData?.map(mesa => {
        const pedidoActual = pedidosData?.find(p => p.mesa_id === mesa.id)
        
        return {
          ...mesa,
          estado: pedidoActual ? 'ocupada' : mesa.estado,
          pedido_actual: pedidoActual || undefined
        } as Mesa
      }) || []

      setMesas(mesasConPedidos)
    } catch (error) {
      console.error('Error fetching mesas:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las mesas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstadoMesa = async (mesaId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('mesas')
        .update({ estado: nuevoEstado })
        .eq('id', mesaId)

      if (error) throw error

      toast({
        title: "Mesa actualizada",
        description: `Mesa marcada como ${nuevoEstado}`,
      })

      fetchMesas()
    } catch (error) {
      console.error('Error updating mesa:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la mesa",
        variant: "destructive"
      })
    }
  }

  const getTiempoOcupacion = (horaPedido: string) => {
    const now = new Date()
    const pedidoTime = new Date(horaPedido)
    const diffMs = now.getTime() - pedidoTime.getTime()
    return Math.floor(diffMs / (1000 * 60)) // minutos
  }

  useEffect(() => {
    fetchMesas()

    // Suscripción a tiempo real
    const channel = supabase
      .channel('mesas-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mesas'
      }, () => {
        fetchMesas()
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pedidos'
      }, () => {
        fetchMesas()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    mesas,
    loading,
    cambiarEstadoMesa,
    getTiempoOcupacion,
    refetch: fetchMesas
  }
}
