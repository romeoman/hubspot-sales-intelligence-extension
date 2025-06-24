#!/bin/bash

# Build script for Vercel deployment
echo "Running build script..."

# Install dependencies
npm install

# Run the build
npm run build

echo "Build completed successfully"