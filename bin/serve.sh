#! /bin/bash

browser-sync start \
  --server "app" \
  --files "app/index.html, app/scripts/*.js, app/styles/*.css" \
  --no-open \
  --port 1337
