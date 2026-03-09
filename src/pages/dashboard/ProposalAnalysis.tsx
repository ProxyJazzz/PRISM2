import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  AlertTriangle,
  Brain,
  Loader2,
} from 'lucide-react';
import ScoreBreakdown from '../../components/ScoreBreakdown';
import SimilarityNetwork from '../../components/SimilarityNetwork';
import ChatbotPanel from '../../components/ChatbotPanel';
import MetricExplanationModal from '../../components/MetricExplanationModal';
import { getProposal, getProposalReport, getMetricExplanation } from '../../api/proposals';

export default function ProposalAnalysis() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [selectedScore, setSelectedScore] = useState(0);
  const [metricData, setMetricData] = useState<any>(null);
  const [metricLoading, setMetricLoading] = useState(false);
  const [metricError, setMetricError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    getProposal(id)
      .then(setProposal)
      .catch((err: any) => setError(err.message || 'Failed to load proposal'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadReport = async () => {
    if (!id) return;
    try {
      const blob = await getProposalReport(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PRISM-Report-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download report.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-prism-accent animate-spin" />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-red-400 font-medium">{error || 'Proposal not found'}</p>
      </div>
    );
  }

  const evalScores = proposal.analysis?.evaluation_scores || {};
  let evalSummaryRaw = proposal.analysis?.evaluation_summary || proposal.analysis?.explanation;
  
  let parsedSummary = evalSummaryRaw;
  if (typeof evalSummaryRaw === 'string') {
    try {
      parsedSummary = JSON.parse(evalSummaryRaw);
    } catch {
      parsedSummary = { overall: evalSummaryRaw, parameters: {} };
    }
  }
  const evalSummary = parsedSummary || { overall: null, parameters: {} };

  const proposalEval = proposal.analysis?.proposal_evaluation || {};

  const getFallback = (key: string) => {
    switch (key) {
      case 'novelty': return "Novelty score reflects overlap with existing database proposals.";
      case 'methodology': return "Methodology evaluates technical depth and keyword density.";
      case 'feasibility': return "Feasibility measures practical deliverability and technical terms.";
      case 'completeness': return "Completeness assesses word count and overall structure.";
      default: return "";
    }
  };

  const scores = [
    { label: 'Novelty', score: proposal.noveltyScore ?? evalScores.novelty ?? proposal.analysis?.noveltyScore ?? 0, color: '#1e90ff', explanation: evalSummary.parameters?.novelty || getFallback('novelty') },
    { label: 'Methodology', score: proposal.methodologyScore ?? evalScores.methodology ?? proposal.analysis?.methodologyScore ?? 0, color: '#00c6ff', explanation: evalSummary.parameters?.methodology || getFallback('methodology') },
    { label: 'Feasibility', score: proposal.feasibilityScore ?? evalScores.feasibility ?? proposal.analysis?.feasibilityScore ?? 0, color: '#22c55e', explanation: evalSummary.parameters?.feasibility || getFallback('feasibility') },
    { label: 'Completeness', score: proposal.completenessScore ?? evalScores.completeness ?? proposal.analysis?.completenessScore ?? 0, color: '#f59e0b', explanation: evalSummary.parameters?.completeness || getFallback('completeness') },
  ];

  const overallScore =
    proposal.overallScore ??
    proposal.score ??
    proposalEval.final_score ??
    proposal.analysis?.overall_score ??
    proposal.analysis?.overallScore ??
    Math.round(scores.reduce((s, c) => s + c.score, 0) / (scores.length || 1));

  const riskLevel =
    proposal.riskLevel ?? proposal.analysis?.risk_level ?? proposal.analysis?.riskLevel ?? (overallScore >= 70 ? 'Low' : overallScore >= 40 ? 'Medium' : 'High');

  const riskColor = riskLevel === 'Low' ? 'text-green-400' : riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400';

  const explanation =
    proposal.explanation ??
    evalSummary?.overall ??
    'AI explanation is not available for this proposal.';

  const similarProposals = proposal.similarProposals ?? proposal.analysis?.similar_proposals ?? proposal.analysis?.similarProposals ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-prism-accent/10 border border-prism-accent/20">
            <FileText className="w-6 h-6 text-prism-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-prism-text text-glow">
              {proposal.title || proposal.fileName || 'Proposal Analysis'}
            </h1>
            <p className="text-sm text-prism-text-muted mt-1">
              Uploaded {new Date(proposal.uploadedAt || proposal.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-prism-accent hover:bg-prism-glow text-white text-sm font-medium transition-colors shadow-[0_0_15px_rgba(30,144,255,0.3)]"
        >
          <Download className="w-4 h-4" />
          Download Report
        </motion.button>
      </div>

      {/* Overall Score & AI Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-8 md:w-1/3 shrink-0">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(30,144,255,0.1)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#1e90ff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallScore * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-prism-text">{overallScore}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-prism-text">Overall Evaluation Score</h3>
              <p className="text-sm text-prism-text-muted mt-1">
                Risk Level: <span className={`font-semibold ${riskColor}`}>{riskLevel}</span>
              </p>
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-8 md:border-l border-prism-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-prism-accent/10 border border-prism-accent/20">
                <Brain className="w-5 h-5 text-prism-accent" />
              </div>
              <h3 className="text-lg font-bold text-prism-text">AI Explanation</h3>
            </div>
            <p className="text-sm text-prism-text-muted leading-relaxed">{explanation}</p>
          </div>
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ScoreBreakdown 
            scores={scores} 
            onMetricClick={(label, score) => {
              if (!id) return;
              setSelectedMetric(label);
              setSelectedScore(score);
              setModalOpen(true);
              setMetricLoading(true);
              setMetricError(null);
              setMetricData(null);
              getMetricExplanation(id, label, score)
                .then(setMetricData)
                .catch(err => setMetricError(err.message))
                .finally(() => setMetricLoading(false));
            }}
          />

          {similarProposals.length > 0 && id && (
            <SimilarityNetwork
              currentId={id}
              currentTitle={proposal.title || 'Current Proposal'}
              similarProposals={similarProposals}
            />
          )}


        </div>

        {/* Right Column - Chatbot */}
        <div>
          {id && <ChatbotPanel proposalId={id} />}
        </div>
      </div>

      {modalOpen && (
        <MetricExplanationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          metric={selectedMetric}
          score={selectedScore}
          data={metricData}
          loading={metricLoading}
          error={metricError}
        />
      )}
    </div>
  );
}
