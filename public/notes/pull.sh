#!/usr/bin/env bash

set -euo pipefail

notes_dir="$(cd "$(dirname "$0")" && pwd)"

for dir in "$notes_dir"/*/; do
	[ -d "$dir" ] || continue

	folder_name="$(basename "$dir")"
	[[ "$folder_name" == .* ]] && continue

	if [ -d "$dir/.git" ]; then
		echo "Pulling: $folder_name"
		git -C "$dir" pull
	fi
done
