#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd "$(dirname "$0")" && pwd)"

git -C "$repo_dir" pull
zsh "$repo_dir/public/notes/pull.sh"
