import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  // Detect touch device — render nothing on touch
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const targetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const trailRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const rafRef = useRef(null);

  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [trailX, setTrailX] = useState(0);
  const [trailY, setTrailY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Hide OS cursor on mount, restore on unmount
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  // Track mouse position and hover state
  useEffect(() => {
    const onMouseMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      const hovering = !!e.target.closest('button, a, [data-cursor-hover]');
      if (hovering !== isHoveringRef.current) {
        isHoveringRef.current = hovering;
        setIsHovering(hovering);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Animation loop
  useEffect(() => {
    const loop = () => {
      const target = targetRef.current;
      const pos = posRef.current;
      const trail = trailRef.current;

      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;

      trail.x += (pos.x - trail.x) * 0.08;
      trail.y += (pos.y - trail.y) * 0.08;

      setCursorX(pos.x);
      setCursorY(pos.y);
      setTrailX(trail.x);
      setTrailY(trail.y);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const primarySize = 12;
  const trailSize = 40;

  return (
    <>
      {/* Primary cursor */}
      <div
        style={{
          position: 'fixed',
          left: cursorX - primarySize / 2,
          top: cursorY - primarySize / 2,
          width: primarySize,
          height: primarySize,
          borderRadius: '50%',
          backgroundColor: isHovering ? '#06b6d4' : '#a855f7',
          boxShadow: isHovering
            ? '0 0 12px 4px #06b6d4'
            : '0 0 12px 4px #a855f7',
          transform: isHovering ? 'scale(2.5)' : 'scale(1)',
          transition: 'transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      {/* Trailing cursor */}
      <div
        style={{
          position: 'fixed',
          left: trailX - trailSize / 2,
          top: trailY - trailSize / 2,
          width: trailSize,
          height: trailSize,
          borderRadius: '50%',
          backgroundColor: 'rgba(168, 85, 247, 0.2)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
}
