#!/bin/bash

# Script to create GitHub repository and push code
# Run this script and follow the prompts

REPO_NAME="insert-page-functionality"
GITHUB_USER="lbaum"

echo "Setting up GitHub repository: $REPO_NAME"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "Remote 'origin' already exists. Updating..."
    git remote set-url origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
else
    echo "Adding remote 'origin'..."
    git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
fi

echo ""
echo "To complete the setup:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named: $REPO_NAME"
echo "3. Do NOT initialize with README, .gitignore, or license"
echo "4. Then run: git push -u origin main"
echo ""
echo "Or if you have GitHub CLI (gh) installed, run:"
echo "gh repo create $REPO_NAME --public --source=. --remote=origin --push"


