import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Building2, User, ShieldCheck, Network, Database } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../lib/api';

export default function Register() {
  const [institutionName, setInstitutionName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser({ institutionName, adminName, email, password });
      // Redirect to login after successful registration
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }} className="w-[1200px] h-[1200px] border border-prism-accent-secondary/20 rounded-full border-dashed" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 max-w-6xl">
        
        {/* Left Side: Visual/Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col w-1/2 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-prism-accent-secondary/30 text-prism-accent-secondary text-sm font-mono w-fit">
            <Network className="w-4 h-4" /> Node Initialization
          </div>
          <h1 className="text-5xl font-bold text-glow leading-tight">
            Join the PRISM Network
          </h1>
          <p className="text-xl text-prism-text-muted font-light leading-relaxed">
            Establish a secure institutional node to leverage advanced AI for proposal screening and evaluation.
          </p>
          
          <div className="space-y-6 mt-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-prism-accent/10 border border-prism-accent/20 text-prism-accent shadow-[0_0_15px_rgba(30,144,255,0.2)]">
                <Database className="w-6 h-6" />
              </div>
              <div className="text-prism-text-muted">Dedicated Vector Database</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-prism-accent-secondary/10 border border-prism-accent-secondary/20 text-prism-accent-secondary shadow-[0_0_15px_rgba(0,198,255,0.2)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-prism-text-muted">Isolated Data Environment</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-prism-glow/10 border border-prism-glow/20 text-prism-glow shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <UserPlus className="w-6 h-6" />
              </div>
              <div className="text-prism-text-muted">Role-Based Access Control</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 max-w-md"
        >
          <div className="glass-panel p-10 rounded-3xl relative overflow-hidden border border-prism-accent/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-prism-glow via-prism-accent to-prism-accent-secondary" />
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-prism-bg-alt/80 mb-6 border border-prism-accent/30 shadow-[0_0_20px_rgba(30,144,255,0.2)]">
                <UserPlus className="w-8 h-8 text-prism-glow" />
              </div>
              <h2 className="text-3xl font-bold text-prism-text text-glow">Node Registration</h2>
              <p className="text-prism-text-muted mt-3 font-mono text-sm uppercase tracking-wider">Create Institutional Profile</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-prism-text-muted font-mono uppercase tracking-wider">Institution Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-prism-text-muted group-focus-within:text-prism-glow transition-colors" />
                  <input 
                    type="text" 
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    required
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl pl-12 pr-4 py-3 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                    placeholder="AI Research Lab"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-prism-text-muted font-mono uppercase tracking-wider">Admin Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-prism-text-muted group-focus-within:text-prism-glow transition-colors" />
                  <input 
                    type="text" 
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl pl-12 pr-4 py-3 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                    placeholder="Dr. Jane Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-prism-text-muted font-mono uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-prism-text-muted group-focus-within:text-prism-glow transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl pl-12 pr-4 py-3 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                    placeholder="admin@institution.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-prism-text-muted font-mono uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-prism-text-muted group-focus-within:text-prism-glow transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl pl-12 pr-4 py-3 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-prism-accent hover:bg-prism-glow text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(30,144,255,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed mt-6 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Establish Node
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-prism-text-muted border-t border-prism-accent/10 pt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-prism-glow hover:text-white transition-colors font-medium">
                Login here
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
