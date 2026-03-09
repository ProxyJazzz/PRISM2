import { getProposals } from './proposals';

export const getDashboardStats = async () => {
  const proposals = await getProposals();
  const totalProposals = proposals.length;
  const received = proposals.length;
  const evaluated = proposals.filter((p: any) => p.finalScore != null || p.score != null).length;
  const remaining = totalProposals - evaluated;

  return {
    totalProposals,
    received,
    evaluated,
    remaining
  };
};

export const getDashboardActivity = async () => {
  const proposals = await getProposals();
  
  const activityMap: Record<string, number> = {};
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    activityMap[dateStr] = 0;
  }

  proposals.forEach((p: any) => {
    if (p.finalScore != null || p.score != null) {
      const d = new Date(p.createdAt || p.uploadedAt || new Date());
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (activityMap[dateStr] !== undefined) {
        activityMap[dateStr]++;
      } else {
        activityMap[dateStr] = 1;
      }
    }
  });

  return Object.keys(activityMap).map(date => ({
    date,
    evaluations: activityMap[date]
  }));
};
