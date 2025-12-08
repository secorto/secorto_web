# Checklist de Mantenimiento - Arquitectura de Secciones

## 📋 Checklist Diario/Semanal

### Antes de Agregar una Nueva Sección
- [ ] Crear colección en `src/content/` (ej: `src/content/eventos/`)
- [ ] Crear carpeta idioma (ej: `es/`, `en/`)
- [ ] Agregar primer markdown de prueba

### Agregar Nueva Sección a `sections.ts`
- [ ] Abrir `src/config/sections.ts`
- [ ] Copiar entrada de sección similar
- [ ] Cambiar `collection` al nombre correcto
- [ ] Cambiar `translationKey` (ej: `nav.eventos`)
- [ ] Configurar `routes` para cada idioma
- [ ] Elegir `listComponent` correcto
- [ ] Configurar `hasTags` según sea necesario
- [ ] Configurar `showFeaturedImage` según sea necesario

### Agregar Traducciones
- [ ] Abrir `src/i18n/ui.ts`
- [ ] Agregar `nav.eventos: 'Events'` en inglés
- [ ] Agregar `nav.eventos: 'Eventos'` en español
- [ ] Verificar que la clave en `sections.ts` coincide

### Crear Componente (si es necesario)
- [ ] Crear `src/components/ListEventos.astro` (si es nuevo)
- [ ] O reutilizar `ListPost` o `ListWork`
- [ ] Si es nuevo, agregarlo en `SectionRenderer.astro`

### Test Local
- [ ] `npm run build` (verificar compilación)
- [ ] `npm run preview` (ver en navegador)
- [ ] `/es/eventos` → carga correctamente
- [ ] `/en/events` → carga correctamente
- [ ] Tags funcionan (si `hasTags: true`)
- [ ] Items individuales funcionan

### Antes de Deployar
- [ ] `npm run build` (compile success)
- [ ] `npm run preview` (visual check)
- [ ] Verificar rutas generadas en `dist/`
- [ ] Verificar sitemap incluye nuevas rutas
- [ ] Test con Lighthouse (accessibility, performance)

---

## 🔍 Checklist Mensual - Auditoría de Arquitectura

### Validación de Configuración
```bash
./validate-architecture.sh
```
- [ ] Todos los checks pasan ✓

### Verificar Duplicación
```bash
grep -r "getPostsByLocale" src/ | wc -l
# Debe ser bajo (máximo en sectionLoader.ts + tests)
```
- [ ] No hay duplicación de `getPostsByLocale`
- [ ] No hay duplicación de `getUniqueTags`

### Revisar `sections.ts`
- [ ] Todas las secciones tienen `translationKey`
- [ ] Todas las claves existen en `ui.ts`
- [ ] No hay rutas duplicadas (mismo `routes[locale]`)
- [ ] `listComponent` siempre es válido
- [ ] Orden alfabético (mantenibilidad)

### Revisar `ui.ts`
- [ ] Todas las `translationKey` de `sections.ts` existen
- [ ] Traducciones completas (es + en)
- [ ] Sin typos en las claves

### Revisar `SectionRenderer.astro`
- [ ] Todos los `listComponent` están cubiertos
- [ ] No hay componentes muertos (imports sin usar)
- [ ] Lógica de tags es correcta

### Performance
- [ ] `[section]/index.astro` compila rápido
- [ ] No hay imports inútiles
- [ ] Build time es aceptable

---

## ⚠️ Checklist de Problemas Comunes

### Sección No Aparece en `/es/nuevaseccion`

**Diagnóstico**:
- [ ] ¿Existe entrada en `sections.ts`?
- [ ] ¿Existe traducción en `ui.ts`?
- [ ] ¿Colección existe en `src/content/`?
- [ ] ¿Hay posts en la colección?
- [ ] ¿`npm run build` pasó sin errores?

**Solución**:
```bash
npm run build --verbose
# Busca errores en [section]/index.astro o sectionLoader.ts
```

### Traducción Falta

**Diagnóstico**:
```typescript
// En sections.ts:
translationKey: 'nav.eventos'

// En ui.ts, ¿existen AMBAS?
es: { 'nav.eventos': 'Eventos' }
en: { 'nav.eventos': 'Events' }
```

**Solución**:
```typescript
// Agregar en ui.ts:
export const ui = {
  en: {
    'nav.eventos': 'Events',  // ← Agregar
  },
  es: {
    'nav.eventos': 'Eventos',  // ← Agregar
  },
}
```

### Ruta Duplicada

**Diagnóstico**:
```typescript
// En sections.ts, dos secciones con misma ruta:
blog: { routes: { es: 'blog' } }
otro: { routes: { es: 'blog' } }  // ← ERROR
```

**Solución**:
Cambiar una de las rutas:
```typescript
otro: { routes: { es: 'articulos' } }
```

### Componente No Existe

**Diagnóstico**:
```typescript
// En sections.ts:
listComponent: 'ListInexistente'

// Pero en SectionRenderer.astro:
{config.listComponent === 'ListInexistente' && ...}  // ← No existe rama
```

**Solución**:

Opción A: Usar componente existente
```typescript
listComponent: 'ListPost'  // Cambiar a existente
```

Opción B: Crear nuevo componente
```astro
// En SectionRenderer.astro, agregar rama:
{config.listComponent === 'ListInexistente' && (
  <ListInexistente posts={posts} basePath={`${locale}/${routeSlug}`} />
)}
```

