/**
 * EJEMPLOS DE EXTENSIÓN
 * 
 * Este archivo muestra cómo agregar nuevas secciones, componentes y funcionalidades
 * sin modificar el código de routing o rendering existente.
 */

// ============================================================================
// EJEMPLO 1: Agregar una nueva sección "Eventos"
// ============================================================================

/* En src/config/sections.ts, simplemente agregar:

export const sectionsConfig = {
  // ... secciones existentes

  events: {
    collection: 'events',
    translationKey: 'nav.events',
    hasTags: true,
    routes: {
      es: 'eventos',
      en: 'events'
    },
    listComponent: 'ListPost',
    showFeaturedImage: true
  }
}
*/

// Resultado automático:
// ✅ /es/eventos → carga desde collection: 'events'
// ✅ /en/events → misma lógica, diferente idioma
// ✅ Tags funcionan: /es/eventos/tags/python

// ============================================================================
// EJEMPLO 2: Agregar traducción de sección
// ============================================================================

/* En src/i18n/ui.ts:

export const ui = {
  en: {
    // ... traducciones existentes
    'nav.events': 'Events',
  },
  es: {
    // ... traducciones existentes
    'nav.events': 'Eventos',
  },
}
*/

// ============================================================================
// EJEMPLO 3: Crear nuevo componente de listado (ListGallery)
// ============================================================================

/*
// Paso 1: Crear src/components/ListGallery.astro
---
interface Props {
  posts: any[]
  basePath: string
}

const { posts, basePath } = Astro.props
---

<div class="gallery">
  {posts.map(post => (
    <div class="gallery-item">
      <img src={post.data.image} />
      <a href={`/${basePath}/${post.cleanId}`}>{post.data.title}</a>
    </div>
  ))}
</div>

// Paso 2: Agregar rama en src/components/SectionRenderer.astro
{config.listComponent === 'ListGallery' && (
  <ListGallery posts={posts} basePath={`${locale}/${routeSlug}`} />
)}

// Paso 3: Usar en config
portfolio: {
  collection: 'portfolio',
  translationKey: 'nav.portfolio',
  hasTags: false,
  routes: { es: 'portfolio', en: 'portfolio' },
  listComponent: 'ListGallery',  ← ¡Nuevo componente!
  showFeaturedImage: false
}

// ¡Listo! No hay cambios en el routing.
*/

// ============================================================================
// EJEMPLO 4: Crear nuevo tipo de renderizador (SectionRendererAdvanced)
// ============================================================================

/*
// Si necesitas más flexibilidad, puedes:

// src/components/SectionRendererAdvanced.astro
---
import type { SectionConfig } from '@config/sections'

interface Props {
  config: SectionConfig
  locale: string
  posts: any[]
  tags: string[]
  customRenderer?: any  // ← Componente personalizado
}

const { config, locale, posts, tags, customRenderer: CustomRenderer } = Astro.props
---

{CustomRenderer ? (
  <CustomRenderer posts={posts} locale={locale} config={config} />
) : (
  <SectionRenderer config={config} locale={locale} posts={posts} tags={tags} />
)}
*/

// ============================================================================
// EJEMPLO 5: Agregar metadatos avanzados en configuración
// ============================================================================

/*
// Extender SectionConfig con más propiedades:

export interface SectionConfig {
  // ... propiedades existentes
  
  // Nuevas propiedades
  icon?: string
  color?: string
  displayOrder?: number
  hideFromNav?: boolean
  customHeader?: boolean
}

export const sectionsConfig: Record<SectionType, SectionConfig> = {
  blog: {
    collection: 'blog',
    translationKey: 'nav.blog',
    hasTags: true,
    routes: { es: 'blog', en: 'blog' },
    listComponent: 'ListPost',
    showFeaturedImage: true,
    
    // Metadatos nuevos
    icon: '📝',
    color: '#3498db',
    displayOrder: 1,
    hideFromNav: false
  },
  // ...
}

// Luego usar en:
// - Generador de sitemap
// - Menú de navegación dinámico
// - Estilos condicionales
*/

// ============================================================================
// EJEMPLO 6: Factory para crear secciones dinámicamente
// ============================================================================

/*
export function createSection(
  type: SectionType,
  overrides?: Partial<SectionConfig>
): SectionConfig {
  const baseConfig = sectionsConfig[type]
  return {
    ...baseConfig,
    ...overrides
  }
}

// Uso:
const blogES = createSection('blog', {
  routes: { es: 'articulos', en: 'blog' }  // Override temporal
})

const blogFeatured = createSection('blog', {
  hasTags: false  // Sin tags
})
*/

// ============================================================================
// EJEMPLO 7: Utilidad para generar menú automáticamente
// ============================================================================

/*
import { sectionsConfig } from '@config/sections'
import { useTranslations } from '@i18n/utils'
import type { UILanguages } from '@i18n/ui'

export function getNavigationItems(locale: UILanguages) {
  return Object.entries(sectionsConfig)
    .map(([_type, config]) => ({
      label: useTranslations(locale)(config.translationKey),
      href: `/${locale}/${config.routes[locale]}`,
      hasTags: config.hasTags,
      icon: config.icon
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

// Uso en Header.astro:
<nav>
  {getNavigationItems(locale).map(item => (
    <a href={item.href}>
      {item.icon} {item.label}
    </a>
  ))}
</nav>
*/

// ============================================================================
// EJEMPLO 8: Validación de configuración
// ============================================================================

/*
import { sectionsConfig } from '@config/sections'
import { ui, languageKeys } from '@i18n/ui'

export function validateSectionsConfig() {
  const errors: string[] = []
  const routes = new Set<string>()

  for (const [type, config] of Object.entries(sectionsConfig)) {
    // Validar que translationKey existe
    for (const locale of languageKeys) {
      if (!(config.translationKey in ui[locale])) {
        errors.push(`Section '${type}': translation key '${config.translationKey}' not found for locale '${locale}'`)
      }
    }

    // Validar que no hay rutas duplicadas
    for (const locale of languageKeys) {
      const route = `${locale}:${config.routes[locale]}`
      if (routes.has(route)) {
        errors.push(`Section '${type}': duplicate route '${config.routes[locale]}' for locale '${locale}'`)
      }
      routes.add(route)
    }

    // Validar que colección existe
    if (!validCollections.includes(config.collection)) {
      errors.push(`Section '${type}': collection '${config.collection}' does not exist`)
    }
  }

  return errors
}

// Uso en build/test:
if (import.meta.env.PROD) {
  const errors = validateSectionsConfig()
  if (errors.length > 0) {
    throw new Error(`Invalid sections config:\n${errors.join('\n')}`)
  }
}
*/

// ============================================================================
// EJEMPLO 9: Cambios multi-idioma simplificados
// ============================================================================

// ANTES: Cambiar "talks" → "plenarias" requería:
// 1. Editar /es/charla/index.astro
// 2. Editar /en/talk/index.astro
// 3. Editar Header.astro
// 4. Editar Navigation.astro
// 5. Actualizar links en múltiples partes
// 6. Esperar a que alguien olvide algo y bugs aparezcan

// AHORA: Cambiar es tan simple como:
/*
talk: {
  routes: {
    es: 'charlas',  // "charla" → "charlas"
    en: 'talks'     // "talk" → "talks" (opcional)
  },
  // ... resto igual
}
*/
// ✅ Todos los links, menús, sitemap se actualizan automáticamente

export default {}
