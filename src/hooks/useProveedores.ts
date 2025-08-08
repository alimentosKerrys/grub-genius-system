
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
      
      // Temporalmente usar ingredientes como base para proveedores hasta que se cree la tabla real
      const { data, error } = await supabase
        .from('ingredientes')
        .select('id, proveedor_principal, created_at, updated_at')
        .not('proveedor_principal', 'is', null)

      if (error) {
        console.error('Error fetching proveedores:', error)
        throw error
      }
      
      // Agrupar por proveedor principal y crear estructura de proveedor
      const proveedoresUnicos = new Map()
      data?.forEach(item => {
        if (item.proveedor_principal && !proveedoresUnicos.has(item.proveedor_principal)) {
          proveedoresUnicos.set(item.proveedor_principal, {
            id: item.id,
            nombre: item.proveedor_principal,
            contacto: 'Contacto disponible',
            telefono: '999-888-777',
            email: `${item.proveedor_principal.toLowerCase().replace(/\s+/g, '')}@proveedor.com`,
            direccion: 'Lima, Perú',
            activo: true,
            created_at: item.created_at,
            updated_at: item.updated_at
          })
        }
      })
      
      console.log('Proveedores fetched:', Array.from(proveedoresUnicos.values()))
      setProveedores(Array.from(proveedoresUnicos.values()))

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
