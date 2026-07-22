# Development Workflow — Quality by Design en Acción

Este documento visualiza cómo el workflow de desarrollo implementa los 3 principios de **Quality by Design**:

1. **Separación de Responsabilidades** → Capas de tests (unit/component/page/flow)
2. **DRY** → Validación centralizada, una fuente de verdad
3. **Type Safety & Determinismo** → Type checking + Linting como primera línea

---

## 🔄 Pipeline de Desarrollo Completo

```mermaid
graph TD
    Start["👤 Developer / 🤖 AI"]
    
    Start --> Reads["📖 Lee contexto<br/>ARCHITECTURE.md<br/>CODING_GUIDELINES.md<br/>ADR relevante"]
    
    Reads --> Generate["✍️ Genera Código<br/>+ Tests"]
    
    Generate --> Validate["✅ Pipeline Local de Validación"]
    
    Validate --> TypeCheck["Type Checking<br/>TypeScript<br/>Validación tipos"]
    Validate --> ESLint["Análisis estático<br/>ESLint<br/>Código fuente"]
    Validate --> Markdown["Análisis estático<br/>Markdownlint<br/>Documentación"]
    Validate --> Unit["Unit Tests<br/>Vitest<br/>Lógica pura"]
    Validate --> E2E["E2E Tests<br/>Playwright<br/>Flujos usuario"]
    
    TypeCheck --> Results{"¿TODO<br/>PASA?"}
    ESLint --> Results
    Markdown --> Results
    Unit --> Results
    E2E --> Results
    
    Results -->|No| Fix["🔄 Ajusta<br/>según feedback"]
    Fix --> Generate
    
    Results -->|Sí| PR["📤 Propone PR<br/>con descripción"]
    PR --> Review["👥 Review Humano<br/>- Arquitectura<br/>- Intención<br/>- ADRs respetados"]
    
    Review --> Approved{"¿Aprobado?"}
    Approved -->|No| Feedback["💬 Feedback"]
    Feedback --> Generate
    
    Approved -->|Sí| Merge["🎉 Merged<br/>a main"]
    Merge --> End["✨ Desplegado"]
    
    style Start fill:#7b1fa2,color:#fff
    style Reads fill:#7b1fa2,color:#fff
    style Generate fill:#17A2B8,color:#fff
    style Fix fill:#7b1fa2,color:#fff
    style Feedback fill:#7b1fa2,color:#fff
    style TypeCheck fill:#1e88e5,color:#fff
    style ESLint fill:#1e88e5,color:#fff
    style Markdown fill:#1e88e5,color:#fff
    style Unit fill:#f57c00,color:#fff
    style E2E fill:#f57c00,color:#fff
    style PR fill:#388e3c,color:#fff
    style Review fill:#388e3c,color:#fff
    style Merge fill:#2e7d32,color:#fff
    style End fill:#1b5e20,color:#fff
    style Results fill:#d32f2f,color:#fff
    style Approved fill:#d32f2f,color:#fff
```

**Leyenda:**
- 🟣 **Lectura & Retroalimentación** (púrpura) — Contexto inicial y bucles de corrección
- 🔷 **Generación** (cyan) — Corazón del flujo (código + tests)
- 🔵 **Type Check + Linting** (azul) — Validación **estática** (sin ejecutar código)
- 🟠 **Unit + E2E Tests** (naranja) — Validación **dinámica** (ejecutable)
- 🔴 **Puntos de decisión** (rojo) — Bifurcaciones (¿pasa validación? ¿aprobado?)
- 🟢 **Review + Merge + Deploy** (verde) — Humano aprueba, despliega y cierra

---

## 📊 Cómo Valida Cada Principio

### 1️⃣ Separación de Responsabilidades

