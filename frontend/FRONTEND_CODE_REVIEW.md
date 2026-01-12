# Frontend Code Review - Cedra Quest

## Tổng quan

Frontend được xây dựng với:
- **Next.js 16.1.1** - React framework với App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **TailwindCSS 4** - Styling
- **Zustand 5** - State management
- **Telegram Apps SDK** - Telegram Mini App integration
- **wagmi/viem** - Web3 wallet connection

---

## 📁 Cấu trúc thư mục

```
frontend/src/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── friends/           # Màn hình bạn bè/referral
│   ├── game/              # Màn hình game
│   ├── home/              # Màn hình chính
│   ├── layout/            # Layout components
│   ├── leaderboard/       # Bảng xếp hạng
│   ├── profile/           # Hồ sơ người dùng
│   ├── providers/         # Context providers
│   ├── quest/             # Màn hình nhiệm vụ
│   ├── reward/            # Phần thưởng
│   ├── shared/            # Components dùng chung
│   ├── spin/              # Vòng quay may mắn
│   └── wallet/            # Ví điện tử
├── hooks/                  # Custom React hooks
├── models/                 # TypeScript interfaces
├── services/              # API & business logic
└── store/                 # Zustand state management
```

---

## 📱 App Router (`src/app/`)

### `layout.tsx`
**Mục đích:** Root layout cho toàn bộ ứng dụng

