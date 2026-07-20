# ADR 007: Detalles Técnicos y Guía de Migración

Documento de referencia técnica para desarrolladores implementando o migrando código
según [ADR 007: Unificación de dominio e i18n](../../007-domain-i18n-unificacion.md).

## Resumen de Cambios Técnicos

### Cambios en Identificadores

| Anterior      | Nuevo                | Contexto                                             |
| ------------- | -------------------- | ---------------------------------------------------- |
| `canonicalId` | `postId`             | Identificador único que agrupa traducciones          |
| Implícito     | `locale` obligatorio | Extraído explícitamente en `{ id, locale }`          |

### Cambios en APIs

#### `extractCleanId`

**Antes:**

```typescript
extractCleanId(id: string): string
```

**Ahora:**

```typescript
extractCleanId(id: string): { id: string, locale: UILanguages }
```

- **Cambio**: Ahora retorna tuple con `id` y `locale` extraído del prefijo
- **Comportamiento**: Lanza error (`throw`) si la entrada no contiene prefijo de
  locale válido (fail-fast)
- **Impacto**: Obliga a validar contenido en build time, previniendo errores
  silenciosos

#### `buildLocaleEntryMap`

**Antes:**

```typescript
buildLocaleEntryMap(entries: Collection[]): Record<string, LocaleLink[]>
```

**Ahora:**

```typescript
buildLocaleEntryMap(entries: Collection[]): Record<postId, AvailableLocales>
```

- **Cambio**: Mapea por `postId`, no por identificador crudo
- **Valor**: `AvailableLocales = Record<UILanguages, true>` (qué locales existen
  para esa entrada)
- **Impacto**: Elimina duplicación de búsquedas; una única fuente de verdad

### Cambios en SEO

#### `SiteLayout` como fuente única

- **Anterior**: Múltiples componentes (`SEOHead`, `AlternateLinks`, etc.) decidían canonical/alternates
- **Nuevo**: `SiteLayout` es la única responsable de emitir:
  - `<link rel="canonical">`
  - `<link rel="alternate" hreflang="es">`
  - `<link rel="alternate" hreflang="x-default">`
- **Impacto**: Previene decisiones contradictorias; política SEO centralizada

## Trade-offs Técnicos

| Aspecto               | Impacto                             | Mitigación                       |
| --------------------- | ----------------------------------- | -------------------------------- |
| **Rigidez**           | Corregir contenido antes del build  | Migración única; después auto    |
| **Curva aprendizaje** | Developers entienden `postId`       | Documentación + ejemplos         |
| **Cambio de API**     | Code refactoring en call-sites      | Scripts migración, grep          |
| **Seguridad**         | Falla en lugar de silenciar errores | Behavior intencional (fail-fast) |

## Checklist de Migración

### Fase 1: Preparación

- [ ] Revisión de `src/i18n/` y helpers dependientes
- [ ] Identificar todos los call-sites de `buildLocaleEntryMap` con grep:

```bash
grep -r "buildLocaleEntryMap" src/
```

- [ ] Listar componentes que usan `SEOHead` directamente (vs `SiteLayout`)

### Fase 2: Actualización de Código

- [ ] Actualizar `entryAdapter` para computar `postId` y `locale` centralizadamente
- [ ] Reemplazar `canonicalId` → `postId` en código y tests
- [ ] Actualizar call-sites de `buildLocaleEntryMap` para consumir `Record<postId, AvailableLocales>`
- [ ] Reemplazar `extractCleanId` para capturar retorno tuple `{ id, locale }`
- [ ] Consolidar SEO en `SiteLayout`; remover lógica duplicate de otros componentes

### Fase 3: Validación

- [ ] Ejecutar `npm run test:unit` — must pass
- [ ] Ejecutar `npm run build` — debe detectar entradas mal formadas (por `extractCleanId` estricto)
- [ ] Validar que `Record<postId, AvailableLocales>` mapeo es correcta (puede ser manual o con tests)
- [ ] Revisar `<head>` en build: canonical + alternates + x-default presentes y correctos

### Fase 4: Contenido

- [ ] Corregir cualquier entrada que `extractCleanId` rechace
- [ ] Auditar fixtures de tests: verificar que usen `postId` consistentemente
- [ ] Validar no hay duplicidad `(postId, locale)` en colecciones

## Referencias a Cambios Concretos

Los siguientes commits/PRs implementan aspectos de esta decisión:

- **#108** — "Purge build translation map": Eliminación de `buildTranslationMap.ts`;
  migración a `translationHelpers`
- **#107** — "Resolución de canonical locale": Refactor en `staticPathsBuilder`,
  `SEOHeadDetail`, introducción de `domain/translation.ts`
- **#106** — "StaticPathDetails simplificados loops": Introducción de
  `entryAdapter`, `entryComputed`; refactor de `buildLocaleEntryMap`
- **#105** — "List date experience when available": Cambios UX en `ListWork`,
  `WorkDateRange`; validación de `date`/`dateRange`
- **#104** — "refactor(section): domain limpio sin acoplamiento a Astro": Refactor
  de `domain/*`, `sectionLoader`; separación de capas

## Consideraciones al Refactorizar

### ¿Por qué `postId` vs `translationKey`?

Relacionado con [ADR 011: translationKey como llave canónica](../../011-i18n-translationkey.md):

- `postId`: Identidad de recurso (post de blog, charla, etc.)
- `translationKey`: Identificador semántico para mensajes de UI (reutilizable, agnóstico a tipos de contenido)

En el contexto de ADR 007, `postId` agrupa traducciones de la misma entrada;
`translationKey` (ADR 011) es una refinación para UI explícitamente.

### ¿Qué pasa si falla `extractCleanId`?

El error ocurre en **build time**, no en runtime. Ejemplos:

```bash
# Entrada mal formada (sin prefijo locale)
id: "my-blog-post"  ❌ No contiene "es/" o "en/"

# Corrección
id: "es/my-blog-post"  ✅
o
id: "en/my-blog-post"  ✅
```

Esto es intencional: garantizar calidad de datos en build, no silenciar en runtime.

## Validación Post-Migración

Después de completar migración, validar:

```bash
# 1. Tests pasan
npm run test:unit

# 2. Build sin errores de extractCleanId
npm run build

# 3. Verificar no hay duplicidad de postId+locale
# (si hay: contenido duplicado debe consolidarse o borrarse)

# 4. Validar canonical/alternates en HTML generado
# Revisar que SiteLayout emitió <link rel="canonical"> y <link rel="alternate">
```

## Notas para Futuros Desarrolladores

1. **`postId` es agnóstico de rutas**: Puedes refactorizar URLs sin que traducciones se invaliden
2. **Fail-fast es feature, no bug**: Si `extractCleanId` lanza, arregla los datos
3. **Centralización en `SiteLayout` es simplificación**: No hay excepciones por componente
4. **Trade-off: rigidez inicial → estabilidad a largo plazo**: Primer setup cuesta, luego cambios son baratos
