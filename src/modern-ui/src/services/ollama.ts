const OLLAMA_ENDPOINT = "http://ollama-mobius-sales.mobiusdtaas.ai/api/generate";
const OLLAMA_MODEL = "llama3.1:8b-instruct";

interface OllamaGenerateResponse {
  response?: string;
}

export const generateWithOllama = async (prompt: string, signal?: AbortSignal): Promise<string> => {
  const response = await fetch(OLLAMA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false
    }),
    signal
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const payload = (await response.json()) as OllamaGenerateResponse;
  return payload.response?.trim() ?? "No response returned.";
};

export const buildNodeBusinessPrompt = (nodeLabel: string, nodeType: string, relationships: string) =>
  `Explain this ontology node in business terms.\nNode: ${nodeLabel}\nType: ${nodeType}\nRelationships: ${relationships}`;

export const buildExecutiveInsightsPrompt = (ontologySummary: string) =>
  `Summarize this ontology for business stakeholders.\n\nOntology snapshot:\n${ontologySummary}`;

export const buildNaturalSearchPrompt = (query: string, availableNodeIds: string[]) =>
  `Given this ontology node list: ${availableNodeIds.join(", ")}. User query: "${query}". Return a comma-separated list of the best matching node IDs only.`;
