/* The Ghor Brand: home page (landing) */
(() => {
  const { $, $$, clamp, lerp, easeInOut, pad2, wait, reduced, lenis, imgSrc, thumb, pieceUrl, card, bySlug, curSwitch, onFrame, ready } = GHOR;
  const WORKS = window.WORKS;
  const root = document.documentElement;

  // Phones show the hero film full-bleed and unblurred, so use the clip whose
  // burned-in captions sit at the top, clear of the headline.
  if (matchMedia("(max-width: 860px)").matches) {
    const bg = $("#hero-bg");
    bg.poster = "assets/media/blank-canvas-poster.jpg";
    bg.querySelector("source").src = "assets/media/blank-canvas.mp4";
    bg.load(); bg.play().catch(() => {});
    $("#hero-video").removeAttribute("autoplay"); $("#hero-video").preload = "none";
  }

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

  // ---------- Hero / reel: corner tile grows into a gallery wall ----------
  const intro = $(".intro"), pin = $(".intro-pin"), hero = $("#hero"), heroContent = $("#hero-content"), heroFilm = $("#hero-film");
  const reel = $("#reel"), reelMedia = $("#reel-media"), reelCount = $("#reel-count"), reelTitle = $("#reel-title"), scrollHint = $(".hero-scroll");
  const REEL = WORKS;
  reelMedia.innerHTML = REEL.map((w, i) => `<figure class="rm"><div class="rm-bg" style="background-image:url(${thumb(w)})"></div><img src="${imgSrc(w)}" alt=""${i ? ' loading="lazy"' : ""} /></figure>`).join("");
  const reelItems = $$(".rm", reelMedia);
  reelItems[0].classList.add("act"); reelTitle.textContent = REEL[0].title;
  let reelI = 0, reelT = 0, reelBig = 0;
  onFrame((now) => {
    if (now - reelT >= (reelBig > 0.5 ? 2600 : 1400)) {
      reelT = now;
      reelItems[reelI].classList.remove("act");
      reelI = (reelI + 1) % reelItems.length;
      const it = reelItems[reelI]; void it.offsetWidth; it.classList.add("act");
      reelCount.textContent = `${pad2(reelI + 1)}/${pad2(reelItems.length)}`;
      reelTitle.textContent = REEL[reelI].title;
    }
    const W = innerWidth, H = pin.offsetHeight;
    const p = clamp(-intro.getBoundingClientRect().top / (intro.offsetHeight - H));
    const e = easeInOut(p); reelBig = e;
    const pd = W < 860 ? 16 : 20, w0 = W < 860 ? 110 : 168, h0 = Math.round(w0 * 1.25);
    const s = reel.style;
    s.setProperty("--rx", `${lerp(W - pd - w0, pd, e)}px`); s.setProperty("--ry", `${lerp(H - pd - h0, pd, e)}px`);
    s.setProperty("--rw", `${lerp(w0, W - pd * 2, e)}px`); s.setProperty("--rh", `${lerp(h0, H - pd * 2, e)}px`);
    s.setProperty("--rr", `${lerp(2, 5, e)}px`); s.setProperty("--rp", e.toFixed(3));
    s.setProperty("--rl", clamp((e - 0.55) / 0.3).toFixed(3));
    if (!root.classList.contains("is-loading")) {
      heroContent.style.opacity = (1 - clamp(e * 1.8)).toFixed(3);
      heroContent.style.transform = `translateY(${-e * 70}px)`;
      heroFilm.style.setProperty("--fy", `${-e * 40}px`);
      scrollHint.style.setProperty("--so", (1 - clamp(e * 4)).toFixed(3));
    }
  });

  // ---------- Intro: hand-off from the preloader into the hero ----------
  const played = root.classList.contains("preload");
  async function boot() {
    if (lenis) lenis.stop();
    await ready;
    const hs = hero.style;
    const setFrame = (t, r, b, l, rad) => { hs.setProperty("--ht", t); hs.setProperty("--hr", r); hs.setProperty("--hb", b); hs.setProperty("--hl", l); hs.setProperty("--hrad", rad); };
    if (played && !reduced) {
      setFrame("36%", "42%", "36%", "42%", "4px");
      await GHOR.preloaded;
      await wait(450);
      hero.style.transition = "clip-path 1.3s cubic-bezier(.771,.029,.189,1.007)";
      setFrame("0%", "0%", "0%", "0%", "0px");
      await wait(800);
      root.classList.remove("is-loading");
      heroContent.classList.add("in"); $$("[data-split]", heroContent).forEach((el) => el.classList.add("in"));
      await wait(700);
      hero.style.transition = "";
    } else {
      root.classList.remove("is-loading");
      await wait(250);
      heroContent.classList.add("in"); $$("[data-split]", heroContent).forEach((el) => el.classList.add("in"));
    }
    if (lenis) lenis.start();
  }
  boot();
})();
