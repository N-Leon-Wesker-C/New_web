# 聂畅 · 学术主页

线上地址：https://woshinc.com

Vue 3 前端 + Node.js 后端，支持各版块发文章与评论（评论需审核）。

## 本地开发

**终端 1 — 后端**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**终端 2 — 前端**

```bash
cd frontend
npm install
npm run dev
```

- 前台：http://localhost:5173
- 后台：http://localhost:5173/admin/login

## 替换服务器上已有网站（woshinc.com）

如果 `woshinc.com` 已经绑在旧站上，**不用改 DNS**，只需换 Nginx 指向和后台进程。

### 1. 先摸清旧站怎么跑的（SSH 登录后执行）

```bash
# 看 Nginx 里 woshinc.com 用哪份配置
sudo nginx -T | grep -A5 "server_name.*woshinc"

# 看旧站文件在哪
ls /etc/nginx/sites-enabled/
ls /var/www/

# 看有没有旧的后端在跑
pm2 list
```

记下：**旧站 root 路径**、**配置文件名**（如 `default` 或 `woshinc`）、**旧 PM2 进程名**。

### 2. 备份旧站（重要）

```bash
sudo cp -r /var/www/旧站目录 /var/www/backup-old-site-$(date +%F)
sudo cp /etc/nginx/sites-available/旧配置名 /etc/nginx/sites-available/旧配置名.bak
```

### 3. 部署新站代码

```bash
cd /var/www/niechang   # 没有就 git clone 到这个目录
git pull

cd backend && cp .env.example .env && nano .env
npm install
pm2 start server.js --name niechang-api   # 或 pm2 restart niechang-api

cd ../frontend && npm install && npm run build
```

### 4. 改 Nginx（替换旧站，保留已有 SSL 证书）

**如果已有 HTTPS**，不要重新跑 certbot，只改 `root` 和加 `/api/`：

```nginx
server {
    listen 443 ssl http2;
    server_name woshinc.com www.woshinc.com;

    # 证书路径保持原来的，certbot 配好的话一般是：
    ssl_certificate     /etc/letsencrypt/live/woshinc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/woshinc.com/privkey.pem;

    root /var/www/niechang/frontend/dist;   # ← 改成新站
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nano /etc/nginx/sites-available/woshinc   # 编辑现有配置
sudo nginx -t && sudo systemctl reload nginx
```

### 5. 停掉旧站后端（如果有）

```bash
pm2 stop 旧进程名
pm2 delete 旧进程名
pm2 save
```

### 6. 验证

- https://woshinc.com → 新首页
- https://woshinc.com/admin/login → 管理后台
- https://woshinc.com/api/health → 应返回 `{"ok":true}`

旧站随时可从 `/var/www/backup-old-site-*` 恢复。

---

## 全新部署到 woshinc.com（82.156.68.84）

### 1. 域名解析（域名服务商控制台）

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| A | `@` | `82.156.68.84` |
| A | `www` | `82.156.68.84` |

### 2. 服务器初始化（SSH 登录 Ubuntu）

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl ufw

sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 3. 上传代码

```bash
sudo mkdir -p /var/www/niechang
sudo chown $USER:$USER /var/www/niechang
cd /var/www/niechang
git clone https://github.com/N-Leon-Wesker-C/N-Leon-Wesker-C.github.io.git .
```

### 4. 配置后端

```bash
cd /var/www/niechang/backend
cp .env.example .env
nano .env   # 修改 ADMIN_PASSWORD 和 JWT_SECRET
npm install
pm2 start server.js --name niechang-api
pm2 save
pm2 startup   # 按提示执行输出的 sudo 命令
```

### 5. 构建前端

```bash
cd /var/www/niechang/frontend
npm install
npm run build
```

### 6. 配置 Nginx

```bash
sudo cp /var/www/niechang/deploy/nginx-init.conf /etc/nginx/sites-available/woshinc
sudo ln -sf /etc/nginx/sites-available/woshinc /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

此时可访问：http://woshinc.com

### 7. 申请 HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d woshinc.com -d www.woshinc.com
```

证书申请成功后，换成完整 HTTPS 配置：

```bash
sudo cp /var/www/niechang/deploy/nginx.conf /etc/nginx/sites-available/woshinc
sudo nginx -t && sudo systemctl reload nginx
```

### 8. 以后更新网站

```bash
cd /var/www/niechang
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

## 管理后台

- 地址：https://woshinc.com/admin/login
- 账号：`backend/.env` 中的 `ADMIN_USERNAME` / `ADMIN_PASSWORD`
