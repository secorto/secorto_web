---
title: Mis primeros pasos en Linux
date: 2026-04-25
tags:
  - linux
  - resumen
  - experiencias
excerpt: Un repaso personal y condensado de lo que aprendí usando varias distribuciones y entornos de escritorio, transformando antiguos tutoriales en lecciones.
gallery:
  - image: "@assets/img/post/chakra/openbox.png"
    alt: "Openbox — captura de escritorio"
  - image: "@assets/img/post/chakra/lxde.png"
    alt: "LXDE — captura de escritorio"
  - image: "@assets/img/post/chakra/kde.png"
    alt: "KDE — captura de escritorio"
translationKey: 'mis-primeros-pasos-en-linux'
---

A lo largo de varios años escribí tutoriales y notas sobre distintas distribuciones y entornos. Este post reúne esas experiencias en forma de lecciones prácticas y reflexiones: qué funcionó, qué me frustró y qué sigo usando.

## Slitaz

- Lección principal: las minidistros enseñan a priorizar lo esencial; valen para hardware muy limitado
- Conceptos aprendidos: `tazpkg` como gestor, flavors (loram), ejecución desde RAM, herramientas incluidas (LightTPD, mplayer, GParted)
- Problemas típicos: compatibilidad gráfica en ciertos netbooks (soluciones: usar Xvesa o instalar drivers intel y ajustar resoluciones)
- Consejo: las distros minimalistas son excelentes para aprender diagnóstico de hardware y manejo mínimo de paquetes

## Chakra / Arch-derived (KDE en netbook)

- Lección principal: `pacman` y la filosofía rolling son poderosas, pero KDE puede ser exigente en máquinas modestas
- Aprendizajes: cómo reducir efectos, elegir compositor (XRender vs OpenGL) y optimizar KDE para mejorar rendimiento
- Valor práctico: aprender a equilibrar apariencia vs usabilidad y cuándo prefiero escritorios ligeros (Openbox, LXDE)

## Openbox y entornos ligeros

- Lección principal: separar compositor/gestor de ventanas de utilidades (Nitrogen para fondos, Conky para información, pcmanfm como gestor)
- Aprendizaje práctico: con la combinación correcta, equipos antiguos recuperan mucha vida y flexibilidad
- Recomendación: usar configuraciones modulares para entender cada pieza del escritorio

## Observaciones generales

- La comunidad GNU/Linux es un recurso clave: foros y wikis aceleraron la solución de problemas
- Enseñanza transversal: cada experimento me enseñó a diagnosticar hardware, leer logs, y a preferir soluciones simples cuando es posible
- En lugar de repetir pasos largos, este post prioriza los aprendizajes y enlaces a los posts originales para quien necesite detalle técnico

## Referencias y posts originales

- Slitaz en Acer Aspire One — <http://scot3004.blogspot.com/2010/08/slitaz-gnulinux-acer-aspire-one.html>
- Windows o Linux — <http://scot3004.blogspot.com/2010/10/windows-o-linux.html>
- Openbox — <http://scot3004.blogspot.com/2011/02/openbox.html>
- Screenshots de mi Chakra — <http://scot3004.blogspot.com/2011/03/screenshoots-de-mi-chakra-bueno-en.html>
- KDE 4.6 netbook (Chakra) — <http://scot3004.blogspot.com/2011/06/kde-46-netbook.html>
