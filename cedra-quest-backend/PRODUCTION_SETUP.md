# 🚀 Production Setup Guide

## Bước 1: Tạo Telegram Bot

### 1.1 Tạo Bot với BotFather
```
1. Mở Telegram, tìm @BotFather
2. Gửi: /newbot
3. Tên bot: Cedra Quest Bot
4. Username: cedra_quest_bot (hoặc tên khác available)
5. Lưu Bot Token: 123456789:ABCDEF...
```

### 1.2 Cấu hình Bot Commands
```
Gửi cho @BotFather:
/setcommands

Chọn bot vừa tạo, paste:
start - 🎮 Khởi động Cedra Quest
help - ❓ Hướng dẫn sử dụng
profile - 👤 Xem profile
quests - 🎯 Danh sách nhiệm vụ
```

## Bước 2: Deploy Backend

### 2.1 Chuẩn bị Environment Variables
```env
# Database (Supabase/Railway)
DATABASE_URL="postgresql://user:pass@host:port/db"
DIRECT_URL="postgresql://user:pass@host:port/db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-production"
JWT_EXPIRES_IN="7d"

# Telegram
TELEGRAM_BOT_TOKEN="123456789:ABCDEF..." # Từ BotFather

# Redis (Railway/Upstash)
REDIS_HOST="redis-host.com"
REDIS_PORT="6379"
REDIS_PASSWORD="redis-password"

# API Keys (optional)
TWITTER_API_KEY=""
TWITTER_API_SECRET=""
```

### 2.2 Deploy lên Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Tạo project mới
railway init

# 4. Add services
railway add postgresql
railway add redis

# 5. Set environment variables
railway variables set TELEGRAM_BOT_TOKEN=your_token
railway variables set JWT_SECRET=your_secret

# 6. Deploy
railway up
```

### 2.3 Hoặc Deploy lên Heroku
```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Tạo app
heroku create cedra-quest-backend

# 4. Add addons
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini

# 5. Set config vars
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set JWT_SECRET=your_secret

# 6. Deploy
git push heroku main
```

## Bước 3: Tạo Frontend

### 3.1 Tạo React App
```bash
npx create-react-app cedra-quest-frontend
cd cedra-quest-frontend
npm install @telegram-apps/sdk axios
```

### 3.2 Setup Environment
```bash
# Tạo .env.local
echo "REACT_APP_API_URL=https://your-backend-url.railway.app" > .env.local
```

## Bước 4: Cấu hình Mini App

### 4.1 Tạo Mini App với BotFather
```
1. Gửi /newapp cho @BotFather
2. Chọn bot vừa tạo
3. Tên app: Cedra Quest
4. Mô tả: Complete quests and earn rewards on Cedra Network
5. Upload photo (512x512 PNG)
6. URL: https://your-frontend-url.vercel.app
```

### 4.2 Test Mini App
```
1. Tìm bot trong Telegram
2. Gửi /start
3. Click "Open App" button
4. Kiểm tra authentication
```

## Bước 5: Production Checklist

### 5.1 Backend Security
- ✅ HTTPS enabled
- ✅ CORS configured cho frontend domain
- ✅ Environment variables secure
- ✅ Database connection pooling
- ✅ Rate limiting
- ✅ Error logging

### 5.2 Frontend Security  
- ✅ API URL từ environment
- ✅ JWT token secure storage
- ✅ Input validation
- ✅ Error handling
- ✅ Loading states

### 5.3 Database Setup
```bash
# Chạy migrations
npx prisma db push

# Seed initial data
npm run prisma:seed
```

### 5.4 Monitoring
- ✅ Health check endpoints
- ✅ Error tracking (Sentry)
- ✅ Performance monitoring
- ✅ Database monitoring
- ✅ Redis monitoring

## Bước 6: Testing

### 6.1 Backend Testing
```bash
# Health check
curl https://your-backend.railway.app/health

# Test quests
curl https://your-backend.railway.app/test/quests
```

### 6.2 Frontend Testing
```
1. Mở Mini App trong Telegram
2. Test authentication flow
3. Test quest listing
4. Test quest verification
5. Test wallet connection
```

## Troubleshooting

### Common Issues:

**1. Bot Token Invalid**
```
- Kiểm tra token từ BotFather
- Verify environment variable
- Check bot permissions
```

**2. CORS Errors**
```
- Add frontend domain to CORS
- Check HTTPS/HTTP mismatch
- Verify headers
```

**3. Database Connection**
```
- Check DATABASE_URL format
- Verify SSL settings
- Test connection pooling
```

**4. Redis Connection**
```
- Verify Redis credentials
- Check network access
- Test Redis commands
```

**5. Mini App Not Loading**
```
- Check frontend URL in BotFather
- Verify HTTPS certificate
- Test responsive design
```