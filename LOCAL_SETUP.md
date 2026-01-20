# Running the Application Locally

This guide explains how to run the application on your local machine, accessible via localhost or your network IP address.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Development Server

### Option 1: Localhost Only (default)
```bash
npm run dev
```
This will start the server at `http://localhost:3000`

### Option 2: Network Access (via IP address)
```bash
npm run dev:host
```
This will start the server accessible from:
- `http://localhost:3000` (on your machine)
- `http://YOUR_IP_ADDRESS:3000` (from other devices on the same network)

When you run `npm run dev:host`, Vite will display:
- Local: `http://localhost:3000`
- Network: `http://192.168.x.x:3000` (your actual IP address)

## Finding Your IP Address

### On macOS/Linux:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
or
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

### On Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

## Accessing from Other Devices

1. Make sure your device and the computer running the server are on the same Wi-Fi network
2. Find your computer's IP address (see above)
3. On your device's browser, navigate to: `http://YOUR_IP_ADDRESS:3000`

## Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `build/` directory, which can be deployed to Netlify or any static hosting service.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically try the next available port. You can also specify a different port:
```bash
npm run dev -- --port 3001
```

### Firewall Issues
If other devices can't access the server:
- **macOS**: System Preferences → Security & Privacy → Firewall → Firewall Options → Allow incoming connections for Node
- **Windows**: Windows Defender Firewall → Allow an app → Node.js
- **Linux**: Configure your firewall to allow port 3000

### Network Access Not Working
- Ensure both devices are on the same network
- Check that your firewall isn't blocking the connection
- Try disabling VPN if active
- Verify the IP address is correct

## Notes

- The development server includes hot module replacement (HMR) for instant updates
- Changes to source files will automatically reload in the browser
- The production build is optimized and minified for deployment


