export const mountWebVowlGraph = (hostId: string) => {
  const host = document.getElementById(hostId);
  if (!host) return;

  // Phase 1: bridge placeholder. Existing WebVOWL runtime can be attached here
  // (e.g. via window.webvowl.app().initialize()) once build pipelines are merged.
  host.setAttribute("data-webvowl-status", "ready-for-bridge");
};
