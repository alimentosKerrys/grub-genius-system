
-- =============================================
-- AGREGAR SISTEMA DE MENÚS (Entrada + Plato Fondo = S/9)
-- =============================================

-- 1. TABLA ENTRADAS (tequeños, sopa, ensalada palta)
CREATE TABLE public.entradas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  costo_preparacion DECIMAL(6,2) DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. TABLA MENUS (Entrada + Plato Fondo = S/9)
CREATE TABLE public.menus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL DEFAULT 'Menú del Día',
  precio_menu DECIMAL(6,2) NOT NULL DEFAULT 9.00,
  descripcion TEXT DEFAULT 'Entrada + Plato de Fondo',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. MODIFICAR TABLA PEDIDO_ITEMS para incluir MENÚS
ALTER TABLE public.pedido_items 
ADD COLUMN es_menu BOOLEAN DEFAULT false,
ADD COLUMN entrada_id UUID REFERENCES public.entradas(id),
ADD COLUMN precio_menu DECIMAL(6,2) DEFAULT 9.00;

-- =============================================
-- DATOS INICIALES PARA MENÚS
-- =============================================

-- Insertar entradas típicas
INSERT INTO public.entradas (nombre, descripcion, costo_preparacion) VALUES 
('Tequeños con Queso', 'Tequeños caseros rellenos de queso', 2.50),
('Sopa de Casa', 'Sopa del día preparada con ingredientes frescos', 1.80),
('Ensalada de Palta', 'Ensalada fresca con palta, tomate y cebolla', 2.00),
('Causa Limeña', 'Causa tradicional con pollo', 3.00);

-- Insertar menú base
INSERT INTO public.menus (nombre, precio_menu, descripcion) VALUES 
('Menú Ejecutivo', 9.00, 'Entrada + Plato de Fondo del día');

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================
CREATE INDEX idx_entradas_activo ON public.entradas(activo);
CREATE INDEX idx_menus_activo ON public.menus(activo);
CREATE INDEX idx_pedido_items_es_menu ON public.pedido_items(es_menu);
