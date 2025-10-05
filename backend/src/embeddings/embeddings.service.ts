import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmbeddingsService {
  private openAIClient: OpenAI;
  private geminiClient: GoogleGenerativeAI;
  private openAIModel = 'text-embedding-3-small';
  private geminiModel = 'models/text-embedding-004';
  private provider: 'openai' | 'gemini';

  constructor(private prisma: PrismaService) {
    this.provider = (process.env.EMBEDDING_PROVIDER as 'openai' | 'gemini') || 'openai';

    if (this.provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        // We avoid throwing here to keep app booting for non-embedding paths
        // but attempts to embed will fail with a descriptive error.
        return;
      }
      this.openAIClient = new OpenAI({ apiKey });
    } else if (this.provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        this.geminiClient = new GoogleGenerativeAI(apiKey);
      }
    }
  }

  private ensureClient() {
    if (this.provider === 'openai' && !this.openAIClient) {
      throw new Error('OPENAI_API_KEY is not set. Please configure it in your environment.');
    }
    if (this.provider === 'gemini' && !this.geminiClient) {
      throw new Error('GEMINI_API_KEY is not set. Please configure it in your environment.');
    }
  }

  async embedText(text: string): Promise<number[]> {
    this.ensureClient();

    if (this.provider === 'openai') {
      const res = await this.openAIClient.embeddings.create({
        model: this.openAIModel,
        input: text,
      });

      return res.data[0].embedding as unknown as number[];
    } else if (this.provider === 'gemini') {
      try {
        const model = this.geminiClient.getGenerativeModel({ model: this.geminiModel });
        const result = await model.embedContent(text, );

        return result.embedding.values;
      } catch (err: any) {
        console.error('[EmbeddingsService] Gemini embedding error:', err);
        throw new Error('GEMINI_EMBEDDING_ERROR: ' + (err?.message || err));
      }
    } else {
      throw new Error('Unknown embedding provider');
    }
  }

  async generateAndStoreInitiativeEmbedding(initiative: {
    id: string;
    title: string;
    description: string;
    theme?: string | null;
    context?: string | null;
    deliverable?: string | null;
    evaluationCriteria?: string | null;
  }) {
    const text = [
      initiative.title,
      initiative.description,
      initiative.theme,
      initiative.context,
      initiative.deliverable,
      initiative.evaluationCriteria,
    ]
      .filter(Boolean)
      .join('\n');

    if (!text) return;

    try {
      const vector = await this.embedText(text);
      const vectorLiteral = `[${vector.join(',')}]`;
      await this.prisma.$executeRawUnsafe(
        'UPDATE "initiatives" SET "embedding" = $1::vector WHERE id = $2',
        vectorLiteral,
        initiative.id,
      );
    } catch (e) {
      console.error('[EmbeddingsService] Error generating/storing embedding:', e);
    }
  }

  async searchSimilarText(text: string, limit = 10) {
    const vector = await this.embedText(text);
    const vectorLiteral = `[${vector.join(',')}]`;
    
    const rows: Array<{ id: string; distance: number }> = await this.prisma.$queryRawUnsafe(
      `SELECT id, (embedding <-> $1::vector) AS distance
      FROM "initiatives"
      WHERE embedding IS NOT NULL
      ORDER BY embedding <-> $1::vector ASC
      LIMIT $2`,
      vectorLiteral,
      limit,
    );

    return rows;
  }

  async searchSimilarInitiatives(text: string, limit = 10) {
    const idsWithScores = await this.searchSimilarText(text, limit);
    if (!idsWithScores.length) return [];
    const ids = idsWithScores.map((r) => r.id);
    const initiatives = await this.prisma.initiative.findMany({
      where: { id: { in: ids } },
      include: { _count: { select: { likes: true, comments: true } } },
    });
    const map = new Map(initiatives.map((i) => [i.id, i]));
    return idsWithScores
      .map(({ id, distance }) => ({ distance, initiative: map.get(id) }))
      .filter((x) => x.initiative);
  }
}