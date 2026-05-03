import { defineConfig } from 'astro/config';
const isDev = import.meta.env.DEV;

import sitemap from "@astrojs/sitemap";

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: "https://secorto.com",
  redirects: {
    '/blog/2023-09-27-devcontainers': '/es/charla/2023-09-27-devcontainers',
    '/blog/2022-08-14-screenpy': '/es/charla/2022-08-14-screenpy',
    '/blog/2020-08-03-que-es-markdown': '/es/charla/2020-08-03-que-es-markdown',
    '/blog/2019-10-22-blog-con-gatsby': '/es/charla/2019-10-22-blog-con-gatsby',
    '/blog/2018-09-17-patrones-automatizacion-pruebas': '/es/charla/2018-09-17-patrones-automatizacion-pruebas',
    '/blog/2017-01-30-test-unitarios': '/es/charla/2017-01-30-test-unitarios',
    '/es/blog/2010-08-12-slitaz-gnulinux-acer-aspire-one': '/es/blog/2026-04-25-mis-primeros-pasos-en-linux',
    '/es/blog/2011-02-28-openbox': '/es/blog/2026-04-25-mis-primeros-pasos-en-linux',
    '/es/blog/2011-03-03-screenshoots-chakra': '/es/blog/2026-04-25-mis-primeros-pasos-en-linux',
    '/es/blog/2011-06-05-kde-46-netbook': '/es/blog/2026-04-25-mis-primeros-pasos-en-linux',
    '/es/blog/2010-10-19-windows-o-linux': '/es/blog/2026-04-25-mis-primeros-pasos-en-linux',
    '/es/blog/2011-07-11-aprendiendo-hacer-paginas-web': '/es/charla/2020-08-03-que-es-markdown',
  },
  integrations: [
    sitemap(),
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false,
      themeCssRoot: 'html',
      themeCssSelector: () => '.dark'
    })
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: isDev,
    }
  }
});
