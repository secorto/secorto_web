# Anexo técnico — Detalles de implementación del modelo `postId` + `locale`

Este anexo documenta las piezas concretas del dominio,
las firmas de funciones y las invariantes que materializan la decisión del ADR 007.
No contiene motivación ni contexto: solo implementación.

## 1. Extracción estricta de identidad (`extractCleanId`)

**Responsabilidad:** Separar la identidad semántica (`id`) del prefijo de idioma (`locale`).

**Firma:**

```typescript
function extractCleanId(rawId: string): { id: string; locale: UILanguages }
```

**Reglas:**

* El prefijo de `locale` es **obligatorio**.
* Si el `rawId` no contiene un `locale` válido $\rightarrow$ `throw`.
* El `id` resultante no incluye el prefijo de idioma.

**Ejemplo:**

```typescript
extractCleanId("es/mi-post")
// → { id: "mi-post", locale: "es" }
```

## 2. Normalización de entradas (`entryAdapter`)

**Responsabilidad:** Convertir una entrada cruda en una entrada del dominio con invariantes garantizadas.

**Firma:**

```typescript
function entryAdapter(entry: RawEntry): NormalizedEntry
```

**Salida:**

```typescript
type NormalizedEntry = {
  raw: RawEntry
  computed: {
    postId: string
    locale: UILanguages
  }
  title?: string
  draft?: boolean
  date?: string
  dateRange?: { start: string; end?: string }
  tags?: string[]
}
```

**Invariantes:**

* `locale` siempre definido.
* `postId` derivado de `id` sin prefijo de idioma.
* No se re-parsea `entry.id` downstream.

## 3. Mapa de variantes por idioma (`buildLocaleEntryMap`)

**Responsabilidad:** Agrupar entradas por `postId` y derivar sus variantes por idioma.

**Firma:**

```typescript
function buildLocaleEntryMap(
  entries: NormalizedEntry[]
): Record<postId, AvailableLocales>
```

**Estructura:**

```typescript
type AvailableLocales = {
  locales: UILanguages[]
  entries: Record<UILanguages, NormalizedEntry>
}
```

**Reglas:**

* Un solo bucket por `postId`.
* Si aparece (`postId`, `locale`) duplicado $\rightarrow$ `throw`.
* No re-parsea `id`; usa `entry.computed`.

## 4. Construcción de enlaces de idioma (`buildDetailLink`)

**Responsabilidad:** Generar enlaces localizados para páginas de detalle.

**Firma:**

```typescript
function buildDetailLink(
  targetLang: UILanguages,
  localizedSection: string // Nota: El texto original quedó truncado aquí
)
```
