import React, { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

export const MagneticCursor = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add trail effect
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.cssText = `
        position: fixed;
        pointer-events: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1));
        border: 2px solid rgba(99, 102, 241, 0.5);
        left: ${e.clientX - 10}px;
        top: ${e.clientY - 10}px;
        animation: cursor-fade 1s ease-out forwards;
        z-index: 9999;
      `;
      document.body.appendChild(trail);
      trailRef.current.push(trail);
      
      // Clean up old trails
      if (trailRef.current.length > 10) {
        const oldTrail = trailRef.current.shift();
        if (oldTrail.parentNode) {
          oldTrail.remove();
        }
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Clean up trails
      trailRef.current.forEach(trail => {
        if (trail.parentNode) {
          trail.remove();
        }
      });
    };
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-50 transition-all duration-100 ease-out ${isClicking ? 'scale-0.8' : ''} ${isHovering ? 'scale-1.5' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      >
        <div
          className={`w-10 h-10 rounded-full border-2 border-indigo-500 transition-all duration-300 ${
            isHovering ? 'scale-150 bg-indigo-500/20 shadow-neon' : 'scale-100 bg-transparent'
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-indigo-500 transition-all duration-300 ${
            isHovering ? 'scale-0' : 'scale-100'
          }`}
          style={{
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      
      {/* Enhanced trail effect */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-40 cursor-trail"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            opacity: (5 - i) * 0.15,
            transition: `all ${0.1 * (i + 1)}s ease-out`,
            width: `${20 - i * 2}px`,
            height: `${20 - i * 2}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(99, 102, 241, ${0.3 - i * 0.05}), rgba(99, 102, 241, ${0.1 - i * 0.02}))`,
            border: `${2 - i * 0.2}px solid rgba(99, 102, 241, ${0.5 - i * 0.1})`
          }}
        />
      ))}
      
      {/* Glow effect */}
      <div
        className="fixed pointer-events-none z-30"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isHovering ? 0.6 : 0,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        <div
          className="w-20 h-20 rounded-full bg-indigo-500/20"
          style={{
            filter: 'blur(20px)',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </>
  );
};
