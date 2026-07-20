# Arquitectura del Proyecto

Visión de los principios arquitectónicos transversales y guía de navegación a la documentación especializada.

---

## 🎯 Principio Rector: Quality by Design

Testing integrado en cada capa — calidad automatizada desde el diseño.

Toda arquitectura se diseña siendo **completamente testeable**.
Testing no es añadido posterior; es manifestación de cómo pensamos el sistema.

## 🎯 3 Principios que lo Habilitan

| Principio | Propósito | Se Aplica En |
| --- | --- | --- |
| **Separación de Responsabilidades** | Modularidad → Testeabilidad | `src/domain/` contiene lógica pura (testeable); presentación en componentes Astro. Testing en capas: Component → Page → Flow. |
| **DRY (Don't Repeat Yourself)** | Una fuente de verdad → Code y tests acceden idénticamente | Configuración centralizada genera rutas dinámicas. Domain tipado; ambos validan contra él. |
| **Type Safety & Determinismo** | Contrato explícito → Comportamiento predecible | `TranslationKey`, `SectionType` tipados. Sin `any`. Configuración validated en build time beneficia ambos. |

---

## 📚 Guía de Documentación

| Necesidad | Documento | Por qué |
| --- | --- | --- |
| **Entender decisiones arquitectónicas** | [adr/README.md](adr/README.md) | Registro formal de decisiones: contexto, alternativas, consecuencias |
| **Agregar contenido / traducción** | [CONTENT_POLICY.md](CONTENT_POLICY.md) | Reglas de nombrado, frontmatter, `draft`, `translationKey` |
| **Escribir código nuevo** | [CODING_GUIDELINES.md](CODING_GUIDELINES.md) | Estilo, tipos, modularidad, fail-fast, testing obligatorio |
| **Crear tests** | [architecture/TESTING_STRATEGY.md](architecture/TESTING_STRATEGY.md) | Unit (Vitest) + E2E (Playwright); capas Component/Page/Flow |
| **Entender vistas de detalle** | [architecture/DETAIL_VIEW_COMPONENTS.md](architecture/DETAIL_VIEW_COMPONENTS.md) | Estrategia de componentes reutilizables |
| **Escribir tests E2E** | [architecture/CONTENT_PAGE_OBJECTS.md](architecture/CONTENT_PAGE_OBJECTS.md) | Page Objects, separación de responsabilidades, type safety |
| **Configurar E2E en CI** | [architecture/E2E_PARAMS.md](architecture/E2E_PARAMS.md) | Parámetros del workflow, Netlify preview, `base_url`, `real_third_party` |
