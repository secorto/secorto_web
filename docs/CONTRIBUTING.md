# Guía de contribución

> **Note**
> Este documento está escrito en español (this document is written in Spanish)

Muchas gracias por el interés en este repositorio el cual corresponde a mi sitio web personal,
estoy abierto a contribuciones las cuales están sujetas al siguiente proceso:

## Análisis

Para el análisis de las tareas a desarrollar se usaran issues y discussions, los cuales deben estar detallados
y para ello se facilitan una serie de plantillas que ayudan con su creación

Para los issues resalto 2 categorías que implican cambios en el código,
y las preguntas considero que es mejor tratarlas como discussions

### Issues

Puedes crear nuevos incidentes (issues) usando el botón "New issue" en la pestaña "Issues" del repositorio

![Reportar issue](./images/issues.png)

Reporte de error: En esta categoría se enumeran todos los comportamientos inesperados (o defectos),
ya sean visuales o bien algún error que aparezca en la consola del navegador

Solicitud mejora: Estos se darán cuando haya algo que se pueda mejorar en el sitio web,
ya sea que se pueda adicionar una nueva funcionalidad o bien cambiar el comportamiento de alguna existente.

Selecciona una de las plantillas según el tipo de incidente que deseas reportar presionando el respectivo botón "Get started"

![Seleccionar plantilla del issue](./images/plantillas_issue.png)

Reemplaza el contenido de acuerdo a lo que quieres reportar para lo cual aparecerá un formulario con la información a diligenciar

![Diligenciar los campos requeridos](./images/issue_bug.png)

### Discussions

Esta funcionalidad permite tener un foro en el repositorio donde se pueden discutir funcionalidades,
de hecho surge como una mejora al tipo issue que ya tenia github

![Discussions](./images/discussions.png)

## Desarrollo

Para el desarrollo de cualquiera de las tareas creadas (issues)
recomiendo hacer la instalación de node usando la misma versión que veas en el archivo [.nvmrc](../.nvmrc)

### 🧐 Como está organizado este proyecto?

Esta es una vista rápida del primer nivel de directorio que veras en este proyecto

```console output
├── docs/
│   ├── README.md
│   └── adr/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── (componentes reutilizables de la página)
│   ├── layouts/
│   │   └── (plantillas/layouts del sitio)
│   ├── content/
│   │   └── (posts y colecciones de contenido)
│   └── pages/
│       └── index.astro
├── tests/
│   ├── e2e/
│   └── unit/
├── .nvmrc
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

1. **`/src`**: Código fuente del proyecto — páginas (`src/pages`), componentes reutilizables (`src/components`),
  layouts (`src/layouts`), contenidos (`src/content`), estilos (`src/styles`) y utilidades (`src/utils`)

2. **`/src/content`**: Contenidos estáticos y publicaciones organizadas por colección
  (por ejemplo `blog`, `work`, `talk`) que alimentan el sitio

3. **`tests/`**: Este directorio contiene las pruebas unitarias y E2E (end-to-end).

4. **`.gitignore`**: Este archivo especifica los archivos y directorios que no se deben cargar en git

5. **`.prettierrc`**: Este es el archivo de configuración de prettier [Prettier](https://prettier.io/).

6. **`LICENSE`**: Aca encuentras los términos de licencia del código que estás viendo

7. **`package.json`**: Es un manifiesto para los proyectos hechos con Node.js, que incluye cosas como los meta-datos
(como el nombre del proyecto, autor, etc) con este archivo es que node sabe que paquetes instalar.

8. **`/node_modules`**: Este directorio contiene todos los módulos de los que tu proyecto depende (paquetes npm)
y son automáticamente instalados.

9. **`README.md`**: El archivo que contiene información relevante sobre cómo se configura, cómo se ejecuta
y otros detalles; todo proyecto git debería tener uno bien documentado

10. **`docs/`**: Documentación técnica y procesos del proyecto — guías,
  entradas de arquitectura (ADRs) en `docs/adr/` y el índice en `docs/README.md`

### Instalación

Para instalar las dependencia de este proyecto, por favor ejecuta el comando

```bash
npm install
```

### Ejecutar server para desarrollo

Una instaladas todas las dependencias podemos ejecutar  el comando

```bash
npm run dev
```

El cual nos iniciara un servidor de desarrollo donde podemos ir viendo como afectan al sitio web
  los cambios que estamos haciendo y por defecto se ejecutará en [http://localhost:4321](http://localhost:4321)!

## Pruebas

Las pruebas son parte clave de cualquier proceso de desarrollo.

Este proyecto se basa en una estrategia de pruebas documentada en [Testing Strategy](./TESTING_STRATEGY.md)

La ejecución de todas las pruebas se hace con:

```bash
npm test
```

## Pull Requests

Por favor mantén tus pull requests enfocados en un solo tema en específico.
Si tienes un número de solicitudes por enviar, entonces envía solicitudes
separadas. Es mucho más fácil recibir solicitudes pequeñas y bien definidas, que
tener que revisar y gestionar solicitudes grandes que apuntan a diferentes
temas.

![Crear pull request](./images/crear_pr.png)

Una vez le des crear selecciona la rama base,
que para este repositorio es `master` y luego debes seleccionar la rama desde la cual hiciste tus cambios

![Comparación de ramas](./images/pr_compare.png)

Una vez tengas seleccionadas las ramas deberás colocar una descripción a tu pull request,
para lo cual aprovecha la plantilla que aparece por defecto

![Descripción Pull request](./images/pr_descripcion.png)

Reemplaza el numero de issue asociado y agrega unas observaciones, sugiero colocar acá unas capturas
que resalten el cambio que has generado

![Ejemplo de un buen PR](./images/pr_ejemplar.png)

### Verificaciones

Para aprobar un pull request, me baso en 2 criterios

1. El cambio está justificado a traves de un issue. que justifique su valor.
2. Se están siguiendo buenas practicas de desarrollo
3. Todas las verificaciones pasan en verde
4. Luego de una verificación manual veo que no se rompió nada (regresión)

![Verificaciones automatizadas](./images/pr_verificaciones.png)

En este repositorio se usan verificaciones automatizadas usando [github actions](https://github.com/features/actions)
y [netlify](https://www.netlify.com/)

Las cuales se ven asi:

Panel de administración de netlify
![Deploy preview en netlify](./images/netlify_preview_deploy.png)
