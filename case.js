/* Case study pages: placeholders for missing images, full-size viewer, background motes.
   Shared by wayward-games.html, protech.html and fempreneur.html. */

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------
   1. Show a placeholder box for any image file that is missing
   --------------------------------------------------------------- */
const shots = [...document.querySelectorAll(".shot")];
shots.forEach(shot => {
  const img = shot.querySelector("img");
  const markMissing = () => shot.classList.add("missing");
  if (img.complete && img.naturalWidth === 0) markMissing();
  img.addEventListener("error", markMissing);
});

/* ---------------------------------------------------------------
   2. Full-size viewer (click a thumbnail to open)
   Click the big image or press Zoom to see it at actual size.
   Arrow keys move between images. Esc closes.
   --------------------------------------------------------------- */
if (shots.length) {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-labelledby", "lb-title");
  box.innerHTML = `
    <div class="win lb-win">
      <div class="win-title">
        <span id="lb-title"></span>
        <span class="lb-tools">
          <span id="lb-count"></span>
          <button class="btn" type="button" id="lb-zoom">Zoom</button>
          <button class="btn" type="button" id="lb-close">Close</button>
        </span>
      </div>
      <div class="lb-frame">
        <button class="btn lb-nav lb-prev" type="button" aria-label="Previous image">&lsaquo;</button>
        <div class="lb-stage" id="lb-stage">
          <img id="lb-img" alt="">
          <p class="lb-msg" id="lb-msg"></p>
        </div>
        <button class="btn lb-nav lb-next" type="button" aria-label="Next image">&rsaquo;</button>
      </div>
      <div class="lb-foot">Click the image to zoom. Use the left and right arrow keys to move between images. Press Esc to close.</div>
    </div>`;
  document.body.appendChild(box);

  const stage = box.querySelector("#lb-stage");
  const bigImg = box.querySelector("#lb-img");
  const msg = box.querySelector("#lb-msg");
  const title = box.querySelector("#lb-title");
  const count = box.querySelector("#lb-count");
  const zoomBtn = box.querySelector("#lb-zoom");
  const closeBtn = box.querySelector("#lb-close");
  const prevBtn = box.querySelector(".lb-prev");
  const nextBtn = box.querySelector(".lb-next");

  let current = 0;
  let opener = null;

  function show(i) {
    current = (i + shots.length) % shots.length;
    const shot = shots[current];
    const src = shot.dataset.full || shot.querySelector("img").getAttribute("src");
    const label = shot.querySelector(".shot-label").textContent.trim();
    stage.classList.remove("zoomed", "missing");
    zoomBtn.textContent = "Zoom";
    stage.scrollTo(0, 0);
    bigImg.alt = label;
    bigImg.onerror = () => {
      msg.textContent = "Image not found: " + src;
      stage.classList.add("missing");
    };
    bigImg.src = src;
    title.textContent = label;
    count.textContent = (current + 1) + " of " + shots.length;
  }

  function open(i, from) {
    opener = from;
    show(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = "";
    if (opener) opener.focus();
  }
  function toggleZoom() {
    const zoomed = stage.classList.toggle("zoomed");
    zoomBtn.textContent = zoomed ? "Fit to screen" : "Zoom";
  }

  shots.forEach((shot, i) => shot.addEventListener("click", () => open(i, shot)));
  closeBtn.addEventListener("click", close);
  zoomBtn.addEventListener("click", toggleZoom);
  bigImg.addEventListener("click", toggleZoom);
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));
  box.addEventListener("click", e => { if (e.target === box) close(); });   // click the dark area to close

  if (shots.length < 2) { prevBtn.hidden = true; nextBtn.hidden = true; }

  document.addEventListener("keydown", e => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") {   // keep keyboard focus inside the viewer
      const items = [zoomBtn, closeBtn, prevBtn, nextBtn].filter(b => !b.hidden);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ---------------------------------------------------------------
   3. Slow floating purple motes in the background
   --------------------------------------------------------------- */
(function () {
  const c = document.getElementById("motes");
  if (!c) return;
  const ctx = c.getContext("2d");
  let w, h, dots = [];

  function size() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    dots = Array.from({ length: Math.min(50, Math.floor(w / 28)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4, s: Math.random() * 0.35 + 0.1, p: Math.random() * 6.28
    }));
  }
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.y -= d.s;
      if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, 6.283);
      ctx.fillStyle = `rgba(190,150,255,${0.25 + 0.35 * Math.sin(t / 900 + d.p)})`;
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  size();
  addEventListener("resize", size);
  requestAnimationFrame(draw);
})();
