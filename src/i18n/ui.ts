export const defaultLang = 'es';
export const showDefaultLang = true;

export const languages = {
  en: 'English',
  es: 'Spanish'
} as const;

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
    'work.featured_image': 'Featured image'
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
    'work.featured_image': 'Imagen destacada'
  },
} as const;
