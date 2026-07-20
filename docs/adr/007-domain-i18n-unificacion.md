---
title: ADR 007 - Unificación de dominio e i18n — normalización centralizada y SEO
status: accepted
date: 2026-03-24
last_updated: 2026-07-20
categories:
  - Architecture
  - i18n
  - Domain
supersedes:
  - 001
---

## Contexto

El dominio de contenido presenta problemas de duplicación y lógica dispersa:

1. **Parseos y transformaciones repetidas**: Información de entrada (locale, identificador)
   se extrae múltiples veces en distintos puntos, causando inconsistencias.
2. **Lógica dispersa para i18n**: URLs alternas, canonical, y x-default se construyen
   en múltiples componentes con APIs y decisiones distintas.
3. **Sin invariantes explícitas**: Riesgo de duplicidad silenciosa (misma entrada en
   múltiples locales) o inconsistencias entre locales (p. ej. draft).
4. **Acoplamiento**: Lógica de dominio está esparcida y acoplada a decisiones de render.

Estos problemas impiden refactorizar contenido o rutas sin riesgo de inconsistencias.

## Problemas detectados

- Extracción y procesamiento repetido del mismo dato en múltiples lugares
- Lógica dispersa para construir enlaces entre idiomas y alternates SEO
- Múltiples componentes con responsabilidades sobre SEO (canonical, x-default)
- Estado implícito sobre locales disponibles por entrada
- Riesgo de duplicidad silenciosa: misma entrada en múltiples locales sin validación

## Decisión

1. **Extraer y normalizar información de entrada una única vez** durante carga, computando
   identificadores y locale de forma centralizada. Esto elimina parseos repetidos.

2. **Usar un identificador agnóstico** como llave canónica que agrupe todas las traducciones
   de una misma entrada, independiente de rutas, slugs o IDs internos. Este identificador
   debe ser explícito y obligatorio en el dominio.

3. **Mapear entradas por este identificador** para conocer qué locales están disponibles,
   eliminando la necesidad de múltiples mapeos y búsquedas.

4. **Centralizar decisiones de SEO** (canonical, x-default, alternates) en un único punto,
   evitando que componentes individuales tomen decisiones contradictorias.

5. **Fallar rápido ante inconsistencias**: Detectar en build time duplicidad (mismo
   identificador + locale) o inconsistencias (misma entrada en múltiples locales con
   propiedades contradictorias). Preferir fallar que silenciar errores.

### Flujo conceptual

**Entrada bruta** → **Normalización centralizada** → **Mapa de traducciones** → **Decisiones SEO unificadas**

## Razonamiento

- **Menos bugs**: Centralizar la normalización elimina inconsistencias causadas por
  procesamiento duplicado en distintos lugares.
- **SEO confiable**: Una única fuente de verdad para canonical y alternates reduce
  riesgo de errores que afecten SEO.
- **Detectar errores temprano**: Fallar en build time ante duplicidad o inconsistencias
  previene errores silenciosos en producción.
- **Estabilidad**: Un identificador agnóstico de rutas permite refactorizar contenido
  o estructura sin invalidar traducciones.

## Consecuencias

### Positivas

- Dominio normalizado y centralizado
- Eliminación de duplicación en procesamiento
- SEO unificado y confiable
- Errores detectados temprano (build time, no runtime)

### Costos

- Requiere normalizar código existente
- Curva de aprendizaje para nuevos desarrolladores

## Referencias

- Para detalles técnicos, cambios de API y guía de migración:
  ver [anexos/007-domain-i18n-unificacion/MIGRATION_AND_TECHNICAL_DETAILS.md](../anexos/007-domain-i18n-unificacion/MIGRATION_AND_TECHNICAL_DETAILS.md)
- Relacionado con: [ADR 001: Router polimórfico](./001-i18n-router-framework.md)
- Relacionado con: [ADR 006: Unificación manejo borradores](./006-unificacion-manejo-borradores.md)
- Relacionado con: [ADR 011: translationKey como llave canónica](./011-i18n-translationkey.md)
