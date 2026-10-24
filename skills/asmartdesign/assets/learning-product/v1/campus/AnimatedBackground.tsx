"use client";

import { useEffect, useRef } from "react";

type Field = {
  update: (options: Record<string, unknown>) => void;
  destroy: () => void;
};
type Engine = {
  mount: (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => Field | null;
};
type Kind = "constellation" | "ripple" | "topology";
const engines: Record<
  Kind,
  { src: string; global: string; id: string; className: string }
> = {
  constellation: {
    src: "/js/constellation-field.js",
    global: "ConstellationField",
    id: "hero-network",
    className: "hero-network",
  },
  ripple: {
    src: "/js/line-ripple.js",
    global: "LineRipple",
    id: "login-ripple",
    className: "login-ripple-field",
  },
  topology: {
    src: "/js/topology-field.js",
    global: "TopologyField",
    id: "lobby-sphere",
    className: "lobby-sphere",
  },
};
const scripts = new Map<string, Promise<void>>();
function loadEngine(src: string) {
  let promise = scripts.get(src);
  if (!promise) {
    promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => {
        scripts.delete(src);
        script.remove();
        reject(new Error("background"));
      };
      document.head.appendChild(script);
    });
    scripts.set(src, promise);
  }
  return promise;
}

// Original presets from landing-layer.js, login-ripple.js and lobby-sphere.js.
function options(kind: Kind) {
  const mobile = window.innerWidth < 768;
  const tablet = window.innerWidth < 1024;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  if (kind === "constellation") {
    const density = reduced ? 52 : mobile ? 140 : tablet ? 200 : 380;
    return {
      background: "transparent",
      baseColor: "#ffffff",
      accentColor: "#8fb0ff",
      density,
      dotSize: mobile ? 88 : tablet ? 94 : 95,
      speed: reduced ? 0 : 72,
      drift: reduced ? 0 : 145,
      hover: reduced || !finePointer ? 0 : 48,
      pullReach: 190,
      pullRate: 0.16,
      linkDistance:
        density <= 140
          ? 98
          : Math.max(72, Math.round(98 - (density - 140) * 0.1)),
      cursorLinks: 10,
      network: { lineWidth: 90, halo: mobile ? 175 : 200, pulse: 88 },
    };
  }
  if (kind === "ripple") {
    return {
      backgroundColor: "transparent",
      strokeColor: "rgba(175, 196, 232, 0.48)",
      count: reduced ? 28 : mobile ? 20 : tablet ? 27 : 36,
      movement: reduced ? 0 : 16,
      hover: !reduced && finePointer,
      force: 3,
      resolution: 8,
      track: "window",
    };
  }
  return {
    background: "transparent",
    edgeColor: "#a8c0ef",
    nodeColor: "#ffffff",
    density: reduced ? 80 : mobile ? 66 : tablet ? 90 : 120,
    dotSize: 95,
    speed: reduced ? 0 : 46,
    hover: reduced || !finePointer ? 0 : 90,
    network: { link: 159, lineWidth: 80, pulse: 95 },
    sphere: { offsetX: 0, tilt: 45, camera: 270 },
  };
}

function AnimatedBackground({ kind }: { kind: Kind }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let field: Field | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const engine = engines[kind];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    function mount() {
      field?.destroy();
      const runtime = (window as unknown as Record<string, Engine>)[
        engine.global
      ];
      if (root.current && runtime)
        field = runtime.mount(root.current, options(kind));
    }
    const trackPointer = (event: PointerEvent) => {
      if (kind !== "topology" || motion.matches || !pointer.matches) return;
      const canvas = root.current?.querySelector("canvas");
      canvas?.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: event.clientX,
          clientY: event.clientY,
        }),
      );
    };
    const update = () => field?.update(options(kind));
    const resize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(update, 120);
    };
    // The sphere engine reads reduced-motion on mount, so remount when it changes.
    const motionChanged = () => {
      if (!cancelled) mount();
    };
    loadEngine(engine.src)
      .then(() => {
        if (!cancelled) mount();
      })
      .catch(() => {});
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", trackPointer, { passive: true });
    motion.addEventListener("change", motionChanged);
    pointer.addEventListener("change", update);
    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", trackPointer);
      motion.removeEventListener("change", motionChanged);
      pointer.removeEventListener("change", update);
      field?.destroy();
    };
  }, [kind]);
  const engine = engines[kind];
  return (
    <div
      className={`animated-backdrop animated-backdrop--${kind}`}
      aria-hidden="true"
    >
      <div ref={root} id={engine.id} className={engine.className} />
      <div className="animated-backdrop-scrim" />
    </div>
  );
}

export function ConstellationBackground() {
  return <AnimatedBackground kind="constellation" />;
}
export function RippleBackground() {
  return <AnimatedBackground kind="ripple" />;
}
export function TopologyBackground() {
  return <AnimatedBackground kind="topology" />;
}
