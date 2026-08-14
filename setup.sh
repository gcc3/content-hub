#!/bin/bash

# .env comes first: pull.sh reads PAGES_REPO from it to fetch src/pages.
echo "[1/6] Setting up .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  .env created from .env.example"
else
  echo "  .env already exists, skipping."
fi

echo "[2/6] Pulling latest code, pages and content..."
./pull.sh || { echo "  Pull failed." >&2; exit 1; }

echo "[3/6] Installing dependencies..."
# --include=dev is not optional here: when this runs from the gift webhook the
# environment carries NODE_ENV=production, which makes npm omit *and prune*
# devDependencies — taking webpack with them, so the build below cannot run.
npm install --include=dev

echo "[4/6] Creating public/notes folder..."
mkdir -p public/notes

echo "[5/6] Checking note command..."
if ! command -v note >/dev/null 2>&1; then
  echo "  Warning: 'note' command not found. public/notes/note.sh requires it." >&2
else
  echo "  'note' command found."
fi

echo "[6/6] Building..."
# Say it here rather than leaving it to be noticed in the output: a build with
# no landing pages is a working site, so it is worth one line that this is what
# was built. Set PAGES_REPO in .env and run ./pull.sh to get them.
if [ ! -f src/pages/index.js ]; then
  echo "  src/pages is absent, building without landing pages."
fi
npm run build || { echo "  Build failed." >&2; exit 1; }

echo "Setup complete."
