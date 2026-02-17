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
     FAQ toggle (smooth + safe)
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
        setTimeout(() => {
          answer.style.display = "none";
        }, 350);
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
     NEW ARRIVALS drag + momentum + auto-slide (UPGRADED)
  ========================= */
  const slider = document.querySelector(".arrival-scroll");
  if (slider) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let momentumID = null;
    let pauseAutoScroll = false;
    let autoDir = 1;

    function updateSlider(x) {
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    }

    function startMomentum(v) {
      function momentum() {
        slider.scrollLeft -= v;
        v *= 0.92;
        if (Math.abs(v) > 0.5) momentumID = requestAnimationFrame(momentum);
      }
      momentumID = requestAnimationFrame(momentum);
    }

    function cancelMomentum() {
      if (momentumID) cancelAnimationFrame(momentumID);
      momentumID = null;
    }

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      pauseAutoScroll = true;
      setTimeout(() => (pauseAutoScroll = false), 1200);
      startMomentum(velocity);
    }

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      pauseAutoScroll = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      lastX = e.pageX;
      cancelMomentum();
      slider.classList.add("is-dragging");
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      updateSlider(e.pageX);
      velocity = e.pageX - lastX;
      lastX = e.pageX;
    });

    slider.addEventListener("mouseup", () => {
      slider.classList.remove("is-dragging");
      endDrag();
    });

    slider.addEventListener("mouseleave", () => {
      slider.classList.remove("is-dragging");
      endDrag();
    });

    slider.addEventListener(
      "touchstart",
      (e) => {
        isDown = true;
        pauseAutoScroll = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        lastX = e.touches[0].pageX;
        cancelMomentum();
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchmove",
      (e) => {
        if (!isDown) return;
        updateSlider(e.touches[0].pageX);
        velocity = e.touches[0].pageX - lastX;
        lastX = e.touches[0].pageX;
      },
      { passive: true }
    );

    slider.addEventListener("touchend", endDrag);

    function animateSlide() {
      if (!pauseAutoScroll && !isDown) {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        slider.scrollLeft += 0.35 * autoDir;
        if (slider.scrollLeft >= maxScroll - 1) autoDir = -1;
        if (slider.scrollLeft <= 0) autoDir = 1;
      }
      requestAnimationFrame(animateSlide);
    }
    requestAnimationFrame(animateSlide);
  }

  /* =========================
     HAMBURGER MENU (safe)
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
     CONTACT FORM -> WHATSAPP
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
     PROMO STRIP (1 LINE + MOVING ON PHONE)
     Requires HTML:
       id="promoWrap"
       id="promoTitle" id="promoSub" id="promoCode"
       id="copyPromoBtn" id="closePromoBtn"
       + promo ticker wrapper:
         id="promoTicker" and id="promoTrack"
  ========================= */
  const PROMO = {
    enabled: true,
    title: "Delivery Discount (min. purchase of $50)",
    code: "deli3",
    subtitle: "Use code {CODE} • $3 OFF",
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

      titleEl && (titleEl.textContent = PROMO.title);
      codeEl && (codeEl.textContent = PROMO.code);
      subEl &&
        (subEl.innerHTML = PROMO.subtitle.replace(
          "{CODE}",
          `<b>${PROMO.code}</b>`
        ));

      wrap.style.display = "block";
      requestAnimationFrame(setupTicker);
    }

    function setupTicker() {
      const isPhone = window.matchMedia("(max-width: 520px)").matches;

      // remove old clone if any
      const next = track.nextElementSibling;
      if (next && next.dataset && next.dataset.clone === "1") next.remove();

      // stop moving on desktop
      if (!isPhone) {
        ticker.classList.remove("is-moving");
        return;
      }

      // if it fits, don't move
      if (track.scrollWidth <= ticker.clientWidth) {
        ticker.classList.remove("is-moving");
        return;
      }

      // clone for seamless loop
      const clone = track.cloneNode(true);
      clone.dataset.clone = "1";
      track.parentNode.appendChild(clone);

      // speed by length (premium slower)
      const px = track.scrollWidth;
      const dur = Math.min(22, Math.max(12, px / 45)); // tweak here
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
        setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
      }
    }

    copyBtn && copyBtn.addEventListener("click", copyCode);
    closeBtn &&
      closeBtn.addEventListener("click", () => {
        localStorage.setItem(PROMO.storageKey, "1");
        wrap.style.display = "none";
      });

    window.addEventListener("resize", () => {
      if (wrap.style.display !== "none") setupTicker();
    });

    showPromo();
  }
}); // ✅ ADDED: closes the main DOMContentLoaded
