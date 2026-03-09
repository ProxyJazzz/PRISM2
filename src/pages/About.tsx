import { motion } from 'framer-motion';
import { Target, Layers, Cpu, BrainCircuit } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="w-[800px] h-[800px] border border-prism-accent/30 rounded-full border-dashed" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute w-[1200px] h-[1200px] border border-prism-accent-secondary/20 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-prism-accent/30 text-prism-accent text-sm font-mono mb-6">
            <Target className="w-4 h-4" /> Mission & Vision
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-glow mb-6">About PRISM</h1>
          <p className="text-xl text-prism-text-muted max-w-3xl mx-auto font-light">
            Accelerating scientific discovery by eliminating bottlenecks in research funding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-prism-text flex items-center gap-4">
              <div className="p-3 rounded-xl bg-prism-accent/10 border border-prism-accent/30 text-prism-accent shadow-[0_0_15px_rgba(30,144,255,0.3)]">
                <BrainCircuit className="w-8 h-8" />
              </div>
              The Intelligence Gap
            </h2>
            <div className="space-y-6 text-lg text-prism-text-muted leading-relaxed">
              <p>
                Every year, millions of hours are spent by highly qualified researchers reviewing grant proposals. This process is inherently slow, prone to human bias, and struggles to identify overlapping research across disparate domains.
              </p>
              <p>
                PRISM was built to solve this. By leveraging advanced neural networks and high-dimensional vector search, we provide funding agencies with an untiring, unbiased first-pass reviewer.
              </p>
              <p>
                Our goal is not to replace human judgment, but to <span className="text-prism-text font-semibold text-glow">augment it</span>—allowing experts to focus on deep critical analysis rather than administrative screening.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] w-full glass-panel rounded-3xl overflow-hidden flex items-center justify-center border border-prism-accent/20"
          >
            {/* Abstract AI Brain Network Visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-64 h-64 rounded-full border-2 border-prism-accent/30 absolute"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="w-48 h-48 rounded-full border-2 border-prism-accent-secondary/40 absolute border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="w-32 h-32 rounded-full bg-prism-glow/20 blur-2xl absolute animate-pulse" />
              
              {/* Neural nodes */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-prism-text rounded-full shadow-[0_0_10px_#fff,0_0_20px_#00c6ff]"
                  style={{ 
                    rotate: `${deg}deg`,
                    translateY: '-100px'
                  }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
              
              <BrainCircuit className="w-16 h-16 text-prism-text text-glow relative z-10" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-10 rounded-3xl border-t-2 border-t-prism-accent hover:-translate-y-2 transition-transform duration-300 group"
          >
            <h3 className="text-2xl font-bold text-prism-text mb-6 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-prism-accent/10 text-prism-accent group-hover:text-prism-glow transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              Technology Stack
            </h3>
            <ul className="space-y-4 text-prism-text-muted">
              {[
                'Distributed GPU Clusters for Inference',
                'Custom Transformer Models (LLMs)',
                'High-Dimensional Vector Search (Similarity)',
                'Real-time WebSocket Streaming',
                'Military-grade Encryption (AES-256)'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-prism-accent shadow-[0_0_5px_rgba(30,144,255,0.8)]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-10 rounded-3xl border-t-2 border-t-prism-accent-secondary hover:-translate-y-2 transition-transform duration-300 group"
          >
            <h3 className="text-2xl font-bold text-prism-text mb-6 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-prism-accent-secondary/10 text-prism-accent-secondary group-hover:text-prism-glow transition-colors">
                <Cpu className="w-6 h-6" />
              </div>
              AI Philosophy
            </h3>
            <p className="text-prism-text-muted leading-relaxed text-lg">
              We build systems that are transparent by design. PRISM does not operate as a "black box." Every evaluation, score, and risk assessment generated by our models is accompanied by a deterministic, citation-backed explanation. We prioritize explainability, security, and human-in-the-loop validation above all else.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
