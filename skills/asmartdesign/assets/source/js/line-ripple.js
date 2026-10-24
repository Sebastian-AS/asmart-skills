/**
 * LineRipple — vanilla port of UI-reference/LineRippleBackground.tsx (Originkit).
 * Short-line field that drifts with simplex noise and bends near the pointer.
 *
 * Usage:
 *   <div id="login-ripple"></div>
 *   LineRipple.mount("#login-ripple", { strokeColor: "rgba(232,238,248,0.55)" });
 */
(function (global) {
  "use strict";

  var BASE_ANGLE = 0;
  var CURL = 3;
  var SEED = 0.5;

  var DEFAULTS = {
    strokeColor: "#FFFFFF",
    backgroundColor: "transparent",
    count: 57,
    movement: 24,
    hover: true,
    force: 4,
    resolution: 10,
    track: "window",
  };

  function createNoise2D(seed) {
    seed = seed == null ? 0.5 : seed;
    var F2 = 0.5 * (Math.sqrt(3) - 1);
    var G2 = (3 - Math.sqrt(3)) / 6;
    var G22 = (3 - Math.sqrt(3)) / 3;
    var p = new Uint8Array(256);
    var i;
    for (i = 0; i < 256; i++) p[i] = i;

    function seededRandom(index) {
      var x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
      return x - Math.floor(x);
    }

    for (i = 255; i > 0; i--) {
      var n = Math.floor((i + 1) * seededRandom(i));
      var q = p[i];
      p[i] = p[n];
      p[n] = q;
    }

    var perm = new Uint8Array(512);
    var permMod12 = new Uint8Array(512);
    for (i = 0; i < 512; i++) {
      perm[i] = p[i & 255];
      permMod12[i] = perm[i] % 12;
    }

    var grad2 = new Float64Array([
      1, 1, -1, 1, 1, -1, -1, -1, 1, 0, -1, 0, 1, 0, -1, 0, 0, 1, 0, -1, 0, 1, 0, -1,
    ]);

    function fastFloor(x) {
      return Math.floor(x) | 0;
    }

    return function noise2D(x, y) {
      var s = (x + y) * F2;
      var ii = fastFloor(x + s);
      var jj = fastFloor(y + s);
      var t = (ii + jj) * G2;
      var x0 = x - (ii - t);
      var y0 = y - (jj - t);
      var i1;
      var j1;
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } else {
        i1 = 0;
        j1 = 1;
      }
      var x1 = x0 - i1 + G2;
      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1 + G22;
      var y2 = y0 - 1 + G22;
      var gi0 = permMod12[(ii & 255) + perm[jj & 255]];
      var gi1 = permMod12[((ii + i1) & 255) + perm[(jj + j1) & 255]];
      var gi2 = permMod12[((ii + 1) & 255) + perm[(jj + 1) & 255]];
      var n0 = 0;
      var n1 = 0;
      var n2 = 0;
      var t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) {
        t0 *= t0;
        n0 = t0 * t0 * (grad2[gi0 * 2] * x0 + grad2[gi0 * 2 + 1] * y0);
      }
      var t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) {
        t1 *= t1;
        n1 = t1 * t1 * (grad2[gi1 * 2] * x1 + grad2[gi1 * 2 + 1] * y1);
      }
      var t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) {
        t2 *= t2;
        n2 = t2 * t2 * (grad2[gi2 * 2] * x2 + grad2[gi2 * 2 + 1] * y2);
      }
      return 70 * (n0 + n1 + n2);
    };
  }

  function num(v, fb) {
    return typeof v === "number" && isFinite(v) ? v : fb;
  }

  function clampN(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function normalizeOptions(opts) {
    opts = opts || {};
    return {
      strokeColor: opts.strokeColor != null ? String(opts.strokeColor) : DEFAULTS.strokeColor,
      backgroundColor:
        opts.backgroundColor != null ? String(opts.backgroundColor) : DEFAULTS.backgroundColor,
      count: Math.round(clampN(num(opts.count, DEFAULTS.count), 1, 100)),
      movement: clampN(num(opts.movement, DEFAULTS.movement), 0, 100),
      hover: opts.hover !== false,
      force: clampN(num(opts.force, DEFAULTS.force), 0, 12),
      resolution: clampN(num(opts.resolution, DEFAULTS.resolution), 1, 20),
      track: opts.track === "container" ? "container" : "window",
    };
  }

  function mount(container, opts) {
    var root = typeof container === "string" ? document.querySelector(container) : container;
    if (!root) {
      console.error("LineRipple: container not found");
      return null;
    }

    var computedPos = window.getComputedStyle(root).position;
    if (computedPos === "static") root.style.position = "relative";
    root.style.overflow = "hidden";
    root.style.margin = root.style.margin || "0";
    root.style.padding = root.style.padding || "0";

    var options = normalizeOptions(opts);
    var mountOpts = Object.assign({}, opts);
    root.style.backgroundColor = options.backgroundColor;

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    root.appendChild(svg);

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);

    var noiseFn = createNoise2D(SEED);
    var points = [];
    var bounds = { width: 1, height: 1 };
    var mouse = {
      x: -10,
      y: 0,
      lx: 0,
      ly: 0,
      sx: 0,
      sy: 0,
      v: 0,
      vs: 0,
      a: 0,
      set: false,
    };
    var raf = 0;
    var destroyed = false;
    var isVisible = true;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var drawnOnce = false;

    function setSize() {
      var width = root.clientWidth || root.offsetWidth || 1;
      var height = root.clientHeight || root.offsetHeight || 1;
      bounds.width = width;
      bounds.height = height;
      svg.style.width = width + "px";
      svg.style.height = height + "px";
    }

    function setLines() {
      var width = bounds.width;
      var height = bounds.height;
      var c = options.count;
      var gap = 90 - ((c - 1) / 99) * 82;
      var cols = Math.ceil((width + gap) / gap);
      var rows = Math.ceil((height + gap) / gap);
      var xStart = (width - gap * (cols - 1)) / 2;
      var yStart = (height - gap * (rows - 1)) / 2;
      var next = [];
      var i;
      var j;
      for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
          next.push({
            x: xStart + gap * i,
            y: yStart + gap * j,
            angle: 0,
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
      }
      points = next;
      path.setAttribute("stroke", options.strokeColor);
      path.setAttribute("stroke-width", "1.5");
    }

    function updateMousePosition(clientX, clientY) {
      var rect = root.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
      root.style.setProperty("--x", mouse.sx + "px");
      root.style.setProperty("--y", mouse.sy + "px");
    }

    function movePoints(time) {
      var drift = time * options.movement * 8e-6;
      var dirX = Math.cos(BASE_ANGLE) * drift;
      var dirY = Math.sin(BASE_ANGLE) * drift;
      var hoverOn = options.hover;
      var pushForce = options.force;
      var p;
      var k;
      for (k = 0; k < points.length; k++) {
        p = points[k];
        var n = noiseFn(p.x * 0.004 - dirX, p.y * 0.004 - dirY);
        var target = BASE_ANGLE + n * Math.PI * CURL;
        var dx = p.x - mouse.sx;
        var dy = p.y - mouse.sy;
        var d = Math.hypot(dx, dy);
        var l = Math.max(175, mouse.vs);
        var bend = 0;
        if (hoverOn && d < l) {
          var s = 1 - d / l;
          var influence = (pushForce / 10) * 0.02;
          var tangent = Math.atan2(dy, dx) + Math.PI / 2;
          bend = (tangent - target) * s * (0.4 + mouse.vs * influence);
          var f = Math.cos(d * 0.001) * s;
          var push = (pushForce / 10) * 7e-4;
          var ang = Math.atan2(dy, dx);
          p.cursor.vx += Math.cos(ang) * f * l * mouse.vs * push;
          p.cursor.vy += Math.sin(ang) * f * l * mouse.vs * push;
        }
        var diff = target + bend - p.angle;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        p.angle += diff * 0.12;
        p.cursor.vx += (0 - p.cursor.x) * 0.01;
        p.cursor.vy += (0 - p.cursor.y) * 0.01;
        p.cursor.vx *= 0.95;
        p.cursor.vy *= 0.95;
        p.cursor.x += p.cursor.vx;
        p.cursor.y += p.cursor.vy;
        p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
        p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
      }
    }

    function drawLines() {
      var half = (6 + (options.resolution / 10) * 20) / 2;
      var d = "";
      var k;
      for (k = 0; k < points.length; k++) {
        var p = points[k];
        var cx = p.x + p.cursor.x;
        var cy = p.y + p.cursor.y;
        var ux = Math.cos(p.angle) * half;
        var uy = Math.sin(p.angle) * half;
        d +=
          "M " +
          (cx - ux).toFixed(1) +
          " " +
          (cy - uy).toFixed(1) +
          " L " +
          (cx + ux).toFixed(1) +
          " " +
          (cy + uy).toFixed(1) +
          " ";
      }
      path.setAttribute("d", d);
    }

    function tick(time) {
      if (destroyed) return;
      if (!isVisible) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!reducedMotion) {
        mouse.sx += (mouse.x - mouse.sx) * 0.1;
        mouse.sy += (mouse.y - mouse.sy) * 0.1;
        var dx = mouse.x - mouse.lx;
        var dy = mouse.y - mouse.ly;
        var dist = Math.hypot(dx, dy);
        mouse.v = dist;
        mouse.vs += (dist - mouse.vs) * 0.1;
        mouse.vs = Math.min(100, mouse.vs);
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.a = Math.atan2(dy, dx);
        root.style.setProperty("--x", mouse.sx + "px");
        root.style.setProperty("--y", mouse.sy + "px");
        movePoints(time);
        drawLines();
      } else if (!drawnOnce) {
        movePoints(0);
        drawLines();
        drawnOnce = true;
      }
      raf = requestAnimationFrame(tick);
    }

    function onPointerMove(e) {
      updateMousePosition(e.clientX, e.clientY);
    }

    function onTouchMove(e) {
      var touch = e.touches[0];
      if (touch) updateMousePosition(touch.clientX, touch.clientY);
    }

    function onResize() {
      setSize();
      setLines();
      drawnOnce = false;
    }

    setSize();
    setLines();

    window.addEventListener("resize", onResize);
    var trackTarget = options.track === "container" ? root : window;
    trackTarget.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.08 }
    );
    observer.observe(root);

    var resizeObs = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(onResize);
      resizeObs.observe(root);
    }

    raf = requestAnimationFrame(tick);

    return {
      update: function (nextOpts) {
        mountOpts = Object.assign({}, mountOpts, nextOpts);
        options = normalizeOptions(mountOpts);
        root.style.backgroundColor = options.backgroundColor;
        setSize();
        setLines();
        drawnOnce = false;
      },
      destroy: function () {
        destroyed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        trackTarget.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("touchmove", onTouchMove);
        observer.disconnect();
        if (resizeObs) resizeObs.disconnect();
        if (svg.parentNode) svg.parentNode.removeChild(svg);
      },
    };
  }

  global.LineRipple = {
    mount: mount,
    DEFAULTS: DEFAULTS,
  };
})(typeof window !== "undefined" ? window : globalThis);
