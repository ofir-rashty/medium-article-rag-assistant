/** RAG hyperparameters — must match Colab ingest + GET /api/stats */
export const RAG_CONFIG = {
  chunk_size: 512,
  overlap_ratio: 0.17,
  top_k: 12,
} as const;

/** Same model name as Colab (instructor proxy on api.llmod.ai) */
export const EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL ?? "4UHRUIN-text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536;
export const CHAT_MODEL = process.env.CHAT_MODEL ?? "4UHRUIN-gpt-5-mini";
