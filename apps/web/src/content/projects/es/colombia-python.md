---
title: "Sitio Web Python Colombia"
excerpt: "Contribuciones open-source al sitio oficial de la comunidad Python Colombia."
role: "Colaborador"
responsibilities: "Script de automatización de eventos del meetup, workflows de GitHub Actions, configuración de dev container, mantenimiento de contenido"
website: https://python.org.co
tags:
  - python
  - opensource
  - jamstack
  - dev
translationKey: colombia-python
image: "@assets/img/project/python-co.png"
priority: 60
---

[python.org.co](https://python.org.co) es el sitio oficial de la comunidad Python Colombia, construido
con [Lektor](https://www.getlektor.com/) y mantenido colaborativamente en el repositorio
[ColombiaPython/sitio-web](https://github.com/ColombiaPython/sitio-web), donde aparezco como uno de
13 colaboradores.

## Automatización de eventos del meetup (2023–2024)

La contribución principal fue desarrollar un script que sincroniza automáticamente los datos de eventos
de Meetup con el modelo de contenido de Lektor:

- Implementación del bot de actualización de eventos que extrae datos de la plataforma Meetup y genera
  los archivos de contenido Lektor correspondientes (PR [#193](https://github.com/ColombiaPython/sitio-web/pull/193)).
- Actualización del workflow de GitHub Actions con ejecución programada para mantener el bot activo.
- Adición de una blacklist de eventos para omitir entradas malformadas que rompían el build.

## Mejoras a la experiencia de desarrollo (2023)

- Configuración de un dev container para GitHub Codespaces que permite contribuir sin instalación
  local (PR [#190](https://github.com/ColombiaPython/sitio-web/pull/190)).
- Configuración del workflow de despliegue para la rama `develop`
  (PR [#191](https://github.com/ColombiaPython/sitio-web/pull/191)).

## Contribuciones de contenido (2023)

- Adición del enlace a Discord en la navegación de la comunidad
  (PR [#189](https://github.com/ColombiaPython/sitio-web/pull/189)).
- Actualización de la sección de eventos con datos hasta agosto de 2023
  (PR [#192](https://github.com/ColombiaPython/sitio-web/pull/192)).

Todas las contribuciones son auditables en
[github.com/ColombiaPython/sitio-web](https://github.com/ColombiaPython/sitio-web).
