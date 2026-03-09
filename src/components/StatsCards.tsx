import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  glowColor: string;
}

interface StatsCardsProps {
  stats: StatCard[];
  loading?: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-panel rounded-2xl p-6 animate-pulse"
          >
            <div className="h-4 w-24 bg-prism-accent/10 rounded mb-4" />
            <div className="h-8 w-16 bg-prism-accent/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity">
            <stat.icon className="w-full h-full" style={{ color: stat.color }} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2.5 rounded-xl"
              style={{
                backgroundColor: `${stat.color}15`,
                border: `1px solid ${stat.color}30`,
                boxShadow: `0 0 12px ${stat.glowColor}`,
              }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <span className="text-sm text-prism-text-muted">{stat.title}</span>
          </div>
          <motion.p
            className="text-3xl font-bold text-prism-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Counter value={stat.value} />
          </motion.p>
        </motion.div>
      ))}
    </div>
  );
}

function Counter({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}
