/**
 * Genera un excerpt automático a partir del contenido del post.
 * Limpia markdown, HTML y extrae los primeros N caracteres.
 * @param content - Contenido del post (puede incluir markdown)
 * @param maxLength - Longitud máxima del excerpt (default: 160)
 * @returns Excerpt limpio sin markdown/HTML
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  if (!content) return ''

  // Remover frontmatter YAML
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '')

  // Remover markdown: # ## ### etc
  const withoutHeadings = withoutFrontmatter.replace(/^#+\s+/gm, '')

  // Remover markdown: **bold** -> bold, *italic* -> italic
  const withoutFormatting = withoutHeadings
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')

  // Remover links markdown: [text](url) -> text
  const withoutLinks = withoutFormatting.replace(/\[(.+?)\]\(.+?\)/g, '$1')

  // Remover código inline: `code` -> code
  const withoutInlineCode = withoutLinks.replace(/`(.+?)`/g, '$1')

  // Remover saltos de línea y espacios múltiples
  const cleaned = withoutInlineCode
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Extraer primeros N caracteres
  if (cleaned.length <= maxLength) {
    return cleaned
  }

  // Cortar sin partir palabras
  const truncated = cleaned.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '…' : truncated + '…'
}

/**
 * Obtiene el excerpt de un post, priorizando:
 * 1. excerpt del frontmatter (si existe)
 * 2. description del frontmatter (si existe)
 * 3. Generado automáticamente del contenido
 * @param data - Datos del frontmatter del post
 * @param content - Contenido del post (opcional, se usa si no hay excerpt/description)
 * @returns Excerpt para SEO
 */
export function getPostExcerpt(
  data: any,
  content?: string
): string {
  // Prioridad 1: excerpt definido explícitamente
  if (data.excerpt) {
    return data.excerpt
  }

  // Prioridad 2: description definida
  if (data.description) {
    return data.description
  }

  // Prioridad 3: generar automáticamente del contenido
  if (content) {
    return generateExcerpt(content)
  }

  // Fallback
  return ''
}
