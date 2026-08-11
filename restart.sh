#!/bin/bash

echo "Restarting server..."

# Abort before touching pm2 if setup or the build fails — restarting onto a
# stale public/main.js is worse than leaving the running server alone, and it
# hides the failure behind a "Restart complete." line.
./setup.sh || { echo "Setup failed — server left on the previous build." >&2; exit 1; }

./build.sh || { echo "Build failed — server left on the previous build." >&2; exit 1; }

./stop.sh

./start.sh

echo "Restart complete."
