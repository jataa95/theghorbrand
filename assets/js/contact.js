/* The Ghor Brand: contact page. The enquiry form composes a message and
   sends it through the configured channel (WhatsApp, email, or TikTok). */
(() => {
  const { $, enquireLink, channel, channelName, socials, ext, bySlug } = GHOR;
  const WORKS = window.WORKS, C = window.CONTACT;

  // Contact methods
  const sub = {
    WhatsApp: `${C.phone || ""}<br />Fastest reply`, Email: C.email, TikTok: `${C.handle}<br />Process videos &amp; DMs`,
    Instagram: C.handle, YouTube: `${C.handle}<br />Studio films`,
  };
  $("#ct-methods").innerHTML = socials().map((s) => `<a class="ct-m" href="${s.href}"${ext(s.href)}><strong>${s.t} ↗</strong><span>${sub[s.t] || ""}</span></a>`).join("");

  const sel = $("#piece");
  sel.insertAdjacentHTML("beforeend", WORKS.map((w) => `<option value="${w.slug}">${w.title}${w.status === "sold" ? " (sold)" : ""}</option>`).join(""));
  const pre = bySlug(new URLSearchParams(location.search).get("w"));
  if (pre) { sel.value = pre.slug; $("#i1").checked = true; }
  sel.addEventListener("change", () => { if (sel.value) $("#i1").checked = true; });

  const note = {
    whatsapp: "Opens WhatsApp with your message ready to send.",
    email: "Opens your email app with your message ready to send.",
    tiktok: "Copies your message and opens TikTok so you can send it as a DM.",
  }[channel];
  $("#form-note").textContent = note;
  $("#form-btn").textContent = `Send via ${channelName}`;

  const form = $("#form");
  const check = (fld, ok) => { fld.classList.toggle("bad", !ok); return ok; };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#name").value.trim(), msg = $("#msg").value.trim();
    const ok = [check($("#f-name"), !!name), check($("#f-msg"), !!msg)].every(Boolean);
    if (!ok) return;
    const interest = form.querySelector('input[name="interest"]:checked').value;
    const piece = bySlug(sel.value), where = $("#where").value.trim();
    const text = [
      `Hi The Ghor Brand, I'm ${name}${where ? ` (${where})` : ""}.`,
      `I'm interested in: ${interest}${piece ? ` ("${piece.title}")` : ""}.`,
      "",
      msg,
    ].join("\n");
    let copied = false;
    if (channel === "tiktok") { try { await navigator.clipboard.writeText(text); copied = true; } catch (_) {} }
    window.open(enquireLink(text), "_blank", "noopener");
    $("#form-done-t").innerHTML = channel === "tiktok"
      ? `${copied ? "Your message is copied." : "Copy your message above."} Paste it into a DM to <a href="${C.tiktok}" target="_blank" rel="noopener" style="text-decoration:underline">${C.handle}</a> on TikTok.`
      : `Thanks! ${channelName} should have opened with your message. If it didn’t, reach out via ${channel === "email" ? `<a href="mailto:${C.email}" style="text-decoration:underline">${C.email}</a>` : `<a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener" style="text-decoration:underline">WhatsApp</a>`}.`;
    $("#form-done").classList.add("show");
  });
  ["name", "msg"].forEach((id) => $("#" + id).addEventListener("input", (e) => e.target.closest(".fld").classList.remove("bad")));
})();
