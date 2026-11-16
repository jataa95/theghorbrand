/* The Ghor Brand: home page (landing) */
(() => {
  const { $, $$, clamp, lerp, pad2, wait, reduced, lenis, imgSrc, thumb, pieceUrl, card, bySlug, curSwitch, onFrame, ready } = GHOR;
  const WORKS = window.WORKS;
  const root = document.documentElement;

  // ---------- Hero film: landscape cut on wide screens, portrait cut on phones ----------
  const heroV = $("#hero-video");
  const phone = matchMedia("(max-aspect-ratio: 4/5), (max-width: 600px)").matches;
  heroV.poster = heroV.dataset[phone ? "posterMobile" : "posterDesktop"];
  heroV.src = heroV.dataset[phone ? "mobile" : "desktop"];
  heroV.play().catch(() => {});

  const avail = WORKS.filter((w) => w.status === "available");
  $("#hero-avail").textContent = pad2(avail.length);
  $("#sc-n").textContent = avail.length;
  const from = avail.filter((w) => w.price).sort((x, y) => x.price.NGN - y.price.NGN)[0];
  const syncFrom = () => $$("[data-from]").forEach((el) => (el.textContent = from ? GHOR.fmtPrice(from) : "On enquiry"));
  syncFrom();
  document.addEventListener("click", (e) => { if (e.target.closest("[data-cur]")) syncFrom(); });

  // ---------- Sticky enquiry button: after the hero, hidden over the footer ----------
  const sticky = $("#sticky-cta"), heroEl = $(".hero"), footer = $("#footer");
  onFrame(() => {
    const past = heroEl.getBoundingClientRect().bottom < innerHeight * 0.4;
    const atFoot = footer && footer.getBoundingClientRect().top < innerHeight * 0.9;
    sticky.classList.toggle("show", past && !atFoot && !root.classList.contains("menu-open"));
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

  // ---------- Hero: gentle parallax as it scrolls away ----------
  const heroContent = $("#hero-content");
  onFrame(() => {
    if (reduced || root.classList.contains("is-loading")) return;
    const r = heroEl.getBoundingClientRect(), p = clamp(-r.top / r.height);
    heroV.style.transform = `translate3d(0, ${(p * r.height * 0.25).toFixed(1)}px, 0) scale(${(1.04 + p * 0.06).toFixed(4)})`;
    heroContent.style.opacity = (1 - clamp(p * 1.6)).toFixed(3);
    heroContent.style.transform = `translateY(${(-p * 60).toFixed(1)}px)`;
  });

  // ---------- Intro: hand-off from the preloader into the hero ----------
  const played = root.classList.contains("preload");
  async function boot() {
    if (lenis) lenis.stop();
    await ready;
    const hs = heroEl.style;
    const setFrame = (t, r, b, l, rad) => { hs.setProperty("--ht", t); hs.setProperty("--hr", r); hs.setProperty("--hb", b); hs.setProperty("--hl", l); hs.setProperty("--hrad", rad); };
    const reveal = () => { heroContent.classList.add("in"); $$("[data-split]", heroContent).forEach((el) => el.classList.add("in")); };
    if (played && !reduced) {
      setFrame("36%", "30%", "36%", "30%", "4px");
      await GHOR.preloaded;
      await wait(450);
      heroEl.style.transition = "clip-path 1.3s cubic-bezier(.771,.029,.189,1.007)";
      setFrame("0%", "0%", "0%", "0%", "0px");
      await wait(800);
      root.classList.remove("is-loading");
      reveal();
      await wait(700);
      heroEl.style.transition = "";
    } else {
      root.classList.remove("is-loading");
      await wait(250);
      reveal();
    }
    if (lenis) lenis.start();
  }
  boot();
})();
