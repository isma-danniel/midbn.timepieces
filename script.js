document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     HERO animation
  ========================= */
  const quote = document.querySelector(".hero-quote");
  const heroBtn = document.querySelector(".hero-btn");

  if (quote && heroBtn) {
    const lines = quote.innerHTML.split("<br>");
    quote.innerHTML = "";

    lines.forEach((lineText, i) => {
      const line = document.createElement("div");
      line.textContent = lineText.trim();
      line.style.opacity = "0";
      line.style.transform = "translateY(20px)";
      line.style.transition = "all 0.8s ease";
      quote.appendChild(line);

      setTimeout(() => {
        line.style.opacity = "1";
        line.style.transform = "translateY(0)";
      }, 400 * (i + 1));
    });

    setTimeout(() => {
      heroBtn.style.opacity = "1";
      heroBtn.style.transform = "translateY(0)";
    }, 400 * (lines.length + 1));
  }


  /* =========================
     FAQ toggle
  ========================= */
  document.querySelectorAll(".faq-question").forEach((btn) => {
    const answer = btn.nextElementSibling;
    if (!answer || !answer.classList.contains("faq-answer")) return;

    btn.setAttribute("aria-expanded", "false");
    answer.style.display = "none";
    answer.style.maxHeight = "0px";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height 0.35s ease";

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        btn.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = "0px";
        setTimeout(() => answer.style.display = "none", 350);
        return;
      }

      btn.setAttribute("aria-expanded", "true");
      answer.style.display = "block";
      answer.style.maxHeight = "0px";

      requestAnimationFrame(() => {
        answer.style.maxHeight = answer.scrollHeight + "px";
      });
    });
  });


  /* =========================
     NEW ARRIVALS (Luxury Smooth)
  ========================= */
  const slider = document.querySelector(".arrival-scroll");

  if (slider) {

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    let velocity = 0;
    let lastX = 0;
    let momentumID = null;

    let pauseUntil = 0;
    let autoDir = 1;

    const AUTO_SPEED = 0.28;
    const DRAG_SPEED = 1.8;
    const FRICTION = 0.92;
    const STOP_V = 0.35;
    const PAUSE_MS = 1600;

    function maxScroll() {
      return Math.max(0, slider.scrollWidth - slider.clientWidth);
    }

    function clampScroll() {
      const m = maxScroll();
      if (slider.scrollLeft < 0) slider.scrollLeft = 0;
      if (slider.scrollLeft > m) slider.scrollLeft = m;
    }

    function cancelMomentum() {
      if (momentumID) cancelAnimationFrame(momentumID);
      momentumID = null;
    }

    function startMomentum(v) {
      cancelMomentum();

      function momentum() {
        slider.scrollLeft -= v;
        clampScroll();

        const atStart = slider.scrollLeft <= 0;
        const atEnd = slider.scrollLeft >= maxScroll() - 1;
        if (atStart || atEnd) v = 0;

        v *= FRICTION;

        if (Math.abs(v) > STOP_V) {
          momentumID = requestAnimationFrame(momentum);
        } else {
          momentumID = null;
        }
      }

      momentumID = requestAnimationFrame(momentum);
    }

    function pauseAuto(ms = PAUSE_MS) {
      pauseUntil = Date.now() + ms;
    }

    function onDown(pageX) {
      isDown = true;
      pauseAuto();
      startX = pageX - slider.offsetLeft;
      startScrollLeft = slider.scrollLeft;
      lastX = pageX;
      velocity = 0;
      cancelMomentum();
      slider.classList.add("is-dragging");
    }

    function onMove(pageX) {
      if (!isDown) return;
      const x = pageX - slider.offsetLeft;
      const walk = (x - startX) * DRAG_SPEED;
      slider.scrollLeft = startScrollLeft - walk;

      velocity = pageX - lastX;
      lastX = pageX;
    }

    function onUp() {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove("is-dragging");
      pauseAuto();
      startMomentum(velocity);
    }

    slider.addEventListener("mousedown", (e) => onDown(e.pageX));
    slider.addEventListener("mousemove", (e) => onMove(e.pageX));
    slider.addEventListener("mouseup", onUp);
    slider.addEventListener("mouseleave", onUp);

    slider.addEventListener("touchstart", (e) => onDown(e.touches[0].pageX), { passive: true });
    slider.addEventListener("touchmove", (e) => onMove(e.touches[0].pageX), { passive: true });
    slider.addEventListener("touchend", onUp);

    slider.addEventListener("mouseenter", () => pauseAuto(999999));
    slider.addEventListener("mouseleave", () => pauseAuto(PAUSE_MS));

    function animate() {
      const now = Date.now();
      const m = maxScroll();

      if (!isDown && !momentumID && now > pauseUntil && m > 0) {
        slider.scrollLeft += AUTO_SPEED * autoDir;

        if (slider.scrollLeft >= m - 1) autoDir = -1;
        if (slider.scrollLeft <= 0) autoDir = 1;
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }


  /* =========================
     HAMBURGER MENU
  ========================= */
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".header nav ul");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }


  /* =========================
     CONTACT FORM → WHATSAPP
  ========================= */
  const form = document.getElementById("waForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("waName")?.value.trim() || "";
      const email = document.getElementById("waEmail")?.value.trim() || "";
      const msg = document.getElementById("waMsg")?.value.trim() || "";

      const phone = "6738908960";
      const text =
        `Hi MIDBN.Timepieces, I want to enquire.\n\n` +
        `Name: ${name}\n` +
        (email ? `Email: ${email}\n` : "") +
        `Message: ${msg}`;

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  }


  /* =========================
     PROMO STRIP (HK42)
  ========================= */
  const PROMO = {
    enabled: true,
    title: "Delivery Discount for purchase $50 & above",
    code: "SHR",
    subtitle: "Use code {CODE} • $3 OFF delivery • Website orders only",
    storageKey: "midbn_promo_closed_v2"
  };

  const wrap = document.getElementById("promoWrap");
  const ticker = document.getElementById("promoTicker");
  const track = document.getElementById("promoTrack");

  if (wrap && ticker && track) {

    const titleEl = document.getElementById("promoTitle");
    const subEl = document.getElementById("promoSub");
    const codeEl = document.getElementById("promoCode");
    const copyBtn = document.getElementById("copyPromoBtn");
    const closeBtn = document.getElementById("closePromoBtn");

    function showPromo() {
      if (!PROMO.enabled) return;
      if (localStorage.getItem(PROMO.storageKey) === "1") return;

      if (titleEl) titleEl.textContent = PROMO.title;
      if (codeEl)  codeEl.textContent  = PROMO.code;

      // Keep HTML clean: don't inject another #promoCode id inside promoSub
      if (subEl) subEl.innerHTML = PROMO.subtitle.replace("{CODE}", `<b>${PROMO.code}</b>`);

      wrap.style.display = "block";
      requestAnimationFrame(setupTicker);
    }

    function setupTicker() {
      const isPhone = window.matchMedia("(max-width: 520px)").matches;

      const next = track.nextElementSibling;
      if (next && next.dataset.clone === "1") next.remove();

      if (!isPhone) {
        ticker.classList.remove("is-moving");
        return;
      }

      if (track.scrollWidth <= ticker.clientWidth) {
        ticker.classList.remove("is-moving");
        return;
      }

      const clone = track.cloneNode(true);
      clone.dataset.clone = "1";
      track.parentNode.appendChild(clone);

      const px = track.scrollWidth;
      const dur = Math.min(22, Math.max(12, px / 45));
      ticker.style.setProperty("--promoDur", dur + "s");

      ticker.classList.add("is-moving");
    }

    async function copyCode() {
      try {
        await navigator.clipboard.writeText(PROMO.code);
      } catch {
        const t = document.createElement("textarea");
        t.value = PROMO.code;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t);
      }

      if (copyBtn) {
        copyBtn.textContent = "Copied ✅";
        setTimeout(() => copyBtn.textContent = "Copy", 1200);
      }
    }

    copyBtn?.addEventListener("click", copyCode);
    closeBtn?.addEventListener("click", () => {
      localStorage.setItem(PROMO.storageKey, "1");
      wrap.style.display = "none";
    });

    window.addEventListener("resize", () => {
      if (wrap.style.display !== "none") setupTicker();
    });

    showPromo();
  }

});
