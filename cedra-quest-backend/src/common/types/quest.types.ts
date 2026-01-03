export enum QuestType {
  SOCIAL = 'SOCIAL',
  ONCHAIN = 'ONCHAIN',
}

export enum QuestStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CLAIMED = 'CLAIMED',
}

export enum QuestFrequency {
  ONCE = 'ONCE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

export enum RewardType {
  POINT = 'POINT',
  TOKEN = 'TOKEN',
  NFT = 'NFT',
}

export interface SocialQuestConfig {
  platform: 'twitter' | 'telegram';
  action: 'follow' | 'like' | 'retweet' | 'join_channel' | 'join_group';
  target_id?: string; // Twitter handle hoặc Telegram channel ID
  url?: string;
}

export interface OnchainQuestConfig {
  chain_id: number;
  contract_address?: string;
  token_symbol?: string;
  min_amount?: string;
  action: 'hold' | 'swap' | 'stake' | 'transfer';
  duration_hours?: number;
}