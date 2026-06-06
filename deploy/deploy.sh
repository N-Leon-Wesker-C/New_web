#!/bin/bash
set -e

cd /var/www/niechang

echo ">>> git pull"
git pull

echo ">>> frontend build"
cd frontend
npm install
npm run build

echo ">>> backend"
cd ../backend
npm install
pm2 restart niechang-api || pm2 start server.js --name niechang-api

pm2 save
echo ">>> Deploy done at $(date)"
