export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adicionales: {
        Row: {
          activo: boolean | null
          created_at: string
          id: string
          ingrediente_id: string | null
          nombre: string
          precio: number
        }
        Insert: {
          activo?: boolean | null
          created_at?: string
          id?: string
          ingrediente_id?: string | null
          nombre: string
          precio: number
        }
        Update: {
          activo?: boolean | null
          created_at?: string
          id?: string
          ingrediente_id?: string | null
          nombre?: string
          precio?: number
        }
        Relationships: [
          {
            foreignKeyName: "adicionales_ingrediente_id_fkey"
            columns: ["ingrediente_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          },
        ]
      }
      entradas: {
        Row: {
          activo: boolean
          costo_preparacion: number | null
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          costo_preparacion?: number | null
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          costo_preparacion?: number | null
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      ingredientes: {
        Row: {
          activo: boolean
          categoria: string
          created_at: string
          id: string
          merma_porcentaje: number | null
          nombre: string
          notas: string | null
          precio_unitario: number
          proveedor_principal: string | null
          stock_actual: number
          stock_minimo: number
          unidad_medida: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          categoria: string
          created_at?: string
          id?: string
          merma_porcentaje?: number | null
          nombre: string
          notas?: string | null
          precio_unitario?: number
          proveedor_principal?: string | null
          stock_actual?: number
          stock_minimo?: number
          unidad_medida: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          categoria?: string
          created_at?: string
          id?: string
          merma_porcentaje?: number | null
          nombre?: string
          notas?: string | null
          precio_unitario?: number
          proveedor_principal?: string | null
          stock_actual?: number
          stock_minimo?: number
          unidad_medida?: string
          updated_at?: string
        }
        Relationships: []
      }
      lista_compras: {
        Row: {
          cantidad_comprada: number | null
          cantidad_necesaria: number
          comprado: boolean | null
          created_at: string
          fecha_necesaria: string
          id: string
          ingrediente_id: string
          precio_estimado: number | null
          precio_real: number | null
          proveedor: string | null
        }
        Insert: {
          cantidad_comprada?: number | null
          cantidad_necesaria: number
          comprado?: boolean | null
          created_at?: string
          fecha_necesaria: string
          id?: string
          ingrediente_id: string
          precio_estimado?: number | null
          precio_real?: number | null
          proveedor?: string | null
        }
        Update: {
          cantidad_comprada?: number | null
          cantidad_necesaria?: number
          comprado?: boolean | null
          created_at?: string
          fecha_necesaria?: string
          id?: string
          ingrediente_id?: string
          precio_estimado?: number | null
          precio_real?: number | null
          proveedor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lista_compras_ingrediente_id_fkey"
            columns: ["ingrediente_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_semanal: {
        Row: {
          activo: boolean | null
          cantidad_estimada: number | null
          cantidad_real: number | null
          created_at: string
          dia_semana: string
          fecha: string
          id: string
          plato_id: string
        }
        Insert: {
          activo?: boolean | null
          cantidad_estimada?: number | null
          cantidad_real?: number | null
          created_at?: string
          dia_semana: string
          fecha: string
          id?: string
          plato_id: string
        }
        Update: {
          activo?: boolean | null
          cantidad_estimada?: number | null
          cantidad_real?: number | null
          created_at?: string
          dia_semana?: string
          fecha?: string
          id?: string
          plato_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_semanal_plato_id_fkey"
            columns: ["plato_id"]
            isOneToOne: false
            referencedRelation: "platos"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          precio_menu: number
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          precio_menu?: number
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          precio_menu?: number
        }
        Relationships: []
      }
      mesas: {
        Row: {
          activa: boolean | null
          capacidad: number
          created_at: string
          estado: string | null
          id: string
          numero: number
        }
        Insert: {
          activa?: boolean | null
          capacidad?: number
          created_at?: string
          estado?: string | null
          id?: string
          numero: number
        }
        Update: {
          activa?: boolean | null
          capacidad?: number
          created_at?: string
          estado?: string | null
          id?: string
          numero?: number
        }
        Relationships: []
      }
      pedido_adicionales: {
        Row: {
          adicional_id: string
          cantidad: number
          created_at: string
          id: string
          pedido_item_id: string
          precio_unitario: number
        }
        Insert: {
          adicional_id: string
          cantidad?: number
          created_at?: string
          id?: string
          pedido_item_id: string
          precio_unitario: number
        }
        Update: {
          adicional_id?: string
          cantidad?: number
          created_at?: string
          id?: string
          pedido_item_id?: string
          precio_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_adicionales_adicional_id_fkey"
            columns: ["adicional_id"]
            isOneToOne: false
            referencedRelation: "adicionales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_adicionales_pedido_item_id_fkey"
            columns: ["pedido_item_id"]
            isOneToOne: false
            referencedRelation: "pedido_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_items: {
        Row: {
          cantidad: number
          created_at: string
          entrada_id: string | null
          es_combinacion: boolean | null
          es_menu: boolean | null
          id: string
          observaciones: string | null
          pedido_id: string
          plato_combinado_id: string | null
          plato_id: string
          porcentaje_combinacion: number | null
          precio_menu: number | null
          precio_unitario: number
        }
        Insert: {
          cantidad?: number
          created_at?: string
          entrada_id?: string | null
          es_combinacion?: boolean | null
          es_menu?: boolean | null
          id?: string
          observaciones?: string | null
          pedido_id: string
          plato_combinado_id?: string | null
          plato_id: string
          porcentaje_combinacion?: number | null
          precio_menu?: number | null
          precio_unitario: number
        }
        Update: {
          cantidad?: number
          created_at?: string
          entrada_id?: string | null
          es_combinacion?: boolean | null
          es_menu?: boolean | null
          id?: string
          observaciones?: string | null
          pedido_id?: string
          plato_combinado_id?: string | null
          plato_id?: string
          porcentaje_combinacion?: number | null
          precio_menu?: number | null
          precio_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_items_entrada_id_fkey"
            columns: ["entrada_id"]
            isOneToOne: false
            referencedRelation: "entradas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_plato_combinado_id_fkey"
            columns: ["plato_combinado_id"]
            isOneToOne: false
            referencedRelation: "platos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_plato_id_fkey"
            columns: ["plato_id"]
            isOneToOne: false
            referencedRelation: "platos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_nombre: string | null
          cliente_telefono: string | null
          created_at: string
          direccion_delivery: string | null
          estado: string
          hora_entrega: string | null
          hora_pedido: string
          id: string
          mesa_id: string | null
          mozo_responsable: string | null
          numero_pedido: string
          observaciones: string | null
          subtotal: number
          tiempo_preparacion: number | null
          tipo_pedido: string
          total: number
          updated_at: string
        }
        Insert: {
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          created_at?: string
          direccion_delivery?: string | null
          estado?: string
          hora_entrega?: string | null
          hora_pedido?: string
          id?: string
          mesa_id?: string | null
          mozo_responsable?: string | null
          numero_pedido: string
          observaciones?: string | null
          subtotal?: number
          tiempo_preparacion?: number | null
          tipo_pedido: string
          total?: number
          updated_at?: string
        }
        Update: {
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          created_at?: string
          direccion_delivery?: string | null
          estado?: string
          hora_entrega?: string | null
          hora_pedido?: string
          id?: string
          mesa_id?: string | null
          mozo_responsable?: string | null
          numero_pedido?: string
          observaciones?: string | null
          subtotal?: number
          tiempo_preparacion?: number | null
          tipo_pedido?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_mesa_id_fkey"
            columns: ["mesa_id"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["id"]
          },
        ]
      }
      platos: {
        Row: {
          activo: boolean
          categoria: string
          costo_total: number | null
          created_at: string
          descripcion: string | null
          dias_populares: string | null
          es_combinable: boolean | null
          id: string
          incluye_arroz: boolean | null
          margen_porcentaje: number | null
          nombre: string
          porciones_por_receta: number
          precio_base: number
          tiempo_preparacion: number | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          categoria: string
          costo_total?: number | null
          created_at?: string
          descripcion?: string | null
          dias_populares?: string | null
          es_combinable?: boolean | null
          id?: string
          incluye_arroz?: boolean | null
          margen_porcentaje?: number | null
          nombre: string
          porciones_por_receta?: number
          precio_base: number
          tiempo_preparacion?: number | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          categoria?: string
          costo_total?: number | null
          created_at?: string
          descripcion?: string | null
          dias_populares?: string | null
          es_combinable?: boolean | null
          id?: string
          incluye_arroz?: boolean | null
          margen_porcentaje?: number | null
          nombre?: string
          porciones_por_receta?: number
          precio_base?: number
          tiempo_preparacion?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      recetas: {
        Row: {
          cantidad: number
          created_at: string
          es_principal: boolean | null
          id: string
          ingrediente_id: string
          notas: string | null
          plato_id: string
          unidad: string
        }
        Insert: {
          cantidad: number
          created_at?: string
          es_principal?: boolean | null
          id?: string
          ingrediente_id: string
          notas?: string | null
          plato_id: string
          unidad: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          es_principal?: boolean | null
          id?: string
          ingrediente_id?: string
          notas?: string | null
          plato_id?: string
          unidad?: string
        }
        Relationships: [
          {
            foreignKeyName: "recetas_ingrediente_id_fkey"
            columns: ["ingrediente_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recetas_plato_id_fkey"
            columns: ["plato_id"]
            isOneToOne: false
            referencedRelation: "platos"
            referencedColumns: ["id"]
          },
        ]
      }
      transacciones: {
        Row: {
          created_at: string
          descripcion: string | null
          fecha_transaccion: string
          id: string
          metodo_pago: string | null
          monto: number
          pedido_id: string | null
          tipo: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          fecha_transaccion?: string
          id?: string
          metodo_pago?: string | null
          monto: number
          pedido_id?: string | null
          tipo: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          fecha_transaccion?: string
          id?: string
          metodo_pago?: string | null
          monto?: number
          pedido_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
