# The Ghor Brand

Portfolio and collection site for **The Ghor Brand** (Ogor Opene): contemporary African art exploring identity, growth and the human experience.

A static site with plain HTML, CSS and JavaScript and no build step. Deploy the repository root as-is (for example on Vercel with the "Other" framework preset).

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Landing: a drifting, draggable strip of paintings, studio films and studio photos over the GHOR wordmark, then selected work, the London press feature, notes on the paintings, studio films, collecting steps and the full collection |
| `work.html` | The *Becoming* collection with filters (available, sold, drop 02 / 03), grid or list view, and a currency switch |
| `piece.html?w=<slug>` | A single painting: price in NGN/USD/GBP/EUR/CAD, specs, enquiry buttons, next work |
| `about.html` | The artist, themes, exhibition film, press clippings |
| `contact.html` | Contact channels and an enquiry form that writes the message for you |

## Editing content

Everything lives in `assets/js/data.js`:

- `WORKS`: title, size, medium, drop (`vol`), `status` (`available` / `sold` / `enquire`), prices and the short statement for each painting. Images are `assets/works/<slug>.jpg`, with a small copy in `assets/works/thumbs/` and a frame-trimmed, sharpened copy for the home strip in `assets/works/tiles/`.
- `CONTACT`: **add a WhatsApp number and/or an email here.** Enquiry buttons and the contact form use WhatsApp first, then email, and fall back to TikTok DMs while neither is set. An Instagram link appears once `instagram` is filled in.

## Assets

- `assets/brand/ghor-logo.svg`: the Ghor mark, traced from the brand artwork; used as a CSS mask so it takes any colour
- `assets/media/`: studio films cut from the TikTok clips with the captions, watermarks and end cards removed (`film-*.mp4`, 4:5, used in the home strip and on the About page), studio photos, press clippings
- `assets/vendor/lenis.min.js`: smooth scrolling

## Typography

The type follows the auge-xp.com reference, using free Google Fonts stand-ins for its licensed faces:

| Role | Reference face | Used here |
| --- | --- | --- |
| Display (wordmark, titles) | Greed Bold | Instrument Sans Bold, 85% width |
| Text, labels, menu | PP Neue Montreal | Instrument Sans |
| Italic accents, quotes | Farnham Display Light Italic | Fraunces Light Italic |

The CSS font stacks already list the licensed names first (`--display`, `--sans` and `--serif` in `styles.css`). To use them, buy the web licences, put the `.woff2` files in `assets/fonts/` and add `@font-face` rules named `Greed`, `PP Neue Montreal` and `Farnham Display` at the top of `styles.css`.
