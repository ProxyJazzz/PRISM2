import { motion } from 'framer-motion';
import { Database, Server, Cpu, Layers, Shield, Network } from 'lucide-react';

const architectureLayers = [
  {
    id: 'client',
    title: 'Client Interface',
    icon: Layers,
    description: 'React + Three.js frontend delivering real-time holographic visualizations and interactive evaluation dashboards.',
    color: 'text-prism-accent',
    borderColor: 'border-prism-accent',
    glow: 'shadow-[0_0_15px_rgba(30,144,255,0.3)]'
  },
  {
    id: 'gateway',
    title: 'API Gateway & Security',
    icon: Shield,
    description: 'Zero-trust entry point handling authentication, rate limiting, and encrypted payload routing.',
    color: 'text-prism-accent-secondary',
    borderColor: 'border-prism-accent-secondary',
    glow: 'shadow-[0_0_15px_rgba(0,198,255,0.3)]'
  },
  {
    id: 'processing',
    title: 'Distributed Processing',
    icon: Server,
    description: 'High-throughput Node.js microservices orchestrating document parsing, OCR, and task queuing.',
    color: 'text-prism-glow',
    borderColor: 'border-prism-glow',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
  },
  {
    id: 'ai',
    title: 'Neural Evaluation Engine',
    icon: Cpu,
    description: 'Cluster of specialized LLMs performing semantic analysis, risk assessment, and scoring generation.',
    color: 'text-purple-400',
    borderColor: 'border-purple-400',
    glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]'
  },
  {
    id: 'data',
    title: 'Vector & Relational Storage',
    icon: Database,
    description: 'Hybrid data layer combining PostgreSQL for structured data and high-dimensional vector databases for similarity search.',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]'
  }
];

export default function Architecture() {
  return (
    <div className="w-full min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} className="w-[800px] h-[800px] border border-prism-accent rounded-full border-dashed" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute w-[1000px] h-[1000px] border border-prism-accent-secondary rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-prism-accent/30 text-prism-accent text-sm font-mono mb-6">
            <Network className="w-4 h-4" /> System Topology
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-glow mb-6">Architecture Overview</h1>
          <p className="text-xl text-prism-text-muted max-w-3xl mx-auto font-light">
            A vertically integrated, high-performance stack designed for secure, real-time AI inference at institutional scale.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {/* Central Data Spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-prism-accent via-prism-accent-secondary to-prism-glow -translate-x-1/2 opacity-30 rounded-full" />
          
          {/* Animated Data Packets */}
          <motion.div 
            className="absolute left-1/2 top-0 w-3 h-16 bg-white rounded-full -translate-x-1/2 shadow-[0_0_15px_#fff,0_0_30px_#00c6ff]"
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute left-1/2 top-0 w-2 h-8 bg-prism-accent-secondary rounded-full -translate-x-1/2 shadow-[0_0_10px_#00c6ff]"
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1.5 }}
          />

          <div className="flex flex-col gap-16">
            {architectureLayers.map((layer, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center w-full ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content Panel */}
                  <div className={`w-1/2 ${isEven ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div className={`glass-panel p-8 rounded-2xl border ${layer.borderColor}/30 hover:${layer.borderColor}/60 transition-all duration-300 group relative overflow-hidden`}>
                      <div className={`absolute inset-0 bg-gradient-to-br from-${layer.color.split('-')[1]}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      <div className={`flex items-center gap-4 mb-4 ${isEven ? 'justify-end' : 'justify-start'}`}>
                        {!isEven && (
                          <div className={`p-3 rounded-xl glass-panel ${layer.borderColor}/50 ${layer.glow}`}>
                            <layer.icon className={`w-6 h-6 ${layer.color}`} />
                          </div>
                        )}
                        <h3 className={`text-2xl font-bold ${layer.color}`}>{layer.title}</h3>
                        {isEven && (
                          <div className={`p-3 rounded-xl glass-panel ${layer.borderColor}/50 ${layer.glow}`}>
                            <layer.icon className={`w-6 h-6 ${layer.color}`} />
                          </div>
                        )}
                      </div>
                      <p className="text-prism-text-muted leading-relaxed">
                        {layer.description}
                      </p>
                    </div>
                  </div>

                  {/* Connection Node */}
                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className={`w-6 h-6 rounded-full bg-prism-bg border-2 ${layer.borderColor} ${layer.glow} z-10`} />
                    <motion.div 
                      className={`absolute w-12 h-12 rounded-full border border-${layer.borderColor}/50`}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                  </div>

                  {/* Empty space for the other side */}
                  <div className="w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
