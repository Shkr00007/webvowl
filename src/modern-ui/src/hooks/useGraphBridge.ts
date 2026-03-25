import { useCallback, useEffect, useRef, useState } from "react";
import { WebVowlBridge } from "services/webvowlBridge";
import type { OntologyNode, SelectedNode } from "types/ontology";

export const useGraphBridge = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const bridgeRef = useRef<WebVowlBridge | null>(null);
  const [graphLoaded, setGraphLoaded] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [nodes, setNodes] = useState<OntologyNode[]>([]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const bridge = new WebVowlBridge(iframe, {
      onGraphLoaded: () => {
        setGraphLoaded(true);
        setNodes(bridge.getOntologyNodes());
      },
      onNodeClick: (node) => {
        setSelectedNode(node);
      }
    });

    bridgeRef.current = bridge;
    bridge.mount();

    return () => {
      bridge.unmount();
      bridgeRef.current = null;
    };
  }, []);

  const focusNode = useCallback((nodeId: string) => {
    bridgeRef.current?.focusNode(nodeId);
  }, []);

  const highlightNodes = useCallback((nodeIds: string[]) => {
    bridgeRef.current?.highlightNodes(nodeIds);
  }, []);

  const toggleFocusMode = useCallback((enabled: boolean) => {
    bridgeRef.current?.toggleFocusMode(enabled, selectedNode?.id);
  }, [selectedNode?.id]);

  const getOntologySnapshot = useCallback(() => bridgeRef.current?.getOntologySnapshot() ?? "No graph loaded.", []);

  return {
    iframeRef,
    graphLoaded,
    selectedNode,
    ontologyNodes: nodes,
    focusNode,
    highlightNodes,
    toggleFocusMode,
    getOntologySnapshot
  };
};
