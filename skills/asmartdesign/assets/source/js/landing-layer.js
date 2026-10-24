/**
 * Layer approach — explicit #hero-network mount with responsive tuning.
 */
(function () {
  "use strict";

  var PRESET = {
    background: "transparent",
    baseColor: "#ffffff",
    accentColor: "#8fb0ff",
    density: 380,
    dotSize: 95,
    speed: 72,
    drift: 145,
    hover: 48,
    pullReach: 190,
    pullRate: 0.16,
    linkDistance: 98,
    cursorLinks: 10,
    network: { lineWidth: 90, halo: 200, pulse: 88 },
  };

  var field = null;

  function breakpoint() {
    var w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }

  function hasFinePointer() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  /** Shorter links at high density — fewer strings, less solid clustering. */
  function scaleLinkDistance(density, base) {
    if (density <= 140) return base;
    return Math.max(72, Math.round(base - (density - 140) * 0.1));
  }

  function tune(base) {
    var opts = Object.assign({}, base);
    var bp = breakpoint();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return Object.assign(opts, { speed: 0, drift: 0, hover: 0, density: 52 });
    }

    if (bp === "mobile") {
      opts.density = Math.min(Math.round(base.density * 0.45), 140);
      opts.dotSize = Math.min(base.dotSize, 88);
      opts.network = Object.assign({}, opts.network, { lineWidth: 90, halo: 175 });
    } else if (bp === "tablet") {
      opts.density = Math.min(Math.round(base.density * 0.65), 200);
      opts.dotSize = Math.min(base.dotSize, 94);
    }

    opts.linkDistance = scaleLinkDistance(opts.density, base.linkDistance);

    if (!hasFinePointer()) {
      opts.hover = 0;
    }

    return opts;
  }

  function apply() {
    if (!field) return;
    field.update(tune(PRESET));
  }

  function init() {
    var el = document.getElementById("hero-network");
    if (!el || !window.ConstellationField) return;
    field = window.ConstellationField.mount(el, tune(PRESET));

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(apply, 120);
    });

    var pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (pointerMq.addEventListener) {
      pointerMq.addEventListener("change", apply);
    } else if (pointerMq.addListener) {
      pointerMq.addListener(apply);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
