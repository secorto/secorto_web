# Common AI Mistakes — Lecciones del repositorio

**Este documento es tu checklist durante desarrollo con IA.** Consulta los patrones ANTES de generar, DURANTE el desarrollo, y DESPUÉS para validar.

Cataloga patrones reales de errores que la IA ha cometido en este repositorio, basados en commits de reparación, issues y ADRs de decisión.

## Flujo de trabajo

### 1. Antes de pedir a IA que genere

- Sabes qué necesitas (código TS / Markdown / tests / docs / ADRs)?
- **Busca el patrón relevante** aquí para entender qué errores evitar
- Comunica a IA: "evita patrón X, haz como patrón Y"

### 2. Mientras desarrollas con IA

- Cada generación: **consulta sección relevante**
- Generaste Page Object? → leer **patrón 5** (responsabilidades mezcladas)
- Generaste Markdown? → leer **patrón 3** (formato inconsistente)
- Generaste documentación? → leer **patrón 7** (duplicación)

### 3. Antes de PR

- Ejecuta validadores ([CODING_GUIDELINES.md](./CODING_GUIDELINES.md))
- Si falla, **busca patrón correspondiente** aquí
- Si pasa pero huele raro → busca **patrón 7** (duplicación de docs)

---

## Catálogo de patrones

Cada sección incluye: el problema (❌), por qué IA lo hace, la solución (✅), y referencias.

## 1. Uso de `any` como atajo (ADR 004)

### El problema

La IA genera código con `any` para evitar definir tipos explícitos:

```typescript
// ❌ IA generó esto
const parseEntry = (entry: any) => { /* ... */ }
const getData = (): any => {}
```

**Por qué ocurre:** Es más rápido en generación, evita inferencias complejas de tipos.

**Impacto real:** Se pierden beneficios de TypeScript en compile-time; errores se detectan en tests E2E lentos.

### La solución

- **Regla ESLint:** `@typescript-eslint/no-explicit-any: error` (habilitada)
- **Patrón correcto:** Define interfaces o tipos genéricos

```typescript
// ✅ Correcto
interface EntryData {
  id: string
  title: string
  locale: UILanguages
}
const parseEntry = (entry: EntryData): Computed => { /* ... */ }
```

**Referencias:**

- [ADR 004: Linting, tipo `any` y convenciones](./adr/004-linting-any-ban-style-conventions.md)
- [copilot-instructions.md](../.github/copilot-instructions.md) — "Avoid `any` type"

---

## 2. Referencias incorrectas a archivos/módulos (ADR 007)

### El problema

La IA genera imports/referencias a archivos que no existen o tienen nombres ligeramente distintos:

```typescript
// ❌ IA generó esto (pero el archivo es src/domain/section.ts, no sections.ts)
import { extractSection } from '@/domain/sections'
```

**Por qué ocurre:** El LLM alucinó basado en patrones similares en el corpus de entrenamiento
(nombres pluralizados, estructura similar de directorios en otros proyectos).

**Impacto real:** Build falla o tests descubren el error tarde.

### La solución

- **Validación:** `tsc --noEmit` + `npm run lint` detectan imports rotos
- **Patrón:** Buscar archivo con `Ctrl+P` en VSCode antes de importar

```typescript
// ✅ Correcto
import { extractCleanId } from '@/domain/id'  // verificado
import { buildLocaleEntryMap } from '@/i18n/builders'  // verificado
```

**En este repo:**

- `postId` para i18n (no `canonicalId`)
- Helpers en `src/i18n/`, domain logic en `src/domain/`

**Referencias:**

- [ADR 007: Unificación dominio + i18n](./adr/007-domain-i18n-unificacion.md)
- [docs/CONTENT_POLICY.md](./CONTENT_POLICY.md) — postId, traducción de contenido

---

## 3. Markdown malformateado (ADR 009)

### El problema

La IA genera Markdown con formato inconsistente:

```markdown
# Título

## Subtítulo (pero hay líneas en blanco inconsistentes)

```

código sin cierre

```

[URLs desnudas](https://example.com sin descripción legible)

- Lista
- sin espacios

1. Lista numerada
2) con formato inconsistente
```

**Por qué ocurre:** Generación rápida sin pasar por validadores; patrones de Markdown
en el corpus de entrenamiento son variados y no siempre cumplen estándar.

