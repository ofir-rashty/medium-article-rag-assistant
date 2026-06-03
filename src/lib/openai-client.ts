import OpenAI from "openai";
import { getOptionalEnv, getRequiredEnv } from "./env";
import { CHAT_MODEL, EMBEDDING_MODEL } from "./rag-config";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!client) {
    const apiKey = getRequiredEnv(
      "OPENAI_API_KEY",
      "OPENAI_API_KEY is not set. In Vercel: Project → Settings → Environment Variables — add OPENAI_API_KEY for Production and Preview, then Redeploy (Deployments → … → Redeploy)."
    );
    const baseURL = getOptionalEnv("OPENAI_BASE_URL");
    client = new OpenAI({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
    });
  }
  return client;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const openai = getOpenAI();
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

export async function chatCompletion(
  system: string,
  user: string
): Promise<string> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}
