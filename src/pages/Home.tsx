import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Network, ShieldCheck, Zap } from 'lucide-react';
import AIProposalNetwork from '../components/AIProposalNetwork';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Holographic rings background */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-prism-accent/10 rounded-full border-dashed opacity-50"
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-prism-accent-secondary/5 rounded-full opacity-30"
          />
        </div>

        <div className="container mx-auto px-4 z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="text-prism-text text-glow block mb-2">Proposal Reviewing</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-prism-accent via-prism-accent-secondary to-prism-glow text-glow-secondary">
                Intelligence & Screening Machine
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-prism-text-muted max-w-3xl mx-auto mb-10 font-light">
              AI-powered intelligence for transparent research proposal evaluation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/about" className="group relative px-8 py-4 rounded-full bg-prism-accent text-white font-semibold overflow-hidden shadow-[0_0_20px_rgba(30,144,255,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-prism-accent-secondary to-prism-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Explore Platform <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/architecture" className="px-8 py-4 rounded-full glass-panel text-prism-text font-semibold hover:bg-prism-bg-alt/80 hover:border-prism-accent transition-all flex items-center gap-2">
                <Network className="w-5 h-5 text-prism-accent-secondary" /> View Architecture
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual: AI Proposal Analysis Network */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full h-[40vh] md:h-[50vh] mt-16 relative max-w-6xl"
          >
            <AIProposalNetwork />
          </motion.div>
        </div>
      </section>

      {/* Narrative Sections */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-32">
            
            {/* 1. AI Thinking Visualization */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-prism-accent-secondary/30 text-prism-accent-secondary text-sm font-mono">
                  <BrainCircuit className="w-4 h-4" /> Cognitive Processing
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-glow">AI Thinking Visualization</h2>
                <p className="text-lg text-prism-text-muted leading-relaxed">
                  PRISM doesn't just score proposals; it explains its reasoning. Watch as the AI breaks down complex research methodologies, cross-references historical data, and builds a comprehensive evaluation matrix in real-time.
                </p>
              </div>
              <div className="flex-1 relative h-[400px] w-full glass-panel rounded-3xl overflow-hidden flex items-center justify-center">
                {/* Abstract orbital nodes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-64 h-64 border border-prism-accent/30 rounded-full absolute" />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="w-48 h-48 border border-prism-accent-secondary/40 rounded-full absolute border-dashed" />
                  <div className="w-24 h-24 rounded-full bg-prism-glow/20 blur-xl absolute animate-pulse" />
                  <BrainCircuit className="w-12 h-12 text-prism-text text-glow relative z-10" />
                </div>
              </div>
            </motion.div>

            {/* 2. How PRISM Works */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row-reverse items-center gap-12"
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-prism-accent-secondary/30 text-prism-accent-secondary text-sm font-mono">
                  <Zap className="w-4 h-4" /> Workflow Dynamics
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-glow">Human-AI Collaboration</h2>
                <p className="text-lg text-prism-text-muted leading-relaxed">
                  Designed to augment, not replace, human expertise. PRISM handles the heavy lifting of data extraction, similarity detection, and initial risk assessment, allowing human reviewers to focus on nuance, innovation, and strategic alignment.
                </p>
              </div>
              <div className="flex-1 relative h-[400px] w-full glass-panel rounded-3xl overflow-hidden flex items-center justify-center">
                {/* Flowing blue waves representation */}
                <div className="absolute inset-0 opacity-30 flex flex-col justify-center gap-8">
                  <motion.div 
                    className="h-1 w-full bg-gradient-to-r from-transparent via-prism-accent to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    className="h-1 w-full bg-gradient-to-r from-transparent via-prism-accent-secondary to-transparent"
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    className="h-1 w-full bg-gradient-to-r from-transparent via-prism-glow to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="relative z-10 flex gap-8 items-center">
                  <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center border-prism-accent shadow-[0_0_15px_rgba(30,144,255,0.5)]"><UserIcon /></div>
                  <motion.div className="w-24 h-[2px] bg-prism-accent-secondary" animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                  <div className="w-20 h-20 rounded-full glass-panel flex items-center justify-center border-prism-glow shadow-[0_0_20px_rgba(0,198,255,0.6)]"><BrainCircuit className="text-prism-glow" /></div>
                </div>
              </div>
            </motion.div>

            {/* 3. Institutional Impact */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-prism-accent-secondary/30 text-prism-accent-secondary text-sm font-mono">
                  <ShieldCheck className="w-4 h-4" /> Scale & Security
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-glow">Institutional Impact</h2>
                <p className="text-lg text-prism-text-muted leading-relaxed">
                  Deployable at national scale. PRISM ensures deterministic scoring, eliminates bias through transparent evaluation metrics, and protects sensitive intellectual property with military-grade encryption and secure enclaves.
                </p>
              </div>
              <div className="flex-1 relative h-[400px] w-full glass-panel rounded-3xl overflow-hidden flex items-center justify-center">
                 {/* Orbital nodes representing institutions */}
                 <div className="relative w-64 h-64">
                   <div className="absolute inset-0 border-2 border-prism-accent/20 rounded-full" />
                   {[0, 1, 2].map((i) => (
                     <motion.div
                       key={i}
                       className="absolute top-0 left-1/2 w-4 h-4 bg-prism-accent-secondary rounded-full shadow-[0_0_10px_rgba(0,198,255,0.8)]"
                       style={{ originX: 0, originY: '128px', x: '-50%' }}
                       animate={{ rotate: 360 }}
                       transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear", delay: i * 2 }}
                     />
                   ))}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-16 h-16 rounded-full bg-prism-bg border border-prism-accent shadow-[0_0_20px_rgba(30,144,255,0.4)] flex items-center justify-center">
                       <ShieldCheck className="w-8 h-8 text-prism-accent" />
                     </div>
                   </div>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-prism-text">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
