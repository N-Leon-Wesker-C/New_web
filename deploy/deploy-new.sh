#!/bin/bash
set -e

# 项目路径（假设在 /var/www/niechang）
PROJECT_DIR="/var/www/niechang"
# 前端部署目标路径
FRONTEND_DEST="/var/www/html"
# 后端路径
BACKEND_DIR="/var/www/niechang/backend"

cd $PROJECT_DIR

echo ">>> git pull"
git pull

echo ">>> frontend build"
cd frontend
npm install
npm run build

echo ">>> 复制前端到 $FRONTEND_DEST"
# 备份旧的（可选）
# rm -rf $FRONTEND_DEST/dist.old || true
# mv $FRONTEND_DEST/dist $FRONTEND_DEST/dist.old || true

# 复制新的
rm -rf $FRONTEND_DEST/dist
cp -r dist $FRONTEND_DEST/

echo ">>> backend"
cd $BACKEND_DIR
npm install
pm2 restart niechang-api || pm2 start server.js --name niechang-api

pm2 save
echo ">>> Deploy done at $(date)"
