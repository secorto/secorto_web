---
title: "Sitio Web de PyBAQ"
excerpt: "Contribuciones open-source al sitio web de la comunidad Python Barranquilla."
image: "@assets/img/pybaq/contribuir-pybaq.png"
role: "Desarrollador Front-End, Mantenedor"
responsibilities: "Mantenimiento del sitio web de la comunidad, scripts de automatización de eventos del meetup, configuración de pipelines CI/CD"
website: https://pybaq.co
tags:
  - python
  - javascript
  - jamstack
  - opensource
  - dev
translationKey: pybaq-website
priority: 90
---

El [sitio web de Python Barranquilla](https://pybaq.co) es un proyecto open-source administrado por la
comunidad bajo la [organización PyBAQ en GitHub](https://github.com/pybaq). Como mantenedor he
contribuido en varias áreas técnicas a lo largo de los años.

## Automatización de eventos

La contribución más relevante ha sido diseñar e implementar un pipeline que mantiene actualizada la
sección de eventos del sitio de forma automática. El script consulta la API de Meetup vía GraphQL,
normaliza la respuesta y genera los archivos de contenido necesarios para que los eventos pasados y
próximos estén siempre reflejados en el sitio sin intervención manual.

- Creación del script inicial de consulta GraphQL (`graphql.py`) para obtener datos de eventos.
- Configuración de un workflow de GitHub Actions que se ejecuta en horario programado y hace commit
  de los archivos generados.
- Iteraciones sobre la configuración del entorno, gestión de dependencias y manejo de casos borde
  en varias versiones (2024–2025).

## CI/CD y experiencia de desarrollo

- Actualización de los workflows de GitHub Actions para pruebas E2E y despliegue a versiones actuales.
- Configuración de un dev container para que cualquier colaborador pueda iniciar el entorno de
  desarrollo con un clic en Codespaces o VS Code Remote Containers.

## Contenido y estilos

- Recuperación y formato de eventos históricos de 2019 y 2020 para completar el archivo del sitio.
- Introducción de estilo de blockquote para publicaciones retrospectivas tipo "viaje en el tiempo".
- Actualización de datos de miembros y aliados (perfiles, enlaces a LinkedIn, información de patrocinadores).

Todas las contribuciones son auditables en [github.com/PyBAQ/website](https://github.com/PyBAQ/website).
