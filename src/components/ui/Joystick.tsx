import React, { useRef, useState, useEffect } from 'react';

interface JoystickProps {
  onMove: (data: { x: number; y: number }) => void;
  size?: number;
}

export default function Joystick({ onMove, size = 120 }: JoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [isPulling, setIsPulling] = useState(false);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsPulling(true);
    handleMove(e);
  };

  const handleEnd = () => {
    setIsPulling(false);
    if (stickRef.current) {
        stickRef.current.style.transform = `translate(0px, 0px)`;
    }
    onMove({ x: 0, y: 0 });
  };

  const handleMove = (e: any) => {
    if (!isPulling || !containerRef.current || !stickRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxRadius = size / 2;

    if (distance > maxRadius) {
      deltaX = (deltaX / distance) * maxRadius;
      deltaY = (deltaY / distance) * maxRadius;
    }

    stickRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    
    // Normalize to -1 to 1
    onMove({
      x: deltaX / maxRadius,
      y: deltaY / maxRadius,
    });
  };

  useEffect(() => {
    if (isPulling) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isPulling]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none'
      }}
    >
      <div 
        ref={stickRef}
        style={{
          width: size / 2,
          height: size / 2,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          backdropFilter: 'blur(4px)',
          transition: isPulling ? 'none' : 'transform 0.1s ease-out'
        }}
      />
    </div>
  );
}
