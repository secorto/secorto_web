---
title: ADR 001 - Router polimórfico con configuración centralizada
status: accepted
date: 2025-06
last_updated: 2026-07-20
categories:
  - Architecture
  - i18n
  - Routing
supersedes: []
---

## Contexto

El sitio **secorto\_web** es un portafolio y blog personal multilingüe
(español e inglés) construido con Astro. A medida que creció el número de
secciones (blog, charlas, trabajo, proyectos, comunidad) se evidenciaron
varios problemas:

1. **Duplicación masiva (~95 %):** cada sección tenía su propio
   `[locale]/blog/index.astro`, `[locale]/charla/index.astro`, etc. con
   lógica casi idéntica y valores hardcodeados.
2. **Aliasing por idioma:** la misma sección se llamaba `charla` en español y
   `talk` en inglés; no había una fuente centralizada de esas rutas.
3. **Escala O(n):** agregar una nueva sección significaba crear ~4 archivos
   (índice + detalle + tags × 2 idiomas) copiando código existente.
4. **Fragilidad:** cambios en la estructura de una página de sección debían
   replicarse manualmente en las demás.

Astro ofrece i18n con `prefixDefaultLocale`,
pero **no provee un router de
secciones polimórfico** ni aliasing de rutas por idioma. Esa pieza debía
construirse.

## Decisión

Implementar un **router polimórfico con configuración centralizada** que:

1. **Centraliza la definición de secciones** en una única fuente de verdad (registro tipado) que define:
   - Mapeos de sección → colección de contenido
   - Aliases de ruta por idioma (p. ej. `charla` en es ↔ `talk` en en)
   - Propiedades y comportamiento específico por sección (p. ej. si soporta tags)
   - Componentes de vista reutilizables polimórficos

2. **Genera rutas estáticas dinámicamente** a partir de la configuración centralizada durante build time,
   eliminando la necesidad de mantener rutas manuales por sección e idioma.

3. **Reutiliza componentes de vista** para múltiples secciones (polimorfismo), reduciendo código duplicado
   y permitiendo cambios transversales en un solo lugar.

### Flujo conceptual

**Configuración centralizada** → **Generador de rutas estáticas** → **Router universal** → **Vistas polimórficas**

## Alternativas consideradas

1. **Mantener rutas manuales por sección**
   - ✅ Simple de entender inicialmente
   - ❌ Duplicación masiva (copiar código por sección × idioma)
   - ❌ Escala O(n): agregar sección requiere crear múltiples archivos
   - ❌ Fragilidad: cambios deben replicarse manualmente en cada sección

2. **Framework i18n de terceros**
   - ✅ Comunidad y soporte
   - ❌ No resuelve aliasing de rutas por sección
   - ❌ No maneja polimorfismo de componentes
   - ❌ Agrega dependencia externa

3. **Configuración centralizada + router dinámico (elegida)**
   - ✅ Cero duplicación
   - ✅ Escala O(1): agregar sección = cambiar configuración únicamente
   - ✅ Type-safe
   - ✅ Aliasing nativo por idioma
   - ✅ Reutilización de componentes
   - ⚠️ Requiere entender la indirección de configuración

## Razonamiento

- **Cero duplicación:** Centralizar la definición permite generar todas las rutas y vistas
  a partir de una única fuente, eliminando copiar/pegar.
- **Escala O(1):** Agregar nueva sección requiere actualizar la configuración centralizada,
  no replicar código en múltiples archivos/idiomas.
- **Aliasing multi-idioma:** Nombres de ruta distintos por idioma se resuelven sin hacks,
  solo configuración.
- **Tipo-seguro:** Compilación valida todas las referencias (colecciones, componentes, claves).
- **Reutilización:** Componentes polimórficos reducen duplicidad de vistas.
- **Agnóstico a cambios internos:** Cambiar estructura o IDs internos de colecciones no afecta
  rutas públicas (están en la configuración).

## Consecuencias

### Positivas

- Configuración centralizada como única fuente de verdad
- Eliminación de duplicación masiva
- Escala constante al agregar nuevas secciones
- Aliasing de rutas por idioma integrado, no mediante redirecciones

### Costos

- Requiere entender la indirección: configuración → rutas estáticas → vistas polimórficas
- Curva de aprendizaje inicial para nuevos desarrolladores

## Referencias

- Relacionado con: [ADR 007: Unificación de dominio e i18n](./007-domain-i18n-unificacion.md)
- Anexos históricos: [docs/adr/anexos/001-i18n-router-framework/](./anexos/001-i18n-router-framework/)
