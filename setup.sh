#!/bin/bash

echo "[1/4] Pulling latest code..."
./pull.sh

echo "[2/4] Installing dependencies..."
npm install

echo "[3/4] Setting up .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  .env created from .env.example"
else
  echo "  .env already exists, skipping."
fi

echo "[4/4] Building..."
npm run build

echo "Setup complete."
