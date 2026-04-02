/**
 * Envía un mensaje al iframe de Giscus cuando éste está presente en la página.
 *
 * Nota sobre el tipo de `message`: se declara como `unknown` intencionalmente
 * para mantener esta utilidad desacoplada del esquema concreto de mensajes
 * que Giscus pueda aceptar. En el código actual se usa con objetos del tipo
 * `{ setConfig: { theme: 'dark' } }`, pero otros mensajes podrían ser válidos
 * en el futuro. Mantener `unknown` evita forzar un contrato rígido y permite
 * que los callers (o los tests) decidan cómo validar o construir el payload.
 *
 * La función empaqueta el `message` dentro de `{ giscus: message }` y lo envía
 * con `postMessage` al `contentWindow` del iframe.
 *
 * @param message Mensaje arbitrario que se colocará en la propiedad `giscus`
 * @param origin Origen objetivo para `postMessage` (por defecto: 'https://giscus.app')
 */
export function sendMessage(message: unknown, origin = 'https://giscus.app'): void {
  const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
  if (!iframe) return
  iframe.contentWindow?.postMessage({ giscus: message }, origin)
}
