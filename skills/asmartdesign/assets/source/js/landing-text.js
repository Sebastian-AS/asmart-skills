/**
 * Hero side-fall + Color Sweep idle + glass carve hover.
 */
(function () {
  "use strict";

  var SWEEP_MS = 5000;
  var BLOB_FOLLOW = 0.16;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildSweepPath(seed) {
    var rng = mulberry32(seed);
    var points = [{ x: 0, y: 50, t: 0 }];
    var x = 0;
    var y = 50;

    for (var i = 1; i < 6; i++) {
      var t = i / 6;
      x = (x + 12 + rng() * 28) % 100;
      y = 38 + rng() * 24;
      points.push({ x: x, y: y, t: t });
    }

    points.push({ x: 0, y: 50, t: 1 });
    return points;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function samplePath(path, progress) {
    for (var i = 0; i < path.length - 1; i++) {
      var a = path[i];
      var b = path[i + 1];
      if (progress >= a.t && progress <= b.t) {
        var local = (progress - a.t) / (b.t - a.t);
        local = smoothstep(local);
        return {
          x: a.x + (b.x - a.x) * local,
          y: a.y + (b.y - a.y) * local,
        };
      }
    }
    return path[0];
  }

  function setSweepPos(el, x, y) {
    el.style.setProperty("--sweep-x", x.toFixed(1) + "%");
    el.style.setProperty("--sweep-y", y.toFixed(1) + "%");
  }

  function splitHeroTitle(el) {
    if (!el || el.dataset.split === "1") return;
    var text = el.textContent.replace(/\s+/g, " ").trim();
    if (!text) return;

    var words = text.split(" ");
    el.textContent = "";
    el.classList.add("is-split");
    el.setAttribute("aria-label", text);
    el.dataset.split = "1";

    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "hero-word";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--i", String(i));
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });
  }

  function cloneGlassWords(h1, layer) {
    var words = h1.querySelectorAll(":scope > .hero-word");
    for (var i = 0; i < words.length; i++) {
      var span = document.createElement("span");
      span.className = "hero-word";
      span.textContent = words[i].textContent;
      layer.appendChild(span);
      if (i < words.length - 1) {
        layer.appendChild(document.createTextNode(" "));
      }
    }
  }

  function bindColorSweep(h1) {
    if (!h1 || reduceMotion) {
      setSweepPos(h1 || document.body, 40, 50);
      return;
    }

    var path = buildSweepPath(0x41534d54);
    var loopStart = performance.now();

    function tick(now) {
      var phase = ((now - loopStart) % SWEEP_MS) / SWEEP_MS;
      var pos = samplePath(path, phase);
      setSweepPos(h1, pos.x, pos.y);
      requestAnimationFrame(tick);
    }

    setSweepPos(h1, 0, 50);
    requestAnimationFrame(tick);
  }

  function bindGlassCarve(h1) {
    if (!h1 || reduceMotion || !finePointer) return;

    h1.classList.add("text-color-sweep--interactive");

    var layer = document.createElement("span");
    layer.className = "hero-glass";
    layer.setAttribute("aria-hidden", "true");
    cloneGlassWords(h1, layer);
    h1.appendChild(layer);

    var glassWords = layer.querySelectorAll(".hero-word");
    var hovering = false;
    var x = 0;
    var y = 0;
    var tx = 0;
    var ty = 0;
    var prevX = 0;
    var prevY = 0;
    var rafId = 0;
    var baseR = 72;

    function paintBlob() {
      var hRect = h1.getBoundingClientRect();
      var vx = x - prevX;
      var vy = y - prevY;
      var speed = Math.hypot(vx, vy);
      var stretch = Math.min(speed * 0.09, 0.52);
      var rx = baseR * (1 + stretch);
      var ry = baseR * (1 - stretch * 0.48);

      for (var i = 0; i < glassWords.length; i++) {
        var word = glassWords[i];
        var wr = word.getBoundingClientRect();
        word.style.setProperty("--lx", (x - (wr.left - hRect.left)).toFixed(1) + "px");
        word.style.setProperty("--ly", (y - (wr.top - hRect.top)).toFixed(1) + "px");
        word.style.setProperty("--rx", rx.toFixed(1) + "px");
        word.style.setProperty("--ry", ry.toFixed(1) + "px");
      }
    }

    function tick() {
      x += (tx - x) * BLOB_FOLLOW;
      y += (ty - y) * BLOB_FOLLOW;
      paintBlob();
      prevX = x;
      prevY = y;

      if (hovering) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    }

    function pointFromEvent(event) {
      var rect = h1.getBoundingClientRect();
      tx = event.clientX - rect.left;
      ty = event.clientY - rect.top;
    }

    h1.addEventListener("pointerenter", function (event) {
      pointFromEvent(event);
      x = tx;
      y = ty;
      prevX = x;
      prevY = y;
      hovering = true;
      h1.classList.add("is-glass-hover");
      paintBlob();
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    h1.addEventListener("pointermove", pointFromEvent);

    h1.addEventListener("pointerleave", function () {
      hovering = false;
      h1.classList.remove("is-glass-hover");
    });
  }

  function init() {
    var title = document.querySelector("[data-hero-fall]");
    splitHeroTitle(title);
    bindColorSweep(title);
    bindGlassCarve(title);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
