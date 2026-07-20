---
title: ADR XXX - Título de la decisión arquitectónica
status: proposed
date: YYYY-MM-DD
last_updated: null
categories:
  - Category1
  - Category2
---

## Contexto

Describe el problema abstracto o situación que requiere una decisión arquitectónica.
Enfócate en conceptos, no en nombres específicos de clases o archivos.

**Ejemplo abstracto (correcto):**
> Múltiples componentes dependen de un enrutador débilmente tipado, dificultando
> el rastreo de rutas y la refactorización de URLs.

**Evitar (implementación concreta):**
> `PageRouter` en `src/routing/PageRouter.ts` no tiene tipos genéricos.

---

## Objetivo

Declara brevemente qué problema esperas resolver con esta decisión.
Puede ser tan simple como 1-2 líneas.

**Ejemplo:**
> Establecer un patrón centralizado para normalizar URLs y sincronizar la
> configuración de i18n en toda la aplicación.

---

## Decisión

Enuncia el patrón, estructura o enfoque arquitectónico que propones.
Mantén el nivel de abstracción: habla de patrones, no de implementación.

**Ejemplo abstracto (correcto):**
> Adoptar un enrutador polimórfico que centraliza la configuración de rutas,
> permitiendo especialización por responsabilidad (rutas públicas, rutas de blog,
> etc.) mediante herencia o composición.

**Evitar (demasiado específico):**
> Crear la clase `CentralizedRouter extends BaseRouter` en `src/routing/`.

---

## Implementación

Describe **cómo se aplicó o aplicará** esta decisión en el código actual.
Incluye referencias a documentos de arquitectura (`docs/architecture/`) donde
vive el mapeo concreto a archivos, clases o funciones reales.

**Estructura típica:**

- Descripción general del enfoque
- Referencia a documentos de arquitectura específicos (ej. `docs/architecture/PAGE_OBJECTS.md`)
- Ejemplos de cómo se integra con código existente (sin copiar código completo)
- Alternativas consideradas y rechazadas si es relevante

**Ejemplo:**
> Centralizar la configuración en `src/config/router.ts`, permitiendo que cada
> especialización (ej. `BlogRouter`, `PageRouter`) herede o componga desde una
> clase base. Ver `docs/architecture/ROUTING_ARCHITECTURE.md` para detalles
> de estructura de archivos y responsabilidades de cada clase.

---

## Consecuencias

### Positivas

- **Consecuencia positiva 1:** Describe el beneficio conceptual (mantenibilidad, claridad, etc.)
- **Consecuencia positiva 2:** Otro beneficio observable
- **Consecuencia positiva 3:** ...

### A tener en cuenta

- **Trade-off o desafío 1:** Describe cualquier complejidad introducida
- **Trade-off o desafío 2:** Posible impacto negativo o limitación
- **Trade-off o desafío 3:** ...

**Ejemplo (positivas):**

- Todas las rutas se centralizan en un único punto, reduciendo duplicación
- Cambios en la estructura de URLs se propagan automáticamente a toda la app
- Fácil agregar nuevas especializaciones de rutas

**Ejemplo (a tener en cuenta):**

- Requiere refactorización de toda la lógica de enrutamiento existente
- Curva de aprendizaje para nuevos desarrolladores
- Pueden surgir casos especiales que no encajen perfectamente en la jerarquía

---

## Referencias

- [ADR 001 - Ejemplo de referencia](001-i18n-router-framework.md)
- [Documentación de Astro - Routing](https://docs.astro.build/en/guides/routing/)
- [Michael Nygard - Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions.html)

---

## Notas para Autores

### Frontmatter YAML Completo

```yaml
---
title: ADR XXX - Descripción
status: proposed | accepted | superseded | replaced
date: YYYY-MM-DD  # Fecha de creación
last_updated: YYYY-MM-DD | null  # Última modificación
categories:  # Array de etiquetas temáticas
  - Category
  - OtherCategory

# Opcional: Para ADRs históricos o migrados
repository: nombre-historico-o-origen
commits: 15  # número aproximado de commits migrados
start_year: 2021
end_year: null  # null o ausencia = present
replaced_by: 003-nombre-del-adr-que-reemplaza.md  # Solo si status: replaced/superseded
---
```

### Principios Clave

1. **Agnóstico a Implementación:** Un ADR válido debe seguir siendo útil incluso si la
   implementación concreta cambia. Los detalles específicos van en `docs/architecture/`.

2. **Decisión > Detalles:** Enfócate en el *por qué* y el *qué patrón*, no en el *cómo exacto*.

3. **Referencias Claras:** Si describes detalles de implementación, hazlo en una sección
   **Implementación** y apunta a documentos de arquitectura para el mapeo concreto.

4. **Consecuencias Cuantificables:** Describe impactos reales (complejidad, mantenibilidad,
   rendimiento), no especulaciones.

---

## Relacionado

- Ver [docs/adr/010-plantilla-estandar-adr.md](010-plantilla-estandar-adr.md) para contexto
  completo sobre la decisión de adoptar esta plantilla.
- Ver [docs/adr/README.md](README.md) para navegar todos los ADRs del proyecto.
