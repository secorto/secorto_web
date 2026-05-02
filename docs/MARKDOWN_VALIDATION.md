# Markdownlint: Validación de Markdown

Este documento explica cómo usar `markdownlint` en el proyecto para asegurar formato consistente en archivos Markdown.

## Propósito

`markdownlint` valida la estructura y formato de archivos Markdown, evitando errores comunes como:

- Encabezados inconsistentes
- Código sin fences adecuados
- Line endings/whitespace inconsistente
- URLs desnudas sin formato de enlace
- Listas inconsistentes

Aplicar estas reglas de forma reproducible reduce el ruido en PRs y mejora la calidad de la documentación.

## Uso local

### Validar archivos

```bash
npm run lint:md
```

Valida todos los archivos `.md` contra la configuración unificada.

### Corregir automáticamente

```bash
npm run lint:md:fix
```

Arregla automáticamente los problemas que se puedan corregir (espacios, formatos básicos, etc).

### Validación específica

Para validar un archivo o carpeta específica:

```bash
npx markdownlint-cli2 'path/to/file.md'
npx markdownlint-cli2 'docs/**/*.md'
```

## Integración con CI/CD

El script `lint:md` se ejecuta como parte del flujo de CI usando la misma configuración unificada.
Los warnings se reportan pero no fallan la compilación, mientras que los errores fallan la validación.

## Configuración de reglas

Las reglas se documentan en `.markdownlint.jsonc` con comentarios explicativos.
Para más detalles sobre reglas específicas, ver la [documentación de markdownlint](https://github.com/DavidAnson/markdownlint).

## Flujo de trabajo recomendado

1. **Antes de hacer commit:** ejecuta `npm run lint:md:fix` para corregir errores automáticos
2. **Si hay errores manualmente:** revisa la salida de `npm run lint:md` para ajustes manuales
3. **En PRs:** el CI valida automáticamente con `npm run lint:md`
4. **Problemas persistentes:** abre un issue documentando la excepción necesaria

## Excepciones justificadas

Si necesitas una excepción a una regla en un archivo específico, puedes usar comentarios inline:

```markdown
<!-- markdownlint-disable MD034 -->
https://example.com (URL desnuda, excepcionalmente permitida)
<!-- markdownlint-enable MD034 -->
```

Documenta la razón de la excepción en el archivo o en un comentario del PR.
