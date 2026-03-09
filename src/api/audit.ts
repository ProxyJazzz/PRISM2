import { getProposals } from './proposals';

export const getAuditLogs = async () => {
  const proposals = await getProposals();
  const logs: any[] = [];
  
  proposals.forEach((p: any) => {
    const title = p.fileName || p.title || 'Untitled Proposal';
    const uploadDate = p.createdAt || p.uploadedAt || new Date().toISOString();
    
    logs.push({
      id: `up-${p.proposalId || p.id}`,
      action: 'uploaded',
      proposalId: p.proposalId || p.id,
      proposalTitle: title,
      timestamp: uploadDate,
      details: 'Document successfully recorded by system.'
    });
    
    if (p.finalScore != null || p.score != null) {
      const evalDate = new Date(new Date(uploadDate).getTime() + 5000).toISOString();
      logs.push({
        id: `ev-${p.proposalId || p.id}`,
        action: 'evaluation_completed',
        proposalId: p.proposalId || p.id,
        proposalTitle: title,
        timestamp: evalDate,
        details: `Analysis complete. Score: ${p.finalScore ?? p.score}%`
      });
    }
  });
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
