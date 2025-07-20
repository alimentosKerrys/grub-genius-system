
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Ingrediente {
  id: string
  nombre: string
  categoria: string
  unidad_medida: string
  precio_unitario: number
  stock_actual: number
  stock_minimo: number
  merma_porcentaje: number
  proveedor_principal?: string
  notas?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export function useIngredientes() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Función para refrescar datos
  const refreshData = async () => {
    setLoading(true)
    try {
      console.log('Fetching ingredientes data...')
      
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .eq('activo', true)
        .order('categoria', { ascending: true })
        .order('nombre', { ascending: true })

      if (error) {
        console.error('Error fetching ingredientes:', error)
        throw error
      }
      
      console.log('Ingredientes fetched:', data)
      setIngredientes(data || [])

    } catch (error) {
      console.error('Error fetching ingredientes data:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los ingredientes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [toast])

  // Función para actualizar stock
  const updateStock = async (id: string, nuevoStock: number) => {
    try {
      const { error } = await supabase
        .from('ingredientes')
        .update({ stock_actual: nuevoStock })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Stock actualizado",
        description: "El stock se actualizó correctamente",
      })
      
      await refreshData()
    } catch (error) {
      console.error('Error updating stock:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el stock",
        variant: "destructive"
      })
    }
  }

  // Función para actualizar precio
  const updatePrecio = async (id: string, nuevoPrecio: number) => {
    try {
      const { error } = await supabase
        .from('ingredientes')
        .update({ precio_unitario: nuevoPrecio })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Precio actualizado",
        description: "El precio se actualizó correctamente",
      })
      
      await refreshData()
    } catch (error) {
      console.error('Error updating precio:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el precio",
        variant: "destructive"
      })
    }
  }

  // Función para obtener métricas
  const getMetricas = () => {
    if (ingredientes.length === 0) {
      return {
        totalIngredientes: 0,
        stockBajo: 0,
        valorTotal: 0,
        proveedores: 0
      }
    }

    const stockBajo = ingredientes.filter(i => i.stock_actual <= i.stock_minimo).length
    const valorTotal = ingredientes.reduce((sum, i) => sum + (i.stock_actual * i.precio_unitario), 0)
    const proveedores = new Set(ingredientes.map(i => i.proveedor_principal).filter(Boolean)).size

    return {
      totalIngredientes: ingredientes.length,
      stockBajo,
      valorTotal: Math.round(valorTotal),
      proveedores
    }
  }

  // Función para obtener estado de stock
  const getEstadoStock = (ingrediente: Ingrediente) => {
    if (ingrediente.stock_actual <= ingrediente.stock_minimo * 0.5) {
      return 'bajo' as const
    } else if (ingrediente.stock_actual <= ingrediente.stock_minimo) {
      return 'normal' as const
    } else {
      return 'optimo' as const
    }
  }

  // Función para filtrar por categoría
  const getIngredientesByCategoria = (categoria?: string) => {
    if (!categoria || categoria === 'todos') return ingredientes
    return ingredientes.filter(ingrediente => ingrediente.categoria === categoria)
  }

  return { 
    ingredientes, 
    loading, 
    getMetricas, 
    getEstadoStock, 
    getIngredientesByCategoria,
    updateStock,
    updatePrecio,
    refreshData
  }
}
