import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Proposal {
  id: string;
  title: string;
  uploadedAt: string;
  status: 'pending' | 'evaluated' | 'error';
  score?: number;
}

interface ProposalListProps {
  proposals: Proposal[];
  loading?: boolean;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', label: 'Pending' },
  evaluated: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', label: 'Evaluated' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', label: 'Error' },
};

export default function ProposalList({ proposals, loading }: ProposalListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel rounded-xl p-5 animate-pulse">
            <div className="h-4 w-48 bg-prism-accent/10 rounded mb-3" />
            <div className="h-3 w-32 bg-prism-accent/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <FileText className="w-12 h-12 text-prism-text-muted mx-auto mb-4 opacity-40" />
        <p className="text-prism-text-muted">No proposals found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {proposals.map((proposal, index) => {
        const status = statusConfig[proposal.status];
        const StatusIcon = status.icon;
        return (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/dashboard/proposals/${proposal.id}`}
              className="glass-panel rounded-xl p-5 flex items-center justify-between group hover:border-prism-accent/40 transition-all block"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-prism-accent/10 border border-prism-accent/20">
                  <FileText className="w-5 h-5 text-prism-accent" />
                </div>
                <div>
                  <p className="text-prism-text font-medium group-hover:text-prism-accent transition-colors">
                    {proposal.title}
                  </p>
                  <p className="text-xs text-prism-text-muted mt-1">
                    Uploaded {new Date(proposal.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {proposal.score !== undefined && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-prism-accent">{proposal.score}%</p>
                    <p className="text-xs text-prism-text-muted">Score</p>
                  </div>
                )}
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.border} ${status.color} border`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
