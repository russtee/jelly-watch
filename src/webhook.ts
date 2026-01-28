import express, { Request, Response } from 'express';
import EventEmitter from 'node:events';
import { GetClosestLensMemorySetting, LensMemorySetting } from './projector.js';

const PORT = process.env.PORT || 3000;

export interface JFWebhookPayload {
  NotificationType: string;
}

export interface JFWebhookPlaybackStartPayload extends JFWebhookPayload {
  Name: string;
  ClientName: string;
  Client: string;
  RemoteEndPoint: string;
  DeviceName: string;
  DeviceId: string;
  Audio_0_Title: string;
  Audio_0_Type: string;
  Audio_0_Language: string;
  Audio_0_Codec: string;
  Audio_0_Channels: number;
  Audio_0_Bitrate: number;
  Video_0_Height: number;
  Video_0_Width: number;
  Video_0_AspectRatio: string;
  Video_0_Codec: string;
  Video_0_FrameRate: number;
  Video_0_PixelFormat: string;
  UserId: string;
}

export interface PlaybackStartEvent  {
  webHookPayload: JFWebhookPlaybackStartPayload;
  aspectRatioCalc: number;
  lensMemorySetting: LensMemorySetting;
}


export class WebhookHandler extends EventEmitter {
  constructor() {
    super();
  }

  async InitAndStartServer(): Promise<void> {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Webhook endpoint
    app.post('/webhook', (req: Request, res: Response) => {
      const payload: JFWebhookPlaybackStartPayload = req.body;

      if ('PlaybackStart' !== payload.NotificationType) {
        console.warn(`Ignoring non-playback webhook: NotificationType=${payload.NotificationType}`);
        return res.status(200).json({ received: true });
      }

      const event: PlaybackStartEvent = {
        webHookPayload: payload,
        aspectRatioCalc: 0,
        lensMemorySetting: {
          aspectRatio: 0,
          memorySlot: 0,
          name: 'Unknown'
        }
      }

      //event.webHookPayload.Audio_0_Channels = stringToInteger(event.webHookPayload.Audio_0_Channels);
      //event.webHookPayload.Audio_0_Bitrate = stringToInteger(event.webHookPayload.Audio_0_Bitrate);
      //event.webHookPayload.Video_0_Height = stringToInteger(event.webHookPayload.Video_0_Height);
      //event.webHookPayload.Video_0_Width = stringToInteger(event.webHookPayload.Video_0_Width);
      //event.webHookPayload.Video_0_FrameRate = stringToFloat(event.webHookPayload.Video_0_FrameRate);
      //
      event.aspectRatioCalc = event.webHookPayload.Video_0_Width / event.webHookPayload.Video_0_Height;
      event.lensMemorySetting = GetClosestLensMemorySetting(event.aspectRatioCalc);

      //console.log('Received webhook:', {payload,event});
      this.emit('playback-start', event);
      res.status(200).json({ received: true }); 
    });

    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'ok' });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Jellyfin webhook server listening on port ${PORT}`);
      console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
    });
  }
}