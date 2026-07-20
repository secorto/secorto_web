# Arquitectura del Proyecto

Visión de los principios arquitectónicos transversales y guía de navegación a la documentación especializada.

---

## 🎯 3 Principios Arquitectónicos Transversales

| Principio | Propósito | Se Aplica En |
| --- | --- | --- |
| **Separación de Responsabilidades** | Código modular, fácil de entender y mantener | Lógica en `src/domain/` (testeable); presentación en componentes Astro. Testing en capas: Component → Page → Flow. |
| **DRY (Don't Repeat Yourself)** | Evitar duplicación; reutilizar mediante composición y configuración | `sectionsConfig` centralizado (1 archivo → 10+ rutas dinámicas). 2 componentes de vista para 5 colecciones. |
| **Type Safety & Determinismo** | TypeScript strict; convenciones explícitas = comportamiento predecible | `TranslationKey`, `SectionType` tipados. Sin `any`. Configuración validated en build time. |

---

## 📚 Guía de Documentación

| Necesidad | Documento | Por qué |
| --- | --- | --- |
| **Entender decisiones arquitectónicas** | [adr/README.md](adr/README.md) | Registro formal de decisiones: contexto, alternativas, consecuencias |
| **Agregar contenido / traducción** | [CONTENT_POLICY.md](CONTENT_POLICY.md) | Reglas de nombrado, frontmatter, `draft`, `translationKey` |
| **Escribir código nuevo** | [CODING_GUIDELINES.md](CODING_GUIDELINES.md) | Estilo, tipos, modularidad, fail-fast, testing obligatorio |
| **Crear tests** | [TESTING_STRATEGY.md](TESTING_STRATEGY.md) | Unit (Vitest) + E2E (Playwright); capas Component/Page/Flow |
| **Entender vistas de detalle** | [DETAIL_VIEW_ARCHITECTURE.md](DETAIL_VIEW_ARCHITECTURE.md) | Cómo 2 componentes reutilizables manejan 5 colecciones |
| **Escribir tests E2E** | [CONTENT_PAGE_OBJECTS_ARCHITECTURE.md](CONTENT_PAGE_OBJECTS_ARCHITECTURE.md) | Page Objects, separación de responsabilidades, type safety |
