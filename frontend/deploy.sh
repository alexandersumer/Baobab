#!/bin/sh

npm run build && firebase deploy --only hosting
