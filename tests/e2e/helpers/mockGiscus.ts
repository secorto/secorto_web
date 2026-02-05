import type { Page } from '@playwright/test'

export async function mockGiscus(page: Page) {
  await page.route('https://giscus.app/client.js', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `(function(){
        var s = document.currentScript || (document.scripts && document.scripts[document.scripts.length-1]);
        var lang = (s && s.getAttribute && s.getAttribute('data-lang')) || 'es';
        var heading = lang === 'es' ? 'Comentarios' : 'Comments';
        var iframe = document.createElement('iframe');
        iframe.className = 'giscus-frame';
        iframe.title = 'giscus mock';
        iframe.style.width = '100%';
        iframe.style.height = '200px';
        iframe.srcdoc = '<!doctype html><html><body><h1>' + heading + '</h1></body></html>';
        s && s.parentNode && s.parentNode.appendChild(iframe);
      })();`
    })
  })
}
