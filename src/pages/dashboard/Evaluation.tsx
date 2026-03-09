import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import UploadPortal from '../../components/UploadPortal';

export default function Evaluation() {
  const navigate = useNavigate();

  const handleUploadSuccess = (id: string) => {
    navigate(`/dashboard/proposals/${id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-prism-accent/10 border border-prism-accent/20">
            <FlaskConical className="w-5 h-5 text-prism-accent" />
          </div>
          <h1 className="text-2xl font-bold text-prism-text text-glow">Evaluation</h1>
        </div>
        <p className="text-sm text-prism-text-muted">
          Submit research proposals for AI-powered evaluation and analysis
        </p>
      </div>

      <UploadPortal onUploadSuccess={handleUploadSuccess} />

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-prism-text mb-4">How it works</h3>
        <div className="space-y-4">
          {[
            { step: '01', title: 'Upload', desc: 'Submit your research proposal PDF document' },
            { step: '02', title: 'Analysis', desc: 'AI engine evaluates methodology, novelty, and feasibility' },
            { step: '03', title: 'Results', desc: 'View detailed score breakdown and similarity analysis' },
            { step: '04', title: 'Interact', desc: 'Chat with AI to explore evaluation insights' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="text-xs font-mono text-prism-accent bg-prism-accent/10 border border-prism-accent/20 rounded-lg px-2.5 py-1">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-medium text-prism-text">{item.title}</p>
                <p className="text-xs text-prism-text-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
