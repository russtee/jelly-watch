import { EpsonProjectorClient } from './epson-control.js';
import { WebhookHandler } from './webhook.js';

const PROJECTOR_IP = '192.168.1.169';
const PROJECTOR_PORT = 80;
const PORT = process.env.PORT || 3000;

const handler = new WebhookHandler();

handler.on('playback-start', (event) => {
  console.log('Playback started event received:', {event});
  // Add your handling logic here
});

await handler.InitAndStartServer(Number(PORT));

const controller = new EpsonProjectorClient(PROJECTOR_IP, PROJECTOR_PORT);

//console.log(`Getting projector status from: ${PROJECTOR_IP}:${PROJECTOR_PORT}`);
//const status = await controller.getStatus();  
//console.log('Projector status:', status);
