# Arquitectura E2E: Flujos + Pasos

## Conceptos Fundamentales

> **Flow (Flujo) = unidad de composición y significado**
>
> **Step (Paso) = unidad de ejecución y observabilidad**

```text
Prueba (Test)
↓
Flujo (Flow)
↓
Paso (Step)
↓
Playwright
```

---

## Flujo (Flow)

Un Flujo expone una única intención.

Ejemplos:

```ts
userInHome()
openPost()
filterByTag()
shouldBeLoaded()
auditA11y()
```

Un Flujo puede:

- Delegar la implementación
- Llamar a otro Flujo
- Componer funciones reutilizables
- Ocultar detalles de implementación

Por ejemplo:

```ts
async auditA11y() {
  await this.a11y.audit()
}
```

La delegación es irrelevante.

Lo importante es que el consumidor vea una única intención.

### Regla del Flujo

Un Flujo sigue siendo un Flujo siempre que:

1. Exponga una única intención.
2. Materialice esa intención mediante un único Paso observable.

---

## Paso (Step)

Un Paso es el artefacto de ejecución que realiza trabajo y aparece en los reportes.

```ts
return verifyStep('la página principal se cargó correctamente', async ({ expect }) => {
  // validaciones
})
```

Solo los Pasos aparecen en los reportes.

Los Pasos proporcionan:

- Observabilidad
- Diagnóstico
- Trazabilidad
- Narrativa para reportes

---

## Delegación

Los Flujos pueden delegar la implementación.

✅ Correcto

```ts
async auditA11y() {
  await this.a11y.audit()
}
```

```text
auditA11y()
↓
a11y.audit()
↓
Step
```

La intención observable sigue siendo la misma.

### Nunca Delegues la Intención

❌ Incorrecto

```ts
async shouldBeLoaded() {
  await verifyRoot()
  await verifyFooter()
  await verifySidebar()
}
```

El Flujo expone:

```text
la página principal se cargó correctamente
```

Por lo tanto, el propio Flujo debe materializar esa intención:

✅ Correcto

```ts
shouldBeLoaded() {
  return verifyStep('la página principal se cargó correctamente', async ({ expect }) => {
    await verifyRoot(expect)
    await verifyFooter(expect)
    await verifySidebar(expect)
  })
}
```

La implementación puede delegarse.

La intención no.

---

## Organización

### Componentes

```text
tests/support/ui/components/
```

Conocimiento específico de la interfaz de usuario (UI).

### Páginas

```text
tests/support/ui/**/pages/
```

Conocimiento específico de cada vista.

### Flujos de Soporte

```text
tests/support/ui/**/flows/
```

Intenciones que abarcan múltiples páginas o componentes.

---

## Resumen

```text
Las pruebas componen Flujos.

Los Flujos exponen intención.
Los Flujos pueden delegar implementación.
Los Flujos pueden llamar a otros Flujos.

Un Flujo debe materializar su propia intención.

Delega la implementación.
Nunca delegues la intención.

Los Pasos proporcionan observabilidad.
Solo los Pasos aparecen en los reportes.
```
