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
pages_dir="$repo_dir/src/pages"
pages_repo="$(read_env PAGES_REPO)"
if [ -d "$pages_dir/.git" ]; then
  echo "  Pulling $pages_dir"
  git -C "$pages_dir" pull
elif [ -n "$pages_repo" ]; then
  echo "  Cloning $pages_repo into $pages_dir"
  git clone "$pages_repo" "$pages_dir"
else
  echo "  Warning: PAGES_REPO is not set in .env — src/pages not fetched." >&2
fi

echo "Pulling content..."
for dir in "$repo_dir/public"/*/; do
  if [ -d "$dir/.git" ]; then
    echo "  Pulling $dir"
    git -C "$dir" pull
  fi
done

echo "Pull complete."
