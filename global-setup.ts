import http from 'http';
import https from 'https';

async function globalSetup() {
  const baseUrl = process.env.NETLIFY_PREVIEW_URL || process.env.BASE_URL || 'http://localhost:4321';

  console.log(`\n🩺 Iniciando Health Check: ${baseUrl}`);

  const check = () => new Promise((resolve, reject) => {
    const protocol = baseUrl.startsWith('https') ? https : http;
    const req = protocol.get(baseUrl, (res) => {
      if (res.statusCode && res.statusCode < 400) resolve(true);
      else reject(new Error(`Status: ${res.statusCode}`));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('Timeout')); });
  });

  try {
    await check();
    console.log(`✅ URL alcanzable. Arrancando suites...\n`);
  } catch (error) {
    console.error(`\n❌ FAlLO CRÍTICO: La URL ${baseUrl} no responde.`);
    console.error(`Error: ${(error as Error).message}`);
    console.error(`Asegúrate de que el despliegue terminó o el servidor local está activo.\n`);
    process.exit(1); // Detiene todo antes de que Playwright intente correr tests
  }
}

export default globalSetup;
