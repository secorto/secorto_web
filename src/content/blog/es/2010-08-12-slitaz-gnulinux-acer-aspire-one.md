---
title: Slitaz en acer aspire one
tags:
  - linux
blogger_orig_url: http://scot3004.blogspot.com/2010/08/slitaz-gnulinux-acer-aspire-one.html
date: 2010-08-12
---

# Descripción

Esta minidistro en su version 3.0 por defecto viene con xOrg,
SliTaz incluye un gestor de ventanas ligero, el servidor web LightTPD,
navegadores en modo texto y en modo gráfico, Gparted, un cliente IRC,
editores de texto, cliente/servidor SSH, SQLite, PHP, un wiki pre-instalado,
editor de audio, numerosas utilidades de sistema, soporte para disco duro,
red, usb, tarjeta de sonido, y mucho más.

El gestor de paquetes de esta minidistro es tazpkg,
este se encuentra disponible tanto en versión shell o
también tiene su GUI en la cual se encuentran los paquetes disponibles para su instalación.

[Página de inicio](http://slitaz.org/es/)

Esta mini-distribución trae diferentes variaciones también llamada flavors,
los paquetes que la misma trae, que van desde el sistema base
al flavor loram que se ejecuta completamente desde el cd, normalmente slitaz se ejecuta desde la Ram

[Flavors de slitaz](http://www.slitaz.org/en/get/flavors.php)

# Instalación de Slitaz

## Usando cd-rom

1.  Iniciar el live cd de slitaz, se asume que este ya se encuentra a la mano.
2.  Iniciar el programa de instalación, ya sea desde menú-> Herramientas del Sistema ->Slitaz-Installer o ejecutando en consola slitaz-installer
3.  Introduces la clave de root que por defecto es root
4.  Seleccionar la partición de disco donde se va a instalar en mi caso fue /dev/sda7, esto se puede saber con gparted (incluido en slitaz).
5.  Si se quiere tener home en otra partición, escriban cual va a ser de lo contrario deje este campo en blanco
6.  Seleccione el nombre del equipo, importante a la hora de instalar un servidor
7.  Introducir la contraseña de root, importante a la hora de ejecutar acciones del sistema como instalar programas o hacer cualquier tipo de configuración del sistema operativo
8.  Introduces tu nombre de usuario y tu clave en las dos últimos diálogos.

## Usando memoria Flash

1.  Montas la memoria en /media/cdrom o bien puedes seguir las instrucciones Usando un .iso
2.  Una vez tienes /media/cdrom sigues los pasos de instalación usando un cd-rom

## Usando un .iso como medio de instalación

1.  Ubicas la carpeta donde tengas el .iso
2.  Montas el .iso en /media/cdrom
3.  Sigues los pasos de instalación usando un cd-rom

Esta mini-distribución esta enfocada en tener justamente lo necesario, desafortunadamente presenta algunos problemas de compatibilidad con mi Acer Aspire One.

Uno de los problemas que mas me molesto es el hecho que cuando trate de ejecutar el slitaz que trae como x server el Xorg, el mismo presentaba problemas para iniciar el x window.

Para este problema presento 2 soluciones, si lo que desea es tener este instalado slitaz en el disco duro, de antemano advierto que el slitaz con Xorg tiene problemas con la pantalla y por eso este se inicia en consola.

### Solución 1

1.  Descargar el flavor Xvesa e instalar el mismo.
2.  Una vez instalado, ejecutar el siguiente comando 915resolution 50 1024 600 para añadir esta resolución a tazx, si el problema persiste añadir este comando al arranque automático.
3.  Ejecutar tazx y seleccionar 1024x600x24

### Solución 2

1.  Instalar slitaz por consola
2.  Reiniciar el compu e iniciar desde el disco.
3.  Una vez conectado a internet instalar el paquete xorg-xg86-driver-video-intel
4.  Aun no se si reconoce la resolución 1024x600 al instalar el driver de intel en caso de que no sea asi lease la solución 1 desde el paso 2

otro problema que tuve fue el de la webcam, desafortunadamente aun no le he encontrado la solución.
El audio sale perfecto, incluso por defecto trae soporte para reproducir mp3 y ogg que son los formatos que principalmente prefiero.
Para ver videos se instala el paquete mplayer incluido en tazpkg
Los discos no se montan automáticamente, de igual forma estos se montan cuando se abren en el navegador de archivos.
