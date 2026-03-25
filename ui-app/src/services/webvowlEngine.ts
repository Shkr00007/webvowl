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

export const mountWebVowlBlackBox = async (container: HTMLDivElement): Promise<void> => {
  container.innerHTML = "";
  const mountPoint = document.createElement("div");
  mountPoint.className = "h-full w-full rounded-xl border border-border bg-surface";
  mountPoint.id = "webvowl-blackbox-mount";
  container.appendChild(mountPoint);

  // Black-box runtime load. React never uses D3 directly.
  await loadScript("/js/d3.min.js");
  await loadScript("/js/webvowl.js");

  // Current phase: host container and runtime bootstrap point.
  // Actual runtime API hookup can be finalized once WebVOWL exposes a stable embeddable init API.
  mountPoint.setAttribute("data-engine", "webvowl-loaded");
};
