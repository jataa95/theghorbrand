/* The Ghor Brand: about page */
(() => {
  const { $, $$, clamp, onFrame } = GHOR;
  // Exhibition film: frame opens from an inset as it scrolls into view
  const frame = $("#studio-frame");
  onFrame(() => {
    const r = frame.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh - r.top) / (vh * 0.9));
    frame.style.setProperty("--ci", `${(1 - p) * 8}%`);
    frame.style.setProperty("--cs", (1.12 - 0.12 * p).toFixed(3));
  });
  $$(".role, .stat, .press-card").forEach((r) => r.classList.add("fade"));
})();
