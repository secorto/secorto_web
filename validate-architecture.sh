#!/bin/bash

# Script de validación para la arquitectura de secciones
# Verifica que todo esté correctamente configurado

set -e

echo "🔍 Validando arquitectura de secciones..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
CHECKS=0
PASSED=0
FAILED=0

check() {
  CHECKS=$((CHECKS + 1))
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗${NC} $2"
    FAILED=$((FAILED + 1))
  fi
}

# 1. Verificar que existen los archivos principales
echo "📁 Verificando archivos..."
test -f src/config/sections.ts
check $? "src/config/sections.ts existe"

test -f src/utils/sectionLoader.ts
check $? "src/utils/sectionLoader.ts existe"

test -f src/components/SectionRenderer.astro
check $? "src/components/SectionRenderer.astro existe"

test -f "src/pages/[locale]/[section]/index.astro"
check $? "src/pages/[locale]/[section]/index.astro existe"

# 2. Verificar configuración en tsconfig.json
echo ""
echo "⚙️  Verificando configuración..."
grep -q '"@config/\*": \["src/config/\*"\]' tsconfig.json
check $? "tsconfig.json contiene alias @config"

# 3. Verificar que sections.ts tiene la estructura correcta
echo ""
echo "📋 Verificando sections.ts..."
grep -q "export const sectionsConfig" src/config/sections.ts
check $? "sectionsConfig exportado"

grep -q "export function getSectionConfigByRoute" src/config/sections.ts
check $? "getSectionConfigByRoute definido"

grep -q "blog:" src/config/sections.ts
check $? "Sección 'blog' configurada"

grep -q "talk:" src/config/sections.ts
check $? "Sección 'talk' configurada"

grep -q "work:" src/config/sections.ts
check $? "Sección 'work' configurada"

# 4. Verificar que sectionLoader.ts tiene las funciones correctas
echo ""
echo "🔧 Verificando sectionLoader.ts..."
grep -q "export async function loadSection" src/utils/sectionLoader.ts
check $? "loadSection función definida"

grep -q "export async function loadSectionByRoute" src/utils/sectionLoader.ts
check $? "loadSectionByRoute función definida"

# 5. Verificar que SectionRenderer.astro tiene los componentes
echo ""
echo "🎨 Verificando SectionRenderer.astro..."
grep -q "ListPost" src/components/SectionRenderer.astro
check $? "ListPost importado/usado"

grep -q "ListWork" src/components/SectionRenderer.astro
check $? "ListWork importado/usado"

grep -q "Tags" src/components/SectionRenderer.astro
check $? "Tags importado/usado"

# 6. Verificar que [section]/index.astro usa las nuevas utilidades
echo ""
echo "🚀 Verificando [section]/index.astro..."
grep -q "loadSectionByRoute" "src/pages/[locale]/[section]/index.astro"
check $? "[section]/index.astro usa loadSectionByRoute"

grep -q "SectionRenderer" "src/pages/[locale]/[section]/index.astro"
check $? "[section]/index.astro usa SectionRenderer"

grep -q "getStaticPaths" "src/pages/[locale]/[section]/index.astro"
check $? "[section]/index.astro define getStaticPaths"

# 7. Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resumen de Validación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Total de checks: ${CHECKS}"
echo -e "${GREEN}Pasaron: ${PASSED}${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}Fallaron: ${FAILED}${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
  echo -e ""
  echo -e "${GREEN}✨ ¡Todas las validaciones pasaron!${NC}"
  echo ""
  echo "Próximos pasos:"
  echo "1. npm run build       # Compilar el proyecto"
  echo "2. npm run preview     # Ver en local"
  echo "3. Revisar /es/blog, /es/charla, /en/talk, etc."
  exit 0
else
  echo -e ""
  echo -e "${RED}❌ Algunas validaciones fallaron${NC}"
  echo "Por favor, revisa los errores arriba."
  exit 1
fi
