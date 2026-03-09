import { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface SimilarProposal {
  id: string;
  title: string;
  similarity: number;
}

interface SimilarityNetworkProps {
  currentId: string;
  currentTitle: string;
  similarProposals: SimilarProposal[];
}

export default function SimilarityNetwork({
  currentId,
  currentTitle,
  similarProposals,
}: SimilarityNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = [
    { id: currentId, name: currentTitle, val: 20, color: '#1e90ff' },
    ...similarProposals.map((p) => ({
      id: p.id,
      name: p.title,
      val: 10 + p.similarity * 10,
      color: '#00c6ff',
    })),
  ];

  const links = similarProposals.map((p) => ({
    source: currentId,
    target: p.id,
    value: p.similarity,
  }));

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-lg font-bold text-prism-text mb-4">Similarity Network</h3>
      <div ref={containerRef} className="h-[300px] rounded-xl overflow-hidden bg-prism-bg/50">
        <ForceGraph2D
          graphData={{ nodes, links }}
          width={containerRef.current?.clientWidth || 500}
          height={300}
          backgroundColor="transparent"
          nodeColor={(node: any) => node.color}
          nodeLabel={(node: any) => node.name}
          linkColor={() => 'rgba(30,144,255,0.3)'}
          linkWidth={(link: any) => link.value * 3}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const label = node.name?.substring(0, 15) || '';
            const fontSize = 11 / globalScale;
            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val / 3, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Label
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, node.x, node.y + node.val / 3 + fontSize + 2);
          }}
        />
      </div>
    </div>
  );
}
