/**
 * Lobby sphere — TopologyField on the neural field.
 * Mounts #lobby-sphere as a full-bleed background, same #070914 as landing/login.
 */
(function () {
  "use strict";

  var PRESET = {
    background: "transparent",
    edgeColor: "#a8c0ef",
    nodeColor: "#ffffff",
    density: 120,
    dotSize: 95,
    speed: 46,
    hover: 90,
    network: { link: 159, lineWidth: 80, pulse: 95 },
    sphere: { offsetX: 0, tilt: 45, camera: 270 },
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
    var opts = JSON.parse(JSON.stringify(base));
    var bp = breakpoint();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      opts.speed = 0;
      opts.hover = 0;
      opts.density = Math.min(opts.density, 80);
    }

    if (bp === "mobile") {
      opts.density = Math.min(Math.round(base.density * 0.55), 110);
      if (opts.sphere) opts.sphere.offsetX = 0;
    } else if (bp === "tablet") {
      opts.density = Math.min(Math.round(base.density * 0.75), 160);
    }

    if (!hasFinePointer()) opts.hover = 0;

    return opts;
  }

  function apply() {
    if (!field) return;
    field.update(tune(PRESET));
  }

  function init() {
    var el = document.getElementById("lobby-sphere");
    if (!el || !window.TopologyField) return;

    field = window.TopologyField.mount(el, tune(PRESET));

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(apply, 120);
    });

    var pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (pointerMq.addEventListener) pointerMq.addEventListener("change", apply);
    else if (pointerMq.addListener) pointerMq.addListener(apply);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
