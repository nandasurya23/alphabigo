import React, { useMemo } from 'react';
import { sanitizeHtml } from '@/utils/security';

interface AdvisorCardProps {
  advisorText: string;
}

export const AdvisorCard: React.FC<AdvisorCardProps> = React.memo(({ advisorText }) => {
  const safeHtml = useMemo(() => sanitizeHtml(advisorText), [advisorText]);

  return (
    <div className="studio-card advisor-card" id="advisor-card">
      <div className="advisor-badge">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <span>OPTIMASI PENDAPATAN HOST</span>
      </div>
      <p
        id="advisor-text"
        className="advisor-text"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </div>
  );
});

AdvisorCard.displayName = 'AdvisorCard';
