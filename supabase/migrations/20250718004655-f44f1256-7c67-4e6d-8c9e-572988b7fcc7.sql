
-- Insertar algunos platos básicos para que aparezcan en la sección de PLATOS INDIVIDUALES
INSERT INTO public.platos (nombre, categoria, descripcion, precio_base, tiempo_preparacion, es_combinable) VALUES 
('Arroz con Pollo', 'Guisos', 'Tradicional arroz con pollo casero', 15.00, 25, false),
('Lomo Saltado', 'Salteados', 'Clásico lomo saltado con papas fritas', 18.00, 20, false),
('Ají de Gallina', 'Guisos', 'Cremoso ají de gallina con papas', 16.00, 30, false),
('Tallarines Verdes', 'Pastas', 'Tallarines con salsa de albahaca', 14.00, 15, true),
('Pollo a la Brasa (1/4)', 'Parrillas', 'Cuarto de pollo a la brasa con papas', 12.00, 20, false),
('Cau Cau', 'Guisos', 'Guiso de mondongo con papas', 13.00, 35, true),
('Seco de Cabrito', 'Guisos', 'Tradicional seco norteño', 20.00, 40, false),
('Arroz Chaufa', 'Chifas', 'Arroz frito al estilo chino', 14.00, 15, true);

-- Crear un plato genérico para los items de menú
INSERT INTO public.platos (nombre, categoria, descripcion, precio_base, tiempo_preparacion, es_combinable) VALUES 
('Plato del Día', 'Menús', 'Plato de fondo del menú ejecutivo', 8.00, 20, false);
