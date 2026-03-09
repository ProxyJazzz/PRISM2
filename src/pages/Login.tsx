import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../lib/api';

export default function Login() {
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
      // DEV BYPASS: admin@admin.com / admin skips backend entirely
      if (email === 'admin@admin.com' && password === 'admin') {
        const devToken = 'dev_bypass_token_' + btoa(JSON.stringify({ sub: 1, email: 'admin@admin.com', iat: Date.now() }));
        localStorage.setItem('token', devToken);
        navigate('/dashboard');
        return;
      }

      const data = await loginUser({ email, password });
      const token = data.token || data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="w-[1200px] h-[1200px] border border-prism-accent/20 rounded-full border-dashed" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 max-w-6xl">
        
        {/* Left Side: Visual/Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col w-1/2 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-prism-accent/30 text-prism-accent text-sm font-mono w-fit">
            <Lock className="w-4 h-4" /> Secure Gateway
          </div>
          <h1 className="text-5xl font-bold text-glow leading-tight">
            Access the PRISM Network
          </h1>
          <p className="text-xl text-prism-text-muted font-light leading-relaxed">
            Authenticate to access institutional evaluation dashboards, AI reasoning logs, and proposal similarity matrices.
          </p>
          
          <div className="space-y-6 mt-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-prism-accent/10 border border-prism-accent/20 text-prism-accent shadow-[0_0_15px_rgba(30,144,255,0.2)]">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="text-prism-text-muted">Advanced Neural Analysis</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-prism-accent-secondary/10 border border-prism-accent-secondary/20 text-prism-accent-secondary shadow-[0_0_15px_rgba(0,198,255,0.2)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-prism-text-muted">Military-Grade Encryption</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-prism-glow/10 border border-prism-glow/20 text-prism-glow shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-prism-text-muted">Real-time Evaluation</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 max-w-md"
        >
          <div className="glass-panel p-10 rounded-3xl relative overflow-hidden border border-prism-accent/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-prism-accent-secondary via-prism-accent to-prism-glow" />
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-prism-bg-alt/80 mb-6 border border-prism-accent/30 shadow-[0_0_20px_rgba(30,144,255,0.2)]">
                <LogIn className="w-8 h-8 text-prism-glow" />
              </div>
              <h2 className="text-3xl font-bold text-prism-text text-glow">System Login</h2>
              <p className="text-prism-text-muted mt-3 font-mono text-sm uppercase tracking-wider">Initialize Secure Session</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-medium text-prism-text-muted font-mono uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-prism-text-muted group-focus-within:text-prism-glow transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl pl-12 pr-4 py-4 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                    placeholder="admin@institution.edu"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-prism-text-muted font-mono uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs text-prism-accent hover:text-prism-glow transition-colors">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-prism-text-muted group-focus-within:text-prism-glow transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-prism-bg/50 border border-prism-accent/30 rounded-xl pl-12 pr-4 py-4 text-prism-text focus:outline-none focus:border-prism-glow focus:ring-1 focus:ring-prism-glow transition-all placeholder:text-prism-text-muted/30"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-prism-accent hover:bg-prism-glow text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(30,144,255,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed mt-8 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Authenticate
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-prism-text-muted border-t border-prism-accent/10 pt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-prism-glow hover:text-white transition-colors font-medium">
                Request Access
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
