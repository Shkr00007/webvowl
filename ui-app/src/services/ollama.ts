const ENDPOINT = "http://ollama-mobius-sales.mobiusdtaas.ai/api/generate";
const MODEL = "llama3.1:8b-instruct";

interface OllamaResponse {
  response?: string;
}

export const askOllama = async (prompt: string): Promise<string> => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed (${response.status})`);
  }

  const payload = (await response.json()) as OllamaResponse;
  return payload.response?.trim() ?? "No response returned.";
};
