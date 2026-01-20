import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Interface for Jellyfin webhook payload
interface JellyfinWebhookPayload {
  NotificationType?: string;
  Item?: {
    Type?: string;
    Width?: number;
    Height?: number;
    Name?: string;
  };
}

// Function to calculate aspect ratio
function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height || height === 0) {
    return 'Unknown';
  }
  
  const ratio = width / height;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const simplifiedWidth = width / divisor;
  const simplifiedHeight = height / divisor;
  
  return `${simplifiedWidth}:${simplifiedHeight} (${ratio.toFixed(2)})`;
}

// Webhook endpoint
app.post('/webhook', (req: Request, res: Response) => {
  try {
    const payload: JellyfinWebhookPayload = req.body;
    
    // Check if this is a playback notification
    if (payload.NotificationType === 'PlaybackStart' && payload.Item) {
      const item = payload.Item;
      
      // Check if item has video dimensions
      if (item.Width && item.Height) {
        const aspectRatio = calculateAspectRatio(item.Width, item.Height);
        console.log(`Media playing: ${item.Name || 'Unknown'}`);
        console.log(`Aspect Ratio: ${aspectRatio}`);
      }
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
