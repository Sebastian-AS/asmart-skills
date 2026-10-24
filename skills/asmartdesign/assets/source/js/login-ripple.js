/**
 * Login Line Ripple — Column preset for V3.
 * Originkit defaults retuned to the neural navy field.
 */
(function () {
  "use strict";

  var PRESET = {
    backgroundColor: "transparent",
    strokeColor: "rgba(175, 196, 232, 0.48)",
    count: 36,
    movement: 16,
    hover: true,
    force: 3,
    resolution: 8,
    track: "window",
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

  function tune(base) {
    var opts = Object.assign({}, base);
    var bp = breakpoint();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return Object.assign(opts, { movement: 0, hover: false, count: Math.min(opts.count, 28) });
    }

    if (bp === "mobile") {
      opts.count = Math.min(Math.round(base.count * 0.55), 28);
      opts.resolution = Math.min(base.resolution, 8);
    } else if (bp === "tablet") {
      opts.count = Math.min(Math.round(base.count * 0.75), 40);
    }

    if (!hasFinePointer()) {
      opts.hover = false;
    }

    return opts;
  }

  function apply() {
    if (!field) return;
    field.update(tune(PRESET));
  }

  function init() {
    var el = document.getElementById("login-ripple");
    if (!el || !window.LineRipple) return;
    field = window.LineRipple.mount(el, tune(PRESET));

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
