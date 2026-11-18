import React from 'react';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'li';
  maxDegrees?: number;
  onMouseEnter?: () => void;
}

/**
 * Minimalist executive card container with crisp 1px border transitions
 * and zero heavy shadows or distracting tilt distortion.
 */
export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  as: Tag = 'div',
  onMouseEnter,
}) => {
  return (
    <Tag
      onMouseEnter={onMouseEnter}
      className={`relative transition-colors duration-200 ease-out ${className}`}
    >
      {children}
    </Tag>
  );
};
