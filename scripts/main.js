import { initScrollSpy } from "./modules/scroll-spy.js";

const IMAGE_SLOT_SOURCES = {
  "hero-person": "./img/site/hero-person-final.png",
  "hero-laptop": "./img/site/hero-laptop-final.png",
  "worry-people": "./img/site/worry-people-final.png",
  "result-1": "./img/site/result-consult-final.png",
  "result-2": "./img/site/result-mobile-final.png",
  "result-3": "./img/site/result-line-final.png",
  "result-4": "./img/site/result-cafe-final.png",
  "result-5": "./img/site/result-line-alt-final.png",
  "about-icon-1": "./img/site/about-student-icon.png",
  "about-icon-2": "./img/site/about-ai-icon.png",
  "about-icon-3": "./img/site/about-local-shop-icon.png",
  "about-photo": "./img/site/about-photo-final.png",
  "reason-icon-1": "./img/site/reason-speed.png",
  "reason-icon-2": "./img/site/reason-crown.png",
  "reason-icon-3": "./img/site/reason-idea.png",
  "reason-icon-4": "./img/site/reason-local.png",
  "reason-icon-5": "./img/site/reason-support.png",
  "member-1": "./img/site/member-matsueda-face.jpg",
  "member-2": "./img/site/member-arai-face.jpg",
  "m-bn-1": "./img/site/result-consult-final.png",
  "m-bn-2": "./img/site/result-mobile-final.png",
  "m-bn-3": "./img/site/result-line-final.png",
  "m-bn-4": "./img/site/result-cafe-final.png",
  "m-about-1": "./img/site/about-student-icon.png",
  "m-about-2": "./img/site/about-ai-icon.png",
  "m-about-3": "./img/site/about-local-shop-icon.png",
  "m-reason-1": "./img/site/reason-speed.png",
  "m-reason-2": "./img/site/reason-idea.png",
  "m-reason-3": "./img/site/reason-local.png",
  "m-reason-4": "./img/site/reason-support.png",
  "m-member-1": "./img/site/member-matsueda-face.jpg",
  "m-member-2": "./img/site/member-arai-face.jpg",
};

class ImageSlotElement extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
        <style>
          :host { display: block; }
          .frame {
            width: 100%;
            height: 100%;
            min-height: 1px;
            overflow: hidden;
            border-radius: var(--slot-radius, 0);
            background: var(--slot-frame-bg, transparent);
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: var(--slot-fit, cover);
          }
        </style>
        <div class="frame" part="frame"><img part="image" alt="" loading="lazy" decoding="async" /></div>
      `;
    }

    this.applyImage();
  }

  applyImage() {
    const image = this.shadowRoot?.querySelector("img");
    if (!image) return;

    const slotId = this.id;
    const source = IMAGE_SLOT_SOURCES[slotId] || this.getAttribute("src");
    const fit = this.getAttribute("fit") || "cover";
    const radius = this.getAttribute("radius");

    this.style.setProperty("--slot-fit", fit);
    if (radius) {
      this.style.setProperty("--slot-radius", `${radius}px`);
    } else if (this.getAttribute("shape") === "circle") {
      this.style.setProperty("--slot-radius", "999px");
    } else if (this.getAttribute("shape") === "rounded") {
      this.style.setProperty("--slot-radius", "16px");
    }

    if (source) {
      image.loading = slotId.startsWith("cta-") ? "eager" : "lazy";
      image.src = source;
      this.dataset.filled = "true";
    }
  }
}

const defineImageSlot = () => {
  if (!customElements.get("image-slot")) {
    customElements.define("image-slot", ImageSlotElement);
  }
};

const initMobileDrawer = () => {
  const drawer = document.getElementById("drawer");
  const scrim = document.getElementById("scrim");
  const openButton = document.getElementById("openDrawer");
  const closeButton = document.getElementById("closeDrawer");
  if (!drawer || !scrim || !openButton || !closeButton) return;

  const setOpen = (isOpen) => {
    drawer.classList.toggle("is-open", isOpen);
    scrim.classList.toggle("is-open", isOpen);
    openButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("drawer-open", isOpen);
  };

  openButton.addEventListener("click", () => setOpen(true));
  closeButton.addEventListener("click", () => setOpen(false));
  scrim.addEventListener("click", () => setOpen(false));
  drawer.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
};

const initWorksRail = () => {
  const rail = document.querySelector(".works-rail");
  const nextButton = document.getElementById("worksNext");
  if (!rail || !nextButton) return;

  nextButton.addEventListener("click", () => {
    const scrollAmount = rail.querySelector(".work-card")?.clientWidth ?? 260;
    rail.scrollBy({ left: scrollAmount + 16, behavior: "smooth" });
  });
};

defineImageSlot();
initScrollSpy();
initMobileDrawer();
initWorksRail();
