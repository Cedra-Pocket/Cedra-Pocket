'use client';

import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { useAppStore } from '../../store/useAppStore';

export interface AppLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

/**
 * AppLayout component
 * Requirements: 9.1, 9.5
 * - 9.1: Apply ocean blue gradient (light blue to deep blue) as the primary color scheme
 * - 9.5: Optimize layout for 390x844 pixel dimensions (mobile-first)
 * 
 * This component provides:
 * - Layout wrapper with bottom navigation
 * - Safe area insets for mobile devices
 * - Ocean blue gradient background
 */
export function AppLayout({ children, showNavigation = true }: AppLayoutProps) {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <div className="min-h-screen-safe flex flex-col bg-gradient-to-b from-bg-dark via-bg-mid to-bg-blue">
      {/* Safe area inset for top (notch, status bar) */}
      <div className="safe-area-inset-top" />
      
      {/* Main content area */}
      <main
        className={`
          flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar mx-8
          ${showNavigation ? 'pb-24' : ''}
        `}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNavigation && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
}

export default AppLayout;
