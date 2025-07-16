
# INVESTIGACIÓN REQUERIDA PARA MVP - SISTEMA GESTIÓN COMIDA

## CONTEXTO DEL PROYECTO
Estamos desarrollando un MVP para un negocio de comida que centralice:
- Gestión de menús y costos
- Control de inventario e ingredientes  
- Planificación semanal de comidas
- Lista de compras automatizada
- Sistema de fidelización básico

## INFORMACIÓN CRÍTICA NECESARIA

### 1. ESTRUCTURA DE COSTOS EN NEGOCIOS DE COMIDA
**Necesitamos investigar:**
- ¿Cómo calculan los restaurantes el costo por porción?
- ¿Qué porcentaje del precio de venta representa el costo de ingredientes? (Food Cost %)
- ¿Cómo manejan la variación de precios de ingredientes?
- ¿Qué margen de ganancia es típico por plato?
- Fórmulas estándar para pricing de comidas

### 2. GESTIÓN DE INVENTARIO GASTRONÓMICO
**Necesitamos investigar:**
- ¿Cómo manejan el stock mínimo los restaurantes?
- ¿Qué sistema de rotación usan (FIFO/LIFO)?
- ¿Cómo calculan las mermas y desperdicios?
- ¿Qué alertas de stock son más efectivas?
- ¿Cómo integran proveedores en su flujo de compras?

### 3. PLANIFICACIÓN DE MENÚS PROFESIONAL
**Necesitamos investigar:**
- ¿Cómo planifican menús semanales los negocios exitosos?
- ¿Qué factores consideran para la selección diaria de platos?
- ¿Cómo balancean variedad vs eficiencia operativa?
- ¿Qué criterios usan para combinar platos en un menú?
- ¿Cómo calculan porciones estimadas por día?

### 4. FIDELIZACIÓN EN NEGOCIOS DE COMIDA
**Necesitamos investigar:**
- ¿Qué programas de lealtad funcionan mejor en food service?
- ¿Cómo estructuran los puntos/recompensas?
- ¿Qué datos de cliente capturan y cómo los usan?
- ¿Qué frecuencia de compra considera un "cliente fiel"?
- Ejemplos de programas exitosos de fidelización gastronómica

### 5. AUTOMATIZACIÓN EN LISTA DE COMPRAS
**Necesitamos investigar:**
- ¿Cómo agrupan compras por proveedor eficientemente?
- ¿Qué información incluyen en órdenes de compra?
- ¿Cómo manejan sustituciones de ingredientes?
- ¿Qué validaciones hacen antes de confirmar compras?
- ¿Cómo tracking el estado de pedidos?

### 6. MÉTRICAS CLAVE (KPIs) EN FOOD BUSINESS
**Necesitamos investigar:**
- ¿Cuáles son los KPIs más importantes en un negocio de comida?
- ¿Cómo miden la rentabilidad por plato?
- ¿Qué alertas operativas son críticas?
- ¿Cómo analizan tendencias de ventas?
- ¿Qué reportes generan diario/semanal/mensual?

## DATOS ESPECÍFICOS QUE NECESITAMOS

### ESTRUCTURA DE DATOS PARA INGREDIENTES:
- Unidades de medida estándar en cocina
- Categorías típicas de ingredientes
- Rangos normales de vida útil por categoría
- Factores de conversión comunes (ej: 1 pollo = X porciones)

### ESTRUCTURA DE DATOS PARA PLATOS:
- Categorías estándar de platos
- Tiempos de preparación típicos por categoría
- Factores que afectan el costo (dificultad, ingredientes premium, etc.)
- Etiquetas útiles para clasificación (vegetariano, picante, etc.)

### FLUJOS OPERATIVOS:
- Secuencia típica de planificación semanal
- Workflow de compras desde planificación hasta recepción
- Proceso de actualización de precios/costos
- Manejo de feedback de clientes y ajustes de menú

## CASOS DE USO REALES

### PREGUNTAS PARA INVESTIGAR:
1. **¿Cómo opera un negocio de comida casera exitoso?**
2. **¿Qué herramientas digitales usan actualmente?**
3. **¿Cuáles son sus principales dolores operativos?**
4. **¿Cómo manejan la variabilidad de demanda?**
5. **¿Qué automatizaciones les ahorrarían más tiempo?**

## BENCHMARKING DE COMPETENCIA

### HERRAMIENTAS EXISTENTES A INVESTIGAR:
- **Toast POS** - ¿Qué funcionalidades de gestión incluye?
- **Resy** - ¿Cómo manejan datos de cliente?
- **ChefTec** - ¿Cómo calculan costos de recetas?
- **Upserve** - ¿Qué métricas priorizan?
- **OpenTable** - ¿Cómo integran fidelización?

## VALIDACIÓN DE NUESTRO MODELO DE DATOS

### TABLAS A VALIDAR CON INVESTIGACIÓN:
```sql
-- ¿Nuestro modelo de Platos_Fondo captura lo esencial?
-- ¿Falta algún campo crítico en Ingredientes?
-- ¿Menu_Semanal refleja cómo realmente planifican?
-- ¿Lista_Compras tiene el workflow correcto?
-- ¿Sistema de fidelización es realista?
```

## CASOS DE PRUEBA ESPECÍFICOS

### ESCENARIOS REALES A MODELAR:
1. **Planificación Lunes**: Chef planifica menú para la semana
2. **Martes Compras**: Sistema genera lista, chef ajusta y compra
3. **Miércoles Operación**: Cliente ordena, sistema descuenta stock
4. **Feedback Jueves**: Cliente da feedback, sistema ajusta popularidad
5. **Viernes Análisis**: Chef revisa costos y márgenes de la semana

## DATOS DE TU MENÚ ACTUAL (3 SEMANAS)

**Por favor incluye:**
- Lista de platos que has ofrecido
- Ingredientes principales por plato
- Costos aproximados que has calculado
- Feedback recibido de clientes
- Proveedores que usas
- Días de mayor/menor demanda
- Platos más/menos populares
- Problemas operativos que has enfrentado

## URGENCIAS PARA IMPLEMENTAR

### PRIORIDAD 1 (Esta semana):
- Cálculo automático de costos por plato
- Sistema de alertas de stock bajo
- Generación de lista de compras
- Dashboard con métricas básicas

### PRIORIDAD 2 (Próxima semana):
- Planificación de menú con validaciones
- Actualización automática de stock
- Sistema de feedback básico
- Reportes de costos

### PRIORIDAD 3 (Siguientes 2 semanas):
- Fidelización con puntos
- Sugerencias inteligentes de menú
- Análisis de rentabilidad
- Automatización de proveedores

## PREGUNTAS ESPECÍFICAS PARA NotebookLM

1. **¿Cuál es la fórmula estándar para calcular food cost percentage?**
2. **¿Cómo se estructura típicamente un programa de fidelización en restaurantes?**
3. **¿Qué KPIs son más predictivos del éxito en un negocio de comida?**
4. **¿Cómo manejan la planificación de menús los restaurantes más eficientes?**
5. **¿Qué automatizaciones de inventario generan mayor ROI?**

---

**NOTA**: Esta investigación es crítica para que nuestro MVP sea realmente útil y no solo una aplicación genérica. Necesitamos que cada funcionalidad esté basada en cómo realmente operan los negocios de comida exitosos.
