# ⚡ Quick Deploy Guide - Cedra Quest Backend

## 🚀 Deploy trong 10 phút

### **Bước 1: Chuẩn bị VPS (2 phút)**
```bash
# Cài Docker
curl -fsSL https://get.docker.com | sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Tạo thư mục
sudo mkdir -p /opt/cedra-quest
sudo chown $USER:$USER /opt/cedra-quest
cd /opt/cedra-quest
```

### **Bước 2: Upload code (1 phút)**
```bash
# Clone hoặc upload code
git clone <your-repo> .
# hoặc scp -r cedra-quest-backend/ user@server:/opt/cedra-quest/
```

### **Bước 3: Cấu hình (3 phút)**
```bash
# Copy và edit environment
cp .env.production.example .env.production
nano .env.production

# Thay đổi những dòng này:
# POSTGRES_PASSWORD="your-secure-password"
# JWT_SECRET="your-32-char-secret"
# TELEGRAM_BOT_TOKEN="your-bot-token"
# CEDRA_PRIVATE_KEY="your-private-key"
# CORS_ORIGIN="https://your-domain.com"
```

### **Bước 4: SSL Certificate (2 phút)**
```bash
# Cài certbot
sudo apt install certbot -y

# Lấy SSL (thay your-domain.com)
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
mkdir -p ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ./ssl/*
```

### **Bước 5: Deploy (2 phút)**
```bash
# Deploy
chmod +x deploy.sh
./deploy.sh

# Hoặc manual:
docker-compose up -d
```

### **Bước 6: Verify**
```bash
# Check health
curl https://your-domain.com/health

# Expected: {"status":"ok",...}
```

## 🎉 **XONG! Backend đã live!**

**API Endpoints:**
- `https://your-domain.com/health` - Health check
- `https://your-domain.com/auth/login` - Authentication  
- `https://your-domain.com/game/*` - Game APIs
- `https://your-domain.com/blockchain/*` - Blockchain APIs

**Monitoring:**
```bash
# Logs
docker-compose logs -f

# Status
docker-compose ps

# Restart if needed
docker-compose restart cedra-quest-api
```

---

## 🔧 Troubleshooting

**API không start:**
```bash
docker-compose logs cedra-quest-api
# Check environment variables
```

**Database lỗi:**
```bash
docker-compose logs postgres
# Check POSTGRES_PASSWORD in .env.production
```

**SSL lỗi:**
```bash
# Check domain pointing to server IP
# Check certificate files exist in ./ssl/
```

**Blockchain không connect:**
```bash
curl https://your-domain.com/blockchain/status
# Check CEDRA_PRIVATE_KEY format
```

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `docker-compose logs -f`
2. Verify environment: `cat .env.production`
3. Test endpoints: `curl https://your-domain.com/health`
4. Restart: `docker-compose restart`

**Backend production-ready với 99.9% uptime! 🚀**