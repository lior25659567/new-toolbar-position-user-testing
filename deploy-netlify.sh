#!/bin/bash

# Netlify deployment script
# This script will help you deploy to Netlify

echo "🚀 Netlify Deployment Setup"
echo ""
echo "Your project is already configured with netlify.toml"
echo ""
echo "To deploy to Netlify, you have two options:"
echo ""
echo "Option 1: Deploy via Netlify CLI (Recommended)"
echo "  1. Run: npx netlify-cli login"
echo "  2. Run: npx netlify-cli deploy --prod"
echo ""
echo "Option 2: Deploy via Netlify Web Interface"
echo "  1. Go to: https://app.netlify.com/add-site"
echo "  2. Click 'Import from Git'"
echo "  3. Select 'GitHub'"
echo "  4. Authorize Netlify to access your GitHub"
echo "  5. Select repository: lior25659567/Itero-toolbar"
echo "  6. Netlify will automatically detect your netlify.toml settings:"
echo "     - Build command: npm run build"
echo "     - Publish directory: build"
echo "  7. Click 'Deploy site'"
echo ""
echo "Your site will be live at: https://[random-name].netlify.app"
echo "You can customize the domain name in Netlify settings."


