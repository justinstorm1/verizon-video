/* Priority 5G pitch deck engine: scaling, navigation, animations, auto-play, speaker-notes sync. */
(() => {
  "use strict";
  const stage = document.getElementById("stage");
  const slides = [...document.querySelectorAll(".slide")];
  const durs = slides.map(s => Number(s.dataset.dur) || 10);
  const total = slides.length;
  const $ = id => document.getElementById(id);
  let idx = 0, notesWin = null;

  /* ---------- team line ---------- */
  const teamEl = $("teamLine");
  if (typeof TEAM === "string" && TEAM.trim()) teamEl.textContent = TEAM.trim();
  else teamEl.remove();

  /* ---------- scale 1920x1080 stage to the window ---------- */
  function fit() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
    stage.style.transformOrigin = "50% 50%";
  }
  addEventListener("resize", fit); fit();

  /* ---------- navigation ---------- */
  const timers = new Map();
  function show(n, opts = {}) {
    n = Math.max(0, Math.min(total - 1, n));
    const prev = slides[idx];
    if (prev && prev !== slides[n]) {
      prev.classList.remove("current");
      const p = prev;
      clearTimeout(timers.get(p));
      timers.set(p, setTimeout(() => { if (!p.classList.contains("current")) { p.classList.remove("play"); stopSlide(p); } }, 650));
    }
    idx = n;
    const cur = slides[idx];
    clearTimeout(timers.get(cur));
    cur.classList.remove("play"); stopSlide(cur);
    cur.classList.add("current");
    void cur.offsetWidth;                       // restart CSS transitions
    requestAnimationFrame(() => requestAnimationFrame(() => { cur.classList.add("play"); startSlide(cur); }));
    try { history.replaceState(null, "", "#" + (idx + 1)); } catch { /* ignore */ }
    if (!opts.fromAuto && auto.on) auto.syncTo(idx);
    sync();
  }
  const next = () => {
    // manual mode: if this slide still has builds waiting, reveal them first
    if (!auto.on && revealAll(slides[idx])) return;
    show(idx + 1);
  };
  const prev = () => show(idx - 1);

  /* ---------- per-slide scripted animations ---------- */
  function startSlide(el) {
    cues(el);
    if (el.id === "s5") chart.start();
    if (el.id === "s8") counters(el);
  }
  function stopSlide(el) {
    el._cues?.forEach(clearTimeout); el._cues = [];
    el.querySelectorAll("[data-at]").forEach(n => { n.classList.add("wait"); n.classList.remove("on"); });
    if (el.id === "s5") chart.reset();
    if (el.id === "s8") el.querySelectorAll("[data-count]").forEach(n => { cancelAnimationFrame(n._raf); clearTimeout(n._t); n.textContent = fmt(n, 0); });
  }

  /* ---------- timed builds: data-at="seconds after the slide appears" ---------- */
  const SPEED = 1;   // tweak if you talk faster (>1) or slower (<1) than the script timing
  function cues(el) {
    el._cues = [...el.querySelectorAll("[data-at]")].map(n =>
      setTimeout(() => { n.classList.remove("wait"); n.classList.add("on"); }, Number(n.dataset.at) * 1000 / SPEED));
  }
  function revealAll(el) {
    const waiting = el.querySelectorAll("[data-at].wait");
    if (!waiting.length) return false;
    el._cues?.forEach(clearTimeout); el._cues = [];
    waiting.forEach(n => { n.classList.remove("wait"); n.classList.add("on"); });
    return true;
  }
  slides.forEach(el => el.querySelectorAll("[data-at]").forEach(n => n.classList.add("wait")));

  /* ---------- KPI counters ---------- */
  function fmt(n, v) {
    const dec = Number(n.dataset.dec || 0);
    return (n.dataset.pre || "") + v.toFixed(dec) + (n.dataset.suf || "");
  }
  function counters(el) {
    el.querySelectorAll("[data-count]").forEach((n, i) => {
      const target = Number(n.dataset.count);
      n.textContent = fmt(n, 0);
      n._t = setTimeout(() => {
        const t0 = performance.now(), D = 1400;
        const step = now => {
          const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
          n.textContent = fmt(n, k === 1 ? target : target * e);
          if (k < 1) n._raf = requestAnimationFrame(step);
        };
        n._raf = requestAnimationFrame(step);
      }, 600 + i * 200);
    });
  }

  /* ---------- latency chart (simulated crowd surge) ---------- */
  const chart = (() => {
    const svg = $("chart"), NS = "http://www.w3.org/2000/svg";
    const L = 78, R = 985, T = 18, B = 400;
    const TMAX = 45, YMAX = 180, REG_END = 162, BOOST_END = 18, GUAR = 25;
    const x = t => L + (t / TMAX) * (R - L);
    const y = v => B - (v / YMAX) * (B - T);
    const noise = (i, a) => Math.sin(i * 12.9898 + a) * 0.5 + Math.sin(i * 4.1414 + a * 2) * 0.5;
    const smooth = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
    const pts = [];
    for (let i = 0; i <= 90; i++) {
      const t = i / 2;
      const load = smooth((t - 8) / 32);
      let reg = 30 + (REG_END - 30) * load + noise(i, 1.7) * (3 + 9 * load);
      let boo = 16 + noise(i, 5.3) * 2.2;
      if (i === 90) { reg = REG_END; boo = BOOST_END; }
      pts.push({ t, reg: Math.max(22, reg), boo: Math.min(GUAR - 3, Math.max(12, boo)) });
    }
    const el = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };

    // axes + grid
    [0, 50, 100, 150].forEach(v => {
      el("line", { x1: L, x2: R, y1: y(v), y2: y(v), stroke: "rgba(255,255,255,.12)", "stroke-width": 1 });
      el("text", { x: L - 14, y: y(v) + 7, fill: "rgba(255,255,255,.6)", "font-size": 20, "text-anchor": "end" }).textContent = v;
    });
    const yl = el("text", { x: (T + B) / -2, y: 22, fill: "rgba(255,255,255,.6)", "font-size": 19, "text-anchor": "middle", transform: "rotate(-90)" }); yl.textContent = "Latency (ms)";
    el("line", { x1: L, x2: R, y1: B, y2: B, stroke: "rgba(255,255,255,.4)", "stroke-width": 2 });
    el("text", { x: R, y: B + 34, fill: "rgba(255,255,255,.6)", "font-size": 19, "text-anchor": "end" }).textContent = "Time (simulated) →";
    // surge marker
    el("line", { x1: x(8), x2: x(8), y1: T + 10, y2: B, stroke: "rgba(255,255,255,.35)", "stroke-width": 2, "stroke-dasharray": "6 8" });
    el("text", { x: x(8) + 12, y: T + 30, fill: "rgba(255,255,255,.75)", "font-size": 20, "font-weight": 700 }).textContent = "Crowd surge begins";
    // guarantee line
    el("line", { x1: L, x2: R, y1: y(GUAR), y2: y(GUAR), stroke: "#F5FF1E", "stroke-width": 2, "stroke-dasharray": "10 8", opacity: .7 });
    const g = el("text", { x: R + 18, y: y(GUAR) - 26, fill: "#F5FF1E", "font-size": 18, "font-weight": 700, opacity: .85 });
    el("tspan", { x: R + 18, dy: 0 }, g).textContent = "Guarantee";
    el("tspan", { x: R + 18, dy: 21 }, g).textContent = "≤25 ms";

    const pReg = el("path", { fill: "none", stroke: "#FF3C2D", "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" });
    const pBoo = el("path", { fill: "none", stroke: "#F5FF1E", "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" });
    const dReg = el("circle", { r: 9, fill: "#FF3C2D", opacity: 0 });
    const dBoo = el("circle", { r: 9, fill: "#F5FF1E", opacity: 0 });
    const lReg = el("text", { fill: "#FF3C2D", "font-size": 21, "font-weight": 700, opacity: 0 }); lReg.textContent = "Regular network";
    const lBoo = el("text", { fill: "#F5FF1E", "font-size": 21, "font-weight": 700, opacity: 0 }); lBoo.textContent = "Priority 5G boost";

    const rReg = $("rReg"), rBoo = $("rBoost"), ok = $("okBadge");
    let raf = 0, delay = 0;
    const DUR = 7000;
    function draw(k) {
      const n = Math.max(1, Math.round(k * 90));
      const sub = pts.slice(0, n + 1);
      pReg.setAttribute("d", sub.map((p, i) => (i ? "L" : "M") + x(p.t).toFixed(1) + " " + y(p.reg).toFixed(1)).join(""));
      pBoo.setAttribute("d", sub.map((p, i) => (i ? "L" : "M") + x(p.t).toFixed(1) + " " + y(p.boo).toFixed(1)).join(""));
      const last = sub[sub.length - 1];
      [[dReg, last.reg], [dBoo, last.boo]].forEach(([d, v]) => { d.setAttribute("cx", x(last.t)); d.setAttribute("cy", y(v)); d.setAttribute("opacity", 1); });
      const lx = x(last.t) + 18;
      lReg.setAttribute("x", lx); lReg.setAttribute("y", y(last.reg) - 14); lReg.setAttribute("opacity", 1);
      lBoo.setAttribute("x", lx); lBoo.setAttribute("y", y(last.boo) + 34); lBoo.setAttribute("opacity", 1);
      rReg.innerHTML = Math.round(last.reg) + "<small>ms</small>";
      rBoo.innerHTML = Math.round(last.boo) + "<small>ms</small>";
      ok.classList.toggle("on", k >= 1);
    }
    function reset() {
      cancelAnimationFrame(raf); clearTimeout(delay);
      pReg.setAttribute("d", ""); pBoo.setAttribute("d", "");
      [dReg, dBoo, lReg, lBoo].forEach(e => e.setAttribute("opacity", 0));
      rReg.innerHTML = "30<small>ms</small>"; rBoo.innerHTML = "16<small>ms</small>";
      ok.classList.remove("on");
    }
    function start() {
      reset();
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) { draw(1); return; }
      delay = setTimeout(() => {
        const t0 = performance.now();
        const step = now => { const k = Math.min(1, (now - t0) / DUR); draw(k); if (k < 1) raf = requestAnimationFrame(step); };
        raf = requestAnimationFrame(step);
      }, 900);
    }
    reset();
    return { start, reset };
  })();

  /* ---------- auto-play (recording run) ---------- */
  const auto = (() => {
    const bar = $("progress"), cnt = $("count");
    let on = false, paused = false, t = null, slideStart = 0, remaining = 0, raf = 0;
    function schedule(ms) {
      clearTimeout(t); slideStart = performance.now(); remaining = ms;
      t = setTimeout(() => { if (idx < total - 1) { show(idx + 1, { fromAuto: true }); schedule(durs[idx] * 1000); } else stop(true); }, ms);
    }
    function tick() {
      if (!on) return;
      const left = paused ? remaining : Math.max(0, remaining - (performance.now() - slideStart));
      const done = durs.slice(0, idx).reduce((a, b) => a + b, 0) * 1000 + (durs[idx] * 1000 - left);
      const all = durs.reduce((a, b) => a + b, 0) * 1000;
      bar.style.width = Math.min(100, done / all * 100) + "%";
      raf = requestAnimationFrame(tick);
    }
    function begin() {
      let c = 3; cnt.style.display = "flex"; cnt.textContent = c;
      const iv = setInterval(() => {
        c--; if (c > 0) { cnt.textContent = c; return; }
        clearInterval(iv); cnt.style.display = "none";
        on = true; paused = false; document.body.classList.add("autoplay");
        show(0, { fromAuto: true }); schedule(durs[0] * 1000); tick(); startClock(); sync();
      }, 1000);
    }
    function stop(finished) {
      on = false; paused = false; clearTimeout(t); cancelAnimationFrame(raf);
      document.body.classList.remove("autoplay"); bar.style.width = 0;
      if (!finished) toast("Auto-play stopped"); sync();
    }
    function toggle() {
      if (!on) return;
      if (!paused) { paused = true; clearTimeout(t); remaining -= performance.now() - slideStart; toast("Paused"); }
      else { paused = false; const r = remaining; schedule(r); remaining = r; toast("Resumed"); }
      sync();
    }
    function syncTo(n) { if (on && !paused) schedule(durs[n] * 1000); }
    return { begin, stop, toggle, syncTo, get on() { return on; }, get paused() { return paused; } };
  })();

  /* ---------- speaker notes window ---------- */
  let clockStart = null;
  function startClock() { clockStart = Date.now(); sync(); }
  function sync() {
    if (notesWin && !notesWin.closed) {
      notesWin.postMessage({ type: "p5g-state", idx, total, durs, script: (typeof SCRIPT !== "undefined" ? SCRIPT : []),
        titles: slides.map(s => (s.querySelector(".eyebrow")?.textContent || "Title").trim()),
        auto: auto.on, paused: auto.paused, clockStart, at: Date.now() }, "*");
    }
  }
  function openNotes() {
    notesWin = window.open("notes.html", "p5g-notes", "width=1000,height=760");
    if (!notesWin) { toast("Pop-up blocked: allow pop-ups for this page, then press N again"); return; }
    setTimeout(sync, 400); setTimeout(sync, 1200);
  }
  addEventListener("message", e => {
    const d = e.data || {};
    if (d.type !== "p5g-cmd") return;
    if (d.cmd === "hello") { notesWin = e.source; sync(); }
    else if (d.cmd === "next") next();
    else if (d.cmd === "prev") prev();
    else if (d.cmd === "goto") show(d.n);
    else if (d.cmd === "auto") { if (auto.on) auto.stop(); else auto.begin(); }
    else if (d.cmd === "pause") auto.toggle();
    else if (d.cmd === "clock") startClock();
    else if (d.cmd === "replay") show(idx);
  });

  /* ---------- UI helpers ---------- */
  let toastT = 0;
  function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 1600); }
  const help = $("help");
  let cursorT = 0;
  function wake() { document.body.classList.remove("hide-cursor"); clearTimeout(cursorT); cursorT = setTimeout(() => document.body.classList.add("hide-cursor"), 1500); }
  addEventListener("mousemove", wake); wake();

  document.body.classList.add("clean");     // no progress bar in the recording unless B is pressed

  addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (["ArrowRight", "PageDown", " ", "Enter", "ArrowDown"].includes(k)) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "PageUp", "Backspace", "ArrowUp"].includes(k)) { e.preventDefault(); prev(); }
    else if (k === "Home") show(0);
    else if (k === "End") show(total - 1);
    else if (/^[1-9]$/.test(k)) show(Number(k) - 1);
    else if (k === "f" || k === "F") { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.(); }
    else if (k === "n" || k === "N") openNotes();
    else if (k === "a" || k === "A") { if (auto.on) auto.stop(); else auto.begin(); }
    else if (k === "p" || k === "P") auto.toggle();
    else if (k === "Escape") { if (auto.on) auto.stop(); help.style.display = "none"; }
    else if (k === "r" || k === "R") show(idx);
    else if (k === "b" || k === "B") { document.body.classList.toggle("clean"); toast(document.body.classList.contains("clean") ? "Progress bar hidden" : "Progress bar shown"); }
    else if (k === "h" || k === "H" || k === "?") help.style.display = help.style.display === "block" ? "none" : "block";
  });
  stage.addEventListener("click", () => next());

  /* ---------- start ---------- */
  const fromHash = parseInt(location.hash.slice(1), 10);
  idx = 0;
  show(Number.isFinite(fromHash) ? fromHash - 1 : 0);
})();
