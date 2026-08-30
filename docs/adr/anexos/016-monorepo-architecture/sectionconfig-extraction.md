# Eliminación de `SectionConfig` y adopción de mapas granulares

Este anexo describe el refactor habilitado por **ADR‑016 (arquitectura monorepo)**:
la eliminación del archivo monolítico `SectionConfig` y la adopción de mapas
granulares para permitir la extracción del paquete `@secorto/i18n`.

## Problema

`apps/web/src/domain/section.ts` contiene un `SectionConfig` monolítico que mezcla:

- rutas por idioma (agnóstico),
- metadata de UI (específico del proyecto),
- categorización (específico),
- configuración de presentación (específico).

Esta mezcla impide extraer un paquete i18n realmente reusable.

## Solución técnica

1. **Eliminar `SectionConfig`.**
2. **Crear mapas granulares por responsabilidad:**
   - rutas por idioma → mapa agnóstico consumido por `@secorto/i18n`,
   - metadata de UI → mapa local del proyecto,
   - categorización → mapa local del proyecto,
   - componentes → dispatch local (Astro-specific).
3. **Instanciación por proyecto:**
   cada sitio define sus propios mapas; el paquete i18n no contiene valores por defecto.

## Consecuencias

- El paquete i18n puede extraerse sin acoplamiento a secorto.
- La aplicación mantiene control sobre metadata y categorización.
- La arquitectura respeta ADR‑001 (router polimórfico), ADR‑007 (DDD) y ADR‑011 (llave canónica).

## Anexos relacionados

- `inventory.md` — análisis de funciones agnósticas vs específicas.
- `migration-guide.md` — pasos de refactor en `apps/web`.
