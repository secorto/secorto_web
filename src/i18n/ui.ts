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
    'work.role': 'Role',
    'work.activity': 'Activity',
    'work.responsibilities': 'Responsibilities',
    'work.website': 'Website',
    'work.today': 'today',
    'featured_image': 'Featured image',
    'blog.tagged': 'Blog tagged with',
    'talk.video': 'Video of talk',
    'talk.slides': 'Slides of talk',
    'talk.tagged': 'Talks tagged with',
  },
  es: {
    'nav.about': 'Sobre mi',
    'nav.blog': 'Blog',
    'nav.work': 'Trabajo',
    'nav.talks': 'Charlas',
    'nav.community': 'Comunidad',
    'nav.projects': 'Proyectos',
    'work.role': 'Rol',
    'work.activity': 'Actividad',
    'work.responsibilities': 'Responsabilidades',
    'work.website': 'Sitio web',
    'work.today': 'actualidad',
    'featured_image': 'Imagen destacada',
    'blog.tagged': 'Entradas etiquetadas con',
    'talk.video': 'Video de la charla',
    'talk.slides': 'Presentación de la charla',
    'talk.tagged': 'Charlas etiquetadas con',
  },
} as const;
