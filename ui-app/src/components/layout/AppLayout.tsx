import { useCallback } from "react";
import { CopilotPanel } from "components/copilot/CopilotPanel";
import { GraphContainer } from "components/graph/GraphContainer";
import { TopNavbar } from "components/layout/TopNavbar";
import { Sidebar } from "components/sidebar/Sidebar";
import { useCopilot } from "hooks/useCopilot";
import { useNodeList } from "hooks/useNodeList";
import type { GraphSelection } from "types/graph";

export const AppLayout = () => {
  const { messages, loading, error, sendMessage, explainSelection } = useCopilot();
  const { query, setQuery, nodes } = useNodeList();

  const handleSelectionChange = useCallback(
    (selection: GraphSelection) => {
      void explainSelection(selection);
    },
    [explainSelection]
  );

  return (
    <div className="grid h-screen grid-rows-[auto,1fr] bg-surface">
      <TopNavbar />
      <main className="grid grid-cols-[280px,1fr,360px] gap-4 p-4">
        <Sidebar query={query} onQueryChange={setQuery} nodes={nodes} />
        <GraphContainer onSelectionChange={handleSelectionChange} />
        <CopilotPanel messages={messages} loading={loading} error={error} onSend={sendMessage} />
      </main>
    </div>
  );
};
