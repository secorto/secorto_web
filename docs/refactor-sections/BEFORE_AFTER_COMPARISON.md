# Comparación Visual: Antes vs Después

Comparación entre los ficheros antes y después de implementar i18n

## 🔴 ANTES: Duplicación Masiva

### Estructura de Carpetas
```
src/pages/[locale]/
├── blog/
│   ├── index.astro                    ← 23 líneas
│   └── [id].astro                     ← 15 líneas (con getStaticPaths)
├── charla/
│   ├── index.astro                    ← 23 líneas (95% igual a blog/)
│   └── [id].astro                     ← 15 líneas (igual que blog/)
├── proyecto/
│   ├── index.astro                    ← 23 líneas (95% igual)
│   └── [id].astro                     ← 15 líneas (igual)
└── trabajo/
    ├── index.astro                    ← 23 líneas (con ListWork diferente)
    └── [id].astro                     ← 15 líneas (igual)

Total: 8 archivos, ~140 líneas de código
Duplicación: ~95% del código
```

### blog/index.astro
```astro
---
import BaseLayout from '@layouts/BaseLayout.astro'
import Tags from '@components/Tags.astro';
import ListPost from '@components/ListPost.astro';
import { getPostsByLocale, getUniqueTags } from '@utils/paths';
import { languageKeys } from '@i18n/ui';
import { useTranslations } from '@i18n/utils';

export async function getStaticPaths() {
  return languageKeys.map(lang => ({params: { locale: lang }}))
}

const { locale } = Astro.params;
const t = useTranslations(locale);

const allPosts = await getPostsByLocale('blog', locale);  // ← hardcoded
const tags = getUniqueTags(allPosts);
const pageTitle = t('nav.blog');  // ← hardcoded
---
<BaseLayout pageTitle={pageTitle}>
  <Tags route=`/${locale}/blog/tags/` tags={tags} />  <!-- ← hardcoded -->
  <ListPost posts={allPosts} basePath=`${locale}/blog`` />  <!-- ← hardcoded -->
</BaseLayout>
```

### charla/index.astro
```astro
---
import BaseLayout from '@layouts/BaseLayout.astro'
import Tags from '@components/Tags.astro';
import ListPost from '@components/ListPost.astro';
import { getPostsByLocale, getUniqueTags } from '@utils/paths';  // DUPLICADO
import { languageKeys } from '@i18n/ui';
import { useTranslations } from '@i18n/utils';

export async function getStaticPaths() {  // DUPLICADO
  return languageKeys.map(lang => ({params: { locale: lang }}))  // DUPLICADO
}

const { locale } = Astro.params;  // DUPLICADO
const t = useTranslations(locale);  // DUPLICADO

const allPosts = await getPostsByLocale('talk', locale);  // ← solo cambio
const tags = getUniqueTags(allPosts);  // DUPLICADO
const pageTitle = t('nav.talks');  // ← solo cambio
---
<BaseLayout pageTitle={pageTitle}>
  <Tags route=`/${locale}/charla/tags/` tags={tags} />  <!-- ← solo cambio -->
  <ListPost posts={allPosts} basePath=`${locale}/charla`` />  <!-- ← solo cambio -->
</BaseLayout>
```

### trabajo/index.astro
```astro
---
import ListWork from '@components/ListWork.astro';
import { languageKeys } from '@i18n/ui';
import { useTranslations } from '@i18n/utils';  // DUPLICADO
import BaseLayout from '@layouts/BaseLayout.astro'  // DUPLICADO
import { getPostsByLocale } from '@utils/paths'  // DUPLICADO

export async function getStaticPaths() {  // DUPLICADO
  return languageKeys.map(lang => ({params: { locale: lang }}))  // DUPLICADO
}

const { locale } = Astro.params;  // DUPLICADO
const t = useTranslations(locale);  // DUPLICADO
const pageTitle = t('nav.work');  // ← solo cambio
const allPosts = await getPostsByLocale('work', locale);  // ← solo cambio
---

<BaseLayout pageTitle={pageTitle}>
  <ListWork posts={allPosts} basePath={`${locale}/trabajo`} lang={locale} />  <!-- ← diferente component -->
</BaseLayout>
```

### Problemas Identificados

```
❌ PROBLEMA 1: Duplicación de Imports
    Cada archivo importa lo mismo:
    - BaseLayout, Tags, ListPost/ListWork
    - getPostsByLocale, getUniqueTags
    - languageKeys, useTranslations

❌ PROBLEMA 2: Duplicación de getStaticPaths
    Todos generan rutas exactamente igual
    Solo diferencia: parámetro locale

❌ PROBLEMA 3: Hardcoding de Valores
    Cada archivo hardcodea:
    - collection ('blog', 'talk', 'work')
    - routes ('/blog', '/charla', '/trabajo')
    - traducción ('nav.blog', 'nav.talks', 'nav.work')
    - componente (ListPost vs ListWork)

❌ PROBLEMA 4: Cambios Distribuidos
    Para cambiar 'charla' a 'plenarias':
    1. charla/index.astro (2 lugares)
    2. Header/Header component
    3. Links en otros archivos
    4. Documentación
    5. Posible bug si olvidas un lugar

❌ PROBLEMA 5: Escalabilidad O(n)
    Agregar sección = crear 2 archivos nuevos
    10 secciones = 20 archivos de routing
    Complejidad lineal, insostenible
```

---

## 🟢 DESPUÉS: Arquitectura Polimórfica

### Estructura de Carpetas
```
src/
├── config/
│   └── sections.ts                    ← 63 líneas (configuración)
├── utils/
│   └── sectionLoader.ts               ← 42 líneas (estrategia de carga)
├── components/
│   └── SectionRenderer.astro          ← 28 líneas (estrategia de render)
└── pages/[locale]/
    └── [section]/
        └── index.astro                ← 47 líneas (router universal)

Total: 4 archivos, ~180 líneas
Duplicación: 0% del código
Configuración es metadata, no código
```
