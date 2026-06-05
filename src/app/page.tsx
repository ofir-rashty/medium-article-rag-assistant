"use client";

import { useState } from "react";

type ContextItem = {
  article_id: string;
  title: string;
  chunk: string;
  score: number;
};

type PromptResponse = {
  response: string;
  context: ContextItem[];
  Augmented_prompt: { System: string; User: string };
};

type StatsResponse = {
  chunk_size: number;
  overlap_ratio: number;
  top_k: number;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PromptResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  async function loadStats() {
    const res = await fetch("/api/stats");
    setStats(await res.json());
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? res.statusText);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Medium Article RAG Assistant</h1>
      <p style={{ color: "#444" }}>
        Answers questions using only the indexed Medium articles corpus (Pinecone
        + OpenAI embeddings + gpt-5-mini).
      </p>

      <button type="button" onClick={loadStats} style={{ marginBottom: 16 }}>
        Load RAG stats (GET /api/stats)
      </button>
      {stats && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: 12,
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          {JSON.stringify(stats, null, 2)}
        </pre>
      )}

      <form onSubmit={handleAsk} style={{ marginTop: 24 }}>
        <label htmlFor="q" style={{ display: "block", fontWeight: 600 }}>
          Question
        </label>
        <textarea
          id="q"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          style={{ width: "100%", marginTop: 8, padding: 8 }}
          placeholder="e.g. List exactly 3 articles about education. Return only the titles."
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 12, padding: "8px 16px" }}
        >
          {loading ? "Asking…" : "Ask (POST /api/prompt)"}
        </button>
      </form>

      {error && (
        <p style={{ color: "crimson", marginTop: 16 }}>{error}</p>
      )}

      {result && (
        <section style={{ marginTop: 32 }}>
          <h2>Response</h2>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
            {result.response}
          </p>
          <h3>Retrieved context</h3>
          <pre
            style={{
              background: "#f4f4f4",
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              overflow: "auto",
            }}
          >
            {JSON.stringify(result.context, null, 2)}
          </pre>
          <h3>Augmented prompt</h3>
          <pre
            style={{
              background: "#f4f4f4",
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              overflow: "auto",
            }}
          >
            {JSON.stringify(result.Augmented_prompt, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
