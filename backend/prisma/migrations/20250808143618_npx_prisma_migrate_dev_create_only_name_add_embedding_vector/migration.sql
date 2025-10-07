-- Enable pgvector extension (vector type)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to initiatives (Gemini = 768 dims)
ALTER TABLE "initiatives"
  ADD COLUMN IF NOT EXISTS "embedding" vector(768);

-- HNSW index for similarity search
CREATE INDEX IF NOT EXISTS "initiatives_embedding_hnsw"
  ON "initiatives" USING hnsw ("embedding" vector_l2_ops);