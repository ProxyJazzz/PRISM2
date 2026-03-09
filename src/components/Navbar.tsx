import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, Menu, X, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Architecture', path: '/architecture' },
  { name: 'Security', path: '/security' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled 
        ? "bg-prism-bg/80 backdrop-blur-xl border-b border-prism-accent/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
        : "bg-transparent border-b border-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-prism-accent/20 blur-md rounded-full group-hover:bg-prism-glow/40 transition-colors" />
              <Hexagon className="w-8 h-8 text-prism-accent group-hover:text-prism-glow transition-colors relative z-10" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-2xl tracking-widest text-prism-text text-glow leading-none">PRISM</span>
              <span className="text-[10px] font-mono text-prism-accent uppercase tracking-widest opacity-80">Neural Network</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative px-4 py-2 group"
                >
                  <span className={cn(
                    "relative z-10 text-sm font-medium transition-colors duration-300 font-mono uppercase tracking-wider",
                    isActive ? "text-prism-glow text-glow" : "text-prism-text-muted group-hover:text-prism-text"
                  )}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-prism-accent/10 border border-prism-accent/30 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-prism-accent/5 border border-prism-accent/0 rounded-lg opacity-0 group-hover:opacity-100 group-hover:border-prism-accent/20 transition-all duration-300" />
                  )}
                </Link>
              );
            })}
            
            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-prism-accent/20 h-8">
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-prism-text-muted hover:text-prism-glow transition-colors font-mono uppercase tracking-wider group">
                <Terminal className="w-4 h-4 group-hover:text-prism-glow transition-colors" />
                Login
              </Link>
              <Link to="/register" className="relative group px-5 py-2 overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-prism-accent/10 border border-prism-accent/50 rounded-lg transition-colors group-hover:bg-prism-accent/20" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-prism-glow/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 text-sm font-bold text-prism-accent group-hover:text-prism-glow transition-colors font-mono uppercase tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                  Request Access
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-prism-text-muted hover:text-prism-glow focus:outline-none transition-colors p-2 rounded-lg hover:bg-prism-accent/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-prism-bg/95 backdrop-blur-xl border-b border-prism-accent/20"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-base font-medium font-mono uppercase tracking-wider transition-all",
                  isActive 
                    ? "bg-prism-accent/10 border border-prism-accent/30 text-prism-glow shadow-[0_0_15px_rgba(30,144,255,0.1)]" 
                    : "text-prism-text-muted hover:bg-prism-accent/5 hover:text-prism-text border border-transparent"
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="mt-6 pt-6 border-t border-prism-accent/20 flex flex-col gap-4">
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center justify-center gap-2 w-full py-3 text-base font-medium text-prism-text-muted hover:text-prism-glow font-mono uppercase tracking-wider rounded-xl hover:bg-prism-accent/5 transition-colors"
            >
              <Terminal className="w-5 h-5" /> Login
            </Link>
            <Link 
              to="/register" 
              onClick={() => setIsOpen(false)} 
              className="w-full text-center px-4 py-3 text-base font-bold rounded-xl bg-prism-accent/10 border border-prism-accent text-prism-accent hover:bg-prism-accent hover:text-prism-bg transition-all font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              Request Access
            </Link>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
