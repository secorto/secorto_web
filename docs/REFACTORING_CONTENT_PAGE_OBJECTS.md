# Refactorización de ContentListPage - Separación de Responsabilidades

## Problema Identificado

La clase original `ContentListPage` presentaba un **error estructural crítico** al mezclar tres responsabilidades distintas en una única clase:

### Responsabilidades Mezcladas

```
ContentListPage (original)
├── Vista de LISTA
│   ├── shouldHaveListHeaderTitle()
│   ├── filterByTag()
│   ├── clickItem()
│   └── shouldRenderTagsForSection()
├── Vista de DETALLE
│   ├── shouldHaveDetailTitle()
│   ├── shouldHaveTags()
│   ├── shouldHaveComments()
│   ├── shouldHaveRole()
│   ├── shouldHaveResponsibilities()
│   └── shouldHaveWebsite()
└── Vista de TAGS (Filtrado)
    ├── shouldHaveFilteredTitle()
    ├── clickItem()
    └── shouldRenderTagsForSection()
```

### Problemas Causados

1. **Violación del Principio de Responsabilidad Única (SRP)**
   - Una clase haciendo múltiples cosas aumenta complejidad y acoplamiento

2. **Confusión de Contextos**
   - En `BlogPages.ts`: `userInBlogPost` devolvía `ContentListPage` pero navegaba a una página de **detalle**
   - Falta claridad sobre qué métodos usar en cada contexto

3. **Mal Árbol de Herencia**
   - No había jerarquía clara de clases especializadas
   - Todos los Page Objects tenían la misma interfaz sin importar su propósito

4. **Propiedades Innecesarias**
   - Métodos de detalle (role, website) en lista
   - Métodos de filtrado en detalle
   - Propiedades de comentarios en lista

## Solución Implementada

Jerarquía clara basada en el patrón Strategy + Template Method:

```
ContentPage (base)
│   ├── name: string
│   ├── headerTitle: TargetComponent
│   ├── tags: TargetComponent
│   ├── shouldHaveHeaderTitle(expected: string)
│   └── shouldHaveTags(ariaSnapshot: string)
│
├── ContentListPage
│   ├── tagLinks: TargetSelector<string>
│   ├── itemLinks: TargetSelector<string>
│   ├── shouldHaveListHeaderTitle()
│   ├── filterByTag()
│   ├── clickItem()
│   ├── shouldRenderTagsForSection()
│   └── shouldHaveFilteredTitle()
│
├── ContentPostDetailPage (blog, talk)
│   ├── comments: CommentsComponent
│   ├── shouldHaveDetailTitle()
│   └── shouldHaveComments()
│
├── ContentExperienceDetailPage (work, projects, community)
│   ├── postRole: TargetComponent
│   ├── postResponsibilities: TargetComponent
│   ├── postWebsite: TargetComponent
│   ├── shouldHaveDetailTitle()
│   ├── shouldHaveRole()
│   ├── shouldHaveResponsibilities()
│   └── shouldHaveWebsite()
│
└── ContentTagsPage (opcional)
    ├── tagLinks: TargetSelector<string>
    ├── itemLinks: TargetSelector<string>
    ├── shouldHaveFilteredTitle()
    ├── clickItem()
    └── shouldRenderTagsForSection()
```

## Cambios Realizados

### 1. Creación de ContentPage Base

**Archivo**: `tests/support/ui/content/ContentPage.ts`

```typescript
export class ContentPage {
  constructor(
    readonly name: string,
    readonly headerTitle: TargetComponent,
    readonly tags: TargetComponent,
  ) {}
}

export function createContentPage(page: Page, name: string): ContentPage {
  // Factory que proporciona los elementos comunes
}
```

**Beneficios**:
- Base común para todas las páginas de contenido
- Factory centralizado para elementos compartidos
- `comments` solo en ContentPostDetailPage (donde se necesita)
- `postRole`, `postResponsibilities`, `postWebsite` solo en ContentExperienceDetailPage

### 2. Refactorización de ContentListPage

**Cambios principales**:
- Hereda de `ContentPage`
- Solo métodos de LISTA: `shouldHaveListHeaderTitle()`, `filterByTag()`, `clickItem()`
- Incluye filtrado: `shouldHaveFilteredTitle()`, `shouldRenderTagsForSection()`
- Usa factory `createContentPage()` para elementos base

**Antes**:
```typescript
const list = await contentListPage(page, 'blog')
await list.shouldHaveDetailTitle()  // ❌ Método de detalle en lista
await list.shouldHaveRole()          // ❌ Método de experiencia en lista
```

**Después**:
```typescript
const list = await contentListPage(page, 'blog')
await list.shouldHaveListHeaderTitle()  // ✅ Correcto
await list.filterByTag('python')         // ✅ Filtrado
```

### 3. Creación de ContentPostDetailPage

**Archivo**: `tests/support/ui/content/ContentPostDetailPage.ts`

Especialización para contenido con comentarios (blog, talk):

```typescript
export class ContentPostDetailPage extends ContentPage {
  constructor(
    name: string,
    headerTitle: TargetComponent,
    tags: TargetComponent,
    readonly comments: CommentsComponent,
  ) {
    super(name, headerTitle, tags)
  }

  shouldHaveDetailTitle(expected: string) { ... }
  shouldHaveComments(locale: UILanguages) { ... }
  // shouldHaveTags() se hereda de ContentPage
}
```