| Validación | Herramienta | Qué Verifica |
|---|---|---|
| **Lógica pura en `src/domain/`** | Vitest (unit) | Domain logic 100% testeable sin dependencias de framework |
| **Componentes puros** | Vitest (component) | Props tipadas, renderizado consistente |
| **Navegación/rutas** | Playwright (page) | Rutas dinámicas, parámetros, redirecciones |
| **Flujos usuario** | Playwright (flow) | Caso de uso completo: login → búsqueda → detalle → traducción |

**Resultado:** Si tests pasan, responsabilidades están correctamente separadas.

---

### 2️⃣ DRY (Una Fuente de Verdad)

| Validación | Herramienta | Qué Verifica |
|---|---|---|
| **Imports centralizados** | TypeScript `tsconfig.paths` + ESLint | Path aliases (`@/domain`, `@/components`, etc.) evitan duplicación |
| **Configuración centralizada** | `src/content.config.ts` + Vitest | Rutas dinámicas, tipos, validación compartida |
| **Tipos únicos** | `tsc --noEmit` + ESLint | `TranslationKey`, `SectionType` validados en build + tests |
| **Lógica duplicada** | ESLint custom rules + revisión | No repetir funciones; extraer a `src/domain/` |

**Resultado:** Cambio en un lugar = se refleja automáticamente en código y tests.

---

### 3️⃣ Type Safety & Determinismo

| Validación | Herramienta | Qué Verifica |
|---|---|---|
| **Análisis estático código** | ESLint (TypeScript/JS/Astro) | Código fuente cumple reglas (tipos explícitos, imports válidos, etc.) |
| **Análisis estático docs** | Markdownlint | Documentación cumple formato (encabezados, listas, URLs, etc.) |
| **Build-time validation** | `astro check` + `tsc --strict` | Tipos inválidos fallan antes de tests |
| **Runtime determinismo** | Playwright (E2E) | Entrada determinística → Output determinístico (sin race conditions) |

**Resultado:** Errores = detectados en compile-time (rápido), no en producción.

---

## 🛠️ Comandos de Validación Local

Antes de proponer PR, ejecuta en este orden:

```bash
npm run build      # Type checking + build
npm run lint       # Linting (tipos, estilo, markdown)
npm run test:unit  # Unit tests (cobertura 100%)
npm run test:e2e   # E2E tests (flujos completos)

# Atajo: todo junto (como CI)
npm run test
```

**Documentación completa de cada herramienta:** Ver [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

---

## 📌 Checklist Antes de PR

- [ ] Leí [ARCHITECTURE.md](../ARCHITECTURE.md) — entiendo los 3 principios
- [ ] Leí ADR relevante (`adr/`) — entiendo decisiones previas
- [ ] Seguí [CODING_GUIDELINES.md](../CODING_GUIDELINES.md) — estilo + type safety
- [ ] Ejecuté pipeline completo: `npm run build && npm run lint && npm run test:unit && npm run test:e2e`
- [ ] Todos los tests pasan localmente — mismo que en CI
- [ ] PR tiene descripción clara (qué, por qué, referencias a ADRs)

---

## 🤖 Para AI (Copilot/Claude)

El flujo anterior es tu workflow:

1. **Antes de generar:** Lee contexto (ARCHITECTURE.md, ADR relevante)
2. **Mientras generas:** Type-safe TypeScript + tests en la misma sesión
3. **Después de generar:** Ejecuta validaciones locales (`npm run lint`, `npm run test:*`)
4. **Propón PR:** Si todo pasa, propón con descripción clara

**Instrucciones completas:** [.github/copilot-instructions.md](../../.github/copilot-instructions.md)

---

## 🔗 Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md) — Principios transversales
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) — Detalles de cada tipo de test
- [PAGE_OBJECTS.md](./PAGE_OBJECTS.md) — Patrón E2E (Page Object Model)
- [CODING_GUIDELINES.md](../CODING_GUIDELINES.md) — Reglas de código
- [adr/](../adr/) — Decisiones que sustentan este workflow
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md) — Instrucciones para AI
