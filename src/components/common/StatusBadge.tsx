import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeStyle = 'badge-wait';

  if (status.includes('입금확인완료')) {
    badgeStyle = 'badge-ok';
  } else if (status === '취소됨') {
    badgeStyle = 'badge-cancel';
  } else if (status.includes('대기자')) {
    badgeStyle = 'badge-wait';
  } else if (status.startsWith('정상')) {
    badgeStyle = 'badge-wait';
  }

  return <span className={`badge ${badgeStyle} ${className}`}>{status}</span>;
};
