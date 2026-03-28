#!/bin/bash

echo "Stopping server..."
if pm2 stop ecosystem.config.js; then
  echo "Server stopped."
fi
