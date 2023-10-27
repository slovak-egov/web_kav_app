#!/bin/sh
set -o errexit
set -o pipefail
set -o nounset
set -x

if [ ! -d ./.next ]; then
  mkdir ./.next
fi

# Delete all old temporary directories
find ./.next/ -mindepth 1 -maxdepth 1 -type d -name "tmp\.*" -exec rm -r {} +
echo "Removing old temp directories - done"

# Create temp dir for new build (time based)
NEW_TEMP_DIR=$(mktemp -d -p ./.next/)
NEW_BUILD_DIR_NAME=".next/$(date +"%F-%H-%M-%s")"

# Build new static content into temp dir
BUILD_DIR=$NEW_TEMP_DIR /usr/local/bin/npm run build
echo "Build completed in $(($(date +"%s") - ${NEW_BUILD_DIR_NAME##*-}))s" >"$NEW_TEMP_DIR/D0NE"

# If successful, rename to new build dir
if [ -f "$NEW_TEMP_DIR/D0NE" ]; then
  mv "$NEW_TEMP_DIR" "$NEW_BUILD_DIR_NAME"
fi

# Write "log" after successful build or fail
# TODO: proper json log format
echo "Build $NEW_BUILD_DIR_NAME - done"

if [ -f "$NEW_BUILD_DIR_NAME/D0NE" ]; then
  rm -f ./.next/current
  ln -s "$(basename "$NEW_BUILD_DIR_NAME")" ./.next/current

  echo "Setting symbolic link to latest build dir ($NEW_BUILD_DIR_NAME) - done"
fi

# Delete all but 3 newest build directories
# TODO: Fix data cleanup (add more sanity checks)
find ./.next/ -mindepth 1 -maxdepth 1 -type d -name "20*" | sort | head -n -3 | xargs -r rm -r
