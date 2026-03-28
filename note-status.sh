#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd "$(dirname "$0")" && pwd)"

while IFS= read -r -d '' git_dir; do
  dir="$(dirname "$git_dir")"
  echo "Status of $dir"
  git -C "$dir" status
  echo ""
done < <(find "$repo_dir/public/notes" -name ".git" -type d -print0)
