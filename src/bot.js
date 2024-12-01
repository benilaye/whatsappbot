import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

export async function createBot() {
  const client = new Client({
    puppeteer: {
      args: ['--no-sandbox']
    }
  });

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Please scan the QR code with your WhatsApp to login');
  });

  await client.initialize();
  return client;
}