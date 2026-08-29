# Anexo técnico — Modelo de identidad de contenido e i18n

Este anexo complementa el ADR-007 y separa dos cosas:

- el contrato del dominio: qué es una entidad y cómo se identifica
- la forma en que la implementación lo cumple: validación, normalización y mapeo

No repite la motivación del ADR; aquí el foco está en la regla y en la garantía.

## 1. Contrato del dominio

La regla de negocio es simple y debe leerse como especificación:

- la identidad canónica de una entrada es `translationKey`
- cada variante debe declarar su `locale`
- `cleanId` es el slug localizable, no la identidad global
- dos entradas son la misma entidad si comparten `translationKey`
- una combinación duplicada de `(translationKey, locale)` es inválida

### Invariantes clave

1. `locale` es obligatorio y explícito.
2. `translationKey` agrupa todas las traducciones y variantes de una entidad.
3. `cleanId` representa el identificador dentro de ese idioma.
4. el dominio no debe re-parsingar IDs dispersos en cada capa.
5. cualquier duplicado de `(translationKey, locale)` debe romper el build.

Esto es lo importante del ADR: es la norma del dominio, no un detalle de implementación.

## 2. Cómo se materializa en la implementación

La implementación solo hace cumplir ese contrato. La capa de código no redefine la regla; la garantiza.

### a. Validación del prefijo de idioma

`extractCleanId` valida que la entrada tenga un `locale` explícito y devuelve el identificador limpio.

```text
es/mi-post  -> { locale: 'es', id: 'mi-post' }
```

Si falta el locale o es inválido, la validación falla de forma temprana.

### b. Normalización de la entrada

`adaptToDomainEntry` convierte la entrada cruda en un modelo del dominio con los campos necesarios:

- `translationKey`
- `cleanId`
- `locale`

Eso permite que el resto del sistema use un objeto ya validado, sin volver a analizar `entry.id`.

### c. Mapa por identidad y locale

`buildLocaleEntryMap` agrupa todas las entradas por `translationKey` y construye un mapa por idioma.

Si aparece el mismo `(translationKey, locale)` dos veces, lanza un error.
Ese `throw` no es la regla; es la garantía que asegura que la regla se cumpla.

### d. Enlaces de idioma y SEO

Las funciones de link y alternates usan ese mapa para construir:

- links de detalle por idioma
- alternates de SEO
- estado de enlace (`available`, `draft`, `missing`)

La idea es clara: primero se resuelve qué variantes existen; luego se presenta ese estado en la UI o en la metadata.

## 3. Ejemplo de flujo

```typescript
const entries = [
  adaptToDomainEntry({ id: 'es/mi-post', data: { translationKey: 'mi-post' } }),
  adaptToDomainEntry({ id: 'en/mi-post', data: { translationKey: 'mi-post' } })
]

const map = buildLocaleEntryMap(entries)
```

El flujo es:

1. normalizar la entrada
2. agrupar por `translationKey`
3. construir enlaces y metadata desde ese resultado

## 4. Regla de separación recomendada

La documentación debe leer así:

- la sección “Contrato del dominio” explica la norma
- la sección “Cómo se materializa en la implementación” describe la garantía de cumplimiento

No conviene mezclar ambas en el mismo bloque, porque la norma del dominio queda
diluida entre validaciones, helpers y excepciones.

Esta separación hace que el ADR siga siendo la decisión de arquitectura y el anexo
sea un complemento técnico, no una segunda versión del ADR.

## 5. Resumen

La parte esencial de ADR-007 no es “cómo se parsea una ID”, sino “qué constituye la
misma entidad y qué hace que una variante sea válida”.

La implementación solo ofrece la protección necesaria para que ese contrato no se
rompa en runtime ni en build.
