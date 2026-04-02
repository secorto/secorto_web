export function sendMessage(message: unknown, origin = 'https://giscus.app'): void {
  const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
  if (!iframe) return
  iframe.contentWindow?.postMessage({ giscus: message }, origin)
}
