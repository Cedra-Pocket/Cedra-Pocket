# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment

### **Environment Setup**
- [ ] Create `.env.production` with real values
- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Configure production database URL
- [ ] Set real Telegram bot token
- [ ] Configure Redis connection
- [ ] Set CORS_ORIGIN to your frontend domain

### **Security**
- [ ] Change all default passwords
- [ ] Set up SSL certificates in `./ssl/` folder
- [ ] Configure firewall (only ports 80, 443, 22)
- [ ] Set up fail2ban for SSH protection
- [ ] Enable database encryption at rest

### **Infrastructure**
- [ ] VPS with minimum 2GB RAM, 2 CPU cores
- [ ] Docker and Docker Compose installed
- [ ] Domain name configured (A record pointing to VPS IP)
- [ ] SSL certificate (Let's Encrypt recommended)

## ✅ Deployment Steps

### **1. Server Preparation**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
sudo mkdir -p /opt/cedra-quest
sudo chown $USER:$USER /opt/cedra-quest
cd /opt/cedra-quest
```

### **2. Deploy Application**
```bash
# Clone or upload your code
git clone <your-repo> .

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### **3. SSL Setup (Let's Encrypt)**
```bash
# Install certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ./ssl/*

# Restart nginx
docker-compose restart nginx
```

## ✅ Post-Deployment

### **Verification**
- [ ] API health check: `curl https://your-domain.com/health`
- [ ] Database connection working
- [ ] Telegram bot responding
- [ ] All endpoints returning correct responses
- [ ] SSL certificate valid
- [ ] CORS working with frontend

### **Monitoring Setup**
- [ ] Set up log rotation
- [ ] Configure monitoring (Grafana/Prometheus)
- [ ] Set up error tracking (Sentry)
- [ ] Database backup automation
- [ ] Uptime monitoring

### **Performance**
- [ ] Enable gzip compression
- [ ] Set up CDN if needed
- [ ] Configure database connection pooling
- [ ] Set up Redis caching
- [ ] Monitor memory and CPU usage

## 🔧 Maintenance Commands

### **Logs**
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f cedra-quest-api
docker-compose logs -f postgres
```

### **Database**
```bash
# Backup database
docker-compose exec postgres pg_dump -U cedra_user cedra_quest_prod > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose exec -T postgres psql -U cedra_user cedra_quest_prod < backup.sql

# Access database
docker-compose exec postgres psql -U cedra_user cedra_quest_prod
```

### **Updates**
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build cedra-quest-api
docker-compose up -d cedra-quest-api

# Run migrations if needed
docker-compose exec cedra-quest-api npx prisma migrate deploy
```

## 🚨 Troubleshooting

### **Common Issues**

**API not starting:**
```bash
# Check logs
docker-compose logs cedra-quest-api

# Check environment variables
docker-compose exec cedra-quest-api env | grep -E "(DATABASE_URL|TELEGRAM_BOT_TOKEN)"
```

**Database connection failed:**
```bash
# Check if postgres is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U cedra_user -d cedra_quest_prod -c "SELECT 1;"
```

**SSL issues:**
```bash
# Check certificate validity
openssl x509 -in ./ssl/cert.pem -text -noout

# Test SSL
curl -I https://your-domain.com/health
```

## 📊 Performance Benchmarks

**Expected Performance:**
- API response time: < 200ms
- Database queries: < 50ms
- Memory usage: < 1GB
- CPU usage: < 50%

**Load Testing:**
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 https://your-domain.com/health
```

## 🔐 Security Best Practices

- [ ] Regular security updates
- [ ] Database access from localhost only
- [ ] Strong passwords (min 16 characters)
- [ ] Regular backup testing
- [ ] Monitor failed login attempts
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] HTTPS only (no HTTP)

## 📞 Support

If you encounter issues:
1. Check logs first: `docker-compose logs -f`
2. Verify environment variables
3. Test database connectivity
4. Check SSL certificate validity
5. Monitor system resources