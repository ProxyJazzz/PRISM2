import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function NeuralBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-prism-bg">
      {/* Base Dark Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,144,255,0.08)_0%,_transparent_60%)] z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(0,198,255,0.05)_0%,_transparent_50%)] z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.05)_0%,_transparent_50%)] z-10 pointer-events-none" />
      
      {/* Subtle Tech Grid */}
      <div className="absolute inset-0 bg-neural-grid opacity-50" />

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-prism-accent"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0.1 + Math.random() * 0.3,
            boxShadow: `0 0 ${p.size * 2}px rgba(30, 144, 255, 0.8)`,
          }}
          animate={{
            y: [`${p.y}%`, `${p.y - 10}%`, `${p.y}%`],
            x: [`${p.x}%`, `${p.x + (Math.random() > 0.5 ? 5 : -5)}%`, `${p.x}%`],
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
      
      {/* Digital Waves (Subtle) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(30,144,255,0.1) 2px, rgba(30,144,255,0.1) 4px)',
        backgroundSize: '100% 4px'
      }} />
    </div>
  );
}
