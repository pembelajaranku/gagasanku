import React, { useMemo } from 'react';

const COLORS = ['#A78BFA', '#7DD3FC', '#6EE7B7', '#FCD34D', '#FF8FB8', '#FFB88C'];

export function ConfettiBurst({ active }: { active: boolean }) {
  const pieces = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: `${(i * 2.8 + ((i * 17) % 13)) % 100}%`,
      color: COLORS[i % COLORS.length],
      duration: `${2.1 + (i % 5) * 0.28}s`,
      delay: `${(i % 6) * 0.08}s`,
    }));
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
