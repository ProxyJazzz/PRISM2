import { motion } from 'framer-motion';
import { Send, Building2, Mail, Users, Globe, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [activeTab, setActiveTab] = useState<'institution' | 'collaboration'>('institution');

  return (
    <div className="w-full min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="w-[1000px] h-[1000px] border border-prism-accent/20 rounded-full border-dashed" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-prism-accent/30 text-prism-accent text-sm font-mono mb-6">
            <Globe className="w-4 h-4" /> Global Network
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-glow mb-6">Connect with PRISM</h1>
          <p className="text-xl text-prism-text-muted max-w-2xl mx-auto font-light">
            Request access for your institution or explore research collaborations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass-panel p-8 rounded-3xl border-t-2 border-t-prism-accent hover:-translate-y-1 transition-transform duration-300 group">
              <div className="p-3 rounded-xl bg-prism-accent/10 w-fit mb-6 border border-prism-accent/20 text-prism-accent group-hover:text-prism-glow group-hover:bg-prism-accent/20 transition-colors shadow-[0_0_15px_rgba(30,144,255,0.2)]">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-prism-text mb-3 group-hover:text-glow transition-all">Headquarters</h3>
              <p className="text-prism-text-muted leading-relaxed">
                100 Neural Way<br />
                Innovation District<br />
                San Francisco, CA 94105
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-t-2 border-t-prism-accent-secondary hover:-translate-y-1 transition-transform duration-300 group">
              <div className="p-3 rounded-xl bg-prism-accent-secondary/10 w-fit mb-6 border border-prism-accent-secondary/20 text-prism-accent-secondary group-hover:text-prism-glow transition-colors shadow-[0_0_15px_rgba(0,198,255,0.2)]">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-prism-text mb-3 group-hover:text-glow transition-all">Direct Contact</h3>
              <p className="text-prism-text-muted leading-relaxed">
                inquiries@prism-ai.dev<br />
                support@prism-ai.dev
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl border border-prism-accent/20 bg-prism-bg-alt/50 flex items-center gap-4">
               <Terminal className="w-6 h-6 text-prism-text-muted" />
               <div className="text-sm font-mono text-prism-text-muted">
                 System Status: <span className="text-emerald-400 text-glow">Online</span>
               </div>
            </div>
          </motion.div>

          {/* Form Area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 glass-panel p-10 rounded-3xl border border-prism-accent/20 relative overflow-hidden"
          >
            {/* Abstract form background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-prism-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            {/* Tabs */}
            <div className="flex space-x-2 mb-10 border-b border-prism-accent/20 pb-4 relative z-10">
              <button
                onClick={() => setActiveTab('institution')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'institution'
                    ? 'bg-prism-accent/20 text-prism-glow border border-prism-accent/50 shadow-[0_0_15px_rgba(30,144,255,0.2)]'
                    : 'text-prism-text-muted hover:text-prism-text hover:bg-prism-bg-alt border border-transparent'
                }`}
              >
                <Building2 className="w-4 h-4" /> Institutional Access
              </button>
              <button
                onClick={() => setActiveTab('collaboration')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'collaboration'
                    ? 'bg-prism-accent-secondary/20 text-prism-glow border border-prism-accent-secondary/50 shadow-[0_0_15px_rgba(0,198,255,0.2)]'
                    : 'text-prism-text-muted hover:text-prism-text hover:bg-prism-bg-alt border border-transparent'
                }`}
              >
                <Users className="w-4 h-4" /> Research Collaboration
              </button>
            </div>

            {/* Form */}
            <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-prism-text-muted font-mono uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl px-5 py-4 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                    placeholder="Dr. Jane Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-prism-text-muted font-mono uppercase tracking-wider">Work Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl px-5 py-4 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                    placeholder="jane@university.edu"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-prism-text-muted font-mono uppercase tracking-wider">Institution / Organization</label>
                <input 
                  type="text" 
                  className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl px-5 py-4 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                  placeholder="Global Research Institute"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-prism-text-muted font-mono uppercase tracking-wider">
                  {activeTab === 'institution' ? 'Expected Proposal Volume (Annual)' : 'Collaboration Proposal'}
                </label>
                {activeTab === 'institution' ? (
                  <div className="relative">
                    <select className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl px-5 py-4 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all appearance-none cursor-pointer">
                      <option value="low">&lt; 1,000 proposals</option>
                      <option value="medium">1,000 - 5,000 proposals</option>
                      <option value="high">5,000+ proposals</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-prism-accent">
                      ▼
                    </div>
                  </div>
                ) : (
                  <textarea 
                    rows={5}
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl px-5 py-4 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all resize-none placeholder:text-prism-text-muted/30"
                    placeholder="Briefly describe your research goals and how PRISM can assist..."
                  />
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 bg-prism-accent hover:bg-prism-glow text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(30,144,255,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Initialize Connection
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
