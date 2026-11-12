import React, { useState, useRef, useEffect } from 'react';
import { calculateCardTilt } from '../utils/validation';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'li';
  maxDegrees?: number;
  onMouseEnter?: () => void;
}

export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  as: Tag = 'div',
  maxDegrees = 6.5,
  onMouseEnter,
}) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const [tiltState, setTiltState] = useState<{
    rotateX: number;
    rotateY: number;
    glowX: number;
    glowY: number;
    isHovered: boolean;
  }>({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    isHovered: false,
  });

  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    setCanTilt(!reducedMotion && !isTouch);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;
    const { rotateX, rotateY, glowX, glowY } = calculateCardTilt(normX, normY, maxDegrees);

    setTiltState({
      rotateX,
      rotateY,
      glowX,
      glowY,
      isHovered: true,
    });
  };

  const handleMouseEnter = () => {
    if (onMouseEnter) onMouseEnter();
    if (!canTilt) return;
    setTiltState((prev) => ({ ...prev, isHovered: true }));
  };

  const handleMouseLeave = () => {
    if (!canTilt) return;
    setTiltState({
      rotateX: 0,
      rotateY: 0,
      glowX: 50,
      glowY: 50,
      isHovered: false,
    });
  };

  const transformStyle: React.CSSProperties | undefined = canTilt
    ? {
        transform: tiltState.isHovered
          ? `perspective(1000px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) translateZ(0)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)',
        transformStyle: 'preserve-3d',
      }
    : undefined;

  const highlightStyle: React.CSSProperties | undefined =
    canTilt && tiltState.isHovered
      ? {
          background: `radial-gradient(380px circle at ${tiltState.glowX}% ${tiltState.glowY}%, rgba(138, 106, 59, 0.10), rgba(251, 248, 243, 0) 70%)`,
        }
      : undefined;

  return (
    <Tag
      ref={cardRef as React.RefObject<any>}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`relative transition-[transform,box-shadow,border-color] duration-250 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        tiltState.isHovered
          ? 'shadow-[0_16px_34px_-10px_rgba(43,33,24,0.14),0_4px_12px_-2px_rgba(138,106,59,0.10)] border-[#8A6A3B]/55'
          : ''
      } ${className}`}
    >
      {/* Moving 3D Specular Highlight Layer */}
      {canTilt && (
        <div
          aria-hidden="true"
          style={highlightStyle}
          className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-250 ${
            tiltState.isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {children}
    </Tag>
  );
};
