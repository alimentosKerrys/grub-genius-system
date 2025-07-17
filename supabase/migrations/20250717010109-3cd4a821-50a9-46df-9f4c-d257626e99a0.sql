
-- =============================================
-- SISTEMA COCINA PRO - MVP BACKEND COMPLETO
-- =============================================

-- 1. TABLA INGREDIENTES (base del sistema de costos)
CREATE TABLE public.ingredientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL, -- verduras, carnes, especias, etc
  unidad_medida VARCHAR(20) NOT NULL, -- kg, unidad, litro, etc
  precio_unitario DECIMAL(8,2) NOT NULL DEFAULT 0,
  stock_actual DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_minimo DECIMAL(10,2) NOT NULL DEFAULT 0,
  merma_porcentaje DECIMAL(5,2) DEFAULT 0, -- ej: Pallares = 15%
  proveedor_principal VARCHAR(100),
  notas TEXT, -- ej: "Pallares 2kg no funcionan, alta merma"
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. TABLA PLATOS (los 32 platos del menú)
CREATE TABLE public.platos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(50) NOT NULL, -- guisos, frituras, tallarines, etc
  descripcion TEXT,
  precio_base DECIMAL(8,2) NOT NULL,
  costo_total DECIMAL(8,2) DEFAULT 0, -- calculado automáticamente
  margen_porcentaje DECIMAL(5,2) DEFAULT 0,
  porciones_por_receta INTEGER NOT NULL DEFAULT 1,
  tiempo_preparacion INTEGER DEFAULT 0, -- minutos
  dias_populares VARCHAR(50), -- "MARTES,MIERCOLES" para Cau Cau
  es_combinable BOOLEAN DEFAULT false, -- guisos pueden mezclarse
  incluye_arroz BOOLEAN DEFAULT true, -- todos incluyen arroz
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. TABLA RECETAS (ingredientes por plato con cantidades exactas)
CREATE TABLE public.recetas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plato_id UUID NOT NULL REFERENCES public.platos(id) ON DELETE CASCADE,
  ingrediente_id UUID NOT NULL REFERENCES public.ingredientes(id) ON DELETE CASCADE,
  cantidad DECIMAL(10,3) NOT NULL, -- cantidad exacta por receta
  unidad VARCHAR(20) NOT NULL,
  es_principal BOOLEAN DEFAULT false, -- ingrediente principal del plato
  notas VARCHAR(200), -- ej: "sin venas", "dorar primero"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(plato_id, ingrediente_id)
);

-- 4. TABLA ADICIONALES (huevos, pescado extra, etc)
CREATE TABLE public.adicionales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  precio DECIMAL(6,2) NOT NULL,
  ingrediente_id UUID REFERENCES public.ingredientes(id),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. TABLA MESAS (para el sistema de pedidos)
CREATE TABLE public.mesas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE,
  capacidad INTEGER NOT NULL DEFAULT 4,
  estado VARCHAR(20) DEFAULT 'libre', -- libre, ocupada, reservada
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. TABLA PEDIDOS (pedidos en vivo)
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido VARCHAR(20) NOT NULL UNIQUE,
  mesa_id UUID REFERENCES public.mesas(id),
  tipo_pedido VARCHAR(20) NOT NULL, -- local, delivery, para_llevar
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente, preparando, listo, entregado
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  cliente_nombre VARCHAR(100),
  cliente_telefono VARCHAR(15),
  direccion_delivery TEXT,
  observaciones TEXT,
  hora_pedido TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  hora_entrega TIMESTAMP WITH TIME ZONE,
  tiempo_preparacion INTEGER, -- minutos reales
  mozo_responsable VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. TABLA ITEMS DEL PEDIDO
CREATE TABLE public.pedido_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  plato_id UUID NOT NULL REFERENCES public.platos(id),
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(8,2) NOT NULL,
  es_combinacion BOOLEAN DEFAULT false,
  porcentaje_combinacion DECIMAL(5,2), -- 50% para mezclas
  plato_combinado_id UUID REFERENCES public.platos(id), -- si es mezcla
  observaciones VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. TABLA ADICIONALES DEL PEDIDO
CREATE TABLE public.pedido_adicionales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_item_id UUID NOT NULL REFERENCES public.pedido_items(id) ON DELETE CASCADE,
  adicional_id UUID NOT NULL REFERENCES public.adicionales(id),
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(6,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. TABLA PLANIFICACIÓN SEMANAL
CREATE TABLE public.menu_semanal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL,
  dia_semana VARCHAR(10) NOT NULL,
  plato_id UUID NOT NULL REFERENCES public.platos(id),
  cantidad_estimada INTEGER DEFAULT 0,
  cantidad_real INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(fecha, plato_id)
);

-- 10. TABLA LISTA DE COMPRAS
CREATE TABLE public.lista_compras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ingrediente_id UUID NOT NULL REFERENCES public.ingredientes(id),
  cantidad_necesaria DECIMAL(10,2) NOT NULL,
  cantidad_comprada DECIMAL(10,2) DEFAULT 0,
  precio_estimado DECIMAL(8,2) DEFAULT 0,
  precio_real DECIMAL(8,2) DEFAULT 0,
  fecha_necesaria DATE NOT NULL,
  comprado BOOLEAN DEFAULT false,
  proveedor VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. TABLA TRANSACCIONES (ventas y costos)
CREATE TABLE public.transacciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL, -- venta, compra
  pedido_id UUID REFERENCES public.pedidos(id),
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(20), -- efectivo, tarjeta, yape, etc
  fecha_transaccion DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

CREATE INDEX idx_ingredientes_categoria ON public.ingredientes(categoria);
CREATE INDEX idx_ingredientes_activo ON public.ingredientes(activo);
CREATE INDEX idx_platos_categoria ON public.platos(categoria);
CREATE INDEX idx_platos_activo ON public.platos(activo);
CREATE INDEX idx_recetas_plato ON public.recetas(plato_id);
CREATE INDEX idx_pedidos_estado ON public.pedidos(estado);
CREATE INDEX idx_pedidos_fecha ON public.pedidos(hora_pedido);
CREATE INDEX idx_pedidos_mesa ON public.pedidos(mesa_id);
CREATE INDEX idx_menu_semanal_fecha ON public.menu_semanal(fecha);
CREATE INDEX idx_transacciones_fecha ON public.transacciones(fecha_transaccion);

-- =============================================
-- FUNCIÓN PARA ACTUALIZAR TIMESTAMPS
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- TRIGGERS PARA AUTO-UPDATE
CREATE TRIGGER update_ingredientes_updated_at BEFORE UPDATE ON public.ingredientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platos_updated_at BEFORE UPDATE ON public.platos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DATOS INICIALES BÁSICOS
-- =============================================

-- Insertar mesas básicas
INSERT INTO public.mesas (numero, capacidad) VALUES 
(1, 4), (2, 4), (3, 6), (4, 2), (5, 4), (6, 8);

-- Insertar adicionales básicos
INSERT INTO public.adicionales (nombre, precio) VALUES 
('Huevo Frito Extra', 2.50),
('Pescado Extra', 8.00),
('Porción Extra Arroz', 3.00);
