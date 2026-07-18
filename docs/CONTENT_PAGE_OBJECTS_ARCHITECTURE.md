# Arquitectura de Page Objects de Contenido

## Diagrama de Clases

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ContentPage (base)                             │
├─────────────────────────────────────────────────────────────────────────┤
│ Properties:                                                             │
│  • name: string                                                         │
│  • headerTitle: TargetComponent                                         │
│  • tags: TargetComponent                                                │
│  • comments: CommentsComponent | null                                   │
│                                                                         │
│ Factory: createContentPage(page: Page, name: string)                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                    ┌───────────────┼───────────────┐
                    │               │               │
        ┌───────────▼──────┐   ┌────▼──────────┐   ┌────▼──────────┐
        │ ContentListPage  │   │ContentDetailPage│  │ ContentTagsPage│
        ├──────────────────┤   ├──────────────────┤  ├─────────────────┤
        │ Plus:            │   │ Plus:            │  │ Plus:           │
        │ • tagLinks       │   │ • postRole?      │  │ • tagLinks      │
        │ • itemLinks      │   │ • postResp?      │  │ • itemLinks     │
        │                  │   │ • postWebsite?   │  │                 │
        │ Methods:         │   │                  │  │ Methods:        │
        │ • filterByTag()  │   │ Methods:         │  │ • clickItem()   │
        │ • clickItem()    │   │ • shouldHave     │  │ • shouldHave    │
        │ • shouldHaveList │   │   DetailTitle()  │  │   FilteredTitle │
        │   HeaderTitle()  │   │ • shouldHave     │  │ ()              │
        │ • shouldRender   │   │   Comments()     │  │                 │
        │   TagsForSection │   │ • shouldHaveRole │  │                 │
        │ • shouldHaveF    │   │ ()               │  │                 │
        │   ilteredTitle() │   │ • shouldHaveResp │  │                 │
        │                  │   │ ()               │  │                 │
        │ Factory:         │   │ • shouldHaveWeb  │  │ Factory:        │
        │ contentListPage()│   │ site()           │  │ contentTags     │
        │                  │   │                  │  │ Page()          │
        │                  │   │ Factories:       │  │                 │
        │                  │   │ • contentDetail  │  │                 │
        │                  │   │ Page() (full)    │  │                 │
        │                  │   │ • contentDetail  │  │                 │
        │                  │   │ PageMinimal()    │  │                 │
        │                  │   │ (sin campos opt) │  │                 │
        └───────────────────┘   └──────────────────┘  └─────────────────┘
```

## Flujo de Uso

### Vista de Lista
```typescript
const list = await userInBlogList(page, 'es')
// Retorna: ContentListPage
// Uso:
await list.shouldHaveListHeaderTitle('Blog')
await list.filterByTag('python')
await list.clickItem('/es/blog/2022-07-11-intro-python', 'Open post')
await list.shouldRenderTagsForSection()
```

### Vista de Detalle
```typescript
const detail = await userInBlogPost(page, 'es', '2022-07-11-intro-python')
// Retorna: ContentDetailPage
// Uso:
await detail.shouldHaveDetailTitle('Introducción a Python')
await detail.shouldHaveComments('es')
await detail.shouldHaveTags(expectedAriaSnapshot)
```

### Vista Filtrada por Tags
```typescript
const tags = await userInBlogTags(page, 'es', 'python')
// Podría retornar: ContentTagsPage (futuro)
// O continuar usando: ContentListPage
// Uso:
await tags.shouldHaveFilteredTitle('Blog', 'python')
await tags.clickItem('/es/blog/2022-07-11-intro-python', 'Open post')
```

## Separación de Responsabilidades

| Responsabilidad | ContentListPage | ContentDetailPage | ContentTagsPage |
|:---|:---:|:---:|:---:|
| Mostrar lista de items | ✅ | ❌ | ❌ |
| Filtrar por tags | ✅ | ❌ | ✅ |
| Navegar a items | ✅ | ❌ | ✅ |
| Mostrar detalles del item | ❌ | ✅ | ❌ |
| Mostrar comentarios | ❌ | ✅ | ❌ |
| Mostrar role/experiencia | ❌ | ✅ | ❌ |
| Mostrar links externos | ❌ | ✅ | ❌ |
| Título de header | ✅ | ✅ | ✅ |
| Mostrar tags disponibles | ✅ | ✅ | ✅ |

## Instanciación

### ContentListPage
```typescript
function contentListPage(page: Page, name: string): ContentListPage {
  const basePage = createContentPage(page, name)
  return new ContentListPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    targetSelector(`${name} tag link`, ...),
    targetSelector(`${name} item link`, ...),
  )
}
```

### ContentDetailPage (Completa)
```typescript
function contentDetailPage(page: Page, name: string): ContentDetailPage {
  const basePage = createContentPage(page, name)
  return new ContentDetailPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    target(`${name} role`, ...),
    target(`${name} responsibilities`, ...),
    target(`${name} website`, ...),
  )
}
```

### ContentDetailPage (Minimal)
```typescript
function contentDetailPageMinimal(page: Page, name: string): ContentDetailPage {
  const basePage = createContentPage(page, name)
  return new ContentDetailPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    // Sin campos opcionales
  )
}
```

## Beneficios

🎯 **Claridad**
- Nombre de clase comunica su propósito
- Métodos disponibles son evidentes

🔒 **Type Safety**
- TypeScript previene usar método incorrecto
- IDE autocompletar es preciso

📚 **Mantenibilidad**
- Cambios en lista no afectan detalle
- Fácil agregar nuevos comportamientos

🏗️ **Escalabilidad**
- Patrón replicable en otros Page Objects
- Preparado para refactorización futura

✅ **Testing**
- Tests más descriptivos y enfocados
- Menos confusión sobre qué está siendo probado
