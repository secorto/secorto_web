import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://secorto.com",
  redirects: {
    '/blog/2023-09-27-devcontainers': '/charla/2023-09-27-devcontainers',
    '/blog/2022-08-14-screenpy': '/charla/2022-08-14-screenpy',
    '/blog/2020-08-03-que-es-markdown': '/charla/2020-08-03-que-es-markdown',
    '/blog/2019-10-22-blog-con-gatsby': '/charla/2019-10-22-blog-con-gatsby',
    '/blog/2018-09-17-patrones-automatizacion-pruebas': '/charla/2018-09-17-patrones-automatizacion-pruebas',
    '/blog/2017-01-30-test-unitarios': '/charla/2017-01-30-test-unitarios'
  },
  integrations: [sitemap()]
});
