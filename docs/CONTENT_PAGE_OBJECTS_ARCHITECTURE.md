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
│                                                                         │
│ Methods:                                                                │
│  • shouldHaveHeaderTitle(expected: string)                             │
│  • shouldHaveTags(ariaSnapshot: string)                                │
│                                                                         │
│ Factory: createContentPage(page: Page, name: string)                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
        ┌───────────────┬───────────┼───────────┬───────────────┐
        │               │           │           │               │
┌───────▼──────┐   ┌────▼──────────┐  ┌────▼──────────┐   ┌────▼──────────┐
│ ContentList  │   │ContentPostDetail│  │ContentExperience│  │ContentTagsPage│
│     Page     │   │    DetailPage    │  │  DetailPage      │  │              │
├──────────────┤   ├──────────────────┤  ├──────────────────┤  ├─────────────────┤
│ Plus:        │   │ Plus:            │  │ Plus:            │  │ Plus:           │
│ • tagLinks   │   │ • comments:      │  │ • postRole       │  │ • tagLinks      │
│ • itemLinks  │   │   CommentsComp   │  │ • postResp       │  │ • itemLinks     │
│              │   │                  │  │ • postWebsite    │  │                 │
│ Methods:     │   │ Methods:         │  │                  │  │ Methods:        │
│ • filterByTag│   │ • shouldHave     │  │ Methods:         │  │ • clickItem()   │
│ ()           │   │   DetailTitle()  │  │ • shouldHave     │  │ • shouldHave    │
│ • clickItem()│   │ • shouldHave     │  │   DetailTitle()  │  │   FilteredTitle │
│ • shouldHave │   │   Comments()     │  │ • shouldHaveRole │  │ ()              │
│   ListHeader │   │                  │  │ ()               │  │                 │
│   Title()    │   │ Factory:         │  │ • shouldHaveResp │  │ Factory:        │
│ • shouldRender   │ contentPost      │  │ ()               │  │ contentTags     │
│   TagsForSection │ DetailPage()     │  │ • shouldHaveWeb  │  │ Page()          │
│ • shouldHaveF    │                  │  │ site()           │  │                 │
│   ilteredTitle() │                  │  │                  │  │                 │
│                  │                  │  │ Factory:         │  │                 │
│ Factory:         │                  │  │ contentExperience│  │                 │
│ contentListPage()│                  │  │ DetailPage()     │  │                 │
└──────────────────┘   └──────────────────┘  └──────────────────┘  └─────────────────┘
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

### Vista de Detalle (Post)
```typescript
const detail = await userInBlogPost(page, 'es', '2022-07-11-intro-python')
// Retorna: ContentPostDetailPage
// Uso:
await detail.shouldHaveDetailTitle('Introducción a Python')
await detail.shouldHaveComments('es')
await detail.shouldHaveTags(expectedAriaSnapshot)
```

### Vista de Detalle (Experiencia)
```typescript
const detail = await userInWorkDetail(page, 'es', 'project-name')
// Retorna: ContentExperienceDetailPage
// Uso:
await detail.shouldHaveDetailTitle('Project Title')
await detail.shouldHaveRole('Product Manager')
await detail.shouldHaveResponsibilities('Led development...')
await detail.shouldHaveWebsite('https://example.com')
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

_Nota: Los métodos `shouldHaveHeaderTitle()` y `shouldHaveTags()` son comunes a todas las clases (heredados de `ContentPage`)._

| Responsabilidad | ContentListPage | ContentPostDetailPage | ContentExperienceDetailPage | ContentTagsPage |
|:---|:---:|:---:|:---:|:---:|
| Mostrar lista de items | ✅ | ❌ | ❌ | ❌ |
| Filtrar por tags | ✅ | ❌ | ❌ | ✅ |
| Navegar a items | ✅ | ❌ | ❌ | ✅ |
| Mostrar detalles del item | ❌ | ✅ | ✅ | ❌ |
| Mostrar comentarios | ❌ | ✅ | ❌ | ❌ |
| Mostrar role/experiencia | ❌ | ❌ | ✅ | ❌ |
| Mostrar links externos | ❌ | ❌ | ✅ | ❌ |

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

### ContentPostDetailPage
```typescript
function contentPostDetailPage(page: Page, name: string): ContentPostDetailPage {
  const basePage = createContentPage(page, name)
  return new ContentPostDetailPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    comments(
      page.locator('.comments script[src*="giscus.app"]'),
      page.locator('iframe.giscus-frame'),
    ),
  )
}
```

### ContentExperienceDetailPage
```typescript
function contentExperienceDetailPage(page: Page, name: string): ContentExperienceDetailPage {
  const basePage = createContentPage(page, name)
  return new ContentExperienceDetailPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    target(`${name} role`, page.getByTestId('post-role')),
    target(`${name} responsibilities`, page.getByTestId('post-responsibilities')),
    target(`${name} website`, page.getByTestId('post-website')),
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
