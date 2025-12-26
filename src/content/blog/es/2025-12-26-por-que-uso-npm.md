---
title: Por qué uso npm (actualizado)
tags:
  - dev
  - herramientas
excerpt: NPM puede ser un gran aliado en el desarrollo frontend; en esta actualización explico por qué lo uso y cómo lo comparo con Yarn y pnpm
date: 2025-12-26
updated: 2025-12-26
translation_status: 'original'
---

Este es un análisis de por qué mi blog usa NPM y por qué, para este proyecto en concreto, me resulta la opción más práctica.

## Qué es la gestión de dependencias

Son las herramientas que facilitan la instalación, actualización y publicación de librerías y utilidades que usamos en un proyecto.

## Por qué usaba Bower (historia)

Hace años usaba Bower porque era cómodo para gestionar assets front-end (CSS/JS) sin demasiada complejidad: centralizaba dependencias y generaba un workflow sencillo para copiar recursos al build.

## Por qué preferí quedarme únicamente con NPM

Con el tiempo NPM amplió su ecosistema y hoy ofrece la mayoría de paquetes y utilidades que antes manejaba Bower. Además mi blog ya usaba NPM para las dependencias de generación estática, por lo que mantener un solo gestor simplifica el pipeline y evita duplicidad de ficheros/lockfiles.

## Por qué automatizar tareas

Automatizar evita trabajo repetitivo y reduce errores humanos. Tareas como optimizar imágenes, compilar SCSS, concatenar/minificar CSS y JS o copiar fuentes al directorio de salida se hacen de forma fiable con scripts.

En mi caso opté por centralizar esos pasos en comandos invocables desde NPM (scripts) en lugar de añadir otra capa de herramientas compleja.

## NPM vs Yarn vs pnpm — contexto y decisión

- Yarn: en entornos profesionales suelo usar Yarn (sobre todo Yarn v1 en proyectos heredados) porque en su momento ofrecía mejoras en rendimiento y en manejo de lockfiles. Yarn introdujo ideas útiles (workspaces, determinismo) que influyeron en el ecosistema.

- pnpm: es una alternativa moderna que ahorra espacio en disco (almacena paquetes en un store global) y suele ser más rápida en instalaciones repetidas. Tiene un enfoque distinto (hoisting diferente) que a veces requiere ajustes en proyectos no preparados para él.

Para este blog en particular prefiero quedarme con NPM por simplicidad y compatibilidad: no necesito las características avanzadas de pnpm, y mantener NPM evita confusiones a colaboradores o a servicios de despliegue que esperan el flujo estándar. En mi uso profesional sí considero Yarn o pnpm cuando el proyecto lo exige (mono-repos, grandes equipos, optimización de CI), pero aquí la elección es deliberada: facilidad de mantenimiento y cero magia extra.

Si decides experimentar con pnpm, prueba primero en un branch y revisa que las dependencias (y cualquier script que manipule paths) sigan comportándose igual.

## Por qué NPM es suficiente en este blog

Porque puedo ejecutar todo el build y las tareas auxiliares desde `npm run ...`, las dependencias necesarias están publicadas en el registro y no necesito un comportamiento de instalación especial. Mantener la herramienta mínima reduce la complejidad y la barrera de entrada para contribuciones ocasionales.

---

Si quieres, puedo añadir ejemplos de `npm run build`/`npm run dev` en el README o en la entrada misma, o crear una versión traducida en inglés para comenzar la traducción.
