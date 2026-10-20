# Instrucciones para Claude CLI

## Stack

- **Monorepo** gestionado con pnpm workspaces (`apps/web`, `packages/i18n`, `packages/step`, `packages/wait-netlify`)
- **Framework:** Astro 7 (TypeScript, SSG)
- **Tests:** Vitest (unit) + Playwright (E2E)
- **Linting:** ESLint + markdownlint-cli2
- **Node:** >=24 (ver `.nvmrc`)
- **Estilo:** sin punto y coma salvo necesario

## Comandos clave (desde raíz)

```bash
pnpm install              # instalar dependencias
pnpm run build            # type check + build (todos los workspaces)
pnpm run dev              # dev server (Astro en apps/web)
pnpm run lint             # ESLint + markdownlint
pnpm run test             # vitest --run
pnpm run test:unit        # unit tests (todos los workspaces)
pnpm run test:e2e         # Playwright E2E (apps/web)
pnpm run test:coverage    # vitest con cobertura
```

## Principio rector: Quality by Design

Testing integrado en cada capa. Tres principios lo habilitan:

1. **Separación de responsabilidades** -- lógica pura en `src/domain/`, presentación en componentes Astro
2. **DRY** -- configuración centralizada, una fuente de verdad
3. **Type Safety** -- TypeScript strict, sin `any`, validación en build time

## Documentación del proyecto

| Necesidad | Documento |
| --- | --- |
| Principios arquitectónicos | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Decisiones (ADRs) | [docs/adr/README.md](docs/adr/README.md) |
| Coding guidelines | [docs/CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) |
| Testing strategy | [docs/architecture/TESTING_STRATEGY.md](docs/architecture/TESTING_STRATEGY.md) |
| Flujos E2E | [docs/architecture/FLOWS.md](docs/architecture/FLOWS.md) |
| Política de IA | [docs/AI_POLICY.md](docs/AI_POLICY.md) |
| Antipatrones comunes con IA | [docs/COMMON_AI_MISTAKES.md](docs/COMMON_AI_MISTAKES.md) |
| Workflow pre-PR | [docs/architecture/DEVELOPMENT_WORKFLOW.md](docs/architecture/DEVELOPMENT_WORKFLOW.md) |
| Contenido y traducciones | [docs/CONTENT_POLICY.md](docs/CONTENT_POLICY.md) |

## Antes de generar código

1. Lee el ADR relevante si existe (`docs/adr/`)
2. Consulta [COMMON_AI_MISTAKES.md](docs/COMMON_AI_MISTAKES.md) para evitar antipatrones conocidos
3. Sigue [CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) para estilo y convenciones

## Antes de proponer PR

```bash
pnpm run build
pnpm run lint
pnpm run test:unit
pnpm run test:e2e
```

Checklist completo en [DEVELOPMENT_WORKFLOW.md](docs/architecture/DEVELOPMENT_WORKFLOW.md#-checklist-antes-de-pr).
