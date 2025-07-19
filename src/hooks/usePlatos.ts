import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Plato {
  id: string
  nombre: string
  categoria: string
  descripcion?: string
  precio_base: number
  costo_total: number
  margen_porcentaje: number
  tiempo_preparacion: number
  dias_populares?: string
  es_combinable: boolean
  incluye_arroz: boolean
  activo: boolean
  created_at: string
  updated_at: string
  porciones_por_receta: number
}

export interface Ingrediente {
  id: string
  nombre: string
  categoria: string
  precio_unitario: number
}

export interface Receta {
  id: string
  plato_id: string
  ingrediente_id: string
  cantidad: number
  unidad: string
  es_principal: boolean
  notas?: string
  ingrediente?: Ingrediente
}

export function usePlatos() {
  const [platos, setPlatos] = useState<Plato[]>([])
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching platos data...')
        
        // Fetch platos
        const { data: platosData, error: platosError } = await supabase
          .from('platos')
          .select('*')
          .eq('activo', true)
          .order('categoria', { ascending: true })
          .order('nombre', { ascending: true })

        if (platosError) {
          console.error('Error fetching platos:', platosError)
          throw platosError
        }
        
        console.log('Platos fetched:', platosData)
        setPlatos(platosData || [])

        // Fetch recetas con ingredientes
        const { data: recetasData, error: recetasError } = await supabase
          .from('recetas')
          .select(`
            *,
            ingrediente:ingredientes(
              id,
              nombre,
              categoria,
              precio_unitario
            )
          `)
          .order('plato_id')
          .order('es_principal', { ascending: false })

        if (recetasError) {
          console.error('Error fetching recetas:', recetasError)
          throw recetasError
        }
        
        console.log('Recetas fetched:', recetasData)
        setRecetas(recetasData || [])

        // Fetch ingredientes
        const { data: ingredientesData, error: ingredientesError } = await supabase
          .from('ingredientes')
          .select('id, nombre, categoria, precio_unitario')
          .eq('activo', true)
          .order('nombre')

        if (ingredientesError) {
          console.error('Error fetching ingredientes:', ingredientesError)
          throw ingredientesError
        }
        
        console.log('Ingredientes fetched:', ingredientesData)
        setIngredientes(ingredientesData || [])

      } catch (error) {
        console.error('Error fetching platos data:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de platos",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Función para obtener recetas de un plato específico
  const getRecetasByPlato = (platoId: string) => {
    return recetas.filter(receta => receta.plato_id === platoId)
  }

  // Función para calcular métricas
  const getMetricas = () => {
    if (platos.length === 0) {
      return {
        totalPlatos: 0,
        categorias: 0,
        margenPromedio: 0,
        tiempoPromedio: 0,
        ratingPromedio: 4.8 // Mock por ahora
      }
    }

    const categorias = new Set(platos.map(p => p.categoria)).size
    const margenPromedio = platos.reduce((sum, p) => sum + (p.margen_porcentaje || 0), 0) / platos.length
    const tiempoPromedio = platos.reduce((sum, p) => sum + (p.tiempo_preparacion || 0), 0) / platos.length

    return {
      totalPlatos: platos.length,
      categorias,
      margenPromedio: Math.round(margenPromedio * 10) / 10,
      tiempoPromedio: Math.round(tiempoPromedio),
      ratingPromedio: 4.8 // Mock por ahora
    }
  }

  // Función para filtrar platos por categoría
  const getPlatosByCategoria = (categoria?: string) => {
    if (!categoria || categoria === 'todos') return platos
    
    // Mapear categorías del frontend a las del backend
    const categoriaMap: Record<string, string[]> = {
      'principales': ['Guisos', 'Salteados', 'Parrillas', 'Chifas', 'Pastas'],
      'entradas': ['Entradas'],
      'bebidas': ['Bebidas']
    }

    const categoriasBackend = categoriaMap[categoria] || [categoria]
    return platos.filter(plato => categoriasBackend.includes(plato.categoria))
  }

  return { 
    platos, 
    recetas, 
    ingredientes, 
    loading, 
    getRecetasByPlato, 
    getMetricas, 
    getPlatosByCategoria 
  }
}