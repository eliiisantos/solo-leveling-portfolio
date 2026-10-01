const SKILLS = [
  { group: "Frontend",  items: [["HTML", 90], ["CSS", 86], ["JavaScript", 82],, ["React", 48]] },
  { group: "Backend/Systems", items: [["Python", 60], ["Java", 60], ["C", 30], ["C#", 40]] },
  { group: "Databases", items: [["MSSQL", 46], ["Oracle DB", 34], ["MongoDB", 40], ["MySQL", 30]] }
];

const QUESTS = [
  {
    name: "HanaPark",
    rank: "S",
    role: "Frontend developer, Documentation, Project Lead",  
    desc: "A smart web app for checking parking availability and reserving slots at STI College Global City.",
    tags: ["HTML", "CSS", "JavaScript", "React"],
    link: { url: "https://hanapark.online", label: "Open live site" }
  },
     {
    name: "Professional Portfolio",
    rank: "A",
    role: "Developer",
    desc: "A Personal project that showcases my experiences and work in web development.",
    tags: ["HTML", "CSS", "JavaScript", "React", "Figma"],
    link: { url: "https://elijah-santos.vercel.app/", label: "View case study" }
  },
  {
    name: "Wayward Games Network",
    rank: "B",
    role: "Network Infrastructure Architect",
    desc: "Planned, designed and configured the network infrastructure for a 5-story building, then tested it in a network simulation.",
    tags: ["AutoCAD", "Canva", "Figma", "Cisco Packet Tracer"],
    link: { url: "wayward-games.html", label: "View case study" }
  },
  {
    name: "ProTech",
    rank: "C",
    role: "UI/UX designer and coder",
    desc: "A hand-coded design concept for a mobile app that helps people protect their digital privacy and security.",
    tags: ["HTML", "CSS", "Figma", "Canva"],
    link: { url: "protech.html", label: "View case study" }
  },
  {
    name: "Fempreneur",
    rank: "E",
    role: "Web designer",
    desc: "A commissioned website wireframe for my cousin's beaded jewelry and vintage clothing business. My first web design project.",
    tags: ["Canva"],
    link: { url: "fempreneur.html", label: "View case study" }
  }

];

/* ---------------------------------------------------------------
   2. Helpers
   --------------------------------------------------------------- */
const rankOf = lv => lv >= 95 ? "S" : lv >= 80 ? "A" : lv >= 60 ? "B" : lv >= 40 ? "C" : lv >= 20 ? "D" : "E";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------
   3. Build the skills stat sheet
   --------------------------------------------------------------- */
const skillGrid = document.getElementById("skill-grid");
skillGrid.innerHTML = SKILLS.map(g => `
  <section class="win skill-win">
    <h3 class="win-title"><span>${g.group}</span></h3>
    <ul class="skill-list">
      ${g.items.map(([name, lv]) => `
        <li class="skill" style="--lv:${lv}">
          <span class="rank r-${rankOf(lv)}" title="Rank ${rankOf(lv)}">${rankOf(lv)}</span>
          <div>
            <div class="skill-head"><span>${name}</span><span class="lv">Lv ${lv}</span></div>
            <div class="bar" role="img" aria-label="${name}: level ${lv} of 100"><i></i></div>
          </div>
        </li>`).join("")}
    </ul>
  </section>`).join("");

/* Player level = average of all skill levels */
const allLevels = SKILLS.flatMap(g => g.items.map(i => i[1]));
document.getElementById("player-level").textContent =
  Math.round(allLevels.reduce((a, b) => a + b, 0) / allLevels.length);

/* Fill the bars when they scroll into view */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); barObserver.unobserve(e.target); } });
}, { threshold: 0.3 });
document.querySelectorAll(".skill-win").forEach(el => barObserver.observe(el));

/* ---------------------------------------------------------------
   4. Build the quest cards
   --------------------------------------------------------------- */
const questGrid = document.getElementById("quest-grid");
questGrid.innerHTML = QUESTS.map(q => `
  <article class="win quest">
    <div class="glare"></div>
    <header class="win-title">
      <span>Quest cleared</span>
      <span class="rank r-${q.rank}" title="${q.rank}-rank quest">${q.rank}</span>
    </header>
    <div class="quest-body">
      <h3>${q.name}</h3>
      <p class="role">${q.role}</p>
      <p>${q.desc}</p>
      <ul class="tags" aria-label="Skills used">${q.tags.map(t => `<li>${t}</li>`).join("")}</ul>
    </div>
    <div class="quest-foot">
      ${q.link ? `<a href="${q.link.url}"${/^https?:/.test(q.link.url) ? ' target="_blank" rel="noopener"' : ''}>${q.link.label}</a>` : (q.note || "")}
    </div>
  </article>`).join("");

/* Spotlight that follows the cursor over each card */
questGrid.querySelectorAll(".quest").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
});

/* ---------------------------------------------------------------
   5. Nav highlight for the section you're viewing
   --------------------------------------------------------------- */
const navLinks = [...document.querySelectorAll(".topbar nav a")];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.removeAttribute("aria-current"));
    const active = navLinks.find(a => a.getAttribute("href") === "#" + e.target.id);
    if (active) active.setAttribute("aria-current", "true");
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => navObserver.observe(s));

/* ---------------------------------------------------------------
   6. Portrait: hover (or tap) reveals the shadow version
   --------------------------------------------------------------- */
