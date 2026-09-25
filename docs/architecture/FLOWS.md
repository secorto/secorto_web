# Flujos E2E

Un **flujo** expone una única intención y retorna un Paso.
El flujo no decide cómo ejecutarse — eso lo decide el consumidor.

Para la referencia completa de primitivos (`step`, `verifyStep`, `resourceStep`, `orchestrateStep`)
y execution semantics (`.soft()`, `.with()`, `.raw()`),
ver [`@secorto/step` README](../../packages/step/README.md).

---

## Flujos de UI — Page Objects

Los flujos de UI viven en clases (Page Objects) que encapsulan el conocimiento de una vista.

```ts
export class HomePage extends NavigablePage {
  shouldBeLocalized(locale: UILanguages) {
    return verifyStep(`homepage is localized in ${locale}`, async ({ expect }) => {
      await this.shouldBeInLocale(locale).with(expect)
      await this.mainLayout.shouldBeLocalized(locale).with(expect)
    })
  }
}
```

## Flujos de API — Funciones

Los flujos de API son funciones sueltas. Todo endpoint debe usar `resourceStep`
para que la adquisición del recurso sea un Paso observable.

```ts
export const robots = (request: APIRequestContext) =>
  resourceStep(
    'fetch robots.txt',
    async () => request.get('/robots.txt'),
    robotsParser,
  )
```

---

## Delegación

Los flujos pueden delegar la implementación. No pueden delegar la intención.

❌ Incorrecto — la intención queda sin materializar en un Paso:

```ts
async shouldBeLoaded() {
  await verifyRoot()
  await verifyFooter()
}
```

✅ Correcto — el flujo materializa su propia intención y puede delegar la implementación:

```ts
shouldBeLoaded() {
  return verifyStep('home layout is loaded', async ({ expect }) => {
    await this.root.shouldBeVisible(expect)
    await this.footer.shouldBeLoaded().with(expect)
  })
}
```

---

## Organización

```text
apps/web/tests/
├── e2e/            ← Pruebas E2E
├── unit/           ← Pruebas unitarias
└── support/
    ├── ui/         ← Page Objects, componentes y flujos de UI
    └── api/        ← Flujos de API y parsers
```

---

## Documentos relacionados

- [`@secorto/step` README](../../packages/step/README.md) — Primitivos y execution semantics
- [TESTING_STRATEGY.md](TESTING_STRATEGY.md) — Estrategia de pruebas completa
- [ADR 014](../adr/014-page-objects-hierarchy-separation-of-concerns.md) — Jerarquía de Page Objects y SRP
- [ADR 015](../adr/015-consolidated-e2e-assertions-soft-expect.md) — Consolidación de aserciones con soft expect
