import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, TrendingUp } from 'lucide-react';

interface MetricExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: string;
  score: number;
  data: {
    explanation: string;
    weaknesses: string[];
    improvements: string[];
  } | null;
  loading: boolean;
  error: string | null;
}

export default function MetricExplanationModal({
  isOpen,
  onClose,
  metric,
  score,
  data,
  loading,
  error
}: MetricExplanationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0f] border border-prism-accent/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-prism-accent/10">
            <div>
              <h2 className="text-xl font-bold text-prism-text flex items-center gap-3">
                {metric} Evaluation
                <span className="px-3 py-1 text-sm rounded-full bg-prism-accent/10 text-prism-accent border border-prism-accent/20">
                  {score}%
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-prism-text-muted hover:text-prism-text rounded-xl hover:bg-prism-accent/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-prism-accent animate-spin" />
                <p className="text-prism-text-muted animate-pulse">Generating metric intelligence...</p>
              </div>
            ) : error ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500/80" />
                <p className="text-red-400 font-medium">Failed to generate explanation</p>
                <p className="text-sm text-red-400/70">{error}</p>
              </div>
            ) : data ? (
              <div className="space-y-8">
                {/* Primary Explanation */}
                <section>
                  <h3 className="text-sm font-semibold text-prism-accent mb-3 uppercase tracking-wider">Analysis Overview</h3>
                  <p className="text-prism-text-muted leading-relaxed text-[15px]">
                    {data.explanation}
                  </p>
                </section>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Weaknesses */}
                  <section className="bg-red-500/5 rounded-xl border border-red-500/10 p-5">
                    <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Factors Reducing Score
                    </h3>
                    <ul className="space-y-3">
                      {data.weaknesses.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-red-400/80">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400/50 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Improvements */}
                  <section className="bg-green-500/5 rounded-xl border border-green-500/10 p-5">
                    <h3 className="text-sm font-semibold text-green-400 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Suggested Improvements
                    </h3>
                    <ul className="space-y-3">
                      {data.improvements.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-green-400/80">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400/50 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
