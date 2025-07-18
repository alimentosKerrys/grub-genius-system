
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        console.log('Fetching menu data...')
        
        // Fetch entradas
        const { data: entradasData, error: entradasError } = await supabase
          .from('entradas')
          .select('*')
          .eq('activo', true)
          .order('nombre')

        if (entradasError) {
          console.error('Error fetching entradas:', entradasError)
          throw entradasError
        }
        
        console.log('Entradas fetched:', entradasData)
        setEntradas(entradasData || [])

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

        // Fetch menus
        const { data: menusData, error: menusError } = await supabase
          .from('menus')
          .select('*')
          .eq('activo', true)
          .order('nombre')

        if (menusError) {
          console.error('Error fetching menus:', menusError)
          throw menusError
        }
        
        console.log('Menus fetched:', menusData)
        setMenus(menusData || [])

      } catch (error) {
        console.error('Error fetching menu data:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del menú",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [toast])

  return { entradas, platos, menus, loading }
}
