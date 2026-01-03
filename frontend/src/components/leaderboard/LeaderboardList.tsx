'use client';

import { useEffect, useRef, useCallback } from 'react';
import { LeaderboardEntry } from './LeaderboardEntry';
import { LoadingSpinner, EmptyState } from '../shared';
import type { LeaderboardEntry as LeaderboardEntryType } from '../../models';

export interface LeaderboardListProps {
  entries: LeaderboardEntryType[];
  currentUserId: string;
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
}

/**
 * LeaderboardList component
 * Renders a sorted list of leaderboard entries with infinite scroll pagination
 * Requirements: 5.1, 5.4, 5.5 - Display ranked list, top 100 sorted by XP, infinite scroll
 */
export function LeaderboardList({
  entries,
  currentUserId,
  onLoadMore,
  hasMore,
  loading = false,
}: LeaderboardListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Sort entries by XP descending (in case they aren't already sorted)
  const sortedEntries = [...entries].sort((a, b) => b.xp - a.xp);

  // Infinite scroll observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (sortedEntries.length === 0 && !loading) {
    return (
      <EmptyState
        title="No Rankings Yet"
        description="Be the first to climb the leaderboard!"
        icon="🏆"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2" data-testid="leaderboard-list">
      {sortedEntries.map((entry, index) => (
        <LeaderboardEntry
          key={entry.userId}
          entry={entry}
          isCurrentUser={entry.userId === currentUserId}
          rank={entry.rank || index + 1}
        />
      ))}

      {/* Load more trigger element */}
      <div ref={loadMoreRef} className="h-4" />

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="md" />
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && sortedEntries.length > 0 && (
        <p className="text-center text-white/50 text-sm py-4">
          You've reached the end of the leaderboard
        </p>
      )}
    </div>
  );
}

export default LeaderboardList;
