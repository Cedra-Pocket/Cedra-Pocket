import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

function generateRandomCode(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// --- API LOGIN ---
app.post('/auth/telegram', async (req, res) => {
  const { initData } = req.body;

  if (!initData) return res.status(400).json({ error: 'Thiếu initData' });

  try {
    // 1. Parse dữ liệu
    const urlParams = new URLSearchParams(initData);
    const userStr = urlParams.get('user');
    const startParam = urlParams.get('start_param');

    // === 🔍 LOG CHECK (Bắt buộc phải thấy dòng này trong Terminal) ===
    console.log('------------------------------------------------');
    console.log('🔍 [DEBUG] InitData Raw:', initData);
    console.log(
      '🔍 [DEBUG] Mã Ref tách được:',
      startParam ? `'${startParam}'` : 'KHÔNG CÓ',
    );
    console.log('------------------------------------------------');
    // ==============================================================

    if (!userStr) return res.status(400).json({ error: 'Thiếu user info' });

    const userData = JSON.parse(userStr);
    const telegramId = userData.id.toString();
    const username = userData.username || userData.first_name;

    const result = await prisma.$transaction(async (tx) => {
      let referrerId: bigint | null = null;

      const existingUser = await tx.users.findUnique({
        where: { telegram_id: telegramId },
      });

      // Logic User Mới + Có Mã Giới Thiệu
      if (!existingUser && startParam) {
        // Trim() để xóa khoảng trắng thừa nếu có
        const cleanCode = startParam.trim();

        const referrer = await tx.users.findUnique({
          where: { referral_code: cleanCode },
        });

        if (referrer) {
          referrerId = referrer.id;
          console.log(
            `✅ [SUCCESS] Tìm thấy người giới thiệu: ${referrer.username} (ID: ${referrer.id})`,
          );
        } else {
          console.log(
            `⚠️ [WARNING] Mã giới thiệu '${cleanCode}' không tồn tại trong DB!`,
          );
        }
      } else if (existingUser) {
        console.log('ℹ️ [INFO] User cũ đăng nhập lại, bỏ qua check ref.');
      }

      const user = await tx.users.upsert({
        where: { telegram_id: telegramId },
        update: { username, updated_at: new Date() },
        create: {
          telegram_id: telegramId,
          username,
          referrer_id: referrerId,
          referral_code: generateRandomCode(8),
          current_rank: 'BRONZE',
          total_points: 0,
          is_wallet_connected: false,
        },
      });
      return user;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
