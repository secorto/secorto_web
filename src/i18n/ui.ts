export const defaultLang = 'es';
export const showDefaultLang = true;

export const languages = {
  en: 'English',
  es: 'Spanish'
} as const;

export const languageKeys = Object.keys(languages) as Array<keyof typeof languages>;

// keyof languages type as typescript type
export type UILanguages = keyof typeof languages;

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.work': 'Work',
    'nav.talks': 'Talks',
    'nav.community': 'Community',
    'nav.projects': 'Projects',
    'work.activity': 'Activity',
    'work.today': 'today',
    'featured_image': 'Featured image',
    'blog.tagged': 'Blog tagged with',
    'talk.video': 'Video of talk',
    'talk.slides': 'Slides of talk',
    'talk.tagged': 'Talks tagged with',
    'post.untranslated_notice': 'This post is not translated into the selected language. You are viewing the original.',
    'post.view_original': 'View original',
    'post.translation_draft_notice': 'This is a draft translation. The canonical original is available.',
    'post.translation_pending': 'Translation pending',
    'post.role': 'Role',
    'post.responsibilities': 'Responsibilities',
    'post.website': 'Website',
    'tags.untranslated_notice': 'This tag has no posts available in this language.',
  },
  es: {
    'nav.about': 'Sobre mi',
    'nav.blog': 'Blog',
    'nav.work': 'Trabajo',
    'nav.talks': 'Charlas',
    'nav.community': 'Comunidad',
    'nav.projects': 'Proyectos',
    'work.activity': 'Actividad',
    'work.today': 'actualidad',
    'featured_image': 'Imagen destacada',
    'blog.tagged': 'Entradas etiquetadas con',
    'talk.video': 'Video de la charla',
    'talk.slides': 'Presentación de la charla',
    'talk.tagged': 'Charlas etiquetadas con',
    'post.untranslated_notice': 'Esta entrada no está traducida al idioma seleccionado. Estás viendo el original.',
    'post.view_original': 'Ver original',
    'post.translation_draft_notice': 'Esta es una traducción en borrador. El original canónico está disponible.',
    'post.translation_pending': 'Traducción pendiente',
    'post.role': 'Rol',
    'post.responsibilities': 'Responsabilidades',
    'post.website': 'Sitio web',
    'tags.untranslated_notice': 'Este tag no tiene posts disponibles en este idioma.',
  },
} as const;
