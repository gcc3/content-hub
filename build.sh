#!/bin/bash
bash pull.sh && npm run build

if [ -f public/notes/note.sh ]; then
  cd public/notes && bash note.sh && cd ../..
fi
