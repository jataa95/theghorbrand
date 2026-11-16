/* The Ghor Brand: work page (filterable grid / list) */
(() => {
  const { $, $$, pad2, pad3, wait, imgSrc, pieceUrl, card, prepare, onFrame, lerp, curSwitch, fmtPrice, statusLabel } = GHOR;
  const WORKS = window.WORKS, FILTERS = window.FILTERS;
  const params = new URLSearchParams(location.search);
  let filter = FILTERS.some((f) => f.id === params.get("filter")) ? params.get("filter") : "all";
  let view = params.get("view") === "list" ? "list" : "grid";

  $("#total").textContent = pad3(WORKS.length);
  $("#cur-slot").innerHTML = curSwitch();
  const chips = $("#chips");
  const pass = (f) => (w) => !f.test || f.test(w);
  chips.innerHTML = FILTERS.map((f) => `<button class="chip" role="tab" data-filter="${f.id}">${f.name}<sup>${pad2(WORKS.filter(pass(f)).length)}</sup></button>`).join("");

  const grid = $("#grid3"), list = $("#list");
  const items = () => WORKS.filter(pass(FILTERS.find((f) => f.id === filter)));

  function render() {
    const ws = items();
    grid.innerHTML = ws.map((w) => card(w)).join("");
    list.innerHTML = ws.map((w) => `
      <a class="row" href="${pieceUrl(w)}" data-slug="${w.slug}" data-reveal>
        <span class="mono">${pad2(WORKS.indexOf(w) + 1)}</span>
        <span class="row-t">${w.title}</span>
        <span class="mono hide-sm hide-md">${w.size || "—"}</span>
        <span class="mono hide-sm"><span class="dot s-${w.status}"></span>${statusLabel(w)}</span>
        <span class="mono hide-sm row-p" data-price="${w.slug}">${fmtPrice(w) || "—"}</span>
        <span class="arr">↗</span>
      </a>`).join("");
    $$(".chip[data-filter]").forEach((c) => c.classList.toggle("act", c.dataset.filter === filter));
    $$("[data-view]").forEach((c) => c.classList.toggle("act", c.dataset.view === view));
    grid.hidden = view !== "grid"; list.hidden = view !== "list";
    prepare(grid); prepare(list);
    $$(".row", list).forEach((r, i) => { r.style.transition = `opacity .8s cubic-bezier(.771,.029,.189,1.007) ${i * 40}ms, transform .8s cubic-bezier(.771,.029,.189,1.007) ${i * 40}ms`; r.classList.add("fade"); });
    const q = new URLSearchParams();
    if (filter !== "all") q.set("filter", filter);
    if (view !== "grid") q.set("view", view);
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
  }

  async function swap(fn) {
    grid.classList.add("is-swapping"); list.classList.add("is-swapping");
    await wait(350);
    fn(); render();
    requestAnimationFrame(() => { grid.classList.remove("is-swapping"); list.classList.remove("is-swapping"); });
  }
  chips.addEventListener("click", (e) => { const c = e.target.closest("[data-filter]"); if (c && c.dataset.filter !== filter) swap(() => (filter = c.dataset.filter)); });
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.view !== view) swap(() => (view = b.dataset.view)); }));

  // List: floating preview follows the cursor
  const prev = $("#preview"), prevImg = $("#preview-img");
  let tx = 0, ty = 0, x = 0, y = 0, cur = null;
  list.addEventListener("mousemove", (e) => { tx = e.clientX + 24; ty = e.clientY - 170; });
  list.addEventListener("mouseover", (e) => {
    const r = e.target.closest(".row");
    if (!r || r.dataset.slug === cur) return;
    cur = r.dataset.slug;
    prevImg.src = `assets/works/${cur}.jpg`;
    prev.classList.add("show");
  });
  list.addEventListener("mouseleave", () => { prev.classList.remove("show"); cur = null; });
  onFrame(() => {
    x = lerp(x, tx, 0.14); y = lerp(y, ty, 0.14);
    prev.style.setProperty("--x", `${x}px`); prev.style.setProperty("--y", `${y}px`);
  });

  render();
})();
