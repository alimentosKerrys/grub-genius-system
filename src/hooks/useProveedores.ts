
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Proveedor {
  id: string
  nombre: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const refreshData = async () => {
    setLoading(true)
    try {
      console.log('Fetching proveedores data...')
      
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true })

      if (error) {
        console.error('Error fetching proveedores:', error)
        throw error
      }
      
      console.log('Proveedores fetched:', data)
      setProveedores(data || [])

    } catch (error) {
      console.error('Error fetching proveedores data:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de proveedores",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [toast])

  const getMetricas = () => {
    return {
      totalProveedores: proveedores.length,
      conContacto: proveedores.filter(p => p.telefono || p.email).length,
      conDireccion: proveedores.filter(p => p.direccion).length
    }
  }

  return { 
    proveedores, 
    loading, 
    getMetricas,
    refreshData
  }
}
