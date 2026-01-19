# Cedra Quest Game Economy Implementation Plan

## Overview
Implement complete game economy system with Pet management, Energy system, Ranking, and Game Cycles.

## Phase 1: Database Schema Updates

### 1.1 Update Prisma Schema
Add new tables for game economy:

```prisma
// Game Cycles Configuration (Admin managed)
model GameCycle {
  id           Int      @id @default(autoincrement())
  cycleNumber  Int      @unique
  growthRate   Decimal  @db.Decimal(10, 4)
  maxSpeedCap  Decimal  @db.Decimal(10, 4)
  startDate    DateTime
  endDate      DateTime
  isActive     Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("game_cycles")
}

// User Energy System
model UserEnergy {
  id            Int      @id @default(autoincrement())
  userId        BigInt   @unique
  currentEnergy Int      @default(10)
  maxEnergy     Int      @default(10)
  lastUpdate    DateTime @default(now())
  
  user          users    @relation(fields: [userId], references: [telegram_id], onDelete: Cascade)

  @@map("user_energy")
}

// Pet Feeding History (Daily tracking)
model PetFeedingLog {
  id              Int      @id @default(autoincrement())
  userId          BigInt
  pointsSpent     Int
  xpGained        Int
  feedDate        String   // "2024-01-20" format
  totalDailySpent Int      // Running total for the day
  createdAt       DateTime @default(now())

  user            users    @relation(fields: [userId], references: [telegram_id], onDelete: Cascade)

  @@unique([userId, feedDate])
  @@map("pet_feeding_logs")
}

// Game Sessions (Mini-game plays)
model GameSession {
  id          Int      @id @default(autoincrement())
  userId      BigInt
  gameType    String   // "arcade", "puzzle", etc.
  score       Int
  pointsEarned Int
  energyUsed  Int      @default(1)
  duration    Int?     // seconds
  createdAt   DateTime @default(now())

  user        users    @relation(fields: [userId], references: [telegram_id], onDelete: Cascade)

  @@map("game_sessions")
}
```

### 1.2 Update Users Table
Add new fields to existing users table:

```prisma
model users {
  // ... existing fields ...
  
  // Pet System
  petLevel         Int      @default(1)
  petCurrentXp     Int      @default(0)
  petLastClaimTime DateTime @default(now())
  
  // Points System
  lifetimePoints   BigInt   @default(0) // For ranking, never decreases
  
  // Relations
  energy           UserEnergy?
  feedingLogs      PetFeedingLog[]
  gameSessions     GameSession[]
}
```

## Phase 2: Core Services Implementation

### 2.1 Game Cycle Service
Manages game cycles and difficulty adjustments.

### 2.2 Pet Service
Handles pet feeding, XP calculation, level up, and mining rewards.

### 2.3 Energy Service
Manages energy consumption and regeneration.

### 2.4 Game Service
Handles mini-game sessions and point rewards.

### 2.5 Ranking Service
Calculates user ranks based on lifetime points.

## Phase 3: API Endpoints

### Pet Management
- `GET /pet/status` - Get pet info and pending rewards
- `POST /pet/feed` - Feed pet (spend points for XP)
- `POST /pet/claim` - Claim mining rewards
- `POST /pet/level-up` - Level up pet (blockchain transaction)

### Energy System
- `GET /energy/status` - Get current energy
- `POST /energy/refill` - Buy energy with points

### Game System
- `POST /game/play` - Start game session (consume energy)
- `POST /game/complete` - Complete game and earn points

### Ranking
- `GET /ranking/leaderboard` - Get top players
- `GET /ranking/user/:id` - Get user rank info

## Phase 4: Business Logic Implementation

### 4.1 Pet Feeding Logic
```typescript
// Daily feeding limits
const FEED_COST = 20; // points per feed
const MAX_DAILY_SPEND = 600; // points per day
const XP_PER_FEED = 20; // XP gained per feed
const XP_FOR_LEVEL_UP = 1200; // XP needed for next level

// Feeding validation
- Check daily spend limit
- Validate user has enough points
- Update pet XP
- Track feeding history
```

### 4.2 Mining Reward Logic
```typescript
// Mining calculation
const calculateMiningReward = (level, elapsedTime, cycleGrowthRate) => {
  const maxTime = 4 * 60 * 60 * 1000; // 4 hours in ms
  const effectiveTime = Math.min(elapsedTime, maxTime);
  const pointsPerHour = level * cycleGrowthRate;
  return (effectiveTime / (60 * 60 * 1000)) * pointsPerHour;
};
```

### 4.3 Energy Regeneration Logic
```typescript
// Energy regeneration
const ENERGY_REGEN_INTERVAL = 30 * 60 * 1000; // 30 minutes
const ENERGY_REGEN_THRESHOLD = 5; // Only regen if energy < 5

// Calculate energy to add based on time elapsed
const calculateEnergyRegen = (lastUpdate, currentEnergy, maxEnergy) => {
  if (currentEnergy >= ENERGY_REGEN_THRESHOLD) return 0;
  
  const elapsed = Date.now() - lastUpdate.getTime();
  const intervalsElapsed = Math.floor(elapsed / ENERGY_REGEN_INTERVAL);
  const energyToAdd = Math.min(intervalsElapsed, maxEnergy - currentEnergy);
  
  return energyToAdd;
};
```

### 4.4 Ranking System Logic
```typescript
// Rank thresholds based on lifetime points
const RANK_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 10000,
  GOLD: 50000,
  PLATINUM: 200000,
  DIAMOND: 1000000,
  LEVIATHAN: 5000000
};

const calculateRank = (lifetimePoints) => {
  for (const [rank, threshold] of Object.entries(RANK_THRESHOLDS).reverse()) {
    if (lifetimePoints >= threshold) return rank;
  }
  return 'BRONZE';
};
```

## Phase 5: Security & Anti-Cheat

### 5.1 Server-Side Time Validation
- All time calculations use server timestamp
- Validate time differences for suspicious activity
- Rate limiting on sensitive endpoints

### 5.2 Concurrency Control
- Database transactions for critical operations
- Optimistic locking for pet feeding
- Request deduplication for level-up operations

### 5.3 Input Validation
- Validate all numeric inputs
- Check business rule constraints
- Sanitize user inputs

## Phase 6: Testing Strategy

### 6.1 Unit Tests
- Pet feeding logic
- Energy regeneration
- Mining reward calculation
- Ranking system

### 6.2 Integration Tests
- Complete pet feeding flow
- Game session flow
- Level up process

### 6.3 Load Testing
- Concurrent pet feeding
- Energy regeneration under load
- Database performance

## Implementation Priority

1. **High Priority**: Pet System (core passive income)
2. **Medium Priority**: Energy System (active income)
3. **Medium Priority**: Game Sessions
4. **Low Priority**: Advanced ranking features
5. **Low Priority**: Admin cycle management

## Estimated Timeline

- Phase 1 (Schema): 1 day
- Phase 2 (Services): 3 days
- Phase 3 (APIs): 2 days
- Phase 4 (Business Logic): 2 days
- Phase 5 (Security): 1 day
- Phase 6 (Testing): 2 days

**Total: ~11 days**

## Dependencies

- Existing authentication system ✅
- Database setup ✅
- Blockchain integration (for level-up transactions)
- Frontend integration points

## Success Metrics

- Pet feeding retention rate
- Energy consumption patterns
- Point economy balance
- User progression rates
- Server performance under load