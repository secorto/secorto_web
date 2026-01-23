#!/usr/bin/env node

/**
 * Script para generar y actualizar excerpts en posts
 *
 * USO:
 *   # Generar excerpts en todos los posts que no tengan (fuerza si existen)
 *   node scripts/generate-excerpts.js
 *
 *   # Regenerar excerpts en TODOS los posts (sobrescribe los existentes)
 *   node scripts/generate-excerpts.js --regenerate
 *
 *   # Generar/actualizar excerpt en un post específico
 *   node scripts/generate-excerpts.js --post src/content/blog/es/2026-01-22-mi-post.md
 *
 *   # Regenerar excerpt en un post específico
 *   node scripts/generate-excerpts.js --post src/content/blog/es/2026-01-22-mi-post.md --regenerate
 *
 * LÓGICA:
 *   1. Lee el contenido markdown
 *   2. Extrae el frontmatter YAML
 *   3. Si no tiene excerpt y no tiene description, genera uno automáticamente
 *   4. Si --regenerate, fuerza la generación aunque exista
 *   5. Actualiza el archivo con el nuevo excerpt
 */

const fs = require('fs')
const path = require('path')
const { globSync } = require('glob')

/**
 * Genera un excerpt del contenido markdown
 * Replicando la lógica de src/utils/excerptBuilder.ts
 */
function generateExcerpt(content, maxLength = 160) {
  // Eliminar frontmatter YAML
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '')

  // Eliminar markdown syntax
  let text = contentWithoutFrontmatter
    // Headings
    .replace(/^#+\s+/gm, '')
    // Bold/Italic
    .replace(/[*_]{1,2}/g, '')
    // Links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Code blocks
    .replace(/```[\s\S]*?```/g, '')
    // HTML tags
    .replace(/<[^>]+>/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()

  // Truncar inteligentemente sin cortar palabras
  if (text.length > maxLength) {
    const truncated = text.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return truncated.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '…'
  }

  return text
}

/**
 * Parsea el frontmatter YAML simple
 * Nota: Este parser es básico. Para YAML complejo, usa una librería real
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null

  const yamlStr = match[1]
  const frontmatter = {}

  yamlStr.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      // Remover comillas si existen
      frontmatter[key] = value.replace(/^["']|["']$/g, '')
    }
  })

  return frontmatter
}

/**
 * Reconstruye el archivo markdown con nuevo frontmatter
 */
function updateFrontmatter(content, newFrontmatter) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return content

  // Reconstruir YAML
  const yamlLines = Object.entries(newFrontmatter).map(([key, value]) => {
    // Si el valor contiene caracteres especiales o espacios, envolver en comillas
    const needsQuotes =
      typeof value === 'string' &&
      (value.includes(':') || value.includes('"') || value.includes('\n'))
    const quotedValue = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value
    return `${key}: ${quotedValue}`
  })

  const newYaml = yamlLines.join('\n')
  const contentBody = content.substring(match[0].length)

  return `---\n${newYaml}\n---\n${contentBody}`
}

/**
 * Procesa un archivo de post
 */
function processPost(filePath, options) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatter = parseFrontmatter(content)

    if (!frontmatter) {
      console.warn(`⚠️  No se encontró frontmatter en: ${filePath}`)
      return false
    }

    // Si ya tiene excerpt y no es regenerate, skip
    if (frontmatter.excerpt && !options.regenerate) {
      console.log(`⏭️  Ya tiene excerpt: ${filePath}`)
      return false
    }

    // Si tiene description pero no excerpt, usar description como fallback (no generar)
    if (frontmatter.description && !options.regenerate && !frontmatter.excerpt) {
      console.log(`⏭️  Tiene description, usando como fallback: ${filePath}`)
      return false
    }

    // Generar excerpt del contenido
    const excerpt = generateExcerpt(content)

    if (!excerpt) {
      console.warn(`⚠️  No se pudo generar excerpt para: ${filePath}`)
      return false
    }

    // Actualizar frontmatter
    frontmatter.excerpt = excerpt
    const updatedContent = updateFrontmatter(content, frontmatter)

    // Escribir archivo
    fs.writeFileSync(filePath, updatedContent, 'utf-8')

    console.log(`✅ Generado excerpt: ${path.relative(process.cwd(), filePath)}`)
    console.log(`   "${excerpt.substring(0, 80)}${excerpt.length > 80 ? '...' : ''}"`)

    return true
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message)
    return false
  }
}

// Main
const args = process.argv.slice(2)
const options = {
  regenerate: args.includes('--regenerate'),
  post: null,
}

const postIndex = args.indexOf('--post')
if (postIndex !== -1 && args[postIndex + 1]) {
  options.post = args[postIndex + 1]
}

let files = []
let processCount = 0

if (options.post) {
  // Modo single post
  console.log(`\n📝 Procesando post individual...`)
  files = [options.post]
} else {
  // Modo masivo
  console.log(
    `\n📚 Procesando TODOS los posts${options.regenerate ? ' (regenerando)' : ''}...\n`
  )
  // Buscar todos los posts en las colecciones
  const collections = ['blog', 'talk', 'community', 'projects', 'work']
  const locales = ['es', 'en']

  for (const collection of collections) {
    for (const locale of locales) {
      const pattern = path.join(
        process.cwd(),
        'src/content',
        collection,
        locale,
        '*.md'
      )
      const matches = globSync(pattern)
      files.push(...matches)
    }
  }
}

if (files.length === 0) {
  console.warn('⚠️  No se encontraron posts para procesar')
  process.exit(1)
}

console.log(`📄 Encontrados ${files.length} archivo(s)\n`)

for (const file of files) {
  if (processPost(file, options)) {
    processCount++
  }
}

console.log(`\n✨ Resumen: ${processCount} post(s) actualizados\n`)
