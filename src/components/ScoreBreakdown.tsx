import { motion } from 'framer-motion';

interface ScoreItem {
  label: string;
  score: number;
  color: string;
  explanation?: string;
}

interface ScoreBreakdownProps {
  scores: ScoreItem[];
  onMetricClick?: (label: string, score: number) => void;
}

export default function ScoreBreakdown({ scores, onMetricClick }: ScoreBreakdownProps) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-lg font-bold text-prism-text mb-6">Score Breakdown</h3>
      <div className="space-y-5">
        {scores.map((item, index) => (
          <div 
            key={item.label}
            onClick={() => onMetricClick?.(item.label, item.score)}
            className={`transition-colors rounded-xl p-3 -mx-3 ${onMetricClick ? 'cursor-pointer hover:bg-prism-bg/50' : ''}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-prism-text-muted">{item.label}</span>
              <span className="text-sm font-bold" style={{ color: item.color }}>
                {item.score}%
              </span>
            </div>
            <div className="h-2.5 bg-prism-bg rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1, delay: index * 0.15, ease: 'easeOut' }}
              />
            </div>
            {item.explanation && (
              <p className="text-xs text-prism-text-muted/70 mt-2 leading-relaxed">
                {item.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
