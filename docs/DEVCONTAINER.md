# Devcontainer — Inicio rápido y notas DX

Quick start (lo que quieres ver al abrir el devcontainer)
-----------------------------------------------------

- Al crear/abrir el devcontainer:
  - `postCreateCommand` ejecuta `npm install` automáticamente
  - Al adjuntarte, `postAttachCommand` ejecuta `npm start` por defecto, dejando el servidor en ejecución
  - El puerto `4321` está forwarded y configurado para abrir la vista previa (`onAutoForward: openPreview`)
- Resultado visible inmediato: servidor en `http://localhost:4321` accesible desde la vista previa de VS Code/Codespaces
- Nota: el editor no siempre muestra automáticamente el `README.md` al abrir el contenedor; por eso este proyecto configura VS Code para intentar abrir `docs/DEVCONTAINER.md` al adjuntarse al devcontainer

Extensiones incluidas
---------------------

- `astro-build.astro-vscode` — soporte de Astro: sintaxis y snippets
- `vitest.explorer` — integración para ejecutar y explorar tests de Vitest
- `ms-playwright.playwright` — herramientas para escribir/ejecutar tests con Playwright
- `dbaeumer.vscode-eslint` — linting integrado con ESLint

Comandos útiles
---------------

- `npm start` — el devcontainer lo arranca automáticamente al adjuntarse; el script `start` usa `--host` para exponer la app en 0.0.0.0 y permitir conexión desde fuera del contenedor (por eso no necesitas correr `npm run dev` dentro del devcontainer)
- `npm run dev` — opcional fuera del devcontainer; dentro del contenedor no es necesario porque `npm start` ya deja la app accesible
- `npm run test:e2e` — ejecutar E2E con Playwright (requiere instalar navegadores primero: `npx playwright install --with-deps`)

Detalles y rationale (instrucciones específicas)
---------------------------------------------

Colocar estas notas en `docs/DEVCONTAINER.md` mantiene el `README.md` raíz compacto y centraliza detalles del entorno para quienes usan Codespaces o devcontainers.

Playwright y navegadores — enfoque de tamaño de imagen
-----------------------------------------------------

- La imagen base del devcontainer es `mcr.microsoft.com/devcontainers/javascript-node:24` (entorno Node.js)
- Para mantener la imagen ligera, NO se instalan los navegadores de Playwright en la imagen por defecto
- Si necesitas ejecutar E2E dentro del contenedor, instala los navegadores manualmente (recomendado sólo en máquinas de desarrollo o CI que lo requieran):

```bash
npx playwright install --with-deps
```

- Ese comando instala **Chromium**, **Firefox** y **WebKit** y las dependencias nativas necesarias. No inicia servidores ni ejecuta tests por sí mismo.

Qué se inicia automáticamente en este devcontainer
-----------------------------------------------

- `npm install` (según `postCreateCommand`)
- `npm start` (según `postAttachCommand`), que en este repo mapea al script `start` en `package.json` y deja la app escuchando en `4321`
- Forward del puerto `4321` y apertura de la vista previa por la configuración del devcontainer

Cosas que no hace el devcontainer automáticamente
-----------------------------------------------

- No instala los navegadores E2E por defecto (ver sección Playwright)
- No publica variables de entorno para pruebas; si vas a ejecutar E2E contra una preview de Netlify configura `NETLIFY_PREVIEW_URL` en tu Codespace/devcontainer o expórtala antes de correr los tests

Recomendaciones rápidas
-----------------------

- Si solo vas a desarrollar la app, evita instalar los navegadores en el contenedor — usa `npm run dev` y depura desde el navegador local
- Para CI o workflows de validación E2E crea una imagen específica o añade un paso en el pipeline que ejecute `npx playwright install --with-deps`
- Mantén este documento corto y coloca información de referencia (comandos opcionales y rationale) aquí; deja en el `README.md` raíz una nota breve y el enlace para no saturar la primera vista del contenedor
