#!/bin/bash

# --- Harvester Music One-Click Deploy Script ---
echo "🚀 Starting Deployment to GitHub..."

# 1. Add all changes
git add .

# 2. Commit with professional update message
git commit -m "💎 Diamond Edition: New Logo Refresh, PPT Headers & Video Interactivity Upgrade"

# 3. Rename branch to main if not already
git branch -M main

# 4. Push to origin main
# Note: If this fails, make sure you have authenticated your terminal with GitHub
echo "📡 Synchronizing with Cloud (harvestermusicproduction)..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ DEPLOYMENT SUCCESSFUL! Your website is updating..."
else
    echo "❌ DEPLOYMENT FAILED. Please check your GitHub credentials or terminal permissions."
fi
