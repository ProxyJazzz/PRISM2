import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCards from '../../components/StatsCards';
import { getDashboardStats, getDashboardActivity } from '../../api/dashboard';

interface Stats {
  totalProposals: number;
  received: number;
  evaluated: number;
  remaining: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          getDashboardStats(),
          getDashboardActivity(),
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = stats
    ? [
        { title: 'Total Proposals', value: stats.totalProposals, icon: FileText, color: '#1e90ff', glowColor: 'rgba(30,144,255,0.2)' },
        { title: 'Received', value: stats.received, icon: Clock, color: '#00c6ff', glowColor: 'rgba(0,198,255,0.2)' },
        { title: 'Evaluated', value: stats.evaluated, icon: CheckCircle, color: '#22c55e', glowColor: 'rgba(34,197,94,0.2)' },
        { title: 'Remaining', value: stats.remaining, icon: BarChart3, color: '#f59e0b', glowColor: 'rgba(245,158,11,0.2)' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-prism-text text-glow">Dashboard</h1>
        <p className="text-sm text-prism-text-muted mt-1">System overview and evaluation metrics</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <StatsCards stats={statCards} loading={loading} />

      {/* Activity Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-prism-text mb-6">Evaluation Activity</h3>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-prism-accent/30 border-t-prism-accent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activity}>
              <defs>
                <linearGradient id="colorEval" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1e90ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,144,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a12',
                  border: '1px solid rgba(30,144,255,0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Area type="monotone" dataKey="evaluations" stroke="#1e90ff" fill="url(#colorEval)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}
