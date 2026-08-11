#!/bin/bash
# A failed build must not look like a successful one: public/main.js is
# git-ignored and only ever produced here, so silently skipping past webpack
# leaves the server serving the previous bundle.
set -e

bash pull.sh
npm run build

if [ -f public/notes/note.sh ]; then
  # Note formatting is content-side; a hiccup there should not block a deploy.
  (cd public/notes && bash note.sh) || echo "note.sh failed, continuing." >&2
fi
