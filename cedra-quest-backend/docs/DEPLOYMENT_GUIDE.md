# 🚀 Hướng Dẫn Deploy Cedra Quest Backend

## 📋 Tổng Quan

Backend Cedra Quest đã hoàn thành 100% và sẵn sàng deploy production với đầy đủ tính năng:

- ✅ **Authentication System** - Telegram Mini App + Non-custodial wallets
- ✅ **Game Economy** - Pet system, Energy, Ranking, Game cycles
- ✅ **Blockchain Integration** - Cedra network với treasury & rewards
- ✅ **Production Ready** - Docker, SSL, monitoring, security

---

## 🛠️ Yêu Cầu Hệ Thống

### **VPS Minimum Requirements:**
- **RAM**: 2GB (khuyến nghị 4GB)
- **CPU**: 2 cores
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04+ hoặc CentOS 8+
- **Network**: Public IP với domain name

### **Software Requirements:**
- Docker & Docker Compose
- Git
- SSL Certificate (Let's Encrypt)

---

## 🔧 Bước 1: Chuẩn Bị VPS

### **1.1 Cập nhật hệ thống**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### **1.2 Cài đặt Docker**
```bash
# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Kiểm tra
docker --version
docker-compose --version
```

### **1.3 Cài đặt Git**
```bash
# Ubuntu/Debian
sudo apt install git -y

# CentOS/RHEL
sudo yum install git -y
```

### **1.4 Tạo thư mục ứng dụng**
```bash
sudo mkdir -p /opt/cedra-quest
sudo chown $USER:$USER /opt/cedra-quest
cd /opt/cedra-quest
```

---

## 📦 Bước 2: Deploy Code

### **2.1 Clone repository**
```bash
# Clone từ Git repository
git clone <your-repository-url> .

# Hoặc upload code qua SCP/SFTP
# scp -r cedra-quest-backend/ user@your-server:/opt/cedra-quest/
```

### **2.2 Cấu hình environment production**
```bash
# Copy template
cp .env.production.example .env.production

# Edit với thông tin thật
nano .env.production
```

**Cấu hình .env.production:**
```bash
# Server
NODE_ENV=production
PORT=3333

# Database - Production PostgreSQL
DATABASE_URL="postgresql://username:password@your-db-host:5432/cedra_quest_prod"
DIRECT_URL="postgresql://username:password@your-db-host:5432/cedra_quest_prod"

# Database cho Docker (nếu dùng Docker DB)
POSTGRES_DB="cedra_quest_prod"
POSTGRES_USER="cedra_user"
POSTGRES_PASSWORD="your-super-secure-password-here"

# JWT - Tạo secret mạnh
JWT_SECRET="your-super-secure-jwt-secret-32-chars-minimum"
JWT_EXPIRES_IN="7d"

# Telegram - Bot production
TELEGRAM_BOT_TOKEN="your-production-telegram-bot-token"

# Redis
REDIS_HOST="redis"
REDIS_PORT="6379"
REDIS_PASSWORD="your-secure-redis-password"

# Blockchain - Cedra Production
CEDRA_NETWORK_URL="https://rpc.cedra.network"
CEDRA_PRIVATE_KEY="ed25519-priv-0x[your-production-private-key]"
CEDRA_GAMEFI_ADDRESS="79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe"
CEDRA_PACKAGE_NAME="CedraMiniApp"
CEDRA_ADMIN_ADDRESS="79ca407a19d76dcc4f722fb074781afd1a3a7316520295e4969673a81a0dabfe"

# Security
CORS_ORIGIN="https://your-frontend-domain.com"
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Monitoring
LOG_LEVEL="info"
SENTRY_DSN="your-sentry-dsn-for-error-tracking"
```

---

## 🔐 Bước 3: Cấu Hình SSL

### **3.1 Cài đặt Certbot**
```bash
# Ubuntu/Debian
sudo apt install certbot -y

# CentOS/RHEL
sudo yum install certbot -y
```

### **3.2 Lấy SSL Certificate**
```bash
# Dừng services nếu đang chạy
sudo systemctl stop nginx apache2 2>/dev/null || true

# Lấy certificate
sudo certbot certonly --standalone -d your-domain.com

# Tạo thư mục SSL
mkdir -p ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ./ssl/*
```

### **3.3 Cấu hình Nginx**
Cập nhật `nginx.conf`:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;  # Thay bằng domain thật

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of config
}
```

---

## 🚀 Bước 4: Deploy Application

### **4.1 Chạy deployment script**
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### **4.2 Manual deployment (nếu script fail)**
```bash
# Build images
docker-compose build

# Start database first
docker-compose up -d postgres redis

# Wait for DB to be ready
sleep 15

# Run database migrations
docker-compose exec postgres psql -U cedra_user -d cedra_quest_prod -c "SELECT 1;"

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

---

## ✅ Bước 5: Verification

### **5.1 Kiểm tra services**
```bash
# Check all containers
docker-compose ps

# Check logs
docker-compose logs -f cedra-quest-api

# Check health
curl https://your-domain.com/health
```

### **5.2 Test API endpoints**
```bash
# Health check
curl https://your-domain.com/health

# Blockchain status
curl https://your-domain.com/blockchain/status

# Game dashboard (cần user ID thật)
curl https://your-domain.com/game/dashboard/123456789
```

