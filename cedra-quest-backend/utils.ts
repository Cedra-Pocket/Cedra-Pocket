import crypto from 'crypto';
import dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Hàm kiểm tra tính hợp lệ của dữ liệu từ Telegram
function verifyTelegramWebAppData(telegramInitData: string): boolean {
  if (!BOT_TOKEN) throw new Error('BOT_TOKEN chưa được cấu hình trong .env');

  // 1. Parse dữ liệu dạng query string
  const urlParams = new URLSearchParams(telegramInitData);

  // 2. Lấy hash ra và xóa khỏi danh sách tham số để chuẩn bị check
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  if (!hash) return false;

  // 3. Sắp xếp các tham số theo bảng chữ cái (a->z)
  // Telegram yêu cầu format: key=value\nkey2=value2
  const dataCheckString = Array.from(urlParams.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // 4. Tạo Secret Key bằng HMAC-SHA256 với Bot Token
  // Khóa bí mật là string "WebAppData"
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();

  // 5. Tính toán hash từ dataCheckString và so sánh với hash gốc
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
}
