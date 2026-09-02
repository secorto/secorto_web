import type { SectionType } from '@domain/section'
import { createLocales } from '@secorto/i18n'
export const defaultLang = 'es'

export const languages = createLocales(['en', 'es'])

export type UILanguages = typeof languages.all[number]

export const languagesMap: Record<UILanguages, string> = {
  en: 'English',
  es: 'Spanish'
}

export const languageKeys = languages.all

export const ui = {
  en: {
    'site.description': 'Personal blog of Sergio Orozco - Developer, Speaker, Open Source Enthusiast',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.work': 'Work',
    'nav.talks': 'Talks',
    'nav.community': 'Community',
    'nav.projects': 'Projects',
    'work.activity': 'Activity',
    'work.today': 'today',
    'featured_image': 'Featured image for {0}',
    'talk.slides': 'Slides of talk',
    'post.view_original': 'View original',
    'post.draft_notice': 'This post is a draft and not yet ready for public viewing.',
    'post.translation_pending': 'Translation pending',
    'translation.disabled.missing': 'Translation does not exist',
    'translation.disabled.draft': 'Translation is a draft',
    'post.role': 'Role',
    'post.responsibilities': 'Responsibilities',
    'post.website': 'Website',
    'post.video': 'Post video',
    'post.work_period': 'Period',
    'tags.untranslated_notice': 'This tag has no posts available in this language.',
    'tags.index_title': 'Tags',
    'tags.index_description': 'Browse all tags grouped by content type.',
    'tags.index_no_tags': 'No tags available.',
    'tags.available_in': 'Available in',
    'footer.avatar_alt': 'Featured image',
    'footer.role': 'Software developer',
    'footer.follow': 'Follow me: ',
    'footer.tags': 'Browse tags',
  },
  es: {
    'site.description': 'Blog personal de Sergio Orozco - Desarrollador, Conferencista, Entusiasta del Open Source',
    'nav.about': 'Sobre mi',
    'nav.blog': 'Blog',
    'nav.work': 'Trabajo',
    'nav.talks': 'Charlas',
    'nav.community': 'Comunidad',
    'nav.projects': 'Proyectos',
    'work.activity': 'Actividad',
    'work.today': 'actualidad',
    'featured_image': 'Imagen destacada para {0}',
    'talk.slides': 'Presentación de la charla',
    'post.view_original': 'Ver original',
    'post.draft_notice': 'Este post está en borrador y aún no está listo para publicación pública.',
    'post.translation_pending': 'Traducción pendiente',
    'translation.disabled.missing': 'No existe la traducción',
    'translation.disabled.draft': 'La traducción es un borrador',
    'post.role': 'Rol',
    'post.responsibilities': 'Responsabilidades',
    'post.website': 'Sitio web',
    'post.video': 'Video del post',
    'post.work_period': 'Periodo',
    'tags.untranslated_notice': 'Este tag no tiene posts disponibles en este idioma.',
    'tags.index_title': 'Etiquetas',
    'tags.index_description': 'Explora todas las etiquetas agrupadas por tipo de contenido.',
    'tags.index_no_tags': 'No hay etiquetas disponibles.',
    'tags.available_in': 'Disponible en',
    'footer.avatar_alt': 'Foto destacada',
    'footer.role': 'Desarrollador de software',
    'footer.follow': 'Sígueme en: ',
    'footer.tags': 'Explorar etiquetas',
  },
} as const

export const sections = {
  blog: {en: 'Blog', es: 'Blog'},
  talk: {en: 'Talks', es: 'Charlas'},
  projects: {en: 'Projects', es: 'Proyectos'},
  work: {en: 'Work', es: 'Trabajo'},
  community: {en: 'Community', es: 'Comunidad'}
} satisfies Record<SectionType, Record<UILanguages, string>>

export const cta = {
  blog: {en: 'Read more', es: 'Leer más'},
  talk: {en: 'Watch talk', es: 'Ver charla'},
  projects: {en: 'View project', es: 'Ver proyecto'},
  work: {en: 'View more', es: 'Ver más'},
  community: {en: 'Learn more', es: 'Saber más'}
} satisfies Record<SectionType, Record<UILanguages, string>>

export const tagged = {
  blog: {en: 'Posts tagged with', es: 'Entradas etiquetadas con'},
  talk: {en: 'Talks tagged with', es: 'Charlas etiquetadas con'},
  projects: {en: 'Projects tagged with', es: 'Proyectos etiquetados con'},
  work: {en: 'Work tagged with', es: 'Trabajos etiquetados con'},
  community: {en: 'Community tagged with', es: 'Comunidad etiquetada con'}
} satisfies Record<SectionType, Record<UILanguages, string>>

export const icons = {
  missing: '🔒',
  draft: '⌛'
} as const
