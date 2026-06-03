/** Read env vars with trim; supports alternate names (e.g. PINECONE_INDEX). */
export function getOptionalEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getRequiredEnv(name: string, hint?: string): string {
  const value = getOptionalEnv(name);
  if (!value) {
    throw new Error(hint ?? `${name} is not set`);
  }
  return value;
}

export function getEnvStatus(): Record<string, boolean> {
  return {
    OPENAI_API_KEY: Boolean(getOptionalEnv("OPENAI_API_KEY")),
    OPENAI_BASE_URL: Boolean(getOptionalEnv("OPENAI_BASE_URL")),
    PINECONE_API_KEY: Boolean(getOptionalEnv("PINECONE_API_KEY")),
    PINECONE_INDEX: Boolean(
      getOptionalEnv("PINECONE_INDEX_NAME", "PINECONE_INDEX")
    ),
  };
}
