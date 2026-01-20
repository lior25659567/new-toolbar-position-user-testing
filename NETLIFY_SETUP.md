# Netlify Deployment Setup Guide

Your project is ready to deploy to Netlify! The `netlify.toml` configuration file is already set up.

## Quick Setup (5 minutes)

### Step 1: Connect GitHub Repository
1. Go to: https://app.netlify.com/start
2. Click **"GitHub"** button
3. Authorize Netlify to access your GitHub account (if not already done)
4. You'll be redirected back to Netlify

### Step 2: Select Your Repository
1. Search for: **"Itero-toolbar"** or **"lior25659567/Itero-toolbar"**
2. Click on your repository

### Step 3: Configure Build Settings
Netlify will automatically detect your settings from `netlify.toml`:
- **Build command:** `npm run build`
- **Publish directory:** `build`
- **Branch to deploy:** `main`

These settings are already configured correctly!

### Step 4: Deploy
1. Click **"Deploy site"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at: `https://[random-name].netlify.app`

## Custom Domain (Optional)
After deployment:
1. Go to your site settings in Netlify
2. Click **"Domain settings"**
3. Click **"Add custom domain"** or **"Options"** → **"Change site name"**
4. Choose a custom name like: `itero-toolbar.netlify.app`

## Automatic Deployments
Once connected, Netlify will automatically deploy:
- ✅ Every push to the `main` branch
- ✅ Every pull request (as preview deployments)

## Manual Deployment (Alternative)
If you prefer using the command line:

```bash
# Login to Netlify
npx netlify-cli login

# Deploy to production
npx netlify-cli deploy --prod

# Or deploy a preview
npx netlify-cli deploy
```

## Your Configuration
Your `netlify.toml` file contains:
```toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures:
- ✅ Single Page Application routing works correctly
- ✅ Build outputs to the correct directory
- ✅ All routes redirect to index.html for client-side routing

## Need Help?
- Netlify Docs: https://docs.netlify.com
- Your repository: https://github.com/lior25659567/Itero-toolbar


