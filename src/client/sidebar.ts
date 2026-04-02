/**
 * Lógica del sidebar centralizada.
 * Exporta helpers para abrir, cerrar, toggle e inicializar el listener.
 */
/**
 * Cierra el sidebar removiendo la clase `sidebar-open` de los elementos
 * relevantes cuando existan. Esta función es segura si alguno de los
 * selectores no está presente en el DOM.
 * @param doc Documento en el que operar (útil para tests)
 */
export function closeSidebar(doc: Document = document): void {
  doc.querySelectorAll('.sidebar-toggle, .hamburger')
    .forEach(el => el.classList.remove('sidebar-open'))
}

/**
 * Abre el sidebar añadiendo la clase `sidebar-open` a los elementos
 * relevantes cuando estén presentes.
 * @param doc Documento en el que operar (útil para tests)
 */
export function openSidebar(doc: Document = document): void {
  doc.querySelectorAll('.sidebar-toggle, .hamburger')
    .forEach(el => el.classList.add('sidebar-open'))
}

/**
 * Alterna el estado del sidebar usando el elemento `.sidebar-toggle` como
 * fuente de verdad. Si el sidebar no existe no hace nada. Las funciones
 * `openSidebar` y `closeSidebar` se encargan de aplicar la clase también
 * al `hamburger` cuando corresponda.
 * @param doc Documento en el que operar (útil para tests)
 */
export function toggleSidebar(doc: Document = document): void {
  const sidebar = doc.querySelector('.sidebar-toggle')
  if (!sidebar) return
  const isOpen = sidebar.classList.contains('sidebar-open')
  if (isOpen) closeSidebar(doc)
  else openSidebar(doc)
}

/**
 * Inicializa el listener `click` en el botón provisto para alternar el
 * sidebar. Si `button` es `null` no hace nada.
 * @param button Elemento botón que disparará el toggle (o `null`)
 */
export function initSidebar(button: HTMLElement | null): void {
  if (!button) return
  const listener: EventListener = () => toggleSidebar()
  button.addEventListener('click', listener)
}
