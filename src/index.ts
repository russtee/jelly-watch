import { EpsonLensMemorySetter } from './lens-memory.js';
import { WebhookHandler } from './webhook.js';

const handler = new WebhookHandler();
const epsonLensMemorySetter = new EpsonLensMemorySetter();

handler.on('playback-start', async (event) => {
  console.log('Playback started event received:', {event});
  await epsonLensMemorySetter.setLensMemory(event.lensMemorySetting.memorySlot);
});

handler.on('playback-stop', async () => {
  //console.log('Playback stopped event received - reset to slot 1');
  //await epsonLensMemorySetter.setLensMemory(1);
});

await handler.InitAndStartServer();