const portrait = document.getElementById("jinwoo");
const hint = document.querySelector(".hint");

/* Show a placeholder box for any image file that is missing */
portrait.querySelectorAll(".layer").forEach(layer => {
  const img = layer.querySelector("img");
  const markMissing = () => layer.classList.add("missing");
  if (img.complete && img.naturalWidth === 0) markMissing();
  img.addEventListener("error", markMissing);
});

/* The lens follows the cursor */
portrait.addEventListener("pointermove", e => {
  const r = portrait.getBoundingClientRect();
  portrait.style.setProperty("--rx", (e.clientX - r.left) + "px");
  portrait.style.setProperty("--ry", (e.clientY - r.top) + "px");
  if (hint) hint.classList.add("used");
});

/* Touch screens have no hover: tap to reveal everything, tap again to hide */
portrait.addEventListener("pointerdown", e => {
  if (e.pointerType === "mouse") return;
  portrait.classList.toggle("full");
  if (hint) hint.classList.add("used");
});

/* ---------------------------------------------------------------
   7. System notification (shown once per browser session)
   --------------------------------------------------------------- */
(function () {
  const hero = document.querySelector(".hero");
  const gate = document.getElementById("gate");
  const box = document.getElementById("gate-win");
  const msg = document.getElementById("gate-msg");
  const accept = document.getElementById("gate-accept");
  const decline = document.getElementById("gate-decline");

  let seen = false;
  try { seen = sessionStorage.getItem("system-accepted") === "1"; } catch (e) {}
  if (seen) return;   // already accepted this session: show the page straight away

  hero.classList.add("pre");
  gate.hidden = false;
  accept.focus();

  function close() {
    try { sessionStorage.setItem("system-accepted", "1"); } catch (e) {}
    gate.hidden = true;
    document.removeEventListener("keydown", onKey);
    requestAnimationFrame(() => hero.classList.remove("pre"));
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    if (e.key === "Tab") {   // keep keyboard focus inside the notification
      const focusable = [accept, decline].filter(b => !b.disabled);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  document.addEventListener("keydown", onKey);

  accept.addEventListener("click", close);
  decline.addEventListener("click", () => {
    msg.textContent = "Declining is not available. Please accept to continue.";
    decline.disabled = true;
    box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake");
    accept.focus();
  });
})();

/* ---------------------------------------------------------------
   8. Slow floating purple motes in the background
   --------------------------------------------------------------- */
(function () {
  const c = document.getElementById("motes");
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
/* Copy button for the email */
(function () {
  var buttons = document.querySelectorAll(".copy-btn");
  if (!buttons.length) return;

  var status = document.createElement("span");
  status.className = "sr-only";
  status.setAttribute("aria-live", "polite");
  document.body.appendChild(status);

  function fallbackCopy(text) {
    var box = document.createElement("textarea");
    box.value = text;
    box.setAttribute("readonly", "");
    box.style.cssText = "position:fixed;opacity:0;";
    document.body.appendChild(box);
    box.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    box.remove();
    return ok;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.dataset.copy;

      function done(ok) {
        btn.textContent = ok ? "Copied" : "Copy failed";
        btn.classList.toggle("done", ok);
        btn.classList.toggle("fail", !ok);
        status.textContent = ok ? "Email address copied" : "Could not copy the email address";
        clearTimeout(btn._reset);
        btn._reset = setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("done", "fail");
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done(true); },
          function () { done(fallbackCopy(text)); }
        );
      } else {
        done(fallbackCopy(text));
      }
    });
  });
})();
/* Loading screen (first visit of the session, shown before the notification) */
(function () {
  var boot = document.getElementById("boot");
  var gate = document.getElementById("gate");
  if (!boot || !gate || gate.hidden) return; // returning visitors skip it

  var accept = document.getElementById("gate-accept");
  var fill = document.getElementById("boot-fill");
  var pct = document.getElementById("boot-pct");
  var line = document.getElementById("boot-line");
  var steps = [
    [0, "Initializing system"],
    [25, "Loading player data"],
    [50, "Preparing quests"],
    [75, "Awakening shadows"],
    [100, "System ready"]
  ];
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DURATION = reduce ? 10000 : 20000; // how long the bar takes, in milliseconds
  var start = performance.now();
  var loaded = document.readyState === "complete";
  var finished = false;

  boot.hidden = false;
  gate.setAttribute("inert", ""); // nothing behind the loading screen can be clicked
  window.addEventListener("load", function () { loaded = true; });

  function finish() {
    if (finished) return;
    finished = true;
    document.removeEventListener("keydown", onKey, true);
    boot.classList.add("out");
    gate.removeAttribute("inert");
    accept.focus();
    setTimeout(function () { boot.hidden = true; }, 700);
  }
  function onKey(e) {
    e.preventDefault();
    e.stopPropagation();
    finish();
  }
  boot.addEventListener("pointerdown", finish);
  document.addEventListener("keydown", onKey, true);

  function tick(now) {
    if (finished) return;
    var p = Math.min(((now - start) / DURATION) * 100, loaded ? 100 : 95);
    fill.style.width = p + "%";
    pct.textContent = Math.floor(p) + "%";
    for (var i = 0; i < steps.length; i++) {
      if (p >= steps[i][0]) line.textContent = steps[i][1];
    }
    if (p >= 100) setTimeout(finish, 250);
    else requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();