#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd "$(dirname "$0")" && pwd)"

# Reads a key from .env, falling back to .env.example so a fresh checkout can
# fetch the pages repo before setup.sh has written an .env of its own.
read_env() {
  local key="$1" file value
  for file in "$repo_dir/.env" "$repo_dir/.env.example"; do
    [ -f "$file" ] || continue
    value="$(sed -n "s/^${key}=//p" "$file" | head -n 1 | tr -d '\r')"
    if [ -n "$value" ]; then
      echo "$value"
      return
    fi
  done
}

echo "Pulling source..."
git -C "$repo_dir" pull

echo "Pulling pages..."
# src/pages lives in its own repo and is git ignored here. Without it the
# bundle has no landing pages to import and the build fails, so a missing
# folder is cloned rather than skipped.
#
# Fetching them halfway is the failure this stops: a src/pages that is on disk
# but is not a clone — copied in by hand — builds perfectly well out of
# whatever it holds, so a deploy that never takes a new page succeeds and says
# nothing. That ends here as an error, and the last line says which commit was
# built. No PAGES_REPO is the one case that is not a failure: nothing was ever
# asked for, so the pages are left alone and the pull carries on without them.
pages_dir="$repo_dir/src/pages"
pages_repo="$(read_env PAGES_REPO)"
if [ -d "$pages_dir/.git" ]; then
  echo "  Pulling $pages_dir"
  git -C "$pages_dir" pull
elif [ -z "$pages_repo" ]; then
  echo "  PAGES_REPO is not set in .env, so pages are skipped."
elif [ ! -e "$pages_dir" ] || [ -z "$(ls -A "$pages_dir")" ]; then
  echo "  Cloning $pages_repo into $pages_dir"
  git clone "$pages_repo" "$pages_dir"
else
  echo "  $pages_dir is not a git clone, so nothing can be pulled into it." >&2
  echo "  Move it aside and run ./pull.sh again to clone $pages_repo." >&2
  exit 1
fi
if [ -d "$pages_dir/.git" ]; then
  echo "  Pages at $(git -C "$pages_dir" log -1 --format='%h %s')"
fi

echo "Pulling content..."
for dir in "$repo_dir/public"/*/; do
  if [ -d "$dir/.git" ]; then
    echo "  Pulling $dir"
    git -C "$dir" pull
  fi
done

echo "Pull complete."
