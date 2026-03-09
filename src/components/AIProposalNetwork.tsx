import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const nodes = [
  { id: 'proposal', label: 'Proposal', x: 10, y: 50 },
  { id: 'extraction', label: 'Extraction', x: 30, y: 20 },
  { id: 'analysis', label: 'Analysis', x: 50, y: 50 },
  { id: 'similarity', label: 'Similarity', x: 70, y: 20 },
  { id: 'evaluation', label: 'Evaluation', x: 70, y: 80 },
  { id: 'insights', label: 'Insights', x: 90, y: 50 },
];

const connections = [
  { from: 'proposal', to: 'extraction' },
  { from: 'proposal', to: 'analysis' },
  { from: 'extraction', to: 'analysis' },
  { from: 'analysis', to: 'similarity' },
  { from: 'analysis', to: 'evaluation' },
  { from: 'similarity', to: 'insights' },
  { from: 'evaluation', to: 'insights' },
];

export default function AIProposalNetwork() {
  const [particles, setParticles] = useState<Array<{ id: number; path: string; duration: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => {
      const connection = connections[Math.floor(Math.random() * connections.length)];
      return {
        id: i,
        path: `${connection.from}-${connection.to}`,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 2,
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(30,144,255,0.2)" />
            <stop offset="50%" stopColor="rgba(0,198,255,0.5)" />
            <stop offset="100%" stopColor="rgba(30,144,255,0.2)" />
          </linearGradient>
        </defs>
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from)!;
          const toNode = nodes.find(n => n.id === conn.to)!;
          return (
            <motion.line
              key={i}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="url(#line-gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 + 1 }}
        >
          <motion.div 
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center border border-prism-accent/50 shadow-[0_0_15px_rgba(30,144,255,0.3)] relative"
            animate={{ boxShadow: ['0 0 15px rgba(30,144,255,0.3)', '0 0 25px rgba(0,198,255,0.6)', '0 0 15px rgba(30,144,255,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          >
            <div className="w-4 h-4 rounded-full bg-prism-accent-secondary blur-[2px]" />
            <div className="absolute inset-0 rounded-full border border-prism-accent-secondary/30 animate-ping" style={{ animationDuration: '3s' }} />
          </motion.div>
          <div className="mt-3 text-sm font-mono text-prism-text-muted text-glow tracking-wider uppercase">
            {node.label}
          </div>
        </motion.div>
      ))}

      {/* Data Flow Particles */}
      {particles.map((p) => {
        const [fromId, toId] = p.path.split('-');
        const fromNode = nodes.find(n => n.id === fromId)!;
        const toNode = nodes.find(n => n.id === toId)!;
        
        return (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_20px_#00c6ff]"
            style={{ left: `${fromNode.x}%`, top: `${fromNode.y}%`, transform: 'translate(-50%, -50%)' }}
            animate={{
              left: [`${fromNode.x}%`, `${toNode.x}%`],
              top: [`${fromNode.y}%`, `${toNode.y}%`],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            }}
          />
        );
      })}
    </div>
  );
}
