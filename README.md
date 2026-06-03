# Medium Article RAG Assistant

RAG assistant over the Medium English articles dataset — **deployed on Vercel**.  
Vectors were ingested in **Google Colab** (Pinecone); this repo is only the Next.js API + UI.

## Submission checklist

| Item | Status |
|------|--------|
| Public GitHub URL | Add after `git push` |
| Public Vercel live URL | Add after deploy |
| `POST /api/prompt` | Implemented |
| `GET /api/stats` | Implemented |
| Pinecone index (1536 dims) | Done in Colab (`medium-rag-index`) |
| System prompt constraints | `src/lib/prompts.ts` |

**Deadline:** 7.6.2026 end of day — submit live URL + GitHub URL.

## RAG hyperparameters (Colab + `/api/stats`)

| Parameter | Value |
|-----------|-------|
| `chunk_size` | 512 (words) |
| `overlap_ratio` | 0.17 |
| `top_k` | 8 |

## Tech stack

- **Next.js 15** (App Router) on Vercel
- **OpenAI** via `https://api.llmod.ai` — `4UHRUIN-text-embedding-3-small`, `gpt-5-mini`
- **Pinecone** — index `medium-rag-index`

## What to commit to Git

Only application code — **not** secrets, CSV, or ingestion tooling:

```
src/          → API + UI
package.json
vercel.json   → includes OPENAI_BASE_URL default
.env.example  → template only (no real keys)
```

**Do not push:** `.env`, `.env.local`, `medium-english-50mb.csv`, `node_modules`, `.next`

## Setup (local dev)

```bash
npm install
copy .env.example .env.local
```

Fill `.env.local` with the same keys as Colab, then:

```bash
npm run dev
```

- UI: http://localhost:3000  
- Health (env check): http://localhost:3000/api/health  
- Stats: http://localhost:3000/api/stats  

## Deploy to Vercel

1. Push to **public** GitHub.
2. Import the repo on [vercel.com](https://vercel.com).
3. **Environment variables** (Production **and** Preview):

| Name | Example / note |
|------|----------------|
| `OPENAI_API_KEY` | Your llmod.ai key (no quotes, no spaces) |
| `PINECONE_API_KEY` | From Pinecone console |
| `PINECONE_INDEX_NAME` | `medium-rag-index` |

`OPENAI_BASE_URL` is set in `vercel.json` to `https://api.llmod.ai` — you do not need to add it unless you override it.

4. **Redeploy** after adding or changing env vars (Deployments → ⋯ → Redeploy).

5. Verify: `GET https://your-app.vercel.app/api/health`  
   All flags should be `true` and `"ready": true`. If `OPENAI_API_KEY` is `false`, the key is missing or the deployment was not redeployed.

## API contract

### `POST /api/prompt`

```json
{ "question": "Your natural language question here" }
```

### `GET /api/stats`

```json
{ "chunk_size": 512, "overlap_ratio": 0.17, "top_k": 8 }
```

### `GET /api/health` (debug)

Returns which env vars the server sees (boolean only, no secrets).

## Ingestion

Done in Colab (chunk → embed → Pinecone). This repo does **not** include the ingest script or the 50MB CSV.

## Author

Replace with your name and course details before submission.
