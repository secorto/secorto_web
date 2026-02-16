export const defaultLang = 'es';
export const showDefaultLang = true;

export const languages = {
  en: 'English',
  es: 'Spanish'
} as const;

export const languageKeys = Object.keys(languages) as Array<keyof typeof languages>;

export type UILanguages = keyof typeof languages;

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
    'featured_image': 'Featured image',
    'blog.tagged': 'Blog tagged with',
    'talk.slides': 'Slides of talk',
    'talk.tagged': 'Talks tagged with',
    'post.view_original': 'View original',
    'post.draft_notice': 'This post is a draft and not yet ready for public viewing.',
    'post.translation_pending': 'Translation pending',
    'post.role': 'Role',
    'post.responsibilities': 'Responsibilities',
    'post.website': 'Website',
    'post.video': 'Post video',
    'post.work_period': 'Period',
    'tags.untranslated_notice': 'This tag has no posts available in this language.',
    'footer.avatar_alt': 'Featured image',
    'footer.role': 'Software developer',
    'footer.follow': 'Follow me: '
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
    'featured_image': 'Imagen destacada',
    'blog.tagged': 'Entradas etiquetadas con',
    'talk.slides': 'Presentación de la charla',
    'talk.tagged': 'Charlas etiquetadas con',
    'post.view_original': 'Ver original',
    'post.draft_notice': 'Este post está en borrador y aún no está listo para publicación pública.',
    'post.translation_pending': 'Traducción pendiente',
    'post.role': 'Rol',
    'post.responsibilities': 'Responsabilidades',
    'post.website': 'Sitio web',
    'post.video': 'Video del post',
    'post.work_period': 'Periodo',
    'tags.untranslated_notice': 'Este tag no tiene posts disponibles en este idioma.',
    'footer.avatar_alt': 'Foto destacada',
    'footer.role': 'Desarrollador de software',
    'footer.follow': 'Sígueme en: '
  },
} as const;
