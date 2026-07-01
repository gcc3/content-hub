#!/bin/bash

echo "[1/6] Pulling latest code..."
./pull.sh

echo "[2/6] Installing dependencies..."
npm install

echo "[3/6] Setting up .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  .env created from .env.example"
else
  echo "  .env already exists, skipping."
fi

echo "[4/7] Creating public/notes folder..."
mkdir -p public/notes

echo "[5/7] Checking note command..."
if ! command -v note >/dev/null 2>&1; then
  echo "  Warning: 'note' command not found. public/notes/note.sh requires it." >&2
else
  echo "  'note' command found."
fi

echo "[6/7] Building..."
npm run build

echo "[7/7] Create notes folder in public/notes..."
mkdir -p public/notes

echo "Setup complete."