**Factory**: `contentPostDetailPage()`

### 4. Creación de ContentExperienceDetailPage

**Archivo**: `tests/support/ui/content/ContentExperienceDetailPage.ts`

Especialización para contenido profesional (work, projects, community):

```typescript
export class ContentExperienceDetailPage extends ContentPage {
  constructor(
    name: string,
    headerTitle: TargetComponent,
    tags: TargetComponent,
    readonly postRole: TargetComponent,
    readonly postResponsibilities: TargetComponent,
    readonly postWebsite: TargetComponent,
  ) {
    super(name, headerTitle, tags)
  }

  shouldHaveDetailTitle(expected: string) { ... }
  shouldHaveRole(expected: string) { ... }
  shouldHaveResponsibilities(expected: string) { ... }
  shouldHaveWebsite(expected: string) { ... }
  // shouldHaveTags() se hereda de ContentPage
}
```

**Factory**: `contentExperienceDetailPage()`

**Archivo**: `tests/support/ui/content/ContentTagsPage.ts`

Proporciona una clase especializada para vistas filtradas por tags (actualmente integrada en ContentListPage, pero disponible para futuras extensiones).

### 5. Actualización de Helpers Page

Cambios en archivos de helpers:

- **BlogPages.ts**: `userInBlogPost()` retorna `ContentPostDetailPage`
- **TalkPages.ts**: `userInTalkDetail()` retorna `ContentPostDetailPage`
- **WorkPages.ts**: `userInWorkDetail()` retorna `ContentExperienceDetailPage`
- **ProjectPages.ts**: `userInProjectDetail()` retorna `ContentExperienceDetailPage`
- **CommunityPages.ts**: `userInCommunityDetail()` retorna `ContentExperienceDetailPage`

**Antes**:
```typescript
// Blog y Talk retornaban ContentDetailPage (genérica)
export const userInBlogPost = () => 
  visit(..., contentDetailsPath(...), () => contentDetailPage(page, 'blog'))

// Work, projects y community también ContentDetailPage (con campos opcionales)
export const userInWorkDetail = () => 
  visit(..., contentDetailsPath(...), () => contentDetailPage(page, 'work'))
```

**Después**:
```typescript
// Blog y Talk retornan ContentPostDetailPage (especializada)
export const userInBlogPost = () => 
  visit(..., contentDetailsPath(...), () => contentPostDetailPage(page, 'blog'))

// Work, projects y community retornan ContentExperienceDetailPage (especializada)
export const userInWorkDetail = () => 
  visit(..., contentDetailsPath(...), () => contentExperienceDetailPage(page, 'work'))
```

## Impacto en Tests

### Compatibilidad Mantenida

Todos los tests existentes funcionan sin cambios porque:

1. Los métodos siguen siendo accesibles en el contexto correcto
2. Las signatures de métodos no cambiaron
3. El comportamiento es idéntico

### Ejemplo de Uso Mejorado

```typescript
// test para lista
const list = await userInBlogList(page, 'es')
await list.shouldHaveListHeaderTitle('Blog')
await list.filterByTag('python')
await list.shouldHaveFilteredTitle('Blog', 'python')

// test para detalle
const detail = await userInBlogPost(page, 'es', slug)
await detail.shouldHaveDetailTitle(postTitle)
await detail.shouldHaveComments('es')
```

## Ventajas de la Refactorización

✅ **Separación Clara de Responsabilidades**
- Cada clase tiene un propósito único

✅ **Mejor Árbol de Herencia**
- Relaciones claras entre clases
- Propiedades compartidas en base

✅ **Mantenibilidad**
- Fácil agregar nuevas responsabilidades sin contaminar otras clases
- IDE puede sugerir métodos correctos según contexto

✅ **Type Safety**
- TypeScript detecta métodos incorrectos en compile time
- Mejor autocompletar en el editor

✅ **Escalabilidad**
- ContentTagsPage disponible para refactorización futura
- Especializaciones claras: `ContentPostDetailPage` vs `ContentExperienceDetailPage`

✅ **Documentación de Intención**
- El tipo de retorno comunica claramente qué página se está testeando
- Nombre de clase (`ContentPostDetailPage` vs `ContentExperienceDetailPage`) explica la especialización
- Métodos disponibles son evidentes desde el IDE

✅ **Type Safety Completo**
- Campos especializados son requeridos (no opcionales)
- Compiler valida disponibilidad de métodos
- Sin validaciones manuales de null/undefined

## Próximas Mejoras Sugeridas

1. **Integración Total de ContentTagsPage**
   - Si el comportamiento de filtrado se vuelve significativamente diferente
   - Actualizar helpers para retornar `ContentTagsPage` cuando sea aplicable

2. **Page Objects para Otros Componentes**
   - Extender patrón a otras páginas (sidebar, header, etc.)
   - Mantener consistencia en toda la suite de tests

3. **Documentación de Tests**
   - Guía para uso correcto de cada Page Object
   - Ejemplos en comentarios JSDoc
