#!/bin/bash

echo "[1/5] Pulling latest code..."
./pull.sh

echo "[2/5] Installing dependencies..."
npm install

echo "[3/5] Setting up .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  .env created from .env.example"
else
  echo "  .env already exists, skipping."
fi

echo "[4/5] Creating public/notes folder..."
mkdir -p public/notes

echo "[5/5] Building..."
npm run build

echo "Setup complete."
