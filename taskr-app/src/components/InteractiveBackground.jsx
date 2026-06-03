import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      // Calculate coordinates relative to screen/viewport
      container.style.setProperty('--mouse-x', `${e.clientX}px`);
      container.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        '--mouse-x': '50vw',
        '--mouse-y': '50vh'
      }}
    >
      {/* Glow Orb 1 - chases mouse */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-35 dark:opacity-[0.22] transition-all duration-1000 ease-out bg-emerald-500/20 dark:bg-emerald-500/10"
        style={{
          left: 'calc(var(--mouse-x) - 300px)',
          top: 'calc(var(--mouse-y) - 300px)',
        }}
      />

      {/* Glow Orb 2 - floating top right */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[130px] opacity-25 dark:opacity-[0.15] bg-teal-500/20 dark:bg-teal-500/10 animate-float"
        style={{
          top: '15%',
          right: '15%',
          animationDuration: '10s'
        }}
      />

      {/* Glow Orb 3 - floating bottom left */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 dark:opacity-[0.12] bg-emerald-600/15 dark:bg-emerald-600/10 animate-float"
        style={{
          bottom: '10%',
          left: '10%',
          animationDuration: '14s'
        }}
      />
    </div>
  );
}
