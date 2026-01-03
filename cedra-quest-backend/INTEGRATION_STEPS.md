# 🔧 Step-by-Step Integration Guide

## Bước 1: Setup Telegram Bot

### 1.1 Tạo Telegram Bot
```
1. Mở Telegram, tìm @BotFather
2. Gửi /newbot
3. Đặt tên bot: "Cedra Quest Bot"
4. Đặt username: "cedra_quest_bot"
5. Lưu Bot Token vào .env
```

### 1.2 Cấu hình Mini App
```
1. Gửi /newapp cho @BotFather
2. Chọn bot vừa tạo
3. Đặt tên app: "Cedra Quest"
4. Mô tả: "Complete quests and earn rewards"
5. Upload icon (512x512 PNG)
6. Đặt URL: https://your-frontend-domain.vercel.app
```

## Bước 2: Deploy Backend

### 2.1 Chuẩn bị Environment
```bash
# Cập nhật .env với production values
DATABASE_URL="your-production-db-url"
TELEGRAM_BOT_TOKEN="your-bot-token"
JWT_SECRET="your-super-secret-key"
REDIS_HOST="your-redis-host"
```

### 2.2 Deploy lên Railway/Heroku
```bash
# Railway
npm install -g @railway/cli
railway login
railway init
railway up

# Hoặc Heroku
npm install -g heroku
heroku create cedra-quest-backend
git push heroku main
```

## Bước 3: Tạo Frontend

### 3.1 Tạo React App
```bash
npx create-react-app cedra-quest-frontend
cd cedra-quest-frontend
npm install @telegram-apps/sdk axios
```

### 3.2 Copy code từ FRONTEND_INTEGRATION.md
- Copy tất cả components và utils
- Cập nhật API_BASE_URL với backend URL
- Test local trước khi deploy

### 3.3 Deploy Frontend
```bash
# Build
npm run build

# Deploy lên Vercel
npm install -g vercel
vercel --prod

# Hoặc Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## Bước 4: Test Integration

### 4.1 Test Backend APIs
```bash
# Health check
curl https://your-backend-url.railway.app/health

# Test quests
curl https://your-backend-url.railway.app/test/quests

# Test auth helper
curl https://your-backend-url.railway.app/test/auth
```

### 4.2 Test Frontend
```
1. Mở Telegram
2. Tìm bot của bạn
3. Gửi /start
4. Click "Open App"
5. Kiểm tra authentication flow
6. Test quest verification
```

## Bước 5: Production Setup

### 5.1 Database Migration
```bash
# Chạy migrations trên production DB
npx prisma db push
npm run prisma:seed
```

### 5.2 Redis Setup
```bash
# Setup Redis instance (Railway/Heroku Redis)
# Cập nhật REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
```

### 5.3 Monitoring
```bash
# Setup logging và monitoring
# Sentry, LogRocket, hoặc similar tools
```

## Bước 6: Social API Integration

### 6.1 Twitter API
```
1. Tạo Twitter Developer Account
2. Tạo App và lấy API keys
3. Cập nhật .env với Twitter credentials
4. Test Twitter verification
```

### 6.2 Telegram API
```
1. Cập nhật TELEGRAM_BOT_TOKEN
2. Test Telegram channel verification
3. Setup webhook cho notifications
```

## Bước 7: Blockchain Integration

### 7.1 Cedra Network Setup
```bash
# Install cedra-ts-sdk
npm install cedra-ts-sdk

# Cập nhật blockchain service
# Implement token balance checking
# Setup wallet connection
```

## Troubleshooting

### Common Issues:

**1. CORS Error:**
```
- Kiểm tra frontend domain trong CORS config
- Đảm bảo HTTPS cho production
```

**2. Authentication Failed:**
```
- Kiểm tra Bot Token
- Verify initData format
- Check JWT secret
```

**3. Database Connection:**
```
- Verify DATABASE_URL
- Check Prisma schema sync
- Run migrations
```

**4. Redis Connection:**
```
- Check Redis credentials
- Verify network access
- Test Redis connection
```

## Next Steps

1. **Load Testing** - Test với nhiều users
2. **Security Audit** - Review authentication flow
3. **Performance Optimization** - Database indexing, caching
4. **Feature Enhancement** - Thêm tính năng mới
5. **Analytics** - Track user behavior và quest completion

## Support

Nếu gặp vấn đề, check:
1. Server logs
2. Browser console
3. Network requests
4. Database queries
5. Redis queue status