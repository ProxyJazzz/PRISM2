import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-prism-accent/20 bg-prism-bg/80 backdrop-blur-md py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-prism-text-muted text-sm">
          <span className="font-mono">PRISM Core v2.4.1</span>
          <span className="hidden md:inline text-prism-accent/50">|</span>
          <span>© {new Date().getFullYear()} Research Platform</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="font-mono">System Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
