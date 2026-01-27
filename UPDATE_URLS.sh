#!/bin/bash
# Quick script to update all localhost:4500 to production URL

BACKEND_URL="https://note-app-t9ok.onrender.com"
OLD_URL="http://localhost:4500"

find Fronted -name "*.html" -type f -exec sed -i "s|$OLD_URL|$BACKEND_URL|g" {} \;

echo "Updated all URLs from $OLD_URL to $BACKEND_URL"
