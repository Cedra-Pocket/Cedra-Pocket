/**
 * Card/Equipment-related data models
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

/**
 * Card category types
 */
export type CardCategory = 'equipment' | 'mining' | 'infrastructure';

/**
 * Equipment card that provides earning bonuses
 */
export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: CardCategory;
  bonusRate: number; // additional tokens per hour
  cost: number;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  owned: boolean;
}

/**
 * Result of purchasing or upgrading a card
 */
export interface PurchaseResult {
  success: boolean;
  card: Card;
  newBalance: number;
  newEarningRate: number;
}
