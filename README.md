# jelly-watch
A Jellyfin monitor that receives webhook notifications and logs the aspect ratio of playing media.

## Features
- Webhook server that listens for Jellyfin playback notifications
- Automatically calculates and logs aspect ratio when media is played
- Displays aspect ratio in simplified form (e.g., 16:9) and decimal format

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm run build
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## Configuration in Jellyfin

1. Install the Webhook plugin in Jellyfin
2. Go to **Dashboard** → **Plugins** → **Webhook** → **Settings**
3. Add a new webhook with the following configuration:
   - **Webhook Name**: jelly-watch
   - **Webhook Url**: `http://your-server:3000/webhook`
   - **Notification Type**: Select **Playback Start**
   - **Item Type**: Select **Movies** and/or **Episodes** (as needed)
   - **Request Content Type**: `application/json`

4. In the **Template** field, paste the following JSON template:

```json
{
  "NotificationType": "{{NotificationType}}",
  "Item": {
    "Type": "{{ItemType}}",
    "Name": "{{Name}}",
    "Width": {{Width}},
    "Height": {{Height}}
  }
}
```

5. Save the webhook configuration
6. When media starts playing, the aspect ratio will be logged to the console

### Example Template
```
http://russt-mm2-fr.goldilocks.red:3000/webhook
```
```
{
    "NotificationType": "{{{NotificationType}}}",
    "Name": "{{{Name}}}",
    "ClientName": "{{{ClientName}}}",
    "Client": "{{Client}}",
    "RemoteEndPoint": "{{RemoteEndPoint}}",
    "DeviceName": "{{DeviceName}}",
    "DeviceId": "{{DeviceId}}",
    "Audio_0_Title": "{{Audio_0_Title}}",
    "Audio_0_Type": "{{Audio_0_Type}}",
    "Audio_0_Language": "{{Audio_0_Language}}",
    "Audio_0_Codec": "{{Audio_0_Codec}}",
    "Audio_0_Channels": "{{Audio_0_Channels}}",
    "Audio_0_Bitrate": "{{Audio_0_Bitrate}}",
    "Video_0_Height": "{{Video_0_Height}}",
    "Video_0_Width": "{{Video_0_Width}}",
    "Video_0_AspectRatio": "{{{Video_0_AspectRatio}}}",
    "Video_0_Codec": "{{{Video_0_Codec}}}",
    "Video_0_FrameRate": "{{{Video_0_FrameRate}}}",
    "Video_0_PixelFormat": "{{{Video_0_PixelFormat}}}",
    "UserId": "{{UserId}}"
}
```

## Example Output

```
Media playing: Example Movie
Aspect Ratio: 16:9 (1.78)
```

## Troubleshooting

### Empty Webhook Payload

If the webhook payload is empty or the aspect ratio is not being logged, ensure that:

1. The webhook template is correctly configured in Jellyfin (see Configuration section above)
2. The template uses the exact field names: `NotificationType`, `Width`, `Height`, and `Name`
3. The media being played has video dimensions (audio files will not have Width/Height)
4. The webhook is triggered on "Playback Start" events

### Testing the Webhook

You can test if the webhook is working by sending a test payload using curl:

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "NotificationType": "PlaybackStart",
    "Item": {
      "Type": "Movie",
      "Name": "Test Movie",
      "Width": 1920,
      "Height": 1080
    }
  }'
```

Expected console output:
```
Media playing: Test Movie
Aspect Ratio: 16:9 (1.78)
```
