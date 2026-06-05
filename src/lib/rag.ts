import { RAG_CONFIG } from "./rag-config";
import {
  MEDIUM_ASSISTANT_SYSTEM_PROMPT,
  buildUserPrompt,
} from "./prompts";
import { embedTexts, chatCompletion } from "./openai-client";
import { queryVectors } from "./pinecone-client";

export type ContextChunk = {
  article_id: string;
  title: string;
  authors: string;
  chunk: string;
  score: number;
};

type PublicContextChunk = Omit<ContextChunk, "authors">;

export type PromptResult = {
  response: string;
  context: PublicContextChunk[];
  Augmented_prompt: {
    System: string;
    User: string;
  };
};

function metaString(
  metadata: Record<string, string | number | boolean | string[]>,
  key: string
): string {
  const v = metadata[key];
  if (v === undefined || v === null) return "";
  return Array.isArray(v) ? v.join(", ") : String(v);
}

function formatContextForPrompt(chunks: ContextChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `[${i + 1}] article_id=${c.article_id} | title=${c.title} | authors=${c.authors} | score=${c.score.toFixed(
          4
        )}\n${c.chunk}`
    )
    .join("\n\n");
}

function dedupeByArticle(
  chunks: ContextChunk[],
  maxArticles?: number
): ContextChunk[] {
  const seen = new Set<string>();
  const out: ContextChunk[] = [];
  for (const c of chunks) {
    if (seen.has(c.article_id)) continue;
    seen.add(c.article_id);
    out.push(c);
    if (maxArticles !== undefined && out.length >= maxArticles) break;
  }
  return out;
}

export async function answerQuestion(
  question: string
): Promise<PromptResult> {
  const [queryEmbedding] = await embedTexts([question]);
  const matches = await queryVectors(queryEmbedding, RAG_CONFIG.top_k);

  // הקשר מלא – כולל authors, לשימוש בפרומפט
  const fullContext: ContextChunk[] = matches.map((m) => ({
    article_id: metaString(m.metadata, "article_id"),
    title: metaString(m.metadata, "title"),
    authors: metaString(m.metadata, "authors"),
    chunk: metaString(m.metadata, "chunk"),
    score: m.score,
  }));

  const contextBlock = formatContextForPrompt(fullContext);
  const system = MEDIUM_ASSISTANT_SYSTEM_PROMPT;
  const user = buildUserPrompt(question, contextBlock);
  const response = await chatCompletion(system, user);

  const publicContext: PublicContextChunk[] = fullContext.map(
    ({ authors, ...rest }) => rest
  );

  return {
    response,
    context: publicContext,
    Augmented_prompt: {
      System: system,
      User: user,
    },
  };
}
