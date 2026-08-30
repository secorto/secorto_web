# Patrón Genérico de Page Objects Basados en Composición

## Objetivo

Definir un patrón universal para Page Objects modulares, basado en composición, aplicable a cualquier framework o dominio.

## Principios del patrón

### 1. Un Page Object = un contexto

Cada vista estable de la UI debe tener su propio Page Object. No se mezclan responsabilidades.

### 2. Composición sobre herencia

Los Page Objects se construyen combinando componentes reutilizables. La herencia se evita.

### 3. Selectores inyectados

Los componentes no contienen selectores hardcodeados; los factories los inyectan.

### 4. Orquestadores como ensambladores

Un Page Object combina layout + componentes + validaciones.

### 5. Factories como frontera semántica

Los tests nunca instancian Page Objects directamente.

### 6. Tests expresan intención

El tipo del Page Object comunica el contexto.

## Beneficios

- Escalabilidad.
- Mantenibilidad.
- Reutilización real.
- Cero duplicación.
- Claridad semántica.

## Ejemplo mínimo universal

```ts
export class DetailPage {
  constructor(
    readonly layout: LayoutComponent,
    readonly metadata: MetadataComponent,
    readonly comments: CommentsComponent,
  ) {}

  shouldBeLoaded(locale: Locale) {
    return verifyStep('detail page loads', async ({ expect }) => {
      await this.layout.shouldBeLoaded(locale)
      await this.metadata.shouldBeVisible()
      await this.comments.shouldBeVisible()
    })
  }
}
```

## Conclusión

Este patrón proporciona una arquitectura modular, escalable y semánticamente clara para Page Objects,
evitando herencia rígida y duplicación de lógica.
