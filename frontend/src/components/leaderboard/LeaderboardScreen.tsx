'use client';

import { useEffect, useCallback, useState } from 'react';
import {
  useAppStore,
  useLeaderboard,
  useHasMoreLeaderboard,
  useUser,
} from '../../store/useAppStore';
import { LeaderboardList } from './LeaderboardList';
import { LoadingSpinner } from '../shared';

const LEADERBOARD_PAGE_SIZE = 20;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cedra-quest-backend.onrender.com';

// Fetch leaderboard from backend
async function fetchLeaderboard(page: number, limit: number) {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch');
    
    const users = await response.json();
    const sorted = users
      .sort((a: { total_points: number }, b: { total_points: number }) => 
        Number(b.total_points) - Number(a.total_points)
      );
    
    const totalCount = sorted.length;
    const startIndex = (page - 1) * limit;
    const entries = sorted
      .slice(startIndex, startIndex + limit)
      .map((u: { id: string; username: string; total_points: number }, i: number) => ({
        userId: String(u.id),
        username: u.username || `Player${startIndex + i + 1}`,
        xp: Number(u.total_points),
        level: Math.floor(Number(u.total_points) / 1000) + 1,
        rank: startIndex + i + 1,
      }));

    return {
      entries,
      totalCount,
      hasMore: startIndex + limit < totalCount,
    };
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return { entries: [], totalCount: 0, hasMore: false };
  }
}

/**
 * LeaderboardScreen component
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 * - 5.1: Display a ranked list of top players
 * - 5.2: Show rank position, user avatar, username, and XP/score
 * - 5.3: Highlight the user's own entry distinctly
 * - 5.4: Display the top 100 players sorted by XP descending
 * - 5.5: Load additional entries using infinite scroll pagination
 */
export function LeaderboardScreen() {
  const leaderboard = useLeaderboard();
  const hasMore = useHasMoreLeaderboard();
  const user = useUser();
  const { setLeaderboard, appendLeaderboard, setLeaderboardPage } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial leaderboard data
  useEffect(() => {
    const loadInitialLeaderboard = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const response = await fetchLeaderboard(1, LEADERBOARD_PAGE_SIZE);
        setLeaderboard(response.entries, response.hasMore);
        setLeaderboardPage(1);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };

    // Only load if we don't have leaderboard data yet
    if (leaderboard.length === 0) {
      loadInitialLeaderboard();
    } else {
      setInitialLoading(false);
    }
  }, []);

  // Handle load more for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const currentPage = Math.ceil(leaderboard.length / LEADERBOARD_PAGE_SIZE);
      const nextPage = currentPage + 1;
      const response = await fetchLeaderboard(nextPage, LEADERBOARD_PAGE_SIZE);
      appendLeaderboard(response.entries, response.hasMore);
    } catch (err) {
      console.error('Failed to load more leaderboard entries:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, leaderboard.length, appendLeaderboard]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchLeaderboard(1, LEADERBOARD_PAGE_SIZE);
      setLeaderboard(response.entries, response.hasMore);
      setLeaderboardPage(1);
    } catch (err) {
      console.error('Failed to refresh leaderboard:', err);
      setError('Failed to refresh leaderboard.');
    } finally {
      setLoading(false);
    }
  }, [setLeaderboard, setLeaderboardPage]);

  // Get current user ID for highlighting
  const currentUserId = user?.id ?? '';

  return (
    <div className="flex flex-col h-full px-6 pt-10">
      {/* Header */}
      <header className="mb-4 rounded-2xl bg-[#1a2d3d]/90 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
            <p className="text-base text-white/70">Top players ranked by XP</p>
          </div>
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={loading || initialLoading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            aria-label="Refresh leaderboard"
          >
            <svg
              className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Current user rank indicator */}
        {user && (
          <div className="mt-3 p-3 rounded-xl bg-accent-cyan/20 border border-accent-cyan/30">
            <p className="text-base text-white/80">
              Your Rank:{' '}
              <span className="font-bold text-accent-cyan">
                #{leaderboard.find((e) => e.userId === currentUserId)?.rank ?? '—'}
              </span>
            </p>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Initial loading state */}
        {initialLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-white/60">Loading leaderboard...</p>
          </div>
        )}

        {/* Error state */}
        {error && !initialLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg bg-accent-cyan text-white font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Leaderboard list */}
        {!initialLoading && !error && (
          <LeaderboardList
            entries={leaderboard}
            currentUserId={currentUserId}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default LeaderboardScreen;
