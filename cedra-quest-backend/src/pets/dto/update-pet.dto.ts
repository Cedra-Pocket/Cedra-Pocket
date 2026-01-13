export class UpdatePetDto {
  level?: number;
  exp?: number;
  maxExp?: number;
  hunger?: number;
  happiness?: number;
  lastCoinTime?: Date;
  pendingCoins?: number;
}

export class ClaimCoinsDto {
  coins: number;
}
