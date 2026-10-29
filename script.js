document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Navbar: scrolled state + mobile menu */
  const navbar = $(".navbar"), menuBtn = $("#menuBtn"), navMenu = $("#navMenu");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    navMenu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "✕" : "☰";
  };
  menuBtn.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
  $$("a", navMenu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* Highlight the nav link of the section in view */
  const links = $$("a", navMenu);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  /* Cube tilts toward the pointer */
  const cubeArea = $(".cube-area");
  const hero = $(".hero");
  if (cubeArea && matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cubeArea.style.setProperty("--ry", x * 24 + "deg");
      cubeArea.style.setProperty("--rx", y * -18 + "deg");
    });
    hero.addEventListener("pointerleave", () => {
      cubeArea.style.setProperty("--ry", "0deg");
      cubeArea.style.setProperty("--rx", "0deg");
    });
  }

  /* Card glow follows the pointer + staggered reveal */
  $$(".work-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  $$(".card-grid").forEach((grid) =>
    $$(".work-card", grid).forEach((c, i) => {
      c.classList.add("reveal");
      c.style.setProperty("--d", (i % 4) * 0.08 + "s");
      reveal.observe(c);
    })
  );

  /* Preview modal */
  const modal = $("#previewModal"), title = $("#modalTitle"), content = $("#modalContent");
  let lastFocus = null;

  const openModal = (heading, node) => {
    lastFocus = document.activeElement;
    title.textContent = heading;
    content.replaceChildren(node);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#modalClose").focus();
  };
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    content.replaceChildren();
    if (lastFocus) lastFocus.focus();
  };

  $$(".view-btn[data-image]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const img = new Image();
      img.alt = btn.dataset.title;
      img.src = btn.dataset.image;
      img.onerror = () => {
        const p = document.createElement("p");
        p.className = "modal-message";
        p.textContent = `Hindi mahanap ang file na "${btn.dataset.image}". Siguraduhing nasa parehong folder ito ng index.html.`;
        content.replaceChildren(p);
      };
      openModal(btn.dataset.title, img);
    })
  );
  $$(".view-btn[data-message]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const p = document.createElement("p");
      p.className = "modal-message";
      p.textContent = btn.dataset.message;
      openModal(btn.closest(".work-card").querySelector("h3").textContent, p);
    })
  );

  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
});

/* Space background: twinkling stars + shooting stars */
(() => {
  const c = document.createElement("canvas");
  c.id = "space";
  document.body.prepend(c);
  const ctx = c.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, stars = [], shoots = [];

  const resize = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    c.width = w * d; c.height = h * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    stars = Array.from({ length: Math.round((w * h) / 5500) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2, p: Math.random() * 6.28,
      s: Math.random() * 0.02 + 0.005, z: Math.random() * 0.5 + 0.1,
      hue: Math.random() < 0.2 ? 200 : Math.random() < 0.3 ? 280 : 0,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const sy = scrollY;
    for (const s of stars) {
      s.p += s.s;
      const a = 0.45 + Math.sin(s.p) * 0.4;
      const y = (((s.y - sy * s.z) % h) + h) % h;
      ctx.fillStyle = s.hue ? `hsla(${s.hue},90%,80%,${a})` : `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, 6.28); ctx.fill();
    }
    if (!still && Math.random() < 0.006 && shoots.length < 2) {
      shoots.push({ x: Math.random() * w, y: Math.random() * h * 0.5, l: 0, v: 9 + Math.random() * 6 });
    }
    shoots = shoots.filter((m) => m.l < 160);
    for (const m of shoots) {
      m.x += m.v; m.y += m.v * 0.5; m.l += m.v;
      const g = ctx.createLinearGradient(m.x, m.y, m.x - 90, m.y - 45);
      g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - 90, m.y - 45); ctx.stroke();
    }
    if (!still) requestAnimationFrame(draw);
  };

  resize(); draw();
  addEventListener("resize", () => { resize(); if (still) draw(); });
})();