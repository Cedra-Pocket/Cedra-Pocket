# Hướng dẫn lấy initData thật từ Telegram Mini App

## Bước 1: Tạo Telegram Bot

1. Mở Telegram và tìm @BotFather
2. Gửi `/newbot` để tạo bot mới
3. Đặt tên và username cho bot
4. Copy **Bot Token** và thay thế trong file `.env`:
   ```
   TELEGRAM_BOT_TOKEN="YOUR_REAL_BOT_TOKEN_HERE"
   ```

## Bước 2: Tạo Telegram Mini App

1. Gửi `/newapp` cho @BotFather
2. Chọn bot vừa tạo
3. Đặt tên cho Mini App
4. Tạo file HTML đơn giản để test:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Cedra Quest Test</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <h1>Cedra Quest Test App</h1>
    <button onclick="getInitData()">Get InitData</button>
    <div id="result"></div>
    
    <script>
        function getInitData() {
            const initData = window.Telegram.WebApp.initData;
            document.getElementById('result').innerHTML = 
                '<h3>InitData:</h3><textarea rows="10" cols="80">' + initData + '</textarea>';
            console.log('InitData:', initData);
        }
        
        // Auto get initData when page loads
        window.onload = function() {
            if (window.Telegram && window.Telegram.WebApp) {
                getInitData();
            }
        }
    </script>
</body>
</html>
```

## Bước 3: Deploy Mini App

1. Upload file HTML lên hosting (GitHub Pages, Netlify, Vercel, etc.)
2. Gửi URL cho @BotFather với `/setmenubutton`
3. Hoặc tạo inline keyboard với URL

## Bước 4: Lấy InitData

1. Mở Mini App từ Telegram
2. Copy initData từ textarea hoặc console
3. Thay thế trong file `test-real-telegram.js`:
   ```javascript
   const REAL_INIT_DATA = 'YOUR_COPIED_INIT_DATA_HERE';
   ```

## Bước 5: Test

```bash
node test-real-telegram.js
```

## Ví dụ InitData thật

InitData sẽ có dạng như này:
```
user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22%2C%22username%22%3A%22john_doe%22%2C%22language_code%22%3A%22en%22%7D&chat_instance=-123456789&chat_type=private&auth_date=1642680000&hash=abc123def456...
```

## Lưu ý bảo mật

- ⚠️ **KHÔNG** commit bot token vào git
- ⚠️ **KHÔNG** chia sẻ initData với người khác
- ✅ Sử dụng environment variables cho production
- ✅ InitData có thời hạn (5 phút), cần lấy mới nếu hết hạn

## Troubleshooting

### Lỗi "Invalid Telegram signature"
- Kiểm tra bot token có đúng không
- Kiểm tra initData có bị cắt cụt không
- Đảm bảo initData được lấy từ Mini App thật, không phải mock

### Lỗi "Telegram auth data is too old"
- InitData chỉ có hiệu lực 5 phút
- Lấy initData mới từ Mini App

### Lỗi "User data not found in initData"
- Kiểm tra initData có chứa thông tin user không
- Đảm bảo Mini App được mở từ Telegram, không phải browser trực tiếp