---

## 🔄 Checklist de Refactoring

### Si Necesitas Cambiar el Nombre de una Sección

**Antes**:
```typescript
blog: {
  translationKey: 'nav.blog',
  collection: 'blog',
  routes: { es: 'blog', en: 'blog' }
}
```

**Después**:
```typescript
articulos: {  // ← Cambiar clave
  translationKey: 'nav.articulos',  // ← Cambiar traducción
  collection: 'blog',  // ← Mantener colección igual
  routes: { es: 'articulos', en: 'articles' }  // ← Cambiar rutas
}
```

**Verificar después**:
- [ ] `npm run build` compila
- [ ] Rutas `/es/articulos` funcionan
- [ ] Viejo `/es/blog` se redirige (si es necesario agregar en `astro.config.mjs`)

### Si Necesitas Cambiar una Ruta

**Antes**:
```typescript
talk: { routes: { es: 'charla', en: 'talk' } }
```

**Después**:
```typescript
talk: { routes: { es: 'conferencias', en: 'talks' } }  // ← Cambiar
```

**Verificar después**:
- [ ] `/es/conferencias` funciona
- [ ] `/en/talks` funciona
- [ ] Viejo `/es/charla` se redirige (opcional, agregar en redirects)

### Si Necesitas Agregar Mejor Componente

**Antes**:
```typescript
blog: { listComponent: 'ListPost' }
```

**Después**:
```typescript
blog: { listComponent: 'ListPostAdvanced' }  // ← Nuevo componente
```

**Pasos**:
1. [ ] Crear `src/components/ListPostAdvanced.astro`
2. [ ] Agregar rama en `SectionRenderer.astro`
3. [ ] Actualizar `sections.ts`
4. [ ] Test

---

## 📊 Checklist Mensual - Reporte

### Métricas

```markdown
## Reporte de Arquitectura - [Mes/Año]

### Secciones Activas
- Blog: 1,234 posts
- Charlas: 45 talks
- Trabajos: 8 entries
- Total: 1,287 items

### Salud del Código
- ✓ Sin duplicación en archivos
- ✓ Todos los checks de validación pasan
- ✓ Build time: <30s
- ✓ Zero errores de compilación

### Cambios Realizados
- [ ] Nueva sección agregada: ______
- [ ] Rutas cambiadas: ______
- [ ] Componentes nuevos: ______
- [ ] Bugs arreglados: ______

### Próximas Mejoras
- [ ] ______
- [ ] ______
```

---

## 🚀 Checklist Pre-Deployment

### Compilación
```bash
npm run build
```
- [ ] Compilación exitosa (exit code 0)
- [ ] No hay warnings
- [ ] Tamaño de `dist/` es razonable

### Preview Local
```bash
npm run preview
```
- [ ] `/es/blog` carga
- [ ] `/es/charla` carga
- [ ] `/en/blog` carga
- [ ] `/en/talk` carga
- [ ] Tags funcionan (si existen)
- [ ] Items individuales cargan

### Verificar Rutas
```bash
curl -I https://preview.local/es/blog
curl -I https://preview.local/en/talk
# Verificar que retornan 200, no 404
```
- [ ] Todas las secciones retornan 200
- [ ] Sitemap está generado

### Accesibilidad (Cypress)
```bash
npm run test:a11y
```
- [ ] Sin violaciones accesibilidad críticas
- [ ] Colores tienen contraste adecuado

### Performance
```bash
npm run build
lighthouse dist/index.html
```
- [ ] Lighthouse score > 80
- [ ] First Contentful Paint < 2s

### SEO
- [ ] Meta descriptions están presentes
- [ ] Og:image está configurado
- [ ] robots.txt existe
- [ ] Sitemap existe en `sitemap.xml`

### Antes de Mergear a Main
- [ ] Todos los checks arriba pasaron
- [ ] PR review completado
- [ ] Tests pasaron
- [ ] Documentation updated

---

## 📞 Soporte Rápido

### "Mi sección no aparece"
```bash
# 1. Verificar estructura
ls src/content/mi-seccion/es/

# 2. Verificar config
grep "mi-seccion" src/config/sections.ts

# 3. Compilar
npm run build

# 4. Buscar errores
npm run build 2>&1 | grep -i error
```

### "Tengo un error de tipos en TypeScript"
```bash
# Verificar que translationKey existe en ui.ts:
grep "nav.mi-sección" src/i18n/ui.ts

# Debe aparecer en AMBOS idiomas:
# en: { 'nav.mi-sección': '...' }
# es: { 'nav.mi-sección': '...' }
```

### "Cambié una ruta pero sigue usando la vieja"
```bash
# Limpiar build
rm -rf dist/
npm run build

# El cache fue borrado, ahora test:
npm run preview
```

---

## 📚 Referencias Rápidas

| Necesito... | Archivo | Sección |
|-------------|---------|---------|
| Agregar sección | `src/config/sections.ts` | `sectionsConfig` |
| Agregar traducción | `src/i18n/ui.ts` | `ui` |
| Cambiar componente | `src/config/sections.ts` | `listComponent` |
| Agregar componente nuevo | `src/components/` + `SectionRenderer.astro` | - |
| Cambiar ruta | `src/config/sections.ts` | `routes` |
| Ver documentación | `ARCHITECTURE_SECTIONS.md` | - |

---

**Última actualización**: 8 de diciembre de 2025
**Versión**: 1.0
**Mantenedor**: Scot
