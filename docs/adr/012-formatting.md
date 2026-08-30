---
id: ADR-012
title: Formateo y estilo del código
status: proposed
date: 2026-05-21
categories:
  - Tooling
  - Style
---

## Contexto

Las decisiones de estilo estaban mezcladas previamente con reglas de análisis estático en ADR 004,
lo que dificultaba mantener una separación clara entre:

- **calidad semántica** (ESLint, tipado, imports, accesibilidad), y
- **estilo y formateo** (convenciones estéticas del código).

Este ADR establece una política independiente para el formateo del código,
con el objetivo de garantizar consistencia visual y reducir fricción en revisiones.

El proyecto presenta inconsistencias en semicolons, quotes, trailing commas, indentación y estilo general,
además de diferencias entre código escrito manualmente y código generado por herramientas.
El mantenedor principal proviene de ecosistemas donde el estilo es definido por una herramienta única
y sin ruido sintáctico, lo cual influye en las preferencias adoptadas aquí.

> **Nota:** Las reglas de análisis estático y calidad de código se documentan en ADR 004.
> Este ADR cubre únicamente decisiones de estilo.

## Decisión

Adoptar un formateador automático como herramienta principal de estilo y establecer convenciones estéticas coherentes
en todo el proyecto.
El formateador será la fuente de verdad para:

- uso de semicolons,
- indentación,
- quotes,
- trailing commas,
- longitud de línea,
- espaciado y demás aspectos visuales del código.

Las reglas de estilo dejarán de gestionarse manualmente o mediante ESLint, y se delegarán completamente al formateador.

## Convenciones de estilo

### Semicolons

Omitir semicolons al final de sentencia en todo el proyecto.
La decisión responde a preferencias de legibilidad y coherencia con estilos minimalistas.

### Indentación

Usar indentación de **2 espacios** como convención global.

### Consistencia estética

El formateador será responsable de aplicar reglas consistentes para:

- comillas simples o dobles,
- trailing commas,
- longitud de línea,
- espaciado entre bloques,
- estilo de funciones y paréntesis.

Estas decisiones se aplicarán de manera uniforme y automática.

## Consecuencias

### Positivas

- Estilo consistente y reproducible en todo el proyecto.
- Reducción de fricción en PRs por diferencias de formato.
- Separación clara entre análisis semántico (ADR 004) y estilo (este ADR).
- Menor carga cognitiva para los desarrolladores al no discutir detalles estéticos.

### A considerar

- La adopción del formateador puede requerir un commit de normalización.
- El código generado por herramientas deberá alinearse automáticamente con las convenciones.
- La decisión es estable, pero la herramienta concreta puede evolucionar sin afectar este ADR.

## Relación con otros ADRs

- Complementa **ADR 004**, que define reglas de análisis estático y calidad semántica.
