import type { OntologyNode, SelectedNode } from "types/ontology";

type GraphEvents = {
  onGraphLoaded?: () => void;
  onNodeClick?: (node: SelectedNode) => void;
};

const LEGACY_URL = "/index.html#foaf";

const asText = (doc: Document, id: string) => doc.getElementById(id)?.textContent?.trim() ?? "-";

export class WebVowlBridge {
  private iframe: HTMLIFrameElement;
  private events: GraphEvents;
  private observer?: MutationObserver;
  private resizeObserver?: ResizeObserver;

  constructor(iframe: HTMLIFrameElement, events: GraphEvents) {
    this.iframe = iframe;
    this.events = events;
  }

  mount() {
    this.iframe.src = LEGACY_URL;
    this.iframe.addEventListener("load", this.onIframeLoaded);
    this.resizeObserver = new ResizeObserver(() => {
      const frameWindow = this.iframe.contentWindow;
      frameWindow?.dispatchEvent(new Event("resize"));
    });
    this.resizeObserver.observe(this.iframe);
  }

  unmount() {
    this.iframe.removeEventListener("load", this.onIframeLoaded);
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
  }

  getOntologyNodes(): OntologyNode[] {
    const graph = this.getGraph();
    if (!graph?.getUnfilteredData) return [];

    const data = graph.getUnfilteredData();
    if (!data?.nodes) return [];

    return data.nodes.map((node: { id?: () => string; labelForCurrentLanguage?: () => string; type?: () => string }) => ({
      id: node.id?.() ?? "unknown",
      label: node.labelForCurrentLanguage?.() ?? node.id?.() ?? "Unknown",
      type: this.mapNodeType(node.type?.())
    }));
  }

  highlightNodes(nodeIds: string[]) {
    const graph = this.getGraph();
    if (!graph?.highLightNodes) return;
    graph.highLightNodes(nodeIds);
  }

  focusNode(nodeId: string) {
    const graph = this.getGraph();
    if (!graph?.highLightNodes) return;
    graph.highLightNodes([nodeId]);
    if (graph.locateSearchResult) {
      graph.locateSearchResult();
    }
  }

  toggleFocusMode(enabled: boolean, selectedNodeId?: string) {
    const frameDoc = this.iframe.contentDocument;
    if (!frameDoc) return;

    const svg = frameDoc.querySelector("svg");
    if (!svg) return;

    svg.classList.toggle("react-focus-mode", enabled);
    if (enabled && selectedNodeId) {
      this.highlightNodes([selectedNodeId]);
    }
  }

  getOntologySnapshot(): string {
    const nodes = this.getOntologyNodes();
    if (!nodes.length) return "No ontology nodes loaded.";

    return nodes.slice(0, 40).map((node) => `${node.id} (${node.type})`).join("\n");
  }

  private mapNodeType(type?: string): OntologyNode["type"] {
    if (!type) return "unknown";
    const normalized = type.toLowerCase();
    if (normalized.includes("class")) return "class";
    if (normalized.includes("property")) return "property";
    if (normalized.includes("datatype")) return "datatype";
    return "unknown";
  }

  private onIframeLoaded = () => {
    const frameWindow = this.iframe.contentWindow;
    const frameDoc = this.iframe.contentDocument;
    if (!frameWindow || !frameDoc) return;

    const selectedNodeName = frameDoc.getElementById("summaryNodeName");
    if (!selectedNodeName) {
      this.events.onGraphLoaded?.();
      return;
    }

    this.observer = new MutationObserver(() => {
      const node: SelectedNode = {
        id: asText(frameDoc, "summaryNodeName"),
        label: asText(frameDoc, "summaryNodeName"),
        type: asText(frameDoc, "summaryNodeType"),
        relationships: asText(frameDoc, "summaryNodeRelationships")
      };
      if (node.label !== "-") {
        this.events.onNodeClick?.(node);
      }
    });

    this.observer.observe(selectedNodeName, {
      characterData: true,
      childList: true,
      subtree: true
    });

    this.injectFocusStyles(frameDoc);
    this.events.onGraphLoaded?.();
  };

  private injectFocusStyles(doc: Document) {
    if (doc.getElementById("react-focus-mode-style")) return;

    const style = doc.createElement("style");
    style.id = "react-focus-mode-style";
    style.textContent = `
      svg.react-focus-mode g { transition: opacity 180ms ease; }
      svg.react-focus-mode g:not(.searchResultA) { opacity: 0.2; }
      svg.react-focus-mode .searchResultA { opacity: 1 !important; filter: drop-shadow(0 0 8px rgba(91,140,255,0.8)); }
    `;

    doc.head.appendChild(style);
  }

  private getGraph(): {
    getUnfilteredData?: () => { nodes?: Array<unknown> };
    highLightNodes?: (nodeIds: string[]) => void;
    locateSearchResult?: () => void;
  } | null {
    const frameWindow = this.iframe.contentWindow as (Window & { webvowl?: { gr?: unknown } }) | null;
    if (!frameWindow?.webvowl?.gr) return null;
    return frameWindow.webvowl.gr as {
      getUnfilteredData?: () => { nodes?: Array<unknown> };
      highLightNodes?: (nodeIds: string[]) => void;
      locateSearchResult?: () => void;
    };
  }
}
