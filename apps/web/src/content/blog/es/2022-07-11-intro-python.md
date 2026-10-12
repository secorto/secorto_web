---
title: Introducción a Python
image: "@assets/img/blog/python-introduction.svg"
tags:
  - dev
  - python
excerpt: "Hoja de ruta progresiva para aprender Python moderno, desde los fundamentos hasta la programación orientada a objetos mediante laboratorios interactivos."
translationKey: intro-python
date: 2022-07-11
---

¡Bienvenido! El ecosistema de **Python** ha evolucionado de gran manera.

Python ha evolucionado considerablemente en los últimos años. Además de una sintaxis simple y expresiva,
el ecosistema moderno incorpora herramientas como los Type Hints,
las dataclasses y otras características que facilitan el mantenimiento del código.

Esta guía unificada funciona como tu **hoja de ruta (Cheatsheet) de referencia rápida**.
El objetivo es darte un panorama claro de los conceptos esenciales antes de que pases a experimentar.
Los laboratorios interactivos, el código en vivo y los diagramas de arquitectura detallados
los encontrarás directamente en los **Notebooks de Google Colab** en nuestro nuevo repositorio dedicado.

---

## 📘 Módulo 1: Fundamentos y Sintaxis Esencial

Este módulo está diseñado para llevarte desde el "Hola Mundo" hasta el control de flujos y colecciones básicas.
Python destaca por su facilidad de lectura, pero esconde reglas de tipado y precisión que debes conocer.

### Tabla de Contenidos - Módulo 1

* **Entorno Jupyter:** Uso de bloques de texto (Markdown) y bloques de código ejecutable en Google Colab.
* **Variables y Tipos de Datos:** Manejo de cadenas (`str`), enteros (`int`) y números complejos.
* **Type Hints:** Introducción conceptual al tipado estático opcional y documentación de contratos en código.
* **Colecciones Esenciales:** Diferencias de mutabilidad y tipado moderno en **Listas**, **Tuplas** y **Diccionarios**.
* **Nota de Precisión:** Importación de la clase `Decimal` para evitar pérdidas de precisión en operaciones financieras.
* **Flujos de Control:** Estructuras condicionales (`if/elif/else`) y ciclos repetitivos (`for`, `while`).
* **Optimización:** Creación de funciones con *Type Hints* y optimización de código mediante *List Comprehension*.

### 🚀 Laboratorio Práctico 1

Abre el notebook interactivo en nuestro repositorio para modificar,
experimentar y ejecutar el código de sintaxis esencial en vivo (incluye el reto del detector de palíndromos):

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/secorto/notebooks/blob/main/spanish/intro-python.ipynb)

---

## 📙 Módulo 2: Programación Orientada a Objetos Moderna

Cuando las estructuras esenciales no bastan, escalamos al paradigma orientado a objetos para modelar problemas complejos.
Aquí dejamos atrás las prácticas obsoletas para adoptar los estándares profesionales de Python moderno.

### Tabla de Contenidos - Módulo 2

* **El Concepto de Objeto:** Por qué en Python es obligatorio el uso explícito de `self` en los métodos de instancia.
* **Modelado Eficiente (`@dataclass`):** Uso de *dataclasses* (Python 3.7+) para autogenerar constructores (`__init__`)
  y representaciones limpias sin escribir código repetitivo.
* **Métodos Mágicos (*Dunder Methods*):** Intercepción y sobrecarga de operadores nativos (`+`, `-`, `==`)
  en tus clases personalizadas.
* **Herencia y Polimorfismo:** Adopción y redefinición de métodos desde una clase base hacia clases hijas.
* **Herencia Múltiple y MRO:** Resolución del "Problema del Diamante" a través del algoritmo *Method Resolution Order*.
* **Filosofía del Lenguaje:** *Duck Typing* y definición de contratos estructurales modernos mediante la clase `Protocol`.

### 🚀 Laboratorio Práctico 2

Para ver las explicaciones profundas, interactuar con el código en vivo y visualizar la arquitectura avanzada de clases
modelada con PlantUML, accede al segundo laboratorio:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/secorto/notebooks/blob/main/spanish/poo-python.ipynb)

*Nota de ejecución: Para este notebook de POO avanzada estaremos utilizando diagramas de arquitectura de clases
  ejecutables de forma nativa. Es necesario ejecutar la celda inicial de configuración para instalar y
  cargar la extensión `iplantuml` para que los gráficos se rendericen correctamente en tu navegador.*

---

## 🏁 Siguientes Pasos

Este artículo técnico es tu punto de partida de referencia. Una vez domines ambos notebooks,
estarás listo para dar el salto hacia frameworks profesionales del mercado actual como
**FastAPI**, **Pydantic** o **SQLAlchemy**, donde el uso de tipos estáticos y objetos es el estándar del día a día.
