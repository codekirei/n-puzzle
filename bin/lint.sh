#! /bin/bash

SOURCE="app/scripts/app.js"
find $SOURCE | entr -c eslint $SOURCE
