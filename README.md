# The Ghor Brand

Portfolio and collection site for **The Ghor Brand** (Ogor Opene): contemporary African art exploring identity, growth and the human experience.

A static site with plain HTML, CSS and JavaScript and no build step. Deploy the repository root as-is (for example on Vercel with the "Other" framework preset).

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Landing: studio-film hero, a painting reel that grows to full screen, selected work, the London press feature, studio films, notes on the paintings, collecting steps, collection marquee |
| `work.html` | The *Becoming* collection with filters (available, sold, drop 02 / 03), grid or list view, and a currency switch |
| `piece.html?w=<slug>` | A single painting: price in NGN/USD/GBP/EUR/CAD, specs, enquiry buttons, next work |
| `about.html` | The artist, themes, exhibition film, press clippings |
| `contact.html` | Contact channels and an enquiry form that writes the message for you |

## Editing content

Everything lives in `assets/js/data.js`:

- `WORKS`: title, size, medium, drop (`vol`), `status` (`available` / `sold` / `enquire`), prices and the short statement for each painting. Images are `assets/works/<slug>.jpg`, plus a small copy in `assets/works/thumbs/`.
- `CONTACT`: **add a WhatsApp number and/or an email here.** Enquiry buttons and the contact form use WhatsApp first, then email, and fall back to TikTok DMs while neither is set. An Instagram link appears once `instagram` is filled in.

## Assets

- `assets/brand/ghor-logo.svg`: the Ghor mark, traced from the brand artwork; used as a CSS mask so it takes any colour
- `assets/media/`: studio films cut from the TikTok clips with the captions, watermarks and end cards removed (`hero.mp4` is the 16:9 desktop hero, `hero-mobile.mp4` the portrait phone hero, `film-*.mp4` the 4:5 studio films), studio photos, press clippings
- `assets/vendor/lenis.min.js`: smooth scrolling
