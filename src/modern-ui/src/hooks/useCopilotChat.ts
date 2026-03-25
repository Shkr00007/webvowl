import { useMemo, useState } from "react";
import { buildNodeBusinessPrompt, generateWithOllama } from "services/ollama";
import type { ChatMessage } from "types/chat";
import type { SelectedNode } from "types/ontology";

const createMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  createdAt: Date.now()
});

export const useCopilotChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", "I can explain selected ontology nodes in business language.")
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askCopilot = async (userInput: string) => {
    if (!userInput.trim()) return;
    setError(null);
    setIsLoading(true);
    const userMessage = createMessage("user", userInput);
    setMessages((previous) => [...previous, userMessage]);

    try {
      const response = await generateWithOllama(userInput);
      setMessages((previous) => [...previous, createMessage("assistant", response)]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unknown error while contacting AI service.");
    } finally {
      setIsLoading(false);
    }
  };

  const explainNode = async (node: SelectedNode) => {
    const prompt = buildNodeBusinessPrompt(node.label, node.type, node.relationships);
    await askCopilot(prompt);
  };

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  return {
    messages,
    isLoading,
    error,
    hasMessages,
    askCopilot,
    explainNode
  };
};
