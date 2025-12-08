# Guía de Migración: Router Dinámico

## Estado Actual

Tienes 3 formas de definir rutas de secciones:

1. **Rutas específicas** (pueden eliminarse):
   - `src/pages/[locale]/blog/index.astro`
   - `src/pages/[locale]/charla/index.astro`
   - `src/pages/[locale]/proyecto/index.astro`

2. **Ruta general para items individuales**:
   - `src/pages/[locale]/[section]/index.astro` (era para items `/es/blog/mi-articulo`)

3. **Nuevo router dinámico** (centralizado):
   - `src/pages/[locale]/[section]/index.astro` (ahora maneja secciones + items)

## Problema de Conflicto

Astro no permite dos rutas que generen los mismos paths. Por ejemplo:
- `[locale]/blog/index.astro` genera `/es/blog`
- `[locale]/[section]/index.astro` genera `/es/blog` (si section=blog)

## Solución Recomendada

### Opción A: Eliminar rutas específicas (RECOMENDADO)

```bash
# Eliminar
rm -rf src/pages/[locale]/blog
rm -rf src/pages/[locale]/charla
rm -rf src/pages/[locale]/proyecto

# Mantener
# src/pages/[locale]/trabajo/  (si tiene lógica especial)
# src/pages/[locale]/comunidad/  (si tiene lógica especial)
```

**Ventajas**:
- ✅ Una única fuente de verdad
- ✅ Mantenimiento centralizado
- ✅ Agregar secciones sin crear carpetas

**Desventajas**:
- Cambio de estructura (pero beneficio > costo)

### Opción B: Mantener rutas específicas + dinámicas

Renombrar el nuevo router a una ruta diferente:
```
[locale]/sections/[section]/index.astro  ← Mantiene complejidad
```

Luego redirigir:
```javascript
// astro.config.mjs
redirects: {
  '/es/blog': '/es/sections/blog',
  '/en/blog': '/en/blog',
}
```

**Ventajas**:
- ✅ No cambia rutas existentes
- ❌ Complejidad aumentada
- ❌ Duplicación

## Mi Recomendación

**Opción A** es más consistente con tu objetivo original:

> "tratando de mantener la complejidad baja y evitar if eternos"

Un único router = menor complejidad.

## Pasos de Implementación

Si eliges **Opción A**:

### 1. Backup
```bash
git checkout -b feature/dynamic-sections
git add .
git commit -m "before: backup before removing duplicate section routes"
```

### 2. Eliminar rutas específicas
```bash
rm -rf src/pages/[locale]/blog
rm -rf src/pages/[locale]/charla
rm -rf src/pages/[locale]/proyecto
```

### 3. Verificar que `[section]/index.astro` es el nuevo router
- Debe estar en: `src/pages/[locale]/[section]/index.astro`
- Debe generar las 5 secciones × 2 idiomas = 10 rutas

### 4. Test locales
```bash
npm run build
npm run preview
```

### 5. Verificar que todo funciona
- `/es/blog` → ✅
- `/es/charla` → ✅
- `/en/blog` → ✅
- `/en/talk` → ✅
- `/es/trabajo` → ✅
- Etc.

### 6. Items individuales aún funcionan
- `/es/blog/articulo` → ✅ (mismo archivo)
- `/es/charla/presentacion` → ✅ (mismo archivo)

## Estructura Resultante

```
src/pages/
├── index.astro
├── robots.txt.ts
├── rss.xml.js
└── [locale]/
    ├── [section]/
    │   └── index.astro  ← Maneja TODO
    │                       - Secciones: /es/blog, /es/charla, etc
    │                       - Items: /es/blog/articulo
    │                       - Tags: /es/blog/tags/javascript
    ├── trabajo/  ← Opcional: si tiene lógica MUY especial
    │   └── index.astro
    └── comunidad/  ← Opcional: si tiene lógica MUY especial
        └── index.astro
```

## Transición Gradual

Si prefieres no eliminar de golpe:

```bash
# 1. Dejar ambas coexistiendo (con cuidado)
# 2. Verificar que el nuevo router genera las mismas rutas
# 3. Eliminar las viejas cuando estés seguro
```

Pero recuerda: Astro se quejará de rutas duplicadas.
