/* ===========================================================
     GOOGLE REVIEWS SLIDER (Testimonials Section)
  ========================================================== */
// Google Maps review page link
const googleMapsUrl = "https://maps.app.goo.gl/dcXpVWVAwmPAqEXf9";

const googleReviews = document.getElementById("googleReviews");
const dotsContainer = document.getElementById("reviewDots");
const prevBtn = document.querySelector(".testimonials-nav.prev");
const nextBtn = document.querySelector(".testimonials-nav.next");

async function loadGoogleReviews() {
  if (!googleReviews) return;

  const sampleReviews = [
    {
      rating: 5,
      text: "Flavour Feast catered our engagement party and every bite was stunning. Guests are still talking about the grazing table presentation.",
      author: "Arezo G.",
      date: "4 days ago",
      link: googleMapsUrl,
    },
    {
      rating: 5,
      text: "We booked them for a corporate open house. Communication was smooth, setup was on time, and the canap\u00e9s looked like art pieces.",
      author: "Michael P.",
      date: "1 week ago",
      link: googleMapsUrl,
    },
    {
      rating: 5,
      text: "I ordered the Persian Bites for my baby shower and it felt like a curated restaurant experience at home. Beautiful flavours and zero stress.",
      author: "Sahar L.",
      date: "3 weeks ago",
      link: googleMapsUrl,
    },
    {
      rating: 5,
      text: "The Kiddie Feast package was perfect for our daughter's birthday. Colourful, fresh, and the kids actually ate everything!",
      author: "Nadia R.",
      date: "1 month ago",
      link: googleMapsUrl,
    },
  ];

  const filledStar = "&#9733;";
  const emptyStar = "&#9734;";

  googleReviews.innerHTML = "";

  sampleReviews.forEach((review) => {
    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <a href="${
        review.link
      }" target="_blank" rel="noopener" class="review-card-inner">
        <div class="review-header">
          <span class="stars" aria-label="${review.rating} out of 5 stars">
            ${filledStar.repeat(review.rating)}${emptyStar.repeat(5 - review.rating)}
          </span>
          <span class="review-date">${review.date}</span>
        </div>
        <p class="review-text">"${review.text}"</p>
        <div class="reviewer">- ${review.author}</div>
      </a>
    `;
    googleReviews.appendChild(card);
  });

  initReviewSlider();
}

function initReviewSlider() {
  const cards = googleReviews.querySelectorAll(".review-card");
  if (!cards.length) return;

  let current = 0;

  // Activate first card
  cards[0].classList.add("active");

  // Create dots
  dotsContainer.innerHTML = "";
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "review-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    cards.forEach((c, i) => c.classList.toggle("active", i === index));
    dotsContainer
      .querySelectorAll(".review-dot")
      .forEach((d, i) => d.classList.toggle("active", i === index));

    current = index;
  }

  prevBtn?.addEventListener("click", () =>
    goTo((current - 1 + cards.length) % cards.length)
  );
  nextBtn?.addEventListener("click", () => goTo((current + 1) % cards.length));

  setInterval(() => {
    goTo((current + 1) % cards.length);
  }, 7000);
}

loadGoogleReviews();

/* ===================================================================
   SMOOTH SCROLL HELPER
   - Scrolls to a target selector with sticky header compensation
=================================================================== */
function smoothScrollTo(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  // Height of sticky header so we don't scroll content under it
  const headerOffset =
    document.querySelector(".site-header")?.offsetHeight || 0;

  const rect = target.getBoundingClientRect();
  const offsetTop = rect.top + window.pageYOffset - (headerOffset + 10);

  window.scrollTo({ top: offsetTop, behavior: "smooth" });
}

/* ===================================================================
   PRIMARY SCRIPT
   - All main interactions are initialized on DOMContentLoaded
=================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Cached DOM references ---------- */
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll("[data-scroll-link]");
  const scrollButtons = document.querySelectorAll("[data-scroll-target]");
  const externalButtons = document.querySelectorAll("[data-external-link]");
  const galleryItems = document.querySelectorAll(
    ".gallery-item[data-lightbox]"
  );
  const lightbox = document.querySelector(".lightbox");
  const lightboxContent = lightbox?.querySelector(".lightbox-content") || null;
  const lightboxCloseEls =
    lightbox?.querySelectorAll("[data-lightbox-close]") || [];
  const menuModal = document.querySelector("[data-menu-modal]");
  const flipCards = document.querySelectorAll(".package-card[data-menu-video]");
  const faqItems = document.querySelectorAll(".faq-item");
  const revealEls = document.querySelectorAll(".reveal");
  const form = document.getElementById("quote-form");
  const formMessage = document.getElementById("form-message");
  const mapFrame = document.querySelector("[data-map-frame]");
  const mapLoadBtn = document.querySelector("[data-map-load]");
  const mapPlaceholder = document.querySelector("[data-map-placeholder]");

  // Terms & Conditions modal elements
  const openBtn = document.getElementById("open-terms");
  const modal = document.getElementById("terms-modal");
  const closeBtn = document.getElementById("close-terms");

  // Keeps reference to current image/video in lightbox
  let currentMediaEl = null;

  // Push non-critical media off the critical path
  document.querySelectorAll("img:not([loading])").forEach((img) => {
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  });

  // Stop browsers from preloading videos we don't need yet
  document.querySelectorAll("video").forEach((vid) => {
    vid.preload = "none";
  });

  /* ===================================================================
     MOBILE NAV
     - Handles hamburger toggle and closing on outside click
  =================================================================== */
  if (navToggle && header) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Smooth-scroll for nav links with data-scroll-link (header navigation)
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      e.preventDefault();
      smoothScrollTo(href);

      // Close mobile nav after click
      header.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Clicking outside header closes the mobile navigation
  document.addEventListener("click", (e) => {
    if (header.classList.contains("nav-open") && !header.contains(e.target)) {
      header.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });

  /* ===================================================================
     SCROLL BUTTONS (Hero CTAs, etc.)
     - Elements with data-scroll-target="#section-id"
  =================================================================== */
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll-target");
      if (target) smoothScrollTo(target);
    });
  });

  /* ===================================================================
     EXTERNAL LINKS (Instagram / WhatsApp / etc.)
     - Elements with data-external-link="https://..."
  =================================================================== */
  externalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-external-link");
      if (url) window.open(url, "_blank", "noopener");
    });
  });

  /* ===================================================================
     MAP LAZY-LOAD
     - Only injects Google Maps iframe when user clicks or scrolls to it
  =================================================================== */
  const loadMap = () => {
    if (!mapFrame || mapFrame.src) return;
    const src = mapFrame.getAttribute("data-src");
    if (!src) return;
    mapFrame.src = src;
    mapFrame.removeAttribute("data-src");
    mapPlaceholder?.remove();
  };

  mapLoadBtn?.addEventListener("click", loadMap);
  mapFrame?.addEventListener("load", () => mapPlaceholder?.remove());

  if ("IntersectionObserver" in window && mapFrame) {
    const mapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMap();
            mapObserver.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    mapObserver.observe(mapFrame);
  }

  /* ===================================================================
     HERO SLIDESHOW
     - Fades between background images every 5 seconds
  =================================================================== */
  const heroSection = document.querySelector(".hero");
  const heroImages = ["assets/images/hero/01.png", "assets/images/hero/02.png"];
  let currentHeroIndex = 0;

  if (heroSection) {
    // Preload images for smoother transition
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    heroSection.style.backgroundImage = `url('${heroImages[0]}')`;

    setInterval(() => {
      currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
      heroSection.style.backgroundImage = `url('${heroImages[currentHeroIndex]}')`;
    }, 5000);
  }

  /* ===================================================================
     MENU MODAL (Detailed package menus)
     - Opens a dark modal with .menu-detail content
  =================================================================== */
  if (menuModal) {
    const detailBlocks = menuModal.querySelectorAll(".menu-detail");
    const cards = document.querySelectorAll(".package-card[data-menu-target]");

    // Show matching menu-detail section inside modal
    function openMenuModal(id) {
      detailBlocks.forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-menu-id") === id);
      });
      menuModal.classList.add("open");
      document.body.style.overflow = "hidden"; // lock background scroll
    }

    function closeMenuModal() {
      menuModal.classList.remove("open");
      document.body.style.overflow = ""; // restore scroll
    }

    // Clicking a package-card opens modal with corresponding menu-detail
    cards.forEach((card) => {
      card.addEventListener("click", () =>
        openMenuModal(card.dataset.menuTarget)
      );
    });

    // Click on backdrop closes modal
    menuModal.addEventListener("click", (e) => {
      if (e.target === menuModal) closeMenuModal();
    });

    // Close icon inside modal
    menuModal
      .querySelector("[data-menu-close]")
      ?.addEventListener("click", closeMenuModal);

    // ESC key closes modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuModal.classList.contains("open"))
        closeMenuModal();
    });
  }

  /* ===================================================================
     PACKAGE CARD VIDEOS DISABLED
     - Remove teaser videos entirely
  =================================================================== */
  flipCards.forEach((card) => {
    const video = card.querySelector(".card-video");
    if (video) {
      video.remove();
    }
  });

  /* ===================================================================
     GALLERY LIGHTBOX (Image + Video)
     - Opens overlay and injects image/video node dynamically
  =================================================================== */
  function openLightbox(src, type = "image") {
    if (!lightbox || !lightboxContent) return;

    // Remove any existing media elements (including placeholder image)
    lightboxContent.querySelectorAll(".lightbox-image, video").forEach((el) => {
      if (el.tagName === "VIDEO") el.pause();
      el.remove();
    });
    currentMediaEl = null;

    let el;
    if (type === "video") {
      el = document.createElement("video");
      el.controls = true;
      el.autoplay = true;
      el.playsInline = true;
    } else {
      el = document.createElement("img");
      el.alt = "";
    }

    el.className = "lightbox-image";
    el.src = src;
    currentMediaEl = el;

    // Insert before close button so button stays on top
    lightboxContent.insertBefore(
      el,
      lightboxContent.querySelector(".lightbox-close")
    );
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightboxContent
      ?.querySelectorAll(".lightbox-image, video")
      .forEach((el) => {
        if (el.tagName === "VIDEO") {
          el.pause();
          el.currentTime = 0;
        }
        el.remove();
      });
    currentMediaEl = null;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Open lightbox on gallery item click
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      openLightbox(item.dataset.lightbox, item.dataset.type || "image");
    });
  });

  // Close buttons in lightbox
  lightboxCloseEls.forEach((btn) =>
    btn.addEventListener("click", closeLightbox)
  );

  // Click on backdrop closes lightbox
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ESC key closes lightbox
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open"))
      closeLightbox();
  });

  /* ===================================================================
     FAQ ACCORDION
     - Expands one answer at a time, collapses others
  =================================================================== */
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const ans = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");
    if (!btn || !ans) return;

    btn.addEventListener("click", () => {
      const isOpen = ans.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      icon?.classList.toggle("rotate", isOpen);

      // Close all other FAQ items when one opens
      if (isOpen) {
        faqItems.forEach((other) => {
          if (other === item) return;
          const oa = other.querySelector(".faq-answer");
          const ob = other.querySelector(".faq-question");
          const oi = other.querySelector(".faq-icon");
          if (oa?.classList.contains("open")) oa.classList.remove("open");
          ob?.setAttribute("aria-expanded", "false");
          oi?.classList.remove("rotate");
        });
      }
    });
  });

  /* ===================================================================
     SCROLL REVEAL ANIMATION
     - Uses IntersectionObserver; falls back to no-op if unsupported
  =================================================================== */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Legacy browsers: just show all elements
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ===================================================================
     FORM VALIDATION (Client-side)
     - Required fields, basic email check, terms checkbox
     - Shows inline errors + global message
     - Currently simulates submit (no remote POST here)
  =================================================================== */

  // Attach error text to the proper .field-error span
  function setFieldError(field, msg) {
    const group =
      field.closest(".form-group") ||
      field.closest(".checkbox-group") ||
      field.parentElement;

    const errorSpan = group?.querySelector(".field-error");
    if (errorSpan) errorSpan.textContent = msg || "";

    field.classList.toggle("input-error", Boolean(msg));
  }

  // Clear all previous error visuals/messages
  function clearFormErrors() {
    form
      .querySelectorAll(".input-error")
      .forEach((el) => el.classList.remove("input-error"));
    form
      .querySelectorAll(".field-error")
      .forEach((el) => (el.textContent = ""));
  }

  // Show global success/error banner under the form
  function showFormMessage(type, text) {
    formMessage.textContent = text;
    formMessage.className = "form-message " + type;
    formMessage.style.display = "block";
  }

  if (form) {
    const submitBtn = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearFormErrors();
      formMessage.style.display = "none";

      let hasError = false;

      // Basic "required" checks
      const requiredFields = [
        "name",
        "email",
        "phone",
        "event-date",
        "guest-count",
        "budget-range",
      ];
      requiredFields.forEach((id) => {
        const field = form.querySelector(`#${id}`);
        if (!field.value.trim()) {
          setFieldError(field, "Required");
          hasError = true;
        }
      });

      // Email pattern validation
      const emailInput = form.querySelector("#email");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value && !emailPattern.test(emailInput.value)) {
        setFieldError(emailInput, "Invalid email");
        hasError = true;
      }

      // Terms & Conditions checkbox must be checked
      const terms = form.querySelector("#terms");
      if (!terms.checked) {
        const err = document.querySelector(".checkbox-error");
        if (err) err.textContent = "You must agree before submitting.";
        hasError = true;
      }

      if (hasError) {
        showFormMessage("error", "Please correct the highlighted fields.");
        return;
      }

      // Valid form: send to Formspree endpoint declared in the HTML form action.
      const formData = new FormData(form);
      submitBtn?.setAttribute("disabled", "true");
      showFormMessage("pending", "Sending your request...");

      try {
        const response = await fetch(form.action, {
          method: form.method || "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });

        if (response.ok) {
          form.reset();
          clearFormErrors();
          showFormMessage(
            "success",
            "Thank you! We will contact you within 24 hours."
          );
        } else {
          const data = await response.json().catch(() => ({}));
          const errorMsg =
            data?.errors?.[0]?.message ||
            "Oops! Something went wrong. Please try again later.";
          showFormMessage("error", errorMsg);
        }
      } catch (error) {
        showFormMessage(
          "error",
          "We couldn't send your request. Please check your internet connection and try again."
        );
      } finally {
        submitBtn?.removeAttribute("disabled");
      }
    });
  }

  /* ===================================================================
     TERMS & CONDITIONS MODAL
     - Opens a modal with terms text; user can read and close it
     - Checkbox still controls actual consent
  =================================================================== */
  if (!openBtn || !modal) return;

  // Open modal on "View Terms" click
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  // Close when clicking the close button
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  });

  // Close when clicking on the dimmed backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  // ESC key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
});

/* ===================================================================
   BACKGROUND STARS
   - Generates twinkling "diamond" stars behind the layout
   - Covers the full document height (not just the first viewport)
=================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".bg-stars");
  if (!container) return;

  const STAR_COUNT = 240; // total number of stars to render

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("span");
    star.classList.add("bg-star");

    const pageHeight = document.body.scrollHeight;

    // Random position across full page
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * pageHeight;

    // Random star size: between 2px and 6px
    const size = 2 + Math.random() * 4;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Random animation duration (3–8s) and delay (0–6s)
    const duration = 3 + Math.random() * 5;
    const delay = Math.random() * 6;

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;

    container.appendChild(star);
  }
});