**Chức năng:**
- Cấu hình font Bricolage Grotesque từ Google Fonts
- Setup viewport cho mobile (không cho zoom, safe area)
- Load Telegram Web App script
- Wrap app với 3 providers: ErrorBoundaryProvider → TelegramProvider → OfflineProvider
- Background image và theme color (#0a0a1a)

**Code quan trọng:**
```tsx
// Viewport config cho Telegram Mini App
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,  // Không cho zoom
  viewportFit: "cover",
  themeColor: "#0a0a1a",
};
```

---

### `page.tsx`
**Mục đích:** Trang chính của ứng dụng (Home page)

**Chức năng:**
- Quản lý navigation giữa các tab (home, quest, spin, wallet, game)
- Hiển thị thông tin user (username, level, XP, token balance)
- Leaderboard modal với data từ backend
- Hash-based routing (#home, #quest, etc.)

**State:**
- `showLeaderboard` - Hiển thị modal bảng xếp hạng
- `leaderboardData` - Dữ liệu top 20 players
- `userRank` - Thứ hạng của user hiện tại

**Flow:**
1. Check Telegram initialization
2. Load user data từ store
3. Render màn hình theo `activeTab`
4. BottomNavigation để chuyển tab

---

## 🧩 Components

### Layout Components (`components/layout/`)

#### `AppLayout.tsx`
- Wrapper layout với bottom navigation
- Safe area insets cho mobile
- Ocean blue gradient background

#### `BottomNavigation.tsx`
**Mục đích:** Navigation bar ở dưới màn hình

**Đặc điểm:**
- 5 tabs: Quest, Spin, Home (center), Wallet, Game
- Home button nổi lên giữa với gradient cyan
- Split nav bars (trái/phải) với glassmorphism
- Haptic feedback khi tap
- Active tab indicator

#### `TopHeader.tsx`
- Header với avatar, username
- Level và XP progress bar
- Glassmorphism với clip-path notch

---

### Provider Components (`components/providers/`)

#### `TelegramProvider.tsx`
**Mục đích:** Quản lý Telegram SDK và authentication

**Chức năng:**
1. Initialize Telegram WebApp SDK
2. Lấy user data từ `initDataUnsafe`
3. Authenticate với backend (`/auth/verify`)
4. Handle back button navigation
5. Sync balance giữa local và backend

**Context value:**
```typescript
interface TelegramContextValue {
  isInitialized: boolean;
  isAvailable: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  user: TelegramUser | null;
  triggerHapticFeedback: (type) => void;
  closeApp: () => void;
  shareReferralLink: (link) => void;
  retryAuth: () => Promise<void>;
}
```

#### `OfflineProvider.tsx`
**Mục đích:** Xử lý offline mode

**Chức năng:**
- Detect online/offline status
- Auto-sync khi reconnect
- Hiển thị banner offline/online
- Pending actions indicator

#### `ErrorBoundaryProvider.tsx`
- Wrap app với ErrorBoundary
- Log errors (có thể gửi đến Sentry)
- Hiển thị fallback UI khi có lỗi

---

### Home Components (`components/home/`)

#### `HeroSection.tsx`
**Mục đích:** Hiển thị mascot và animations

**Animations:**
- Light rays (tia sáng hội tụ)
- Bubbles floating up
- Glow effect behind mascot
- Fish swimming (conca1, conca2, conca3)
- Seaweed wave (rongbien)
- Crab walking (cua)
- Mascot breathing animation

#### `TokenBalance.tsx`
- Hiển thị số token/gem
- Format số lớn (K, M)
- Earning rate badge (+X/hr)

#### `LevelBadge.tsx`
- Level indicator (LVL X/Y)
- XP progress bar

#### `FloatingActions.tsx`
- Upgrade và Play buttons
- Haptic feedback on tap

---

### Quest Components (`components/quest/`)

#### `QuestScreen.tsx`
**Mục đích:** Màn hình danh sách nhiệm vụ

**Chức năng:**
1. Load quests từ backend (`/quests` hoặc `/test/quests`)
2. Filter theo type (daily, social, achievement)
3. Hiển thị progress bar tổng
4. Handle quest verification

**Flow verify quest:**
```
User tap quest → Check authenticated → 
  Yes: Call API /quests/:id/verify → Update local state → Add reward
  No: Mark completed locally (demo mode)
```

#### `QuestCard.tsx`
**Mục đích:** Card hiển thị 1 quest

**Features:**
- Icon theo quest type (🐦 social, 🎁 daily, 👥 referral, 🏆 achievement)
- Reward badge (🪙 +amount)
- Claim button khi completed
- Detail modal khi tap
- Locked state (opacity 60%)

---

### Spin Components (`components/spin/`)

#### `SpinScreen.tsx`
**Mục đích:** Vòng quay may mắn

**Wheel segments:** 8 phần với rewards khác nhau (10-500 coins)

**Logic quay:**
1. Random chọn segment trúng thưởng
2. Tính góc quay (5-8 vòng + góc đến segment)
3. CSS transition 4s với cubic-bezier
4. Sau 4s: hiển thị kết quả, cộng điểm, sync backend

**Sync với backend:**
```typescript
if (backendAPI.isAuthenticated()) {
  const updatedUser = await backendAPI.addPoints(prize.value);
  setUser({ ...user, tokenBalance: Number(updatedUser.total_points) });
}
```

---

### Wallet Components (`components/wallet/`)

#### `WalletScreen.tsx`
**Mục đích:** Quản lý ví và balance

**Chức năng:**
- Hiển thị points balance
- Input wallet address
- Connect wallet (gọi API `/users/connect-wallet`)
- Disconnect wallet
- Hiển thị Game Coins

---

### Game Components (`components/game/`)

#### `GameScreen.tsx`
**Mục đích:** Danh sách games

**Features:**
- Category filter (All, Arcade, Puzzle, Sport, Action, Casual)
- Featured games carousel (drag to scroll)
- Trending games list (15 games)
- Play button (hiện tại chỉ alert)

---

### Shared Components (`components/shared/`)

#### `GlassCard.tsx`
- Glassmorphism card với backdrop blur
- Optional onClick với hover effects

#### `GradientButton.tsx`
- 3 variants: primary (green), secondary (blue), accent (purple-pink)
- Loading state với spinner
- Disabled state

#### `LoadingSpinner.tsx`
- 3 sizes: sm, md, lg
- Cyan accent color

#### `ProgressBar.tsx`
- 3 heights: sm, md, lg
- 3 colors: primary, accent, success
- Optional percentage display

#### `ErrorBoundary.tsx`
- Class component catch errors
- Fallback UI với retry button
- ScreenErrorFallback, NetworkErrorFallback, NotFoundFallback

#### `Skeleton.tsx`
- Loading skeletons cho các screens
- HomeScreenSkeleton, QuestScreenSkeleton, etc.

---

## 🪝 Hooks (`src/hooks/`)

### `useAuth.ts`
**Mục đích:** Authentication logic

```typescript
interface UseAuthReturn {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  authenticate: (initData, telegramUser?) => Promise<boolean>;
  logout: () => void;
}
```

### `useNetworkStatus.ts`
**Mục đích:** Track online/offline

```typescript
interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;  // Đã từng offline (để trigger sync)
}
```

### `useQuests.ts`
**Mục đích:** Fetch và manage quests

```typescript
interface UseQuestsReturn {
  quests: Quest[];
  isLoading: boolean;
  error: string | null;
  fetchQuests: () => Promise<void>;
  verifyQuest: (questId) => Promise<{ success, message }>;
  refetch: () => Promise<void>;
}
```

---

## 📦 Models (`src/models/`)

### `user.ts`
```typescript
interface UserData {
  id: string;
  telegramId: string;
  username: string;
  avatarUrl?: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  tokenBalance: number;
  gemBalance: number;
  earningRate: number;
  walletAddress?: string;
  lastDailyClaim?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
}
```

### `quest.ts`
```typescript
type QuestType = 'social' | 'daily' | 'achievement' | 'referral';
type QuestStatus = 'active' | 'completed' | 'locked';

interface Quest {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  type: QuestType;
  status: QuestStatus;
  progress: number;  // 0-100
  currentValue: number;
  targetValue: number;
  reward: QuestReward;
  expiresAt?: Date;
}
```

### `wallet.ts`
```typescript
interface WalletState {
  connected: boolean;
  address?: string;
  chainId?: number;
  connecting: boolean;
  error?: string;
}
```

### `reward.ts`, `leaderboard.ts`, `card.ts`, `friend.ts`
- Định nghĩa interfaces cho rewards, leaderboard entries, cards, friends

---

## 🔌 Services (`src/services/`)

### `backend-api.service.ts`
**Mục đích:** Gọi API backend

**Endpoints:**
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/verify` | Authenticate với initData |
| GET | `/users/profile` | Lấy profile user |
| POST | `/users/connect-wallet` | Kết nối ví |
| POST | `/users/add-points` | Cộng điểm |
| GET | `/quests` | Lấy danh sách quests |
| GET | `/test/quests` | Quests không cần auth |
| POST | `/quests/:id/verify` | Verify quest |
| GET | `/health` | Health check |

**Adapter methods:**
- `backendUserToUserData()` - Convert backend user → frontend format
- `backendQuestToQuest()` - Convert backend quest → frontend format

### `telegram.service.ts`
**Mục đích:** Telegram SDK wrapper

**Methods:**
- `initialize()` - Init SDK, call `ready()`
- `getUserData()` - Lấy user từ initDataUnsafe
- `triggerHapticFeedback(type)` - Rung (light/medium/heavy)
- `handleBackButton(callback)` - Handle nút back
- `closeApp()` - Đóng Mini App
- `shareReferralLink(link)` - Share qua Telegram

### `wallet.service.ts`
**Mục đích:** Web3 wallet connection

**Note:** Hiện tại là stub, cần integrate với wagmi hooks

### `storage.service.ts`
**Mục đích:** localStorage wrapper

**Features:**
- JSON serialization
- Prefix keys (`tg_mini_app_`)
- Error handling (quota exceeded)

### `offline-queue.service.ts`
**Mục đích:** Queue actions khi offline

**Action types:**
- CLAIM_REWARD
- CLAIM_DAILY_REWARD
- PURCHASE_CARD
- UPGRADE_CARD
- COMPLETE_QUEST

**Flow:**
1. Enqueue action khi offline
2. Save to localStorage
3. Auto-sync khi online
4. Retry up to 3 times

---

## 🗄️ Store (`src/store/`)

### `useAppStore.ts`
**Mục đích:** Global state với Zustand

**State sections:**
```typescript
interface AppState {
  // User
  user: UserData | null;
  isLoading: boolean;
  error: string | null;

  // Quests
  quests: Quest[];
  questsLoading: boolean;

  // Rewards
  rewards: Reward[];
  dailyReward: DailyRewardData | null;

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  leaderboardPage: number;
  hasMoreLeaderboard: boolean;

  // Cards
  cards: Card[];
  activeCardCategory: CardCategory;

  // Friends
  referralStats: ReferralStats | null;

  // Wallet
  wallet: WalletState;

  // Navigation
  activeTab: NavigationTab;

  // Spin
  spinsLeft: number;
}
```

**Persistence:**
- Lưu vào localStorage với key `tg-mini-app-storage`
- Persist: user, quests, rewards, dailyReward, cards, referralStats, wallet, activeTab, spinsLeft

**Selector hooks:**
```typescript
// Optimized selectors
export const useUser = () => useAppStore((state) => state.user);
export const useQuests = () => useAppStore((state) => state.quests);
export const useSpinsLeft = () => useAppStore((state) => state.spinsLeft);
// ... etc
```

**Action hooks:**
```typescript
export const useUserActions = () => {
  const setUser = useAppStore((state) => state.setUser);
  const updateBalance = useAppStore((state) => state.updateBalance);
  // ...
};
```

---

## 🎨 Styling

### `globals.css`
- TailwindCSS imports
- Custom CSS variables cho colors
- Glass card styles
- Animations (breathing, bubble, fish-swim, seaweed-wave, crab-walk)
- Hide scrollbar utility
- Safe area utilities

### Key CSS Classes:
```css
.glass-card          /* Glassmorphism card */
.btn-gradient-primary /* Gradient button */
.animate-breathing   /* Mascot breathing */
.animate-fish-swim-* /* Fish animations */
.hide-scrollbar      /* Hide scrollbar */
.safe-area-inset-*   /* Safe area padding */
```

---

## 🔄 Data Flow

### Authentication Flow:
```
App Load → TelegramProvider.initialize()
         → Get initData from Telegram WebApp
         → POST /auth/verify { initData }
         → Receive JWT + user data
         → Store JWT in localStorage
         → Convert to UserData format
         → setUser() in Zustand store
```

### Quest Completion Flow:
```
User tap Quest → QuestCard onClick
              → QuestScreen.handleQuestSelect()
              → Check isAuthenticated?
                 Yes → POST /quests/:id/verify
                     → Backend verify (Social/Onchain)
                     → Return success/fail
                     → Update local quest status
                     → Add reward to balance
                 No → Mark completed locally (demo)
```

### Spin Flow:
```
User tap SPIN → SpinScreen.spinWheel()
             → Check spinsLeft > 0
             → Random select winning segment
             → Calculate rotation angle
             → CSS transition 4s
             → After 4s:
                → Show result
                → updateBalance(prize)
                → decrementSpins()
                → Sync to backend (addPoints)
```

---

## ⚠️ Lưu ý quan trọng

1. **Telegram SDK phải load trước app** - Script trong `<head>` của layout.tsx

2. **JWT token lưu trong localStorage** - Key: `jwt_token`

3. **State persist trong localStorage** - Key: `tg-mini-app-storage`

4. **Offline support** - Actions được queue và sync khi online

5. **Haptic feedback** - Gọi `telegramService.triggerHapticFeedback()` khi user interact

6. **Safe area** - Sử dụng `safe-area-inset-*` classes cho notch/home indicator

7. **Hash routing** - Navigation dùng URL hash (#home, #quest, etc.)

---

## 🐛 Potential Issues

1. **Wallet service chưa hoàn thiện** - Cần integrate wagmi hooks

2. **Twitter verification chưa implement** - Backend return true placeholder

3. **Blockchain verification chưa implement** - Backend return true placeholder

4. **Game chưa có logic** - Chỉ có UI, click Play chỉ alert

5. **Cards/Equipment chưa có data** - Cần seed từ backend

6. **Referral system basic** - Chưa có commission tracking đầy đủ
