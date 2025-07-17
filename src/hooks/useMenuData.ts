
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Entrada {
  id: string
  nombre: string
  descripcion?: string
  costo_preparacion: number
}

export interface PlatoMenu {
  id: string
  nombre: string
  categoria: string
  precio_base: number
  descripcion?: string
  tiempo_preparacion: number
  es_combinable: boolean
}

export interface MenuCompleto {
  id: string
  nombre: string
  precio_menu: number
  descripcion?: string
}

export function useMenuData() {
  const [entradas, setEntradas] = useState<Entrada[]>([])
  const [platos, setPlatos] = useState<PlatoMenu[]>([])
  const [menus, setMenus] = useState<MenuCompleto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Fetch entradas
        const { data: entradasData, error: entradasError } = await supabase
          .from('entradas')
          .select('*')
          .eq('activo', true)

        if (entradasError) throw entradasError
        setEntradas(entradasData || [])

        // Fetch platos
        const { data: platosData, error: platosError } = await supabase
          .from('platos')
          .select('*')
          .eq('activo', true)

        if (platosError) throw platosError
        setPlatos(platosData || [])

        // Fetch menus
        const { data: menusData, error: menusError } = await supabase
          .from('menus')
          .select('*')
          .eq('activo', true)

        if (menusError) throw menusError
        setMenus(menusData || [])

      } catch (error) {
        console.error('Error fetching menu data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  return { entradas, platos, menus, loading }
}
