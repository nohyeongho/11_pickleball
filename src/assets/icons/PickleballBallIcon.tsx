import React from 'react';

interface PickleballBallIconProps {
  className?: string;
  size?: number;
}

export const PickleballBallIcon: React.FC<PickleballBallIconProps> = ({
  className = 'w-9 h-9',
  size = 40,
}) => {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="lgRedBallGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#D9144D" />
          <stop offset="60%" stopColor="#A50034" />
          <stop offset="100%" stopColor="#7E0027" />
        </radialGradient>
      </defs>
      {/* Outer Ball */}
      <circle cx="20" cy="20" r="18" fill="url(#lgRedBallGrad)" />
      {/* Pickleball Perforations in Crisp White */}
      <circle cx="14" cy="14" r="2.3" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="26" cy="13" r="2.3" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="20" cy="20" r="2.6" fill="#FFFFFF" fillOpacity="0.95" />
      <circle cx="13" cy="26" r="2.3" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="27" cy="26" r="2.3" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="20" cy="8" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="8" cy="20" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="32" cy="20" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="20" cy="32" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
    </svg>
  );
};
