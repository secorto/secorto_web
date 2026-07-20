# Page Objects: Arquitectura E2E en 3 Capas

Modelo de arquitectura para estructurar tests E2E usando una jerarquía composable de Components, Pages y Flows (opcional).

## Modelo Genérico: Component/Page/Flow

La arquitectura E2E en este proyecto sigue un modelo de **3 capas composables**:

### Capa 1: Components (Unidades de UI con Comportamiento)

**Ubicación**: `tests/support/ui/components/`

Abstraen cualquier unidad de UI con un protocolo de interacción o validación esperado:

- **Primitivos**: `Target` (locator genérico + assertions), `Link` (locator + validaciones de href)
- **Especializados**: `Comments` (composite: script + iframe), `PageHelper` (utilidades stateless)
- **Criterio de creación**: ¿Tiene el elemento un "happy path" o protocolo de uso? → Es componente
- **Responsabilidad**: Encapsular cómo se ve/comporta EL ELEMENTO específico (no el contexto page)
- **Patrón**: Clase + factory + métodos que retornan `Promise` vía `step()`
- **Realidad SSG**: En un sitio sin interacciones pesadas, `Target` suele ser
  suficiente. Pero si existe un Dropdown, Modal, o Tab con open/close/select,
  ese es un componente formal

### Capa 2: Pages (Orquestadores de Components)

**Ubicación**: `tests/support/ui/{domain}/` (ej: `home/`, `content/`, `sidebar/`)

Orquestan múltiples components con métodos semánticos que representan el flujo local:

- **Responsabilidad**: Combinar components para expresar la lógica/validación de una sección
- **Patrón**:
  - Clase con constructor que inyecta components
  - Factory: `homePage(page: Page): HomePage`
  - Helper: `userInHome(page: Page): Promise<HomePage>` que invoca `visit()` y retorna factory
  - Métodos sin `async` si retornan lazy `Promise` (para encadenamiento)
- **Métodos**: Cada uno encapsulado en `step()`, orquestan 1+ componentes + lógica local
- **Exportación**: Cada Page Object expone métodos semánticos, NO simples locators

### Capa 3: Flows (Secuencias Multi-Step/Multi-Page - OPCIONAL)

**Ubicación**: `tests/support/flows/`

Encapsulan narrativas complejas que cruzan múltiples pages o requieren coordinación:

- **Responsabilidad**: Encapsular secuencias que no pertenecen a una sola page
- **Por qué**: Permite reutilizar narrativas complejas en múltiples tests sin duplicación
  (ej: "iniciar sesión → navegar → filtrar → validar").
- **Cuándo**: Solo cuando necesites la **misma secuencia multi-page en múltiples tests**.
  Si es una secuencia única, hazla inline en el spec.
- **Estructura**: UN único `step()` raíz; cada acción delega a métodos de Page que contienen sus propios `step()`

## Patrones y Principios

- **Componentes vs Pages**: Components encapsulan comportamiento de elementos aislados
  (Target, Dropdown, Comments). Pages combinan components para expresar lógica de sección/dominio.
  Pages exponen métodos semánticos, NO simples locators.
- **Encapsulación en `step()`**: Cada método retorna `Promise` via `step()` para visibilidad en reportes E2E.
- **Inyección de componentes**: Pages reciben components en constructor, no los crean directamente.
- **Flows (cuando sea necesario)**: Usa flows para secuencias complejas multi-page; no para toda acción.
- **Localizadores estables**: Preferir selectores accesibles por Playwright (`getByRole` / ARIA).
  Si no es práctico, usar `data-testid` como atributo estable. Evitar selectores frágiles (clases).
- **Mocking de terceros**: Mockear recursos externos con `page.route()` o proveedores locales en CI.
- **Timeouts razonables**: Usar checks de visibilidad/atributos en lugar de `sleep()`
- **Composición sobre herencia**: Prefiere inyectar components en pages que crear jerarquías de herencia.

---

## Ejemplo: Modelo de Page Objects para Content

Aplicación concreta del modelo genérico al testing de contenido (blogs, talks, trabajos, etc.).

**Para el contexto de decisión, justificación y tabla de responsabilidades**, ver [ADR 014: Jerarquía de Page Objects](../adr/014-page-objects-hierarchy-separation-of-concerns.md).

### Diagrama de Clases

```mermaid
classDiagram
    class ContentPage {
        -name: string
        -headerTitle: TargetComponent
        -tags: TargetComponent
        +shouldHaveHeaderTitle(expected: string)
        +shouldHaveTags(ariaSnapshot: string)
        +clickTag(tag: string, title?: string)
    }

    class ContentListPage {
        -tagLinks: TargetSelector
        -itemLinks: TargetSelector
        +shouldHaveFilteredTitle(section: string, tag: string)
        +shouldHaveFilteredResults()
        +filterByTag(tag: string)
        +clickItem(href: string, title: string)
        +shouldRenderTagsForSection()
    }

    class ContentPostDetailPage {
        -comments: CommentsComponent
        +shouldHaveComments(locale: UILanguages)
    }

    class ContentExperienceDetailPage {
        -postRole: TargetComponent
        -postResponsibilities: TargetComponent
        -postWebsite: TargetComponent
        +shouldHaveRole(expected: string)
        +shouldHaveResponsibilities(expected: string)
        +shouldHaveWebsite(expected: string)
    }

    class ContentTagsPage {
        -tagLinks: TargetSelector
        -itemLinks: TargetSelector
        +shouldHaveFilteredTitle(section: string, tag: string)
        +clickItem(href: string, title: string)
        +shouldRenderTagsForSection()
    }

    ContentPage <|-- ContentListPage
    ContentPage <|-- ContentPostDetailPage
    ContentPage <|-- ContentExperienceDetailPage
    ContentPage <|-- ContentTagsPage
```

### Archivos de Implementación

Las implementaciones de cada Page Object y sus factories están en [tests/support/ui/content/](../../tests/support/ui/content/):

- **Base compartida**: [ContentPage.ts](../../tests/support/ui/content/ContentPage.ts)
- **Listas**: [ContentListPage.ts](../../tests/support/ui/content/ContentListPage.ts), [BlogPages.ts](../../tests/support/ui/content/BlogPages.ts), [WorkPages.ts](../../tests/support/ui/content/WorkPages.ts), etc.
- **Detalles**: [ContentPostDetailPage.ts](../../tests/support/ui/content/ContentPostDetailPage.ts), [ContentExperienceDetailPage.ts](../../tests/support/ui/content/ContentExperienceDetailPage.ts)
- **Filtrado**: [ContentTagsPage.ts](../../tests/support/ui/content/ContentTagsPage.ts)
