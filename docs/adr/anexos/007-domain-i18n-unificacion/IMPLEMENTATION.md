# Anexo técnico — Modelo de identidad de contenido e i18n

Este anexo complementa el ADR-007 y deja clara la regla del dominio y la
garantía que habilita la implementación actual.

## 1. Contrato del dominio

La regla de negocio es la especificación:

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

Esto es la norma del dominio. La implementación solo la garantiza.

## 2. Qué habilita el flujo actual

La capa actual de `@secorto/i18n` no redefine la regla; la hace cumplir de forma
centralizada en el paso de construir paths y resolver traducciones.

El flujo quedaría resumido así:

- se define la ruta de sección
- cada entrada se normaliza con el contrato del dominio
- se agrupan las variantes por `translationKey`
- se construyen los paths de detalle y se resuelven `siblings`

Eso es lo que habilita que una entidad pueda resolverse por idioma sin perder la
identidad global.

La misma idea se aplica a páginas standalone, con la diferencia de que en ese
caso la entidad no nace de una colección de contenido sino de un mapeo
localizable de rutas. En ambos casos la identidad sigue siendo `translationKey`,
la variante sigue siendo `locale` y el índice sigue siendo la fuente de verdad
para resolver traducciones.

## 3. Garantía del modelo

La garantía importante no es “cómo se implementa internamente”, sino que el
sistema puede afirmar con seguridad:

- qué variantes existen para una entidad
- qué locale falta
- qué translation está vinculada a cada slug
- qué routes forman parte del mismo contenido traducido

En otras palabras, la implementación actual hace posible que el dominio se
reafirme en cada paso de generación de rutas y de links de traducción, sin que la
lógica de identidad se disperse por la app.

## 4. Resumen

La parte esencial del ADR-007 es simple: una entidad se identifica por
`translationKey` y cada variante tiene su `locale`.

La implementación actual no cambia esa regla; simplemente la hace visible y
aplicable en el flujo real de generación de paths y enlaces de traducción.
