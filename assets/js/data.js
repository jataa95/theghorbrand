/* The Ghor Brand: artwork data, transcribed from the "Becoming" collection cards.
   status: "available" | "sold" | "enquire"
   vol: which drop of the Becoming collection the piece was released in.
   price: as listed on the collection cards (NGN, USD, EUR, GBP, CAD). */
window.WORKS = [
  { slug: "right-on-time", title: "Right On Time", size: "121.92 × 152.4 cm", medium: "Acrylic on canvas", vol: "02", status: "available",
    price: { NGN: 1100000, USD: 810, EUR: 700, GBP: 610, CAD: 1115 },
    desc: "Not late, not early. Just right on time." },
  { slug: "emergence", title: "Emergence", subtitle: "(Becoming)", size: "121.92 × 213.36 cm", medium: "Acrylic & impasto", status: "enquire", feature: true,
    desc: "Identity is not fixed. The self is a process that continues, revises, contradicts, and persists." },
  { slug: "when-the-world-went-quiet", title: "When the World Went Quiet", size: "91.44 × 121.92 cm", medium: "Acrylic, nylon & impasto on canvas", vol: "03", status: "available",
    price: { NGN: 750000, USD: 550, EUR: 480, GBP: 415, CAD: 760 },
    desc: "A dying poppy, but not without resilience. Maybe it’s fading. Maybe it’s becoming." },
  { slug: "the-in-between", title: "The In-Between", size: "91.44 × 121.92 cm", medium: "Acrylic, nylon & impasto on canvas", vol: "03", status: "available",
    price: { NGN: 750000, USD: 550, EUR: 480, GBP: 415, CAD: 760 },
    desc: "Sometimes, becoming means learning to exist in the spaces where the old no longer fits, and the new has yet to take shape." },
  { slug: "still-water", title: "Still Water", size: "60.96 × 91.44 cm", medium: "Acrylic & impasto on canvas", vol: "03", status: "available",
    price: { NGN: 450000, USD: 330, EUR: 285, GBP: 250, CAD: 460 },
    desc: "This work marks the moment when the noise of becoming quietens enough to hear yourself think, to feel yourself breathe, to exist without urgency or performance." },
  { slug: "a-life-unwritten", title: "A Life Unwritten", size: "60.96 × 91.44 cm", medium: "Acrylic & impasto on canvas", vol: "02", status: "available",
    price: { NGN: 450000, USD: 330, EUR: 285, GBP: 250, CAD: 460 },
    desc: "This piece explores the possibilities that emerge when identity is no longer treated as predetermined. It asks: who might I still become?" },
  { slug: "the-courage-to-speak", title: "The Courage to Speak", size: "60.96 × 91.44 cm", medium: "Acrylic & impasto on canvas", vol: "02", status: "sold",
    price: { NGN: 450000, USD: 330, EUR: 285, GBP: 250, CAD: 460 },
    desc: "When you finally decide that whatever comes after speaking is worth the risk." },
  { slug: "inheritance-of-silence", title: "Inheritance of Silence", size: "60.96 × 91.44 cm", medium: "Acrylic & impasto on canvas", vol: "02", status: "sold",
    price: { NGN: 450000, USD: 330, EUR: 285, GBP: 250, CAD: 460 },
    desc: "The weight of expectations we inherit, and the silence we learn to carry." },
  { slug: "unspoken-dreams", title: "Unspoken Dreams", size: "60.96 × 91.44 cm", medium: "Acrylic & impasto on canvas", vol: "02", status: "sold",
    price: { NGN: 450000, USD: 330, EUR: 285, GBP: 250, CAD: 460 },
    desc: "This work reflects on the ambitions, identities, and possibilities that remain unexpressed because of fear, expectation, or circumstance." },
];

/* Filters on the Work page */
window.FILTERS = [
  { id: "all", name: "All" },
  { id: "available", name: "Available", test: (w) => w.status === "available" },
  { id: "sold", name: "Sold", test: (w) => w.status === "sold" },
  { id: "vol-02", name: "Becoming · 02", test: (w) => w.vol === "02" },
  { id: "vol-03", name: "Becoming · 03", test: (w) => w.vol === "03" },
];

window.CURRENCIES = [
  { id: "NGN", sym: "₦" }, { id: "USD", sym: "$" }, { id: "GBP", sym: "£" }, { id: "EUR", sym: "€" }, { id: "CAD", sym: "CAD " },
];

/* Contact details.
   TODO(owner): add a WhatsApp number (digits only, with country code, e.g. "2348012345678")
   and/or an email address. Until one is set, enquiries go to TikTok. */
window.CONTACT = {
  whatsapp: "",          // e.g. "2348012345678"
  phone: "",             // display version, e.g. "+234 801 234 5678"
  email: "",             // e.g. "hello@theghorbrand.com"
  tiktok: "https://www.tiktok.com/@theghorbrand",
  youtube: "https://www.youtube.com/@theghorbrand",
  instagram: "",         // TODO(owner): e.g. "https://www.instagram.com/theghorbrand/"
  handle: "@theghorbrand",
};
