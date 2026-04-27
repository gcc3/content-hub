#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd "$(dirname "$0")" && pwd)"

pull_script="$repo_dir/public/notes/pull.sh"
push_script="$repo_dir/public/notes/push.sh"

if [[ ! -f "$pull_script" ]]; then
  echo "Warning: $pull_script not found." >&2
  exit 1
fi

if [[ ! -f "$push_script" ]]; then
  echo "Warning: $push_script not found." >&2
  exit 1
fi

cd "$repo_dir/public/notes"
bash "$pull_script"
bash "$push_script"
