import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import ProposalList, { Proposal } from "../../components/ProposalList";
import { getProposals } from "../../api/proposals";

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProposals()
      .then((data) => {
        const mapped = (data as any[]).map((p: any) => ({
          id: p.proposalId || p.id,
          title: p.fileName || p.title || "Untitled Proposal",
          uploadedAt: p.createdAt || p.uploadedAt || new Date().toISOString(),
          status:
            p.finalScore != null || p.score != null ? "evaluated" : "pending",
          score: p.finalScore ?? p.score ?? p.overallScore,
        }));
        setProposals(mapped);
      })
      .catch((err: any) => setError(err.message || "Failed to load proposals"))
      .finally(() => setLoading(false));
  }, []);

  const pending = proposals.filter((p) => p.status === "pending");
  const evaluated = proposals.filter((p) => p.status === "evaluated");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-prism-accent/10 border border-prism-accent/20">
          <FileText className="w-5 h-5 text-prism-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-prism-text text-glow">
            Proposals
          </h1>
          <p className="text-sm text-prism-text-muted">
            Manage and review all submitted proposals
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Pending */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold text-prism-text mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
          Pending ({pending.length})
        </h2>
        <ProposalList proposals={pending} loading={loading} />
      </motion.div>

      {/* Evaluated */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-prism-text mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          Evaluated ({evaluated.length})
        </h2>
        <ProposalList proposals={evaluated} loading={loading} />
      </motion.div>
    </div>
  );
}
