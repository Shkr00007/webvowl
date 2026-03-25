import type { GraphNode } from "types/app";

type MountOptions = {
  onNodeClick: (node: GraphNode) => void;
};

type MountedEngine = {
  focusNode: (node: GraphNode | null) => void;
  destroy: () => void;
};

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-webvowl-src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.webvowlSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });

const demoNode: GraphNode = {
  id: "person",
  label: "Person",
  type: "Class",
  connections: 12
};

export const mountWebVowlBlackBox = async (container: HTMLDivElement, options: MountOptions): Promise<MountedEngine> => {
  container.innerHTML = "";

  const mountPoint = document.createElement("div");
  mountPoint.className = "h-full w-full rounded-xl border border-border bg-surface";
  mountPoint.id = "webvowl-blackbox-mount";
  container.appendChild(mountPoint);

  await loadScript("/js/d3.min.js");
  await loadScript("/js/webvowl.js");

  mountPoint.setAttribute("data-engine", "webvowl-loaded");

  const clickHandler = () => {
    options.onNodeClick(demoNode);
  };

  mountPoint.addEventListener("click", clickHandler);

  return {
    focusNode: (node) => {
      mountPoint.setAttribute("data-focused-node", node?.id ?? "");
    },
    destroy: () => {
      mountPoint.removeEventListener("click", clickHandler);
      container.innerHTML = "";
    }
  };
};
