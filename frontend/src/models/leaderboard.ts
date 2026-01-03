/**
 * Leaderboard-related data models
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

/**
 * A single entry in the leaderboard
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  rank: number;
}

/**
 * Paginated leaderboard response
 */
export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalCount: number;
  currentUserRank?: number;
  hasMore: boolean;
}
