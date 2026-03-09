import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FlaskConical,
  FileText,
  ClipboardList,
  LogOut,
  Hexagon,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/evaluation', icon: FlaskConical, label: 'Evaluation' },
  { to: '/dashboard/proposals', icon: FileText, label: 'Proposals' },
  { to: '/dashboard/audit-logs', icon: ClipboardList, label: 'Audit Logs' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-prism-bg-alt border-r border-prism-accent/10 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-prism-accent/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Hexagon className="w-8 h-8 text-prism-accent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-prism-glow shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </div>
          </div>
          <span className="text-xl font-bold text-prism-text text-glow tracking-wider">
            PRISM
          </span>
        </div>
        <p className="text-xs text-prism-text-muted font-mono mt-2 uppercase tracking-widest">
          Control Center
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-prism-accent/15 text-prism-accent border border-prism-accent/30 shadow-[0_0_15px_rgba(30,144,255,0.1)]'
                  : 'text-prism-text-muted hover:text-prism-text hover:bg-prism-accent/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-prism-accent' : ''}`} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-prism-accent shadow-[0_0_8px_rgba(30,144,255,0.8)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-prism-accent/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
