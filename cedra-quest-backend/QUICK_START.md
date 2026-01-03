# 🚀 Quick Start Guide - Chạy Cedra Quest trong 15 phút

## 📋 Chuẩn bị

### Yêu cầu:
- ✅ Node.js 18+ đã cài đặt
- ✅ Tài khoản Telegram
- ✅ Tài khoản Railway/Heroku (free tier)
- ✅ Tài khoản Vercel/Netlify (free tier)

## 🎯 Bước 1: Tạo Telegram Bot (2 phút)

### 1.1 Tạo Bot
```
1. Mở Telegram → Tìm @BotFather
2. Gửi: /newbot
3. Tên: Cedra Quest Bot
4. Username: cedra_quest_bot (hoặc tên khác)
5. Lưu Bot Token: 123456789:ABCDEF...
```

### 1.2 Cấu hình Commands
```
Gửi: /setcommands
Chọn bot → Paste:

start - 🎮 Khởi động game
help - ❓ Hướng dẫn
profile - 👤 Xem profile
```

## 🔧 Bước 2: Deploy Backend (5 phút)

### 2.1 Chuẩn bị Environment
```bash
# Copy .env template
cp .env .env.production

# Cập nhật TELEGRAM_BOT_TOKEN
nano .env.production
```

### 2.2 Deploy lên Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login và setup
railway login
railway init
railway add postgresql
railway add redis

# Set environment variables
railway variables set TELEGRAM_BOT_TOKEN=your_bot_token
railway variables set JWT_SECRET=your_super_secret_key

# Deploy
railway up
```

### 2.3 Setup Database
```bash
# Sau khi deploy thành công
npx prisma db push
npm run prisma:seed
```

## 📱 Bước 3: Deploy Frontend (5 phút)

### 3.1 Tạo React App
```bash
# Tạo app mới
npx create-react-app cedra-quest-frontend
cd cedra-quest-frontend

# Install dependencies
npm install @telegram-apps/sdk axios

# Copy template code
cp -r ../frontend-template/src/* ./src/
```

### 3.2 Cấu hình API URL
```bash
# Tạo .env.local
echo "REACT_APP_API_URL=https://your-backend-url.railway.app" > .env.local
```

### 3.3 Deploy lên Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Build và deploy
npm run build
vercel --prod
```

## 🤖 Bước 4: Cấu hình Mini App (2 phút)

### 4.1 Tạo Mini App
```
1. Gửi /newapp cho @BotFather
2. Chọn bot vừa tạo
3. Tên: Cedra Quest
4. Mô tả: Complete quests and earn rewards
5. URL: https://your-frontend-url.vercel.app
```

### 4.2 Upload Icon
- Tải icon 512x512 PNG
- Upload qua @BotFather

## ✅ Bước 5: Test (1 phút)

### 5.1 Test Backend
```bash
curl https://your-backend-url.railway.app/health
curl https://your-backend-url.railway.app/test/quests
```

### 5.2 Test Frontend
```
1. Tìm bot trong Telegram
2. Gửi /start
3. Click "Open App"
4. Kiểm tra authentication
5. Test quest verification
```

## 🎉 Hoàn thành!

Bây giờ bạn đã có:
- ✅ Backend API chạy trên Railway
- ✅ Frontend Mini App trên Vercel  
- ✅ Telegram Bot hoạt động
- ✅ Database với sample quests
- ✅ Authentication flow hoàn chỉnh

## 🔧 Troubleshooting

### Lỗi thường gặp:

**1. "Invalid Telegram data"**
```
- Kiểm tra TELEGRAM_BOT_TOKEN
- Đảm bảo mở app trong Telegram
- Check console logs
```

**2. "CORS Error"**
```
- Verify frontend URL trong backend CORS
- Check HTTPS/HTTP
- Restart backend sau khi update CORS
```

**3. "Database connection failed"**
```
- Check DATABASE_URL
- Verify Railway database service
- Run: railway connect postgresql
```

**4. "Mini App not loading"**
```
- Check frontend URL trong @BotFather
- Verify HTTPS certificate
- Test responsive design
```

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `railway logs`
2. Test API: `curl backend-url/health`
3. Check browser console
4. Verify environment variables

## 🚀 Next Steps

1. **Customize Quests** - Thêm quest mới
2. **Social Integration** - Setup Twitter/Telegram API
3. **Blockchain Features** - Tích hợp wallet
4. **Analytics** - Track user behavior
5. **Notifications** - Setup push notifications

Chúc mừng! Bạn đã có một Telegram Mini App hoàn chỉnh! 🎉