**Impacto real:** Reviews grandes con correcciones de formato; CI falla por `markdownlint-cli2`.

### La solución

- **Herramienta:** `markdownlint-cli2` valida formato
- **Reglas clave:** Encabezados ATX, listas `1.`, código fenced, URLs descritas, LF line-endings

```markdown
# Correcto

## Subtítulo

Párrafo normal.

- Lista con espacios
- Entre items

1. Numerada correctamente
2. Con formato consistente

Ver [Documentación oficial](https://example.com) para más.
```

**Referencias:**

- [ADR 009: Validación Markdown](./adr/009-markdown-validation.md)

---

## 4. ADRs sin estructura/plantilla (ADR 010)

### El problema

La IA genera ADRs con formato inconsistente:

```markdown
# Mi Decision

Esto es la decisión porque:
- razón 1
- razón 2

Alternativas: podríamos hacer X, Y, Z.
```

**Por qué ocurre:** Sin plantilla clara, el LLM improvisa estructura basado en ADRs
genéricos de otros proyectos (Michael Nygard, etc.) que tienen formatos distintos.

**Impacto real:** Reviews en ADRs lentas; falta secciones críticas (Contexto, Motivación, Consecuencias);
no hay validación automática de estructura.

### La solución

- **Usa la plantilla:** [ADR 010: Plantilla estándar](./adr/010-plantilla-estandar-adr.md) — debe incluir frontmatter YAML + secciones obligatorias
- **Patrón crítico:** Decisión **agnóstica a implementación**:
  - ✅ "Especialización por responsabilidad" (concepto abstracto)
  - ❌ "Crear clase `ContentListPage` que herede de `BasePage`" (concreto)

**Referencias:**

- [ADR 010: Plantilla estándar ADRs](./adr/010-plantilla-estandar-adr.md)
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) — ADR guidelines

---

## 5. Mezcla de responsabilidades en Page Objects (ADR 014)

### El problema

La IA genera Page Objects que mezclan múltiples contextos/vistas en una sola clase:

```typescript
// ❌ IA generó esto (ContentListPage)
class ContentListPage {
  // Responsabilidad 1: Vista de LISTA
  shouldHaveListHeaderTitle() { /* ... */ }
  filterByTag() { /* ... */ }
  
  // Responsabilidad 2: Vista de DETALLE
  shouldHaveDetailTitle() { /* ... */ }
  shouldHaveComments() { /* ... */ }
  
  // Responsabilidad 3: Vista de TAGS
  shouldHaveTagsInFilter() { /* ... */ }
}
```

**Por qué ocurre:** El LLM generaliza basado en ejemplos amplios; no respeta SRP (Single Responsibility Principle)
en el contexto específico del proyecto.

**Impacto real:** Tests confusos; autocompletar IDE ofrece métodos irrelevantes; métodos muertos;
dificultad para agregar nuevas especializaciones.

### La solución

- **Patrón:** Jerarquía de Page Objects con especialización clara
- **Principio SRP:** Cada clase = una responsabilidad (lista/detalle/filtrado separado)

```typescript
// ✅ Correcto
abstract class BasePage {
  getHeader() { /* ... */ }
}
class ListPage extends BasePage {
  getItems() { /* ... */ }
}
class DetailPage extends BasePage {
  getComments() { /* ... */ }
}
```

**Referencias:**

- [ADR 014: Jerarquía Page Objects + SRP](./adr/014-page-objects-hierarchy-separation-of-concerns.md)
- [docs/architecture/PAGE_OBJECTS.md](./architecture/PAGE_OBJECTS.md)

---

## 6. Lógica duplicada en componentes (Patrón general)

### El problema

La IA genera copiar-pegar de lógica en múltiples componentes:

```typescript
// ❌ Repetido en DetailBlog.astro y DetailCharla.astro
const canonicalId = entry.id.split('-').slice(1).join('-')
const locale = entry.id.split('-')[0] as UILanguages
const postId = canonicalId
```

**Por qué ocurre:** LLM no sigue DRY; más rápido copiar que abstraer a función compartida.

**Impacto real:** Bugs duplicados; mantenimiento difícil; inconsistencias.

### La solución

- **Patrón:** Extraer a función/utility en `src/domain/` o `src/i18n/`
- **Regla:** Si la lógica aparece en 2+ lugares, debe estar centralizada

