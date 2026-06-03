import { Pinecone } from "@pinecone-database/pinecone";
import { getOptionalEnv, getRequiredEnv } from "./env";
import { EMBEDDING_DIMENSIONS } from "./rag-config";

let pinecone: Pinecone | null = null;

export function getPinecone(): Pinecone {
  if (!pinecone) {
    const apiKey = getRequiredEnv(
      "PINECONE_API_KEY",
      "PINECONE_API_KEY is not set. Add it in Vercel Environment Variables, then Redeploy."
    );
    pinecone = new Pinecone({ apiKey });
  }
  return pinecone;
}

export function getIndexName(): string {
  const name = getOptionalEnv("PINECONE_INDEX_NAME", "PINECONE_INDEX");
  if (!name) {
    throw new Error(
      "Pinecone index name is not set. Set PINECONE_INDEX_NAME=medium-rag-index (or PINECONE_INDEX) in Vercel, then Redeploy."
    );
  }
  return name;
}

export async function queryVectors(
  vector: number[],
  topK: number
): Promise<
  Array<{
    id: string;
    score: number;
    metadata: Record<string, string | number | boolean | string[]>;
  }>
> {
  const index = getPinecone().index(getIndexName());
  const result = await index.query({
    vector,
    topK,
    includeMetadata: true,
  });

  return (result.matches ?? []).map((m) => ({
    id: m.id ?? "",
    score: m.score ?? 0,
    metadata: (m.metadata ?? {}) as Record<
      string,
      string | number | boolean | string[]
    >,
  }));
}

export { EMBEDDING_DIMENSIONS };
