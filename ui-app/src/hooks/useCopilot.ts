import { useState } from "react";
import { askOllama } from "services/ollama";
import type { ChatMessage } from "types/chat";
import type { GraphSelection } from "types/graph";

const makeMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  timestamp: Date.now()
});

export const useCopilot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    makeMessage("assistant", "Hi — select a node or ask a business question about your ontology.")
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, makeMessage("user", content)]);

    try {
      const answer = await askOllama(content);
      setMessages((prev) => [...prev, makeMessage("assistant", answer)]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unexpected copilot error");
    } finally {
      setLoading(false);
    }
  };

  const explainSelection = async (selection: GraphSelection) => {
    const prompt = `Explain this ontology node in business terms. Node: ${selection.label}; Type: ${selection.type}; Relationships: ${selection.relationships}`;
    await sendMessage(prompt);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    explainSelection
  };
};