```typescript
// ✅ Correcto: src/domain/id.ts
export const extractCleanId = (entryId: string) => {
  const parts = entryId.split('-')
  return {
    locale: parts[0] as UILanguages,
    id: parts.slice(1).join('-'),
  }
}

// Usar en componentes
const { locale, id: postId } = extractCleanId(entry.id)
```

**Checklist:**

- Buscar duplicación con `Ctrl+F` regex
- Extraer a `src/domain/` o `src/i18n/` (100% cobertura unitaria)

**Referencias:**

- [docs/CODING_GUIDELINES.md](./CODING_GUIDELINES.md) — DRY, domain layer
- [docs/architecture/DETAIL_VIEW_COMPONENTS.md](./architecture/DETAIL_VIEW_COMPONENTS.md)

---

## 7. Documentación duplicada

### El problema

La IA genera documentación que ya existe en otro archivo/sección, sin revisar qué está documentado:

```markdown
# CODING_GUIDELINES.md

## Page Objects

Page Objects son clases que representan vistas de página para tests E2E.
Cada Page Object debe representar una vista específica (lista, detalle, etc).
La estructura es: base compartida + especializaciones...

// Pero esto ya está explicado en ADR 014 + PAGE_OBJECTS.md
```

**Por qué ocurre:** El LLM no tiene contexto de dónde vive cada explicación; genera basado en patrones genéricos sin búsqueda en docs.

**Impacto real:** Documentación desincronizada (se actualiza un lugar pero no el otro), confusión sobre fuente de verdad, reviews enormes de "ya está documentado aquí".

### La solución

- **Patrón:** Antes de documentar, busca si existe (`Ctrl+Shift+F`)
- Si existe, referencia (`Ver [ADR 014](./adr/014-page-objects-hierarchy-separation-of-concerns.md)`)
- No repitas explicación; linquea y reutiliza

```markdown
# ✅ Correcto: CODING_GUIDELINES.md

## Page Objects

Para jerarquía y especialización de Page Objects, ver [ADR 014](./adr/014-page-objects-hierarchy-separation-of-concerns.md) y [PAGE_OBJECTS.md](./architecture/PAGE_OBJECTS.md).

Resumen: cada clase = una responsabilidad (lista/detalle/filtrado separado).
```

**Regla clara:** Una decisión = Un lugar. Explicación en ADR. Detalles de implementación en `architecture/`. Referencias cruzadas entre docs.

**Referencias:**

- [CONTRIBUTING.md](./CONTRIBUTING.md) — cómo escribir documentación
- [ADR 010: Plantilla ADRs](./adr/010-plantilla-estandar-adr.md)

---

## 8. Código muerto / Referencias inexistentes

### El problema

La IA referencia funciones, tipos o módulos que no existen, generando imports a rutas muertas:

```typescript
// ❌ IA generó esto
import { parsePostId } from '@/utils/posts'  // archivo no existe
import type { DetailViewProps } from '@/types/views'  // tipo no existe
import { logEvent } from '@/utils/analytics'  // función no existe

const x = parsePostId(entry)  // runtime error: import failed
```

**Por qué ocurre:** LLM alucinó basado en convenciones genéricas; no validó que existan en el repo.

**Impacto real:** Build falla; tests descubren en E2E; tiempo perdido debuggeando.

### La solución

- **Validación:** `tsc --noEmit` detecta imports rotos inmediatamente
- **Patrón:** Validar con `Ctrl+Click` en IDE antes de confiar en import

**Referencias:**

- [ADR 007: Centralización dominio + i18n](./adr/007-domain-i18n-unificacion.md)
- [docs/architecture/](./architecture/) — dónde vive cada tipo de lógica

---

## Cómo usar este documento

**Cada patrón tiene:**

- El problema (❌)
- Por qué ocurre
- La solución (✅)
- Referencias a ADRs y documentación

**Antes de PR:** revisa las secciones relevantes a lo que generaste (código TS, Markdown, tests, docs, ADRs) y ejecuta los comandos de validación en [CODING_GUIDELINES.md](./CODING_GUIDELINES.md).

## Referencias cruzadas

- [CODING_GUIDELINES.md](./CODING_GUIDELINES.md) — reglas de código
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) — instrucciones para IA
- [docs/adr/](./adr/) — decisiones que originaron estas reglas
- [docs/architecture/](./architecture/) — detalles de implementación
