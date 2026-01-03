import * as crypto from 'crypto';

export interface TelegramInitData {
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  auth_date: number;
  hash: string;
}

export function validateTelegramWebAppData(
  initData: string,
  botToken: string,
): TelegramInitData | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      return null;
    }

    // Remove hash from params for validation
    urlParams.delete('hash');
    
    // Sort parameters and create data string
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate expected hash
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (expectedHash !== hash) {
      return null;
    }

    // Parse user data
    const userData = urlParams.get('user');
    const authDate = parseInt(urlParams.get('auth_date') || '0');
    
    // Check if auth_date is not too old (24 hours)
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return null;
    }

    return {
      user: userData ? JSON.parse(userData) : undefined,
      auth_date: authDate,
      hash,
    };
  } catch (error) {
    return null;
  }
}