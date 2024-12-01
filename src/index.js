import { createBot } from './bot.js';
import { messageHandler } from './handlers/messageHandler.js';
import { setupEvents } from './events/events.js';
import { config } from 'dotenv';

config();

async function main() {
  try {
    const client = await createBot();
    setupEvents(client);
    messageHandler(client);
    
    console.log('WhatsApp bot is running!');
  } catch (error) {
    console.error('Error starting the bot:', error);
  }
}

main();