# ADR 007: Unificación de dominio e i18n — `postId`, mapas de locales y SEO centralizado

> **Estado:** Aceptada
> **Fecha:** 2026-03-24
> **Categoría:** Arquitectura / i18n / Dominio

## Contexto

Se han aplicado varios cambios relacionados con cómo se modela el dominio de
contenido y cómo se construyen las rutas i18n en build time. Estos cambios
surgen de la necesidad de:

1) evitar parseos repetidos del `entry.id`,
2) centralizar cómo se calculan URLs alternas y canonical, y
3) hacer las invariantes del sitio más explícitas (p. ej. duplicados por locale).

Los cambios agrupados en esta decisión están relacionados con los PR/issues
referenciados: #108, #107, #106, #105, #104 (ver sección Referencias).

## Problemas detectados

- Re-parseo frecuente de `entry.id` en distintos puntos del código
- Duplicación y lógica dispersa para construir `localeLinks` y alternates
- Múltiples componentes SEO con APIs distintas y lógica repetida para x-default
- Estado lax o implícito sobre locales por entrada (p. ej. falta de `locale`)
- Riesgo de inconsistencias silenciosas (entradas duplicadas por `postId`+locale)

## Decisión

1. Normalizar la identidad canónica de una serie/entrada usando `postId`.
  - `postId` será la clave única usada para agrupar traducciones/variantes
    de una misma entrada a través de locales.

2. Hacer que la extracción de id sea explícita y con locale: `extractCleanId`
  devuelve `{ id: string, locale: UILanguages }` — el `locale` es obligatorio;
  la función es estricta y lanza si el `id` no contiene un prefijo de locale
  válido.

3. `entryAdapter` debe normalizar entradas y asignar `computed.postId` y
  `computed.locale` para uso downstream.

4. `buildLocaleEntryMap(allEntries)` devolverá un único `Record<postId, AvailableLocales>`
  (map por `postId`) para evitar doble-mapeos y parseos repetidos.

5. Construir enlaces de idioma para detalle usando rutas ya localizadas
  (p. ej. `config.routes[locale]`) con `buildDetailLink(targetLang, localizedSection, availableLocales)`
  (helper actual en `src/i18n/languagePickerUtils.ts`, renombrado desde
  `buildDetailLinkFromLocalizedSection`) — esto elimina la dependencia a
  `findCanonicalSectionKey` en el builder de paths.

6. Unificar componentes de SEO en un solo `SEOHead` (presentacional) y que
  `SiteLayout` sea la única fuente de `canonical` y emita `x-default`.

7. Fallar rápido ante inconsistencias críticas: duplicados de `(postId, locale)`
  lanzan error en build time para forzar corrección de contenido.

## Razonamiento

- Reducir parseos y transformaciones repetidas mejora rendimiento del build
  y reduce la superficie de bugs (menos lugares que entender/editar).
- Centralizar canonical/alternates en `SiteLayout` evita decisiones contradictorias
  en componentes individuales y normaliza la política SEO del sitio.
- Fallar temprano hace visibles problemas de contenido que podrían dar lugar
  a URLs o enlaces incorrectos en producción.

## Trade-offs

- + Seguridad: invariantes fuertes (no silencioso). Falla en lugar de degradar.
- - Rigidez: obliga a corregir contenido/legacy antes del build; mayor coste
  inicial en migración.
- + Simplicidad para consumidores: API única (`postId` → `AvailableLocales`).
- - Migración: call-sites que esperaban la forma antigua deben actualizarse.
- + Mejor rendimiento y claridad en `staticPathsBuilder` y helpers i18n.

## Consecuencias

- Cambios en la API interna: renombrado `canonicalId` → `postId` y nueva
  forma de `buildLocaleEntryMap` (map por `postId`).
- Documentar migración para integraciones y actualizar tests/consumers.
- Tests deben cubrir duplicados y la lógica de `resolveDefaultLocale` y `draft`.

## Referencias

- Implementación y commits relacionados: PR/issues #108, #107, #106, #105, #104
- ADRs y anexos previos relevantes:
  - [ADR 001: i18n router framework](./001-i18n-router-framework.md)
  - [ADR 006: Unificación manejo borradores](./006-unificacion-manejo-borradores.md)

## Migración / Checklist

1. Actualizar call-sites que usen `buildLocaleEntryMap` para esperar
  `Record<postId, AvailableLocales>` (no la forma antigua)
2. Reemplazar referencias a `canonicalId` por `postId` en código y tests
3. Validar que `extractCleanId` lanzará en entradas mal formadas y corregir
  contenido `src/content/*` donde aplique
