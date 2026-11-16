/* The Ghor Brand: home page (landing) */
(() => {
  const { $, $$, clamp, lerp, pad2, wait, reduced, lenis, imgSrc, thumb, pieceUrl, card, bySlug, curSwitch, onFrame, ready } = GHOR;
  const WORKS = window.WORKS;
  const root = document.documentElement;

  // ---------- Stage strip: paintings and studio films, drifting; drag or scroll to push it ----------
  const FILMS = {
    "film-final-layers": "The final layers",
    "film-blank-canvas": "From a blank canvas",
    "film-gallery": "On the gallery wall",
  };
  const STUDIO = {
    "studio-right-on-time": "With Right On Time",
    "studio-hold": "Ogor Opene, Lagos",
  };
  // Painting tiles keep the canvas's real proportions (frame trimmed off), so the row staggers naturally.
  const RATIO = {
    "a-life-unwritten": .683, "emergence": .569, "inheritance-of-silence": .677, "right-on-time": .802, "still-water": .644,
    "the-courage-to-speak": .684, "the-in-between": .75, "unspoken-dreams": .699, "when-the-world-went-quiet": .75,
    "film-final-layers": .8, "film-blank-canvas": .8, "film-gallery": .8, "studio-right-on-time": .75, "studio-hold": .75,
  };
  const ORDER = ["right-on-time", "film-final-layers", "emergence", "when-the-world-went-quiet", "studio-right-on-time", "the-in-between",
    "film-blank-canvas", "still-water", "the-courage-to-speak", "studio-hold", "a-life-unwritten", "film-gallery", "inheritance-of-silence", "unspoken-dreams"];
  const capFor = (w) => `${GHOR.statusLabel(w)}${w.price ? " · " + GHOR.fmtPrice(w) : ""}`;
  const tileHTML = (k, i, clone) => {
    const st = `--ar:${RATIO[k]};--i:${clone ? 0 : i}`;
    const lazy = i > 4 || clone ? ' loading="lazy"' : "";
    if (FILMS[k]) return `<a class="tile is-film" href="https://www.tiktok.com/@theghorbrand" target="_blank" rel="noopener" style="${st}" aria-label="Studio film: ${FILMS[k]}">
        <div class="tile-media"><video muted loop playsinline autoplay preload="${clone ? "none" : "metadata"}" poster="assets/media/${k}.jpg"><source src="assets/media/${k}.mp4" type="video/mp4" /></video></div>
        <div class="tile-cap"><b>Studio film</b><span>${FILMS[k]}</span></div></a>`;
    if (STUDIO[k]) return `<a class="tile" href="about.html" style="${st}">
        <div class="tile-media"><img src="assets/works/tiles/${k}.jpg" alt="Ogor Opene in the studio"${lazy} /></div>
        <div class="tile-cap"><b>The artist</b><span>${STUDIO[k]}</span></div></a>`;
    const w = bySlug(k);
    return `<a class="tile" href="${pieceUrl(w)}" style="${st}" data-slug="${k}">
        <div class="tile-media"><img src="assets/works/tiles/${k}.jpg" alt="${w.title}, painting by Ogor Opene"${lazy} /></div>
        <div class="tile-cap"><b>${w.title}</b><span>${capFor(w)}</span></div></a>`;
  };
  {
  const track = $("#strip-track"), strip = $("#strip");
  track.innerHTML = ORDER.map((k, i) => tileHTML(k, i)).join("") + ORDER.map((k, i) => tileHTML(k, i, true)).join("");
  const tiles = $$(".tile", track);
  let sx = 0, sv = 0, dragging = false, moved = 0, lastX = 0;
  strip.addEventListener("pointerdown", (e) => { dragging = true; moved = 0; lastX = e.clientX; strip.classList.add("drag"); strip.setPointerCapture(e.pointerId); });
  strip.addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); sx += dx; sv = dx; });
  const endDrag = () => { dragging = false; strip.classList.remove("drag"); };
  strip.addEventListener("pointerup", endDrag); strip.addEventListener("pointercancel", endDrag);
  strip.addEventListener("click", (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  strip.addEventListener("wheel", (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { sv -= e.deltaX * 0.06; } }, { passive: true });
  let actT = 0;
  onFrame((now, dt) => {
    const k = dt / 16.67;
    if (!dragging) {
      const vel = lenis ? Math.abs(lenis.velocity || 0) : 0;
      sv = lerp(sv, -(reduced ? 0 : 0.45) - Math.min(vel * 0.4, 16), 0.06);
      sx += sv * k;
    }
    const half = track.scrollWidth / 2;
    if (half) { while (sx <= -half) sx += half; while (sx > 0) sx -= half; }
    track.style.transform = `translate3d(${sx.toFixed(2)}px,0,0)`;
    // touch screens: caption the first tile that is fully on screen
    if (now - actT > 150 && matchMedia("(hover: none)").matches) {
      actT = now;
      const best = tiles.find((t) => { const r = t.getBoundingClientRect(); return r.left >= 4 && r.right <= innerWidth; });
      tiles.forEach((t) => t.classList.toggle("act", t === best));
    }
  });
  // films in the strip only play while the stage is on screen
  new IntersectionObserver(([en]) => $$("video", track).forEach((v) => (en.isIntersecting ? v.play().catch(() => {}) : v.pause())), { threshold: 0.05 }).observe(strip);
  document.addEventListener("click", (e) => { if (e.target.closest("[data-cur]")) $$(".tile[data-slug]", track).forEach((t) => ($(".tile-cap span", t).textContent = capFor(bySlug(t.dataset.slug)))); });

  // phones: the wordmark is sized to fill the width exactly
  const word = $(".sw-in");
  const fitWord = () => {
    word.style.fontSize = "";
    if (innerWidth >= 860) return;
    const foot = word.closest(".stage-foot"), cs = getComputedStyle(foot);
    const avail = foot.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), w = word.getBoundingClientRect().width;
    if (w) word.style.fontSize = `${(parseFloat(getComputedStyle(word).fontSize) * avail / w).toFixed(2)}px`;
  };
  document.fonts.ready.then(fitWord); addEventListener("load", fitWord); addEventListener("resize", fitWord);
  }

  const avail = WORKS.filter((w) => w.status === "available");
  $("#stage-avail").textContent = pad2(avail.length);
  $("#sc-n").textContent = avail.length;

  // ---------- Sticky enquiry button: after the hero, hidden over the footer ----------
  const sticky = $("#sticky-cta"), heroEl = $(".stage"), footer = $("#footer");
  onFrame(() => {
    const past = heroEl.getBoundingClientRect().bottom < innerHeight * 0.4;
    const atFoot = footer && footer.getBoundingClientRect().top < innerHeight * 0.9;
    sticky.classList.toggle("show", past && !atFoot && !root.classList.contains("menu-open"));
    // logo turns white while it sits over the strip of paintings
    root.classList.toggle("over-stage", $("#strip").getBoundingClientRect().bottom > 60);
  });

  $("#stat-works").dataset.count = WORKS.length;
  $("#stat-avail").dataset.count = WORKS.filter((w) => w.status === "available").length;

  // ---------- Selected work (6) ----------
  const SELECTED = ["right-on-time", "when-the-world-went-quiet", "the-in-between", "still-water", "a-life-unwritten", "the-courage-to-speak"];
  $("#grid").innerHTML = SELECTED.map((s) => card(bySlug(s))).join("");
  $("#cur-slot").innerHTML = curSwitch();
  $("#grid-cta").textContent = `View all ${pad2(WORKS.length)} works`;

  // ---------- About cycle ----------
  const cyc = $$("#about-cycle span");
  let cycI = 0;
  setInterval(() => {
    const cur = cyc[cycI];
    cur.classList.remove("act"); cur.classList.add("leave");
    setTimeout(() => cur.classList.remove("leave"), 750);
    cycI = (cycI + 1) % cyc.length;
    cyc[cycI].classList.add("act");
  }, 1800);

  // ---------- Studio films: play only while on screen ----------
  const filmIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    const v = en.target.querySelector("video");
    if (en.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.25 });
  $$(".film").forEach((f) => { f.classList.add("fade"); filmIO.observe(f); });

  // ---------- Statements slider ----------
  const NOTES = ["still-water", "the-in-between", "inheritance-of-silence", "a-life-unwritten", "when-the-world-went-quiet"].map(bySlug);
  $("#testi-bgs").innerHTML = NOTES.map((w) => `<div class="testi-bg" style="background-image:url(${thumb(w)})"></div>`).join("");
  $("#testi-art").innerHTML = NOTES.map((w) => `<img src="${imgSrc(w)}" alt="" loading="lazy" />`).join("");
  $("#testi-quotes").innerHTML = NOTES.map((w) => `<div class="testi-q">
      <blockquote data-split="wipe">“${w.desc}”</blockquote>
      <div class="meta"><a href="${pieceUrl(w)}">${w.title} ↗</a></div>
    </div>`).join("");
  $("#testi-tabs").innerHTML = NOTES.map((w, i) => `<button class="testi-tab" role="tab" data-k="${i}">${w.title}<i></i></button>`).join("");
  const tBg = $$(".testi-bg"), tQ = $$(".testi-q"), tTab = $$(".testi-tab"), tArt = $$("#testi-art img"), tIdx = $("#testi-index");
  let tI = -1, tTimer = null, tActive = false;
  const T_DUR = 7000;
  function showT(n) {
    n = (n + NOTES.length) % NOTES.length;
    if (tI >= 0) {
      [tBg, tQ, tTab, tArt].forEach((l) => l[tI].classList.remove("act"));
      $$("[data-split]", tQ[tI]).forEach((el) => el.classList.remove("in"));
    }
    tI = n;
    tBg[n].classList.add("act"); tQ[n].classList.add("act"); tArt[n].classList.add("act");
    const tab = tTab[n]; void tab.offsetWidth; tab.classList.add("act"); tab.style.setProperty("--dur", `${T_DUR}ms`);
    requestAnimationFrame(() => $$("[data-split]", tQ[n]).forEach((el) => el.classList.add("in")));
    tIdx.textContent = `${pad2(n + 1)}/${pad2(NOTES.length)}`;
    clearTimeout(tTimer);
    if (tActive) tTimer = setTimeout(() => showT(tI + 1), T_DUR);
  }
  tTab.forEach((b) => b.addEventListener("click", () => showT(+b.dataset.k)));
  ready.then(() => new IntersectionObserver(([en]) => {
    tActive = en.isIntersecting;
    if (tActive) showT(tI < 0 ? 0 : tI); else clearTimeout(tTimer);
  }, { threshold: 0.35 }).observe($("#statements")));

  // ---------- Marquee (speed reacts to scroll velocity) ----------
  const track = $("#marquee-track");
  const mq = WORKS.map((w) => `<a class="mq" href="${pieceUrl(w)}"><img src="${imgSrc(w)}" alt="${w.title}" loading="lazy" /><span>${w.title}</span></a>`).join("");
  track.innerHTML = mq + mq;
  $("#more-count").textContent = String(WORKS.length).padStart(3, "0");
  let mqX = 0, mqHover = false, mqSpeed = 0.6;
  track.addEventListener("mouseenter", () => (mqHover = true));
  track.addEventListener("mouseleave", () => (mqHover = false));
  onFrame((now, dt) => {
    if (reduced) return;
    const vel = lenis ? Math.abs(lenis.velocity || 0) : 0;
    mqSpeed = lerp(mqSpeed, (mqHover ? 0.12 : 0.6) + Math.min(vel * 0.35, 14), 0.08);
    mqX -= mqSpeed * (dt / 16.67);
    const half = track.scrollWidth / 2;
    if (half && -mqX >= half) mqX += half;
    track.style.transform = `translate3d(${mqX.toFixed(2)}px,0,0)`;
  });

  // ---------- Intro: hand-off from the preloader into the stage ----------
  const played = root.classList.contains("preload");
  async function boot() {
    await ready;
    if (played && !reduced) await GHOR.preloaded;
    root.classList.remove("is-loading");
    await wait(played ? 250 : 80);
    heroEl.classList.add("in");
  }
  boot();
})();
