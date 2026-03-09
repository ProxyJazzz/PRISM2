import { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { getMe } from '../api/auth';

export default function Header() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => {});
  }, []);

  return (
    <header className="h-16 border-b border-prism-accent/10 bg-prism-bg-alt/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-prism-text-muted" />
        <input
          type="text"
          placeholder="Search proposals, reports..."
          className="w-full bg-prism-bg/50 border border-prism-accent/20 rounded-lg pl-10 pr-4 py-2 text-sm text-prism-text placeholder:text-prism-text-muted/40 focus:outline-none focus:border-prism-accent/50 transition-colors"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-prism-accent/10 transition-colors text-prism-text-muted hover:text-prism-text">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-prism-accent shadow-[0_0_6px_rgba(30,144,255,0.8)]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-prism-accent/10">
          <div className="w-8 h-8 rounded-full bg-prism-accent/20 border border-prism-accent/30 flex items-center justify-center">
            <User className="w-4 h-4 text-prism-accent" />
          </div>
          <div className="text-sm">
            <p className="text-prism-text font-medium">{user?.name || 'Admin'}</p>
            <p className="text-prism-text-muted text-xs">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
