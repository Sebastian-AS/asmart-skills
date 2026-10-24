/**
 * ConstellationField — vanilla JS port for static HTML (V2-ui-reference).
 * Same WebGL network animation as UI-reference/ConstellationField.tsx.
 *
 * Usage:
 *   <div id="hero-network" class="constellation-field"></div>
 *   <script src="js/constellation-field.js"></script>
 *   <script>
 *     ConstellationField.mount("#hero-network", { baseColor: "#ffffff", accentColor: "#4a6fc1" });
 *   </script>
 */
(function (global) {
  "use strict";

  var MAX_DPR = 2;
  var MAX_EDGES = 18000;
  var MAX_DENSITY = 500;
  var PULL_REACH = 220;
  var PULL_RATE = 0.3;

  var LINE_VERT =
    "precision highp float;attribute vec2 a_p0;attribute vec2 a_p1;attribute vec2 a_corner;attribute float a_alpha;uniform vec2 uSize;uniform float uWidth;varying float v_alpha;varying float v_off;varying float v_half;void main(){vec2 d=a_p1-a_p0;float len=max(length(d),1e-5);vec2 nrm=vec2(-d.y,d.x)/len;float half_=max(uWidth*0.5,0.35);float ext=half_+0.75;vec2 p=mix(a_p0,a_p1,a_corner.x);p+=nrm*a_corner.y*ext;v_alpha=a_alpha;v_off=a_corner.y*ext;v_half=half_;gl_Position=vec4(p.x/uSize.x*2.0-1.0,1.0-p.y/uSize.y*2.0,0.0,1.0);}";
  var LINE_FRAG =
    "precision mediump float;uniform vec3 uColor;varying float v_alpha;varying float v_off;varying float v_half;void main(){float cov=clamp((v_half-abs(v_off))/0.75+0.5,0.0,1.0);float a=v_alpha*cov;gl_FragColor=vec4(uColor*a,a);}";
  var NODE_VERT =
    "precision highp float;attribute vec2 a_pos;attribute float a_radius;attribute float a_pulse;uniform vec2 uSize;uniform float uDpr,uHalo;varying float v_pulse;varying float v_core;void main(){float sprite=a_radius*uHalo*2.0;gl_PointSize=max(2.0,sprite*uDpr);v_pulse=a_pulse;v_core=1.0/max(uHalo,1.0);gl_Position=vec4(a_pos.x/uSize.x*2.0-1.0,1.0-a_pos.y/uSize.y*2.0,0.0,1.0);}";
  var NODE_FRAG =
    "precision mediump float;uniform vec3 uColor;varying float v_pulse;varying float v_core;void main(){float d=length(gl_PointCoord-0.5)*2.0;float halo=(1.0-smoothstep(0.88,1.0,d))*0.28;float core=1.0-smoothstep(v_core-0.12,v_core+0.02,d);float a=clamp(v_pulse*(halo+core),0.0,1.0);if(a<=0.002)discard;gl_FragColor=vec4(uColor*a,a);}";

  var CORNERS = [
    [0, -1],
    [1, -1],
    [1, 1],
    [0, -1],
    [1, 1],
    [0, 1],
  ];

  var DEFAULTS = {
    background: "transparent",
    baseColor: "#FFFFFF",
    accentColor: "#00FF96",
    density: 138,
    dotSize: 100,
    speed: 50,
    hover: 100,
    linkDistance: 160,
    network: { lineWidth: 100, halo: 240, pulse: 100 },
  };

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("ConstellationField shader:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function linkProgram(gl, vsSrc, fsSrc) {
    var vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
    var fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    if (!prog) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("ConstellationField link:", gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  function parseColor(input, fb) {
    if (!input) return fb;
    var str = String(input).trim();
    if (str.charAt(0) === "#") {
      var hex = str.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length >= 6) {
        var r = parseInt(hex.slice(0, 2), 16);
        var g = parseInt(hex.slice(2, 4), 16);
        var b = parseInt(hex.slice(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r / 255, g / 255, b / 255];
      }
      return fb;
    }
    var m = str.match(/[\d.]+/g);
    if (m && m.length >= 3) {
      return [
        Math.min(255, parseFloat(m[0])) / 255,
        Math.min(255, parseFloat(m[1])) / 255,
        Math.min(255, parseFloat(m[2])) / 255,
      ];
    }
    return fb;
  }

  function num(v, fb) {
    return typeof v === "number" && isFinite(v) ? v : fb;
  }

  function clampN(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6d2b79f5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalizeOptions(opts) {
    opts = opts || {};
    var network = Object.assign({}, DEFAULTS.network, opts.network || {});
    return {
      background: opts.background != null ? opts.background : DEFAULTS.background,
      baseColor: opts.baseColor != null ? opts.baseColor : DEFAULTS.baseColor,
      accentColor: opts.accentColor != null ? opts.accentColor : DEFAULTS.accentColor,
      density: Math.round(clampN(num(opts.density, DEFAULTS.density), 10, MAX_DENSITY)),
      dotSize: clampN(num(opts.dotSize, DEFAULTS.dotSize), 20, 400) / 100,
      speed: clampN(num(opts.speed, DEFAULTS.speed), 0, 100) / 50,
      drift: clampN(num(opts.drift, 100), 50, 220) / 100,
      hover: clampN(num(opts.hover, DEFAULTS.hover), 0, 200) / 100,
      pullReach: clampN(num(opts.pullReach, PULL_REACH), 60, 320),
      pullRate: clampN(num(opts.pullRate, PULL_RATE), 0.04, 0.5),
      linkDistance: clampN(num(opts.linkDistance, DEFAULTS.linkDistance), 40, 400),
      cursorLinks: Math.round(clampN(num(opts.cursorLinks, 10), 0, 24)),
      lineWidth: clampN(num(network.lineWidth, 100), 20, 400) / 100,
      halo: clampN(num(network.halo, 240), 100, 500) / 100,
      pulse: clampN(num(network.pulse, 100), 0, 200) / 100,
    };
  }

  function mount(container, opts) {
    var root =
      typeof container === "string" ? document.querySelector(container) : container;
    if (!root) {
      console.error("ConstellationField: container not found");
      return null;
    }

    root.classList.add("constellation-field");
    var computedPos = window.getComputedStyle(root).position;
    if (computedPos === "static") {
      root.style.position = "relative";
    }
    if (root.classList.contains("hero-network") || computedPos === "absolute") {
      root.style.inset = root.style.inset || "0";
      root.style.width = "100%";
      root.style.height = "100%";
    }
    root.style.overflow = "hidden";

    var options = normalizeOptions(opts);
    var mountOpts = Object.assign({}, opts);
    root.style.background = options.background;

    var canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    root.appendChild(canvas);

    var gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
    });
    if (!gl) {
      console.error("ConstellationField: WebGL unavailable");
      return null;
    }

    var lineProg = linkProgram(gl, LINE_VERT, LINE_FRAG);
    var nodeProg = linkProgram(gl, NODE_VERT, NODE_FRAG);
    if (!lineProg || !nodeProg) return null;

    var locs = {};
    function u(prog, name) {
      var key = (prog === lineProg ? "L:" : "N:") + name;
      if (!(key in locs)) locs[key] = gl.getUniformLocation(prog, name);
      return locs[key];
    }

    var eP0 = new Float32Array(MAX_EDGES * 6 * 2);
    var eP1 = new Float32Array(MAX_EDGES * 6 * 2);
    var eCorner = new Float32Array(MAX_EDGES * 6 * 2);
    var eAlpha = new Float32Array(MAX_EDGES * 6);
    for (var e = 0; e < MAX_EDGES; e++) {
      for (var c = 0; c < 6; c++) {
        var k = (e * 6 + c) * 2;
        eCorner[k] = CORNERS[c][0];
        eCorner[k + 1] = CORNERS[c][1];
      }
    }

    var bP0 = gl.createBuffer();
    var bP1 = gl.createBuffer();
    var bCorner = gl.createBuffer();
    var bAlpha = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bP0);
    gl.bufferData(gl.ARRAY_BUFFER, eP0.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bP1);
    gl.bufferData(gl.ARRAY_BUFFER, eP1.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bCorner);
    gl.bufferData(gl.ARRAY_BUFFER, eCorner, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bAlpha);
    gl.bufferData(gl.ARRAY_BUFFER, eAlpha.byteLength, gl.DYNAMIC_DRAW);

    var nodeCount = 0;
    var nx, ny, nvx, nvy, nr, nPos, nRad, nPulse;
    var bNodePos = gl.createBuffer();
    var bNodeRad = gl.createBuffer();
    var bNodePulse = gl.createBuffer();

    function build(n, w, h) {
      var R = rng(20260824);
      nodeCount = n;
      nx = new Float32Array(n);
      ny = new Float32Array(n);
      nvx = new Float32Array(n);
      nvy = new Float32Array(n);
      nr = new Float32Array(n);
      nPos = new Float32Array(n * 2);
      nRad = new Float32Array(n);
      nPulse = new Float32Array(n);
      for (var i = 0; i < n; i++) {
        nx[i] = R() * w;
        ny[i] = R() * h;
        nvx[i] = (R() - 0.5) * 0.3 * 60;
        nvy[i] = (R() - 0.5) * 0.3 * 60;
        nr[i] = R() * 2.4 + 1.8;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, bNodePos);
      gl.bufferData(gl.ARRAY_BUFFER, nPos.byteLength, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bNodeRad);
      gl.bufferData(gl.ARRAY_BUFFER, nRad.byteLength, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bNodePulse);
      gl.bufferData(gl.ARRAY_BUFFER, nPulse.byteLength, gl.DYNAMIC_DRAW);
    }

    var raf = 0;
    var last = performance.now();
    var clock = 0;
    var builtFor = -1;
    var builtW = 0;
    var builtH = 0;
    var ptr = { x: -10000, y: -10000 };
    var destroyed = false;
    var cursorScratch = [];

    function drawLines(edgeCount, edgeOffset, color, width, cw, ch) {
      if (edgeCount <= 0) return;
      gl.useProgram(lineProg);
      var start = edgeOffset * 6;
      var verts = edgeCount * 6;
      gl.bindBuffer(gl.ARRAY_BUFFER, bP0);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, eP0.subarray(start * 2, (start + verts) * 2));
      var aP0 = gl.getAttribLocation(lineProg, "a_p0");
      gl.enableVertexAttribArray(aP0);
      gl.vertexAttribPointer(aP0, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bP1);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, eP1.subarray(start * 2, (start + verts) * 2));
      var aP1 = gl.getAttribLocation(lineProg, "a_p1");
      gl.enableVertexAttribArray(aP1);
      gl.vertexAttribPointer(aP1, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bCorner);
      var aCorner = gl.getAttribLocation(lineProg, "a_corner");
      gl.enableVertexAttribArray(aCorner);
      gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bAlpha);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, eAlpha.subarray(start, start + verts));
      var aAlpha = gl.getAttribLocation(lineProg, "a_alpha");
      gl.enableVertexAttribArray(aAlpha);
      gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 0, 0);
      gl.uniform2f(u(lineProg, "uSize"), cw, ch);
      gl.uniform1f(u(lineProg, "uWidth"), width);
      gl.uniform3f(u(lineProg, "uColor"), color[0], color[1], color[2]);
      gl.drawArrays(gl.TRIANGLES, 0, verts);
      gl.disableVertexAttribArray(aP0);
      gl.disableVertexAttribArray(aP1);
      gl.disableVertexAttribArray(aCorner);
      gl.disableVertexAttribArray(aAlpha);
    }

    function render(now) {
      if (destroyed) return;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var v = options;
      var sp = v.speed;
      clock = (clock + dt * sp) % 6283;

      var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      var cw = root.clientWidth || 1200;
      var ch = root.clientHeight || 800;
      var bw = Math.max(1, Math.round(cw * dpr));
      var bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);

      var wantN = v.density;
      if (wantN !== builtFor) {
        build(wantN, cw, ch);
        builtFor = wantN;
        builtW = cw;
        builtH = ch;
      } else if (cw !== builtW || ch !== builtH) {
        var sx = cw / Math.max(builtW, 1);
        var sy = ch / Math.max(builtH, 1);
        for (var i = 0; i < nodeCount; i++) {
          nx[i] *= sx;
          ny[i] *= sy;
        }
        builtW = cw;
        builtH = ch;
      }

      var pull = v.pullRate * v.hover;
      var reach2 = v.pullReach * v.pullReach;
      for (var i = 0; i < nodeCount; i++) {
        nx[i] += nvx[i] * dt * sp * v.drift;
        ny[i] += nvy[i] * dt * sp * v.drift;
        if (nx[i] < 0 || nx[i] > cw) nvx[i] = -nvx[i];
        if (ny[i] < 0 || ny[i] > ch) nvy[i] = -nvy[i];
        if (pull > 0) {
          var dx = nx[i] - ptr.x;
          var dy = ny[i] - ptr.y;
          if (dx * dx + dy * dy < reach2) {
            var k = Math.min(1, pull * dt);
            nx[i] -= dx * k;
            ny[i] -= dy * k;
          }
        }
        nPos[i * 2] = nx[i];
        nPos[i * 2 + 1] = ny[i];
        nRad[i] = nr[i] * v.dotSize;
        nPulse[i] = 0.78 + Math.sin(clock + nx[i]) * 0.22 * v.pulse;
      }

      var LINKD = v.linkDistance;
      var l2 = LINKD * LINKD;
      var cellSize = LINKD;
      var cellX = new Int32Array(nodeCount);
      var cellY = new Int32Array(nodeCount);
      var buckets = {};
      var edges = 0;

      for (var gi = 0; gi < nodeCount; gi++) {
        cellX[gi] = Math.floor(nx[gi] / cellSize);
        cellY[gi] = Math.floor(ny[gi] / cellSize);
        var bk = cellX[gi] + "," + cellY[gi];
        if (!buckets[bk]) buckets[bk] = [];
        buckets[bk].push(gi);
      }

      for (var i = 0; i < nodeCount && edges < MAX_EDGES; i++) {
        var cx = cellX[i];
        var cy = cellY[i];
        for (var ox = -1; ox <= 1 && edges < MAX_EDGES; ox++) {
          for (var oy = -1; oy <= 1 && edges < MAX_EDGES; oy++) {
            var bucket = buckets[cx + ox + "," + (cy + oy)];
            if (!bucket) continue;
            for (var bi = 0; bi < bucket.length && edges < MAX_EDGES; bi++) {
              var j = bucket[bi];
              if (j <= i) continue;
              var dx = nx[i] - nx[j];
              var dy = ny[i] - ny[j];
              var dd = dx * dx + dy * dy;
              if (dd >= l2) continue;
              var a = 0.22 + (1 - Math.sqrt(dd) / LINKD) * 0.55;
              for (var c = 0; c < 6; c++) {
                var k = (edges * 6 + c) * 2;
                eP0[k] = nx[i];
                eP0[k + 1] = ny[i];
                eP1[k] = nx[j];
                eP1[k + 1] = ny[j];
                eAlpha[edges * 6 + c] = a;
              }
              edges++;
            }
          }
        }
      }

      var nodeEdges = edges;

      if (pull > 0 && v.cursorLinks > 0 && ptr.x > -5000) {
        cursorScratch.length = 0;
        for (var ci = 0; ci < nodeCount; ci++) {
          var cdx = nx[ci] - ptr.x;
          var cdy = ny[ci] - ptr.y;
          var cdd = cdx * cdx + cdy * cdy;
          if (cdd < reach2) cursorScratch.push({ i: ci, d: cdd });
        }
        if (cursorScratch.length > 1) {
          cursorScratch.sort(function (a, b) {
            return a.d - b.d;
          });
        }
        var climit = Math.min(v.cursorLinks, cursorScratch.length);
        var pullR = v.pullReach;
        for (var cc = 0; cc < climit && edges < MAX_EDGES; cc++) {
          var ni = cursorScratch[cc].i;
          var dist = Math.sqrt(cursorScratch[cc].d);
          var ca = 0.32 + (1 - dist / pullR) * 0.55;
          for (var c = 0; c < 6; c++) {
            var k = (edges * 6 + c) * 2;
            eP0[k] = ptr.x;
            eP0[k + 1] = ptr.y;
            eP1[k] = nx[ni];
            eP1[k + 1] = ny[ni];
            eAlpha[edges * 6 + c] = ca;
          }
          edges++;
        }
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      var cb = parseColor(v.baseColor, [0.902, 0.784, 0.475]);
      var ca = parseColor(v.accentColor, [0.902, 0.784, 0.475]);

      drawLines(nodeEdges, 0, cb, v.lineWidth, cw, ch);
      if (edges > nodeEdges) {
        drawLines(edges - nodeEdges, nodeEdges, ca, v.lineWidth * 0.75, cw, ch);
      }

      if (nodeCount > 0) {
        gl.useProgram(nodeProg);
        gl.bindBuffer(gl.ARRAY_BUFFER, bNodePos);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, nPos);
        var aPos = gl.getAttribLocation(nodeProg, "a_pos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bNodeRad);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, nRad);
        var aRad = gl.getAttribLocation(nodeProg, "a_radius");
        gl.enableVertexAttribArray(aRad);
        gl.vertexAttribPointer(aRad, 1, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bNodePulse);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, nPulse);
        var aPulse = gl.getAttribLocation(nodeProg, "a_pulse");
        gl.enableVertexAttribArray(aPulse);
        gl.vertexAttribPointer(aPulse, 1, gl.FLOAT, false, 0, 0);

        gl.uniform2f(u(nodeProg, "uSize"), cw, ch);
        gl.uniform1f(u(nodeProg, "uDpr"), dpr);
        gl.uniform1f(u(nodeProg, "uHalo"), v.halo);
        gl.uniform3f(u(nodeProg, "uColor"), ca[0], ca[1], ca[2]);
        gl.drawArrays(gl.POINTS, 0, nodeCount);
        gl.disableVertexAttribArray(aPos);
        gl.disableVertexAttribArray(aRad);
        gl.disableVertexAttribArray(aPulse);
      }

      raf = requestAnimationFrame(render);
    }

    function track(e) {
      var r = root.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      var cw = root.clientWidth || r.width;
      var ch = root.clientHeight || r.height;
      ptr.x = ((e.clientX - r.left) / r.width) * cw;
      ptr.y = ((e.clientY - r.top) / r.height) * ch;
    }

    function onLeave() {
      ptr.x = -10000;
      ptr.y = -10000;
    }

    var trackTarget = root;
    if (root.classList.contains("hero-network")) {
      var heroEl = root.closest(".hero--neural");
      if (heroEl) trackTarget = heroEl;
    }

    trackTarget.addEventListener("pointermove", track, { passive: true });
    trackTarget.addEventListener("pointerenter", track, { passive: true });
    trackTarget.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(render);

    return {
      update: function (nextOpts) {
        mountOpts = Object.assign({}, mountOpts, nextOpts);
        options = normalizeOptions(mountOpts);
        root.style.background = options.background;
      },
      destroy: function () {
        destroyed = true;
        cancelAnimationFrame(raf);
        trackTarget.removeEventListener("pointermove", track);
        trackTarget.removeEventListener("pointerenter", track);
        trackTarget.removeEventListener("pointerleave", onLeave);
        root.removeChild(canvas);
      },
    };
  }

  global.ConstellationField = {
    mount: mount,
    DEFAULTS: DEFAULTS,
  };
})(typeof window !== "undefined" ? window : globalThis);
