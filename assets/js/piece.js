/* The Ghor Brand: single artwork page (piece.html?w=slug) */
(() => {
  const { $, pad2, imgSrc, pieceUrl, tagHTML, statusHTML, statusLabel, fmtPrice, curSwitch, enquireLink, channelName, card, bySlug, ARTIST, BRAND } = GHOR;
  const WORKS = window.WORKS;
  const w = bySlug(new URLSearchParams(location.search).get("w"));
  if (!w) { location.replace("work.html"); return; }

  const i = WORKS.indexOf(w);
  const prev = WORKS[(i - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(i + 1) % WORKS.length];
  const related = WORKS.filter((o) => o !== w && o.status === "available")
    .concat(WORKS.filter((o) => o !== w && o.status !== "available")).slice(0, 3);

  document.title = `${w.title} | ${BRAND}`;
  document.querySelector('meta[name="description"]').setAttribute("content", `${w.title} by ${ARTIST}. ${w.desc}`);

  const specs = [["Artist", `${ARTIST} (${BRAND})`], ["Medium", w.medium], ["Size", w.size], ["Collection", w.vol ? `Becoming · ${w.vol}` : "Becoming"], ["Status", statusLabel(w)], ["Studio", "Lagos, Nigeria"]]
    .filter(([, v]) => v);
  const sold = w.status === "sold";
  const ask = sold
    ? `Hi The Ghor Brand, I love "${w.title}". I see it has sold. Could you make something similar, or tell me about available work?`
    : `Hi The Ghor Brand, I'm interested in "${w.title}". Is it still available?`;
  const priceBlock = w.price
    ? `<div class="price-box${sold ? " is-sold" : ""}">
        <div class="price-top"><span class="mono">${sold ? "Sold · was" : "Price"}</span>${curSwitch()}</div>
        <p class="price" data-price="${w.slug}">${fmtPrice(w)}</p>
      </div>`
    : `<div class="price-box"><div class="price-top"><span class="mono">Price</span></div><p class="price price-ask">On enquiry</p></div>`;

  $("#piece-root").innerHTML = `
    <section class="piece">
      <div>
        <div class="crumbs mono"><a href="work.html" class="bnd-hov">Work</a><span>/</span><span>Becoming${w.vol ? ` · ${w.vol}` : ""}</span><span>/</span><span>${w.title}</span></div>
        <div class="piece-wall" data-reveal><img src="${imgSrc(w)}" alt="${w.title}, painting by ${ARTIST}" />${statusHTML(w)}</div>
      </div>
      <aside class="piece-info">
        <span class="mono piece-idx">${pad2(i + 1)} / ${pad2(WORKS.length)}</span>
        <h1 class="piece-title" data-split="wipe">${w.title}${w.subtitle ? ` <em>${w.subtitle}</em>` : ""}</h1>
        <div class="tags" style="justify-content:flex-start;margin-top:22px">${tagHTML(w)}</div>
        <p class="piece-desc" data-split="wipe">${w.desc}</p>
        ${priceBlock}
        <dl class="specs">${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
        <div class="piece-btns">
          <a href="${enquireLink(ask)}" target="_blank" rel="noopener" class="btn"><span class="bnd-hov">${sold ? "Ask about similar work" : `Enquire on ${channelName}`}</span><i>↗</i></a>
          <a href="contact.html?w=${w.slug}" class="btn btn-ghost"><span class="bnd-hov">Send an enquiry</span><i>↗</i></a>
        </div>
        <div class="pager mono">
          <a href="${pieceUrl(prev)}" class="bnd-hov">← ${prev.title}</a>
          <a href="${pieceUrl(next)}" class="bnd-hov">${next.title} →</a>
        </div>
      </aside>
    </section>

    <a class="next" href="${pieceUrl(next)}" aria-label="Next work: ${next.title}">
      <div class="next-bg" style="background-image:url(${GHOR.thumb(next)})" data-parallax="0.08"></div>
      <img src="${imgSrc(next)}" alt="" loading="lazy" />
      <div class="next-in">
        <div><p class="mono" style="margin-bottom:14px">Next work</p><div class="next-t">${next.title}</div></div>
        <span class="mono">${pad2(WORKS.indexOf(next) + 1)} / ${pad2(WORKS.length)} ↗</span>
      </div>
    </a>

    <section class="related">
      <div class="sec-head"><h2 class="h2" data-split="wipe">More from <em>Becoming</em></h2><a href="work.html" class="mono bnd-hov">All work ↗</a></div>
      <div class="grid3">${related.map((o) => card(o)).join("")}</div>
    </section>`;
})();
