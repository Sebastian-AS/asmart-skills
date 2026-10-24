/**
 * TopologyField — vanilla port of UI-reference/TopologyFieldBase.tsx
 * plus the TopologyField.tsx base preset (network + sphere defaults).
 *
 *   TopologyField.mount("#lobby-sphere", { edgeColor: "#a8c0ef", nodeColor: "#ffffff" });
 */
(function (global) {
  "use strict";

  var MAX_DPR = 2;
  var R_SPHERE = 2.5;
  var BASE_N = 120;
  var BASE_LINK = 1.08;
  var FOCAL = 1.303;
  // Keep hover illumination local to nearby vertices and edge segments.
  var HOVER_RADIUS = 95;

  var EDGE_VERT =
    "precision highp float;" +
    "attribute vec3 a_p0;attribute vec3 a_p1;attribute vec2 a_corner;attribute float a_hover;" +
    "uniform mat3 uRot;uniform vec2 uRes;uniform float uDist,uWidth,uOffsetX;" +
    "varying float v_depth;varying float v_hover;" +
    "void main(){" +
    "float ar=uRes.x/max(uRes.y,1.0);" +
    "vec3 r0=uRot*a_p0;vec3 r1=uRot*a_p1;" +
    "float w0=max(uDist-r0.z,0.05);float w1=max(uDist-r1.z,0.05);" +
    "vec4 c0=vec4((1.3030/ar)*r0.x+uOffsetX*w0,1.3030*r0.y,0.0,w0);" +
    "vec4 c1=vec4((1.3030/ar)*r1.x+uOffsetX*w1,1.3030*r1.y,0.0,w1);" +
    "vec2 n0=c0.xy/c0.w;vec2 n1=c1.xy/c1.w;" +
    "vec2 dir=(n1-n0)*vec2(ar,1.0);dir=normalize(dir+vec2(1e-6));" +
    "vec2 perp=vec2(-dir.y,dir.x)/vec2(ar,1.0);" +
    "vec4 sel=mix(c0,c1,a_corner.x);" +
    "sel.xy+=perp*a_corner.y*uWidth*sel.w;" +
    "v_depth=mix(r0.z,r1.z,a_corner.x)/2.50;v_hover=a_hover;" +
    "gl_Position=sel;}";

  var EDGE_FRAG =
    "precision mediump float;" +
    "uniform vec3 uColor;uniform vec3 uBg;uniform float uFade;" +
    "varying float v_depth;varying float v_hover;" +
    "void main(){" +
    "float t=clamp(v_depth*0.5+0.5,0.0,1.0);" +
    "float fog=mix(1.0-uFade,1.0,t);" +
    "float bright=1.0+v_hover*1.4;" +
    "vec3 col=mix(uBg,uColor,fog)*bright;" +
    "float a=fog*(0.35+v_hover*0.55);" +
    "gl_FragColor=vec4(col*a,a);}";

  var NODE_VERT =
    "precision highp float;" +
    "attribute vec3 a_pos;attribute float a_rate;attribute float a_phase;attribute float a_hover;" +
    "uniform mat3 uRot;uniform vec2 uRes;" +
    "uniform float uDist,uDotSize,uTime,uSpeed,uDpr,uOffsetX,uPulse;" +
    "varying float v_depth;varying float v_pulse;varying float v_hover;" +
    "void main(){" +
    "float ar=uRes.x/max(uRes.y,1.0);" +
    "vec3 r=uRot*a_pos;float w=max(uDist-r.z,0.05);" +
    "gl_Position=vec4(((1.3030/ar)*r.x+uOffsetX*w),1.3030*r.y*w,0.0,w);" +
    "v_depth=r.z/2.50;" +
    "float cycle=0.5+0.5*sin(uTime*abs(a_rate)*uSpeed+a_phase);" +
    "float twinkle=1.0-step(0.0,a_rate);" +
    "float breath=mix(0.62+0.38*cycle,pow(cycle,2.0),twinkle);" +
    "v_pulse=mix(breath,1.0,clamp(a_hover,0.0,1.0))*uPulse*(1.0+a_hover*0.85);v_hover=a_hover;" +
    "float size=uDotSize*v_pulse*(1.0+a_hover*0.6)/w;" +
    "gl_PointSize=max(2.0,size*uDpr);}";

  var NODE_FRAG =
    "precision mediump float;" +
    "uniform vec3 uColor;uniform vec3 uBg;uniform float uFade;" +
    "varying float v_depth;varying float v_pulse;varying float v_hover;" +
    "void main(){" +
    "float t=clamp(v_depth*0.5+0.5,0.0,1.0);" +
    "float fog=mix(1.0-uFade,1.0,t);" +
    "float d=length(gl_PointCoord-0.5)*2.0;" +
    "float halo=(1.0-smoothstep(0.82,1.0,d))*0.32;" +
    "float core=1.0-smoothstep(0.18,0.32,d);" +
    "float shape=halo+core;" +
    "float bright=1.0+v_hover*1.2;" +
    "vec3 col=mix(uBg,uColor,fog)*bright;" +
    "float a=clamp(v_pulse*shape*fog*(0.5+v_hover*0.45),0.0,1.0);" +
    "if(a<=0.003)discard;" +
    "gl_FragColor=vec4(col*a,a);}";

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
    edgeColor: "#a8c0ef",
    nodeColor: "#ffffff",
    density: 120,
    dotSize: 100,
    speed: 50,
    hover: 100,
    network: { link: 159, lineWidth: 80, pulse: 100 },
    sphere: { offsetX: 0, tilt: 45, camera: 270 },
  };

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("TopologyField shader:", gl.getShaderInfoLog(sh));
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
      console.error("TopologyField link:", gl.getProgramInfoLog(prog));
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

  function fibonacciSphere(n, radius) {
    var px = new Float32Array(n * 3);
    var rates = new Float32Array(n);
    var phases = new Float32Array(n);
    var R = rng(Math.floor(Math.random() * 4294967296));
    var ga = Math.PI * (3 - Math.sqrt(5));
    var i;
    for (i = 0; i < n; i++) {
      var y = 1 - (2 * i + 1) / n;
      var rAtY = Math.sqrt(Math.max(0, 1 - y * y));
      var theta = ga * i;
      px[i * 3] = radius * rAtY * Math.cos(theta);
      px[i * 3 + 1] = radius * y;
      px[i * 3 + 2] = radius * rAtY * Math.sin(theta);
      var rate = 0.25 + R() * 0.65;
      rates[i] = R() < 0.34 ? -rate : rate;
      phases[i] = R() * Math.PI * 2;
    }
    return { px: px, rates: rates, phases: phases };
  }

  function createHoverParticles(n, radius) {
    var points = new Float32Array(n * 3);
    var rates = new Float32Array(n);
    var phases = new Float32Array(n);
    var random = rng(Math.floor(Math.random() * 4294967296));
    for (var i = 0; i < n; i++) {
      var y = 1 - 2 * random();
      var radial = Math.sqrt(Math.max(0, 1 - y * y));
      var angle = random() * Math.PI * 2;
      points[i * 3] = radius * radial * Math.cos(angle);
      points[i * 3 + 1] = radius * y;
      points[i * 3 + 2] = radius * radial * Math.sin(angle);
      rates[i] = 0.25 + random() * 0.65;
      phases[i] = random() * Math.PI * 2;
    }
    return { points: points, rates: rates, phases: phases };
  }

  function buildTopology(n, linkScale) {
    var fib = fibonacciSphere(n, R_SPHERE);
    var px = fib.px;
    var link = BASE_LINK * Math.sqrt(BASE_N / n) * linkScale;
    var l2 = link * link;
    var ea = [];
    var eb = [];
    var i;
    var j;
    for (i = 0; i < n; i++) {
      for (j = i + 1; j < n; j++) {
        var dx = px[i * 3] - px[j * 3];
        var dy = px[i * 3 + 1] - px[j * 3 + 1];
        var dz = px[i * 3 + 2] - px[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < l2) {
          ea.push(i);
          eb.push(j);
        }
      }
    }
    var edges = ea.length;
    var p0 = new Float32Array(edges * 6 * 3);
    var p1 = new Float32Array(edges * 6 * 3);
    var corner = new Float32Array(edges * 6 * 2);
    var eHover = new Float32Array(edges * 6);
    var e;
    var c;
    for (e = 0; e < edges; e++) {
      i = ea[e];
      j = eb[e];
      for (c = 0; c < 6; c++) {
        var k = e * 6 + c;
        p0[k * 3] = px[i * 3];
        p0[k * 3 + 1] = px[i * 3 + 1];
        p0[k * 3 + 2] = px[i * 3 + 2];
        p1[k * 3] = px[j * 3];
        p1[k * 3 + 1] = px[j * 3 + 1];
        p1[k * 3 + 2] = px[j * 3 + 2];
        corner[k * 2] = CORNERS[c][0];
        corner[k * 2 + 1] = CORNERS[c][1];
        eHover[k] = 0;
      }
    }
    return {
      px: px,
      rates: fib.rates,
      phases: fib.phases,
      p0: p0,
      p1: p1,
      corner: corner,
      eHover: eHover,
      edges: edges,
      ea: ea,
      eb: eb,
    };
  }

  function rotateMat(ay, ax) {
    var cy = Math.cos(ay);
    var sy = Math.sin(ay);
    var cx = Math.cos(ax);
    var sx = Math.sin(ax);
    return new Float32Array([cy, 0, -sy, sy * sx, cx, cy * sx, sy * cx, -sx, cy * cx]);
  }

  function projectNode(x, y, z, rot, dist, offsetX, bw, bh) {
    var rx = rot[0] * x + rot[3] * y + rot[6] * z;
    var ry = rot[1] * x + rot[4] * y + rot[7] * z;
    var rz = rot[2] * x + rot[5] * y + rot[8] * z;
    var w = Math.max(dist - rz, 0.05);
    var ar = bw / Math.max(bh, 1);
    var sx = (((FOCAL / ar) * rx + offsetX * w) / w) * 0.5 + 0.5;
    var sy = (-(FOCAL * ry) / w) * 0.5 + 0.5;
    return { sx: sx * bw, sy: sy * bh, rz: rz };
  }

  function pointSegmentDistance(px, py, ax, ay, bx, by) {
    var dx = bx - ax;
    var dy = by - ay;
    var lengthSquared = dx * dx + dy * dy;
    var t = lengthSquared > 0
      ? clampN(((px - ax) * dx + (py - ay) * dy) / lengthSquared, 0, 1)
      : 0;
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  function normalizeOptions(opts) {
    opts = opts || {};
    var network = Object.assign({}, DEFAULTS.network, opts.network || {});
    var sphere = Object.assign({}, DEFAULTS.sphere, opts.sphere || {});
    return {
      background: opts.background != null ? opts.background : DEFAULTS.background,
      edgeColor: opts.edgeColor != null ? opts.edgeColor : DEFAULTS.edgeColor,
      nodeColor: opts.nodeColor != null ? opts.nodeColor : DEFAULTS.nodeColor,
      density: Math.round(clampN(num(opts.density, DEFAULTS.density), 30, 300)),
      dotSize: clampN(num(opts.dotSize, DEFAULTS.dotSize), 20, 400) / 100,
      speed: clampN(num(opts.speed, DEFAULTS.speed), 0, 100) / 50,
      hover: clampN(num(opts.hover, DEFAULTS.hover), 0, 200) / 100,
      link: clampN(num(network.link, 159), 40, 200) / 100,
      lineWidth: (clampN(num(network.lineWidth, 80), 20, 400) / 100) * 0.0016,
      pulse: clampN(num(network.pulse, 100), 0, 200) / 100,
      offsetX: (clampN(num(sphere.offsetX, 0), -100, 100) / 100) * 0.35,
      tilt: clampN(num(sphere.tilt, 45), 0, 90) * (Math.PI / 180),
      camera: clampN(num(sphere.camera, 270), 100, 400) / 50,
      fade: 0.55,
    };
  }

  function mount(container, opts) {
    var root = typeof container === "string" ? document.querySelector(container) : container;
    if (!root) {
      console.error("TopologyField: container not found");
      return null;
    }

    var mountOpts = Object.assign({}, opts);
    var options = normalizeOptions(mountOpts);
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var computedPos = window.getComputedStyle(root).position;
    if (computedPos === "static") root.style.position = "relative";
    root.style.overflow = "hidden";
    root.style.background = options.background;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    root.appendChild(canvas);

    var gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: true,
    });
    if (!gl) {
      console.error("TopologyField: WebGL unavailable");
      return null;
    }

    var edgeProg = linkProgram(gl, EDGE_VERT, EDGE_FRAG);
    var nodeProg = linkProgram(gl, NODE_VERT, NODE_FRAG);
    if (!edgeProg || !nodeProg) return null;

    var locMap = {};
    function u(prog, name) {
      var key = (prog === edgeProg ? "E:" : "N:") + name;
      if (!(key in locMap)) locMap[key] = gl.getUniformLocation(prog, name);
      return locMap[key];
    }

    var graph = buildTopology(options.density, options.link);
    var hoverParticlePool = createHoverParticles(48, R_SPHERE * 1.006);
    var visibleHoverParticles = 0;
    var hoverParticleProgress = 0;
    var hoverDuration = 0;
    var nodeHover = new Float32Array(graph.px.length / 3);
    var nodeDirectHover = new Float32Array(graph.px.length / 3);
    var edgeHoverBuf = graph.eHover;
    var builtN = options.density;
    var builtLink = options.link;
    var ptr = { x: -10000, y: -10000 };
    var destroyed = false;

    var bP0 = gl.createBuffer();
    var bP1 = gl.createBuffer();
    var bCorner = gl.createBuffer();
    var bEHover = gl.createBuffer();
    var bPos = gl.createBuffer();
    var bRate = gl.createBuffer();
    var bPhase = gl.createBuffer();
    var bNHover = gl.createBuffer();
    var bHoverParticlePos = gl.createBuffer();
    var bHoverParticleRate = gl.createBuffer();
    var bHoverParticlePhase = gl.createBuffer();
    var bHoverParticleHover = gl.createBuffer();

    function uploadGraph(g) {
      gl.bindBuffer(gl.ARRAY_BUFFER, bP0);
      gl.bufferData(gl.ARRAY_BUFFER, g.p0, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bP1);
      gl.bufferData(gl.ARRAY_BUFFER, g.p1, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bCorner);
      gl.bufferData(gl.ARRAY_BUFFER, g.corner, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bEHover);
      gl.bufferData(gl.ARRAY_BUFFER, g.eHover, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bPos);
      gl.bufferData(gl.ARRAY_BUFFER, g.px, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bRate);
      gl.bufferData(gl.ARRAY_BUFFER, g.rates, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bPhase);
      gl.bufferData(gl.ARRAY_BUFFER, g.phases, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bNHover);
      gl.bufferData(gl.ARRAY_BUFFER, nodeHover, gl.DYNAMIC_DRAW);
      edgeHoverBuf = g.eHover;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, bHoverParticlePos);
    gl.bufferData(gl.ARRAY_BUFFER, hoverParticlePool.points, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bHoverParticleRate);
    gl.bufferData(gl.ARRAY_BUFFER, hoverParticlePool.rates, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bHoverParticlePhase);
    gl.bufferData(gl.ARRAY_BUFFER, hoverParticlePool.phases, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bHoverParticleHover);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(48), gl.STATIC_DRAW);

    uploadGraph(graph);

    function updateHover(rot, dist, offsetX, bw, bh, hv, dt) {
      var points = ptr.x >= 0 && ptr.y >= 0 ? [ptr] : [];
      var overSphere = false;
      var n = graph.px.length / 3;
      var projected = new Array(n);
      var i;
      var persistence = Math.exp(-dt / 1.4);
      for (i = 0; i < n; i++) {
        nodeHover[i] *= persistence;
        nodeDirectHover[i] *= persistence;
      }
      for (i = 0; i < n; i++) {
        var p = projectNode(
          graph.px[i * 3],
          graph.px[i * 3 + 1],
          graph.px[i * 3 + 2],
          rot,
          dist,
          offsetX,
          bw,
          bh
        );
        if (p.rz < -0.15) continue;
        projected[i] = p;
        for (var j = 0; j < points.length; j++) {
          var d = Math.hypot(p.sx - points[j].x, p.sy - points[j].y);
          if (d < HOVER_RADIUS) {
            overSphere = true;
            var nodeIntensity = (1 - d / HOVER_RADIUS) * hv;
            nodeHover[i] = Math.max(nodeHover[i], nodeIntensity);
            nodeDirectHover[i] = Math.max(nodeDirectHover[i], nodeIntensity);
          }
        }
      }
      var e;
      var c;
      for (e = 0; e < graph.edges; e++) {
        var a = graph.ea[e];
        var b = graph.eb[e];
        var pa = projected[a];
        var pb = projected[b];
        var previousEdgeHover = edgeHoverBuf[e * 6] * persistence;
        var hi = Math.max(nodeDirectHover[a], nodeDirectHover[b], previousEdgeHover);
        if (pa && pb) {
          for (var k = 0; k < points.length; k++) {
            var edgeDistance = pointSegmentDistance(
              points[k].x,
              points[k].y,
              pa.sx,
              pa.sy,
              pb.sx,
              pb.sy
            );
            if (edgeDistance < HOVER_RADIUS) {
              overSphere = true;
              hi = Math.max(hi, (1 - edgeDistance / HOVER_RADIUS) * hv);
            }
          }
        }
        nodeHover[a] = Math.max(nodeHover[a], hi);
        nodeHover[b] = Math.max(nodeHover[b], hi);
        for (c = 0; c < 6; c++) edgeHoverBuf[e * 6 + c] = hi;
      }
      return overSphere;
    }

    var raf = 0;
    var last = performance.now();
    var clock = 0;
    var pageVisible = !document.hidden;
    var inView = true;
    var observer = null;

    function canRender() {
      return !destroyed && pageVisible && inView;
    }

    function scheduleRender() {
      if (!raf && canRender()) raf = requestAnimationFrame(render);
    }

    function pauseRender() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onVisibilityChange() {
      pageVisible = !document.hidden;
      if (pageVisible) scheduleRender();
      else pauseRender();
    }

    function render(now) {
      raf = 0;
      if (destroyed) return;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) clock = (clock + dt * options.speed) % 6283;

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

      if (options.density !== builtN || options.link !== builtLink) {
        graph = buildTopology(options.density, options.link);
        nodeHover = new Float32Array(graph.px.length / 3);
        nodeDirectHover = new Float32Array(graph.px.length / 3);
        uploadGraph(graph);
        builtN = options.density;
        builtLink = options.link;
      }

      var ay = clock * 0.14;
      var ax = clock * 0.07 + options.tilt;
      var rot = rotateMat(ay, ax);
      var dist = options.camera;
      var offsetX = options.offsetX;
      var hv = reduced ? 0 : options.hover;

      if (hv > 0) {
        var overSphere = updateHover(rot, dist, offsetX, bw, bh, hv, dt);
        if (overSphere && visibleHoverParticles < hoverParticlePool.rates.length) {
          hoverDuration += dt;
          // Longer hovers emit particles faster, so the accumulation accelerates.
          hoverParticleProgress += dt * (0.8 + hoverDuration * 1.25);
          while (hoverParticleProgress >= 1 && visibleHoverParticles < hoverParticlePool.rates.length) {
            visibleHoverParticles++;
            hoverParticleProgress--;
          }
        } else if (!overSphere) {
          hoverDuration = 0;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, bEHover);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, edgeHoverBuf);
        gl.bindBuffer(gl.ARRAY_BUFFER, bNHover);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, nodeHover);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      var bg = parseColor(options.background === "transparent" ? "#070914" : options.background, [0.027, 0.035, 0.078]);
      var ce = parseColor(options.edgeColor, [0.66, 0.75, 0.94]);
      var cn = parseColor(options.nodeColor, [1, 1, 1]);

      if (graph.edges > 0) {
        gl.useProgram(edgeProg);
        gl.bindBuffer(gl.ARRAY_BUFFER, bP0);
        var aP0 = gl.getAttribLocation(edgeProg, "a_p0");
        gl.enableVertexAttribArray(aP0);
        gl.vertexAttribPointer(aP0, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bP1);
        var aP1 = gl.getAttribLocation(edgeProg, "a_p1");
        gl.enableVertexAttribArray(aP1);
        gl.vertexAttribPointer(aP1, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bCorner);
        var aCorner = gl.getAttribLocation(edgeProg, "a_corner");
        gl.enableVertexAttribArray(aCorner);
        gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bEHover);
        var aHover = gl.getAttribLocation(edgeProg, "a_hover");
        gl.enableVertexAttribArray(aHover);
        gl.vertexAttribPointer(aHover, 1, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix3fv(u(edgeProg, "uRot"), false, rot);
        gl.uniform2f(u(edgeProg, "uRes"), bw, bh);
        gl.uniform1f(u(edgeProg, "uDist"), dist);
        gl.uniform1f(u(edgeProg, "uWidth"), options.lineWidth);
        gl.uniform1f(u(edgeProg, "uOffsetX"), offsetX);
        gl.uniform3f(u(edgeProg, "uColor"), ce[0], ce[1], ce[2]);
        gl.uniform3f(u(edgeProg, "uBg"), bg[0], bg[1], bg[2]);
        gl.uniform1f(u(edgeProg, "uFade"), options.fade);
        gl.drawArrays(gl.TRIANGLES, 0, graph.edges * 6);

        gl.disableVertexAttribArray(aP0);
        gl.disableVertexAttribArray(aP1);
        gl.disableVertexAttribArray(aCorner);
        gl.disableVertexAttribArray(aHover);
      }

      var nodeCount = graph.px.length / 3;
      if (nodeCount > 0) {
        gl.useProgram(nodeProg);
        gl.bindBuffer(gl.ARRAY_BUFFER, bPos);
        var aPos = gl.getAttribLocation(nodeProg, "a_pos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bRate);
        var aRate = gl.getAttribLocation(nodeProg, "a_rate");
        gl.enableVertexAttribArray(aRate);
        gl.vertexAttribPointer(aRate, 1, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bPhase);
        var aPhase = gl.getAttribLocation(nodeProg, "a_phase");
        gl.enableVertexAttribArray(aPhase);
        gl.vertexAttribPointer(aPhase, 1, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bNHover);
        var aNHover = gl.getAttribLocation(nodeProg, "a_hover");
        gl.enableVertexAttribArray(aNHover);
        gl.vertexAttribPointer(aNHover, 1, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix3fv(u(nodeProg, "uRot"), false, rot);
        gl.uniform2f(u(nodeProg, "uRes"), bw, bh);
        gl.uniform1f(u(nodeProg, "uDist"), dist);
        gl.uniform1f(u(nodeProg, "uDotSize"), options.dotSize * 5.5);
        gl.uniform1f(u(nodeProg, "uTime"), clock);
        gl.uniform1f(u(nodeProg, "uSpeed"), options.speed);
        gl.uniform1f(u(nodeProg, "uDpr"), dpr);
        gl.uniform1f(u(nodeProg, "uOffsetX"), offsetX);
        gl.uniform1f(u(nodeProg, "uPulse"), options.pulse);
        gl.uniform3f(u(nodeProg, "uColor"), cn[0], cn[1], cn[2]);
        gl.uniform3f(u(nodeProg, "uBg"), bg[0], bg[1], bg[2]);
        gl.uniform1f(u(nodeProg, "uFade"), options.fade);
        gl.drawArrays(gl.POINTS, 0, nodeCount);

        if (visibleHoverParticles > 0) {
          gl.bindBuffer(gl.ARRAY_BUFFER, bHoverParticlePos);
          gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, bHoverParticleRate);
          gl.vertexAttribPointer(aRate, 1, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, bHoverParticlePhase);
          gl.vertexAttribPointer(aPhase, 1, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, bHoverParticleHover);
          gl.vertexAttribPointer(aNHover, 1, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.POINTS, 0, visibleHoverParticles);
        }

        gl.disableVertexAttribArray(aPos);
        gl.disableVertexAttribArray(aRate);
        gl.disableVertexAttribArray(aPhase);
        gl.disableVertexAttribArray(aNHover);
      }

      scheduleRender();
    }

    function track(e) {
      var r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      ptr.x = ((e.clientX - r.left) / r.width) * canvas.width;
      ptr.y = ((e.clientY - r.top) / r.height) * canvas.height;
    }

    function onLeave() {
      ptr.x = -10000;
      ptr.y = -10000;
    }

    canvas.addEventListener("pointermove", track);
    canvas.addEventListener("pointerenter", track);
    canvas.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(function (entries) {
        inView = entries.some(function (entry) { return entry.isIntersecting; });
        if (inView) scheduleRender();
        else pauseRender();
      });
      observer.observe(root);
    }
    scheduleRender();

    return {
      update: function (nextOpts) {
        mountOpts = Object.assign({}, mountOpts, nextOpts);
        if (nextOpts && nextOpts.network) {
          mountOpts.network = Object.assign({}, mountOpts.network || {}, nextOpts.network);
        }
        if (nextOpts && nextOpts.sphere) {
          mountOpts.sphere = Object.assign({}, mountOpts.sphere || {}, nextOpts.sphere);
        }
        options = normalizeOptions(mountOpts);
        root.style.background = options.background;
      },
      destroy: function () {
        destroyed = true;
        pauseRender();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (observer) observer.disconnect();
        canvas.removeEventListener("pointermove", track);
        canvas.removeEventListener("pointerenter", track);
        canvas.removeEventListener("pointerleave", onLeave);
        if (canvas.parentNode === root) root.removeChild(canvas);
      },
    };
  }

  global.TopologyField = { mount: mount, DEFAULTS: DEFAULTS };
})(typeof window !== "undefined" ? window : globalThis);
