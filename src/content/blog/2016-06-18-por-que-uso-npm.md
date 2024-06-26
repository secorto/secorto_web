---
title: Por que uso npm
tags:
  - dev
excerpt: NPM puede llegara ser un gran aliado al desarrollar en front end, a continuación mis motivos
date: 2016-06-18
---

Este es un análisis del por que mi blog usa NPM

# Que es eso de la gestión de dependencias

Son aquellas aplicaciones que facilitan la administración de módulos comunes entre distintas aplicaciones.

## Por que usaba bower

En cuanto a la gestión de dependencia, usaba bower por que me permitía los paquetes sin muchos problemas, tenia centralizadas las herramientas a usar en el front y un archivo sencillo que los manejara.

## Que hizo que prefiriera quedarme unicamente con NPM para la gestión de dependencias

Se relaciona mas al tipo de proyecto, y en particular mi blog ya usaba NPM para las dependencias de generación de estáticos, y para lo que usaba bower ya npm ofrecía paquetes similares

# Por que automatizar tareas

Por que es aburrido hacer tareas repetitivas cuando ya hay herramientas que evitan tener que repetir estos pasos y evitan errores por omisión de alguno

## Por que considero importante la automatización de tareas de front

Cuando decidí aprender GULP y bower fue por que veía las grandes ventajas en automatización front-end que ellos me representaban.
Note que algunas cosas repetitivas como lo son minimizar imágenes, compilar los scss, unificar los css, unificar los javascript, agregar en un directorio los archivos de tipografía (fonts) se hacia mas sencillo al tener una herramienta que con un comando ejecutara esto.

## Por que NPM es suficiente en mi blog

Debido a que en mi blog puedo realizar muchas tareas a través de linea de comandos, ademas uso herramientas que van mas allá de node como Sass y Jekyll y requería unificar el build script en uno solo, y cuando usaba gulp el archivo se había hecho muy largo, y esos mismos comandos que especifique en el shell justificaban el tamaño de estos posts
