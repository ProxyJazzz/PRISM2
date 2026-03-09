import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly AI_ANALYZE_ENDPOINT = 'http://localhost:8000/analyze-proposal';
    // Keep legacy endpoint for backward compatibility
    private readonly AI_LEGACY_ENDPOINT = 'http://localhost:8000/analyze';

    constructor(private configService: ConfigService) { }

    /**
     * Sends the uploaded proposal PDF to the AI microservice for PKL-model-based evaluation.
     * Tries the new /analyze-proposal endpoint first, falls back to /analyze.
     */
    async analyzeProposal(file: Express.Multer.File): Promise<any> {
        this.logger.log(`AI analysis started for file: ${file.originalname}`);
        const formData = new FormData();
        // Append the file buffer correctly for standard HTTP transmission
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        try {
            // Try new PKL-based endpoint first
            const response = await axios.post(this.AI_ANALYZE_ENDPOINT, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
                maxBodyLength: Infinity
            });
            this.logger.log(`AI PKL analysis completed`);

            // Normalize the response to match backend schema expectations
            const data = response.data;
            return {
                ...data,
                // Map fields the ProposalsService expects
                proposal_id: data.proposal_id ?? null,
                proposal_evaluation: {
                    final_score: data.overall_score ?? null,
                    category: data.category ?? null,
                },
                evaluation_summary: data.explanation ?? null,
                evaluation_scores: data.scores ?? null,
            };
        } catch (error) {
            this.logger.warn('PKL endpoint failed, falling back to legacy /analyze');
            try {
                const fallbackResponse = await axios.post(this.AI_LEGACY_ENDPOINT, formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                    maxBodyLength: Infinity
                });
                this.logger.log(`AI legacy analysis completed`);
                return fallbackResponse.data;
            } catch (fallbackError) {
                this.logger.error("AI service failure", fallbackError);
                if (fallbackError.response) {
                    throw new InternalServerErrorException(
                        `AI Service failed: ${JSON.stringify(fallbackError.response.data)}`
                    );
                }
                throw new InternalServerErrorException('AI Service is unavailable');
            }
        }
    }

    async chatWithProposal(context: string, message: string): Promise<any> {
        this.logger.log(`Forwarding chat to AI service`);
        try {
            const response = await axios.post(`http://localhost:8000/chat`, {
                context,
                message
            });
            return response.data;
        } catch (error: any) {
            this.logger.error("AI chat service failure", error);
            if (error.response) {
                throw new InternalServerErrorException(
                    `AI Service Chat failed: ${JSON.stringify(error.response.data)}`
                );
            }
            throw new InternalServerErrorException('AI Chat Service is unavailable');
        }
    }
    async getMetricExplanation(context: string, metric: string, score: number): Promise<any> {
        this.logger.log(`Fetching metric explanation for ${metric} from AI service`);
        try {
            const response = await axios.post(`http://localhost:8000/metric-explanation`, {
                metric,
                score,
                context
            });
            return response.data;
        } catch (error: any) {
            this.logger.error("AI metric explanation failure", error);
            if (error.response) {
                throw new InternalServerErrorException(
                    `AI Service Metric Explanation failed: ${JSON.stringify(error.response.data)}`
                );
            }
            throw new InternalServerErrorException('AI Metric Explanation Service is unavailable');
        }
    }
}