4. Ejecutar la suite de tests y la build completa (`npm run test:unit`, `npm run build`)

---

Firmado: Equipo de arquitectura — secorto_web

## Consideraciones adicionales (commits en `master`)

Tener en cuenta los cambios recientes en `master` que influyen en esta ADR:

- "Purge build translation map" — eliminación/limpieza del mapa previo de traducciones
- "Resolución de canonical locale" — ajustes en la forma de resolver el locale canónico
- "StaticPathDetails simplificados loops" — simplificación de bucles en generación de paths
- "List date experience when available" — incluir fecha en listings de experiencias cuando exista
- "refactor(section): domain limpio sin acoplamiento a Astro" — separación del dominio de Astro
- "Tags index" — cambios en la indexación de tags

Estos commits ya están reflejados en la implementación de la rama `domain-new` y deben evaluarse por los reviewers para confirmar que la migración y las invariantes propuestas siguen siendo válidas tras esos cambios.

### Detalle técnico por commit

- **Purge build translation map (#108)**
  - Qué cambió: se eliminó `src/i18n/buildTranslationMap.ts` y tests relacionados
  - Impacto: la lógica previa de "buildTranslationMap" ya no existe; cualquier consumidor de esa API debe migrar a los nuevos helpers (`translationHelpers`, `entryAdapter`, `entryComputed`). Esto refuerza la decisión de centralizar el mapa por `postId`.

- **Resolución de canonical locale (#107)**
  - Qué cambió: ajustes en `AlternateLinks.astro`, `SEOHeadDetail.astro`, `src/i18n/*`, `staticPathsBuilder` y `translationHelpers`; añadido `src/domain/translation.ts`
  - Impacto: introduce/normaliza cómo se decide el locale canónico de una serie; confirmar que `resolveDefaultLocale` (o su equivalente) aplica la misma política que el ADR (ignorar draft cuando se decide el canonical o no, según la política elegida).

- **StaticPathDetails simplificados loops (#106)**
  - Qué cambió: añadido `src/domain/entryComputed.ts`, `src/utils/entryAdapter.ts`, `src/domain/pageDetail.ts` y simplificaciones en `staticPathsBuilder` y `translationHelpers`
  - Impacto: refactor que respalda la estrategia de computar `postId` y `locale` una sola vez (en `entryAdapter`) y luego usar buckets por `postId`; esto reduce parseos y simplifica bucles en la generación de paths.

- **List date experience when available (#105)**
  - Qué cambió: cambios en `ListWork.astro`, `WorkDateRange.astro` y `src/domain/post.ts`; tests añadidos
  - Impacto: mejora UX para entradas "experience" mostrando fecha cuando existe; validar que `entry` normalizado via `entryAdapter` preserve `date`/`dateRange` para estas vistas.

- **refactor(section): domain limpio sin acoplamiento a Astro (#104)**
  - Qué cambió: refactor amplio para separar el dominio de la capa de render (múltiples `src/domain/*`, `sectionLoader`, `sections`, páginas y tests)
  - Impacto: buena compatibilidad con la ADR (dominio independiente). Reforzar que los helpers del dominio no importen componentes Astro ni dependan de paths concretos.

- **Tags index (#103)**
  - Qué cambió: añadido índice de tags (`src/pages/[locale]/tags.astro`), cambios en `domain/tags.ts`, `staticPathsBuilder.adapters.ts` y tests e2e/unit relacionados
  - Impacto: la indexación de tags y el `buildTagLocaleMap` (ya presente en `translationHelpers`) deben coincidir con la nueva estrategia de mapas por `postId` y con la normalización de slugs/locales.

### Recomendaciones rápidas tras revisar commits

- Confirmar que no quedan referencias a `buildTranslationMap` en consumers; si las hay, migrar a `translationHelpers`.
- Revisar `resolveDefaultLocale` para asegurarse de que su política (considera `draft` o no) coincide con la esperada por SEO y UX.
- Ejecutar una pasada por el contenido (`src/content/*`) para detectar entradas que violen la invariante `(postId, locale)` duplicado antes de merge.
- Añadir un breve snippet en la PR de migración explicando los puntos de ruptura: renombrado `canonicalId`→`postId`, firma de `buildLocaleEntryMap`, y `extractCleanId` más estricto.

---

## Actualización (2026-03-24): i18n + domain — resumen de cambios recientes

Además de lo documentado arriba, se han añadido mejoras y refactors en PRs posteriores que conviene dejar registrados:

- `TranslationLink` (POJO) y centralización de builders en `languagePickerUtils` para devolver objetos homogéneos que consumen `LanguagePicker` y `SEOHead`
- `SEOHead` unificado para generar `alternates` y `x-default` desde `TranslationLink`
- `MarkdownLayout` ahora inserta `SEOHead` y respeta `draft` en frontmatter para aplicar `noindex` en páginas Markdown fuera de collections
- `staticPathsBuilder` precomputa `localeLinks` y `defaultPath` y los pasa a templates, reduciendo lógica en templates

Ver `src/i18n/languagePickerUtils.ts`, `src/components/SEOHead.astro`, `src/layouts/MarkdownLayout.astro`, `src/utils/staticPathsBuilder.ts` y `src/domain/translationLink.ts` para detalles de implementación.

- Notas de migración adicionales:

- `getCanonicalMetadata` fue eliminado del runtime; sus responsabilidades se cubren ahora mediante helpers de dominio (p. ej. `getSeoDescription` en `src/domain/post.ts`) que están más enfocados en construir descripciones/metadata para SEO. Además, el campo `title` es obligatorio en todas las colecciones y debe presentarse en el frontmatter de las entradas.
- `getCanonicalMetadata` fue eliminado del runtime; la generación de la descripción SEO queda cubierta por el helper `getSeoDescription` (en `src/domain/post.ts`), que se centra únicamente en construir la `description`/`excerpt` para metadatos. La responsabilidad de emitir el `canonical` recae en el layout principal (por ejemplo `SiteLayout`, que suele usar `Astro.url` o el mecanismo de layout correspondiente) y la aplicación de `noindex` se controla desde el frontmatter `draft` (ej. `entry.data.draft`) y se transmite a `SEOHead` o a las plantillas que lo consumen. Además, el campo `title` es obligatorio en todas las colecciones y debe presentarse en el frontmatter de las entradas.
- Incluir en la PR de migración instrucciones de validación: `npm run test`, `npm run build`, y chequeos de contenido para duplicados `(postId, locale)`.

Firmado: Equipo de arquitectura — secorto_web
---

## Resumen

Esta versión actualiza la ADR original para reflejar los cambios recientes en la rama de i18n/domain: se introduce un pequeño objeto de dominio para representar enlaces de traducción (`TranslationLink`), se centralizan los builders de links en `languagePickerUtils`, se unifica la generación de metas/alternates en `SEOHead` y se añade soporte SEO para páginas Markdown fuera de colecciones mediante `MarkdownLayout`. Además se adaptó `staticPathsBuilder` para precomputar `localeLinks` y `defaultPath` por entrada.

La actualización documenta los commits más recientes y las implicaciones de migración.

## Contexto

Había duplicación y lógica dispersa para construir enlaces localizados y metas SEO. Los cambios recientes buscan:

- Unificar la representación de un enlace de idioma (href, label, disponibilidad, motivo)
- Centralizar la construcción de `localeLinks` y alternates/`x-default`
- Permitir páginas Markdown fuera de collections con `title`, `draft` y plantilla compartida
- Reducir parseos/transformaciones repetidas durante build time

Estos cambios se implementaron en múltiples archivos y producen una API más estable y testeable para i18n.

## Problemas abordados

- Lógica repetida para construir enlaces y alternates en diversas plantillas
- Falta de un objeto de dominio que describa un enlace de traducción
- Ausencia de control consistente de `noindex` para páginas markdown fuera de collections
- Repetidos parseos de identificadores y locales en la generación de rutas

## Decisión tomada

1. Añadir `TranslationLink` como objeto de dominio (POJO) para representar enlaces de idioma y su disponibilidad. (nuevo: [src/domain/translationLink.ts](../../src/domain/translationLink.ts))
2. Exponer helpers en `languagePickerUtils` que devuelven `TranslationLink` para casos: `home`, `collection`, `tag`, `detail`, `static page` y `alternates`. (actualizado: [src/i18n/languagePickerUtils.ts](../../src/i18n/languagePickerUtils.ts))
3. Actualizar `SEOHead` para recibir `links` y `defaultPath` y generar `alternates`/metas desde `TranslationLink`. (actualizado: [src/components/SEOHead.astro](../../src/components/SEOHead.astro))
4. Modificar `MarkdownLayout` para renderizar `SEOHead` usando `buildStaticPageLinks(Astro.url)` y respetar `draft` en frontmatter para `noindex`. (actualizado: [src/layouts/MarkdownLayout.astro](../../src/layouts/MarkdownLayout.astro))
5. Precomputar `localeLinks` y `defaultPath` en la generación de rutas (`staticPathsBuilder`) usando `buildLanguageLinks` + `buildDetailLink`, y exponerlos a los templates. (actualizado: [src/utils/staticPathsBuilder.ts](../../src/utils/staticPathsBuilder.ts))
6. Mantener tests unitarios que cubren los builders y metadata helpers; adaptar donde haga falta.

## Razonamiento

- Un `TranslationLink` evita decisiones ad-hoc y reduce código repetido en templates y layouts.
- Centralizar `SEOHead` garantiza coherencia en alternates y canonical/default path, además de simplificar call-sites.
- `MarkdownLayout` con `SEOHead` permite crear páginas fuera de collections con soporte para `title` y `draft` sin duplicar lógica.
- Precomputar `localeLinks` en build time mejora rendimiento y simplifica templates.

## Consecuencias

- Cambios localizados en ~11 archivos (refactor y adiciones), con riesgo moderado y fácil revisión por PR.
- Necesidad de mantener sincronía entre `rootMap` y `buildStaticPageLink` para rutas estáticas.
- Eliminación o relegado de utilidades antiguas (ej. `getCanonicalMetadata`) — ver notas abajo.

## Archivos clave cambiados

- [src/domain/translationLink.ts](../../src/domain/translationLink.ts) (nuevo)
- [src/i18n/languagePickerUtils.ts](../../src/i18n/languagePickerUtils.ts) (refactor / builders)
- [src/components/SEOHead.astro](../../src/components/SEOHead.astro) (consume `TranslationLink`)
- [src/layouts/MarkdownLayout.astro](../../src/layouts/MarkdownLayout.astro) (inserta `SEOHead`, respeta `draft`)
- [src/utils/staticPathsBuilder.ts](../../src/utils/staticPathsBuilder.ts) (precomputo `localeLinks` y `defaultPath`)
- Tests: [tests/unit/i18n/languagePickerUtils.test.ts](../../tests/unit/i18n/languagePickerUtils.test.ts)

## Migración y pasos recomendados

1. Actualizar call-sites que consumen `buildDetailLink`/`buildLanguageLinks` si cambió la firma.
2. Verificar que `MarkdownLayout` se usa para páginas markdown fuera de colecciones (añadir frontmatter `layout`, `title`, `draft`).
3. Revisar `src/content/*` para detectar entradas que violen invariantes `(postId, locale)` duplicado antes del merge.
4. Ejecutar tests unitarios y build: `npm run test` / `npm run build`.

## Notas sobre código obsoleto / remanentes

- La función `getCanonicalMetadata` fue eliminada del runtime. Su responsabilidad de construir la descripción SEO fue asumida por el helper de dominio `getSeoDescription` (en `src/domain/post.ts`), que únicamente compone la `description`/`excerpt`. La lógica de `canonical` continúa viviendo en el layout/plantilla que emite la URL canónica (p. ej. `SiteLayout`), y el control de `noindex` se aplica según `draft` en frontmatter (`entry.data.draft`) y se pasa a `SEOHead` o a las plantillas correspondientes. Asegúrese de que todas las entradas incluyan el campo obligatorio `title` en su frontmatter para cumplir el contrato de las collections.

## Cambios recientes relevantes (resumen por commit)

- **TranslationLink + languagePicker refactor**: introduce `TranslationLink` y centraliza builders. Impacto directo en `SEOHead` y `LanguagePicker`.
- **MarkdownLayout: SEO + draft**: añade `SEOHead` y `noindex` para drafts; permite páginas fuera de colecciones con layout compartido.
- **staticPathsBuilder: precomputo localeLinks**: `localeLinks` y `defaultPath` ahora se calculan en build y se pasan a templates.

Ver los commits en la rama feature/translation-link-domain para detalles.

## Riesgos y mitigaciones

- Riesgo: inconsistencias entre `rootMap` y `buildStaticPageLink` → mitigación: tests para rutas estáticas y documentación del contract de `rootMap`.
- Riesgo: remanentes de utilidades antiguas (p. ej. `getCanonicalMetadata`) → mitigación: decidir en PR si eliminar o marcar como deuda técnica.

## Recomendaciones finales

- Exponer `TranslationLink` desde `@domain` para evitar duplicación de tipos en consumidores.
- Añadir una entrada en `docs/tech-debt.md` si `getCanonicalMetadata` se deja como reserva.
- Incluir en el PR de migración un snippet con los puntos de ruptura y comandos sugeridos para validar (`npm run test`, `npm run build`).

---

Firmado: Equipo de arquitectura — secorto_web


