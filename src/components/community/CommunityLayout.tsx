import { type ReactNode } from 'react';
import '@/styles/community.css';

interface CommunityLayoutProps {
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
  children: ReactNode;
}

export function CommunityLayout({ leftSidebar, rightSidebar, children }: CommunityLayoutProps) {
  return (
    <>
      {/* Subtle top gradient glow */}
      <div className="community-glow" />

      <div className="community-layout">
        {/* Left Sidebar */}
        <aside className="community-left-sidebar">
          {leftSidebar}
        </aside>

        {/* Main Feed */}
        <main className="min-w-0">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="community-right-sidebar">
          {rightSidebar}
        </aside>
      </div>
    </>
  );
}
