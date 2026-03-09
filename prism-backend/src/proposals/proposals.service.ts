import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AiService } from '../ai/ai.service';

export interface ProposalSummary {
  proposalId: number;
  fileName: string;
  createdAt: Date;
  finalScore: number | null;
  category: string | null;
  documentType?: string;
}

export interface ProposalDetail {
  proposalId: number;
  fileName: string;
  analysis: any;
}

export interface ProposalAnalytics {
  totalProposals: number;
  averageScore: number;
  categoryDistribution: Record<string, number>;
}

@Injectable()
export class ProposalsService {
  private readonly logger = new Logger(ProposalsService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) { }

  async uploadProposal(userId: number, file: Express.Multer.File): Promise<any> {
    try {

      this.logger.log(`Forwarding ${file.originalname} to AI service`);

      const aiAnalysis = await this.aiService.analyzeProposal(file);

      if (!aiAnalysis) {
        throw new InternalServerErrorException("AI analysis failed");
      }

      this.logger.log(`AI response received. AI Proposal ID: ${aiAnalysis.proposal_id}`);

      return await this.prisma.$transaction(async (tx) => {

        const proposal = await tx.proposal.create({
          data: {
            userId: userId,
            fileName: file.originalname,
            aiProposalId: aiAnalysis.proposal_id,
            status: "processed",
          },
        });

        const evaluation = aiAnalysis.proposal_evaluation || {};

        await tx.proposalAnalysis.create({
          data: {
            proposalId: proposal.id,
            finalScore: evaluation.final_score ?? null,
            category: evaluation.category ?? null,
            evaluationSummary: aiAnalysis.evaluation_summary ?? null,
            analysisJson: aiAnalysis,
          },
        });

        return {
          proposalId: proposal.id,
          analysis: aiAnalysis,
        };

      });

    } catch (error) {
      this.logger.error("Upload Error:", error);

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Database failure during proposal storage"
      );
    }
  }

  async getUserProposals(userId: number): Promise<ProposalSummary[]> {
    this.logger.log(`Fetching proposals for user: ${userId}`);
    try {
      const proposals = await this.prisma.proposal.findMany({
        where: { userId: userId },
        select: {
          id: true,
          fileName: true,
          uploadDate: true,
          analysis: {
            select: {
              finalScore: true,
              category: true,
              analysisJson: true,
            },
          },
        },
        orderBy: { uploadDate: 'desc' },
      });

      return proposals.map((p) => {
        let documentType = undefined;
        if (p.analysis?.analysisJson) {
          const json = p.analysis.analysisJson as any;
          documentType = json?.document_classification?.document_type;
        }

        return {
          proposalId: p.id,
          fileName: p.fileName,
          createdAt: p.uploadDate,
          finalScore: p.analysis?.finalScore ?? null,
          category: p.analysis?.category ?? null,
          documentType,
        };
      });
    } catch (error) {
      this.logger.error("Error fetching user proposals:", error);
      throw new InternalServerErrorException('Database failure during proposal retrieval');
    }
  }

  async getProposalById(proposalId: number, userId: number): Promise<ProposalDetail | null> {
    this.logger.log(`Fetching proposal details for proposalId: ${proposalId}, userId: ${userId}`);
    try {
      const proposal = await this.prisma.proposal.findFirst({
        where: { id: proposalId, userId: userId },
        select: {
          id: true,
          fileName: true,
          analysis: {
            select: {
              analysisJson: true,
            },
          },
        },
      });

      if (!proposal) {
        return null;
      }

      return {
        proposalId: proposal.id,
        fileName: proposal.fileName,
        analysis: proposal.analysis?.analysisJson ?? null,
      };
    } catch (error) {
      this.logger.error("Error fetching proposal details:", error);
      throw new InternalServerErrorException('Database failure during proposal retrieval');
    }
  }

  async getProposalAnalytics(userId: number): Promise<ProposalAnalytics> {
    this.logger.log(`Generating analytics for user: ${userId}`);
    try {
      const analyses = await this.prisma.proposalAnalysis.findMany({
        where: {
          proposal: {
            userId: userId,
          },
        },
        select: {
          finalScore: true,
          category: true,
        },
      });

      const totalProposals = analyses.length;
      let totalScore = 0;
      let scoredCount = 0;
      const categoryDistribution: Record<string, number> = {};

      analyses.forEach((a) => {
        if (a.finalScore !== null) {
          totalScore += a.finalScore;
          scoredCount++;
        }
        if (a.category) {
          categoryDistribution[a.category] =
            (categoryDistribution[a.category] || 0) + 1;
        }
      });

      const averageScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

      return {
        totalProposals,
        averageScore,
        categoryDistribution,
      };
    } catch (error) {
      this.logger.error("Error generating proposal analytics:", error);
      throw new InternalServerErrorException('Database failure during analytics generation');
    }
  }

  async chatWithProposal(proposalId: number, userId: number, message: string): Promise<any> {
    this.logger.log(`Processing chat for proposalId: ${proposalId}, userId: ${userId}`);
    
    // Auth check + get context
    const proposal = await this.prisma.proposal.findFirst({
      where: { id: proposalId, userId: userId },
      select: {
        analysis: {
          select: {
            analysisJson: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new InternalServerErrorException('Proposal not found or unauthorized');
    }

    const context = JSON.stringify(proposal.analysis?.analysisJson || {});
    return await this.aiService.chatWithProposal(context, message);
  }

  async getMetricExplanation(proposalId: number, userId: number, metric: string, score: number): Promise<any> {
    this.logger.log(`Processing metric explanation for proposalId: ${proposalId}, metric: ${metric}`);
    
    // Auth check + get context
    const proposal = await this.prisma.proposal.findFirst({
      where: { id: proposalId, userId: userId },
      select: {
        analysis: {
          select: {
            analysisJson: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new InternalServerErrorException('Proposal not found or unauthorized');
    }

    const context = JSON.stringify(proposal.analysis?.analysisJson || {});
    return await this.aiService.getMetricExplanation(context, metric, score);
  }
}
