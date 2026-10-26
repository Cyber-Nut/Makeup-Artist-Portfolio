// ---- Edit these two values ----
const WHATSAPP_NUMBER = "917037248289"; // country code + number, no "+" or spaces
const SOURCE_TAG = "your website";

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Floating WhatsApp button
const dockWa = document.getElementById("dock-wa");
if (dockWa) {
  dockWa.href = waLink(`Hi Shivangi! I found you on ${SOURCE_TAG} 💄 I'd like to check if my date is available.`);
}

// Service "Ask about…" links pre-select that function in the form
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.addEventListener("click", () => {
    const want = el.dataset.wa;
    document.querySelectorAll('#book-form input[name="events"]').forEach((cb) => {
      cb.checked = cb.value === want;
    });
  });
});

// Before / after slider
const ba = document.getElementById("ba");
const range = document.getElementById("ba-range");
if (ba && range) {
  const set = () => ba.style.setProperty("--pos", range.value + "%");
  range.addEventListener("input", set);
  set();
}

// Lookbook filter
const chips = document.querySelectorAll(".chip");
const looks = document.querySelectorAll(".look");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("is-on", c === chip));
    const f = chip.dataset.f;
    looks.forEach((l) => { l.hidden = f !== "all" && l.dataset.cat !== f; });
  });
});

// Hide filter chips that have no photos yet
chips.forEach((chip) => {
  const f = chip.dataset.f;
  if (f !== "all" && ![...looks].some((l) => l.dataset.cat === f)) chip.hidden = true;
});

// Reel: sound toggle, and pause when the visitor prefers less motion
const reelVid = document.querySelector(".reel video");
const soundBtn = document.querySelector(".reel-sound");
if (reelVid) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { reelVid.removeAttribute("autoplay"); reelVid.pause(); reelVid.controls = true; }
  soundBtn?.addEventListener("click", () => {
    reelVid.muted = !reelVid.muted;
    if (!reelVid.muted) reelVid.play();
    soundBtn.textContent = reelVid.muted ? "Sound on" : "Sound off";
    soundBtn.setAttribute("aria-pressed", String(!reelVid.muted));
  });
}

// Booking form -> WhatsApp with everything pre-typed
const form = document.getElementById("book-form");
if (form) {
  const err = document.getElementById("form-error");
  const sent = document.getElementById("sent");
  const sentLink = document.getElementById("sent-link");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const date = form.date.value;
    const place = form.place.value;
    const events = [...form.querySelectorAll('input[name="events"]:checked')].map((c) => c.value);

    if (!name || !date) {
      err.textContent = !name ? "Add your name so she knows who's messaging." : "Pick your event date to check availability.";
      err.hidden = false;
      (!name ? form.name : form.date).focus();
      return;
    }
    err.hidden = true;

    const pretty = new Date(date + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const text =
      `Hi Shivangi! I'm ${name} and I found you on ${SOURCE_TAG} 💄\n\n` +
      `📅 Date: ${pretty}\n📍 Venue: ${place}\n✨ Functions: ${events.length ? events.join(", ") : "Not sure yet"}\n\n` +
      `Is my date available?`;

    const url = waLink(text);
    sentLink.href = url;
    sent.hidden = false;

    if (typeof gtag === "function") gtag("event", "generate_lead", { method: "whatsapp_form" });
    if (typeof fbq === "function") fbq("track", "Lead");

    const w = window.open(url, "_blank", "noopener");
    if (!w) sentLink.focus();
  });
}
