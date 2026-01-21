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
2. Configure the webhook URL to point to: `http://your-server:3000/webhook`
3. Enable "Playback Start" notifications
4. When media starts playing, the aspect ratio will be logged to the console

### Example Template
```
{
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
