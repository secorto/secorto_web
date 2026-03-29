export function sendMessage(message: { setConfig: { theme: string } }) {
  const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
  if (!iframe) return
  iframe.contentWindow?.postMessage({ giscus: message }, 'https://giscus.app')
}

export function setGiscusTheme(theme: string) {
  sendMessage({ setConfig: { theme } })
}

export default setGiscusTheme