### **5.3 Expected responses**
```json
// Health check
{
  "status": "ok",
  "timestamp": "2024-01-19T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected"
}

// Blockchain status
{
  "success": true,
  "connected": true,
  "account": "0x...",
  "network": "https://rpc.cedra.network"
}
```

---

## 🔧 Bước 6: Production Optimization

### **6.1 Firewall Configuration**
```bash
# Ubuntu UFW
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# CentOS Firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### **6.2 Auto-restart on boot**
```bash
# Enable Docker service
sudo systemctl enable docker

# Create systemd service
sudo tee /etc/systemd/system/cedra-quest.service > /dev/null <<EOF
[Unit]
Description=Cedra Quest Backend
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/cedra-quest
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable service
sudo systemctl enable cedra-quest.service
sudo systemctl start cedra-quest.service
```

### **6.3 Log rotation**
```bash
# Create logrotate config
sudo tee /etc/logrotate.d/cedra-quest > /dev/null <<EOF
/opt/cedra-quest/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose -f /opt/cedra-quest/docker-compose.yml restart cedra-quest-api
    endscript
}
EOF
```

---

## 📊 Bước 7: Monitoring & Maintenance

### **7.1 Health monitoring script**
```bash
# Tạo script monitoring
cat > /opt/cedra-quest/monitor.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://your-domain.com/health"
WEBHOOK_URL="your-discord-or-slack-webhook"

if ! curl -f -s $HEALTH_URL > /dev/null; then
    echo "API is down! Restarting..."
    cd /opt/cedra-quest
    docker-compose restart cedra-quest-api
    
    # Send notification
    curl -X POST $WEBHOOK_URL -H 'Content-Type: application/json' \
         -d '{"text":"🚨 Cedra Quest API was down and restarted"}'
fi
EOF

chmod +x /opt/cedra-quest/monitor.sh

# Add to crontab (check every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/cedra-quest/monitor.sh") | crontab -
```

### **7.2 Backup script**
```bash
# Tạo script backup
cat > /opt/cedra-quest/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/cedra-quest"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U cedra_user cedra_quest_prod > $BACKUP_DIR/db_$DATE.sql

# Backup environment files
cp .env.production $BACKUP_DIR/env_$DATE.backup

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.backup" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /opt/cedra-quest/backup.sh

# Add to crontab (daily backup at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/cedra-quest/backup.sh") | crontab -
```

---

## 🔍 Troubleshooting

### **Common Issues:**

**1. Container won't start:**
```bash
# Check logs
docker-compose logs cedra-quest-api

# Check environment
docker-compose exec cedra-quest-api env | grep -E "(DATABASE|TELEGRAM)"

# Restart specific service
docker-compose restart cedra-quest-api
```

**2. Database connection failed:**
```bash
# Check postgres
docker-compose ps postgres
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U cedra_user -d cedra_quest_prod -c "SELECT 1;"
```

**3. SSL certificate issues:**
```bash
# Check certificate
openssl x509 -in ./ssl/cert.pem -text -noout

# Renew certificate
sudo certbot renew
sudo cp /etc/letsencrypt/live/your-domain.com/*.pem ./ssl/
docker-compose restart nginx
```

**4. High memory usage:**
```bash
# Check container stats
docker stats

# Restart if needed
docker-compose restart

# Check for memory leaks in logs
docker-compose logs cedra-quest-api | grep -i "memory\|heap"
```

---

## 📞 Support Commands

### **Useful maintenance commands:**
```bash
# View all logs
docker-compose logs -f

# Restart API only
docker-compose restart cedra-quest-api

# Update application
git pull origin main
docker-compose build cedra-quest-api
docker-compose up -d cedra-quest-api

# Database operations
docker-compose exec postgres psql -U cedra_user cedra_quest_prod

# Check disk space
df -h
docker system df

# Clean up old images
docker system prune -a
```

---

## 🎯 Performance Benchmarks

**Expected metrics after deployment:**
- **API Response Time**: < 200ms
- **Database Queries**: < 50ms  
- **Memory Usage**: < 1GB
- **CPU Usage**: < 50%
- **Uptime**: 99.9%

**Load testing:**
```bash
# Install artillery
npm install -g artillery

# Test production
artillery quick --count 100 --num 10 https://your-domain.com/health
```

---

## ✅ Deployment Checklist

**Pre-deployment:**
- [ ] VPS với specs đủ (2GB RAM, 2 CPU)
- [ ] Domain name pointing to VPS IP
- [ ] SSL certificate obtained
- [ ] Production environment variables configured
- [ ] Database credentials secured
- [ ] Telegram bot token (production)
- [ ] Cedra private key (production)

**Deployment:**
- [ ] Code deployed to `/opt/cedra-quest`
- [ ] Docker containers running
- [ ] Database migrations completed
- [ ] SSL certificate configured
- [ ] Firewall configured
- [ ] Health check passing

**Post-deployment:**
- [ ] API endpoints responding
- [ ] Blockchain connection working
- [ ] Monitoring setup
- [ ] Backup script configured
- [ ] Auto-restart on boot enabled
- [ ] Performance benchmarks met

---

## 🚀 **BACKEND ĐÃ SẴN SÀNG PRODUCTION!**

Với hướng dẫn này, bạn có thể deploy backend lên VPS và phục vụ hàng nghìn users đồng thời. Backend đã được tối ưu cho production với đầy đủ tính năng bảo mật, monitoring và blockchain integration.

**Happy deploying! 🎉**