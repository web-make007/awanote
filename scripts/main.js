import { initScrollSpy } from "./modules/scroll-spy.js";

const IMAGE_SLOT_SOURCES = {
  "hero-person": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/01_hero_01_人物01.png",
  "hero-laptop": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/02_hero_02_ノートPC.png",
  "worry-people": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/05_illust_05_悩む人々.png",
  "result-1": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/11_result_11_相談シーン.png",
  "result-2": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/13_result_13_スマホ閲覧.png",
  "result-3": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/12_result_12_スマホLINE.png",
  "result-4": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/18_sample_18_カフェサイト.png",
  "result-5": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/15_result_15_スマホLINE2.png",
  "about-icon-1": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/08_illust_08_学生アイコン.png",
  "about-icon-2": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/09_illust_09_AIアイコン.png",
  "about-icon-3": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/10_illust_10_地域店舗アイコン.png",
  "about-photo": "./img/_DSC9693-hero.jpg",
  "reason-icon-1": "./img/site/reason-speed.png",
  "reason-icon-2": "./img/site/reason-crown.png",
  "reason-icon-3": "./img/site/reason-idea.png",
  "reason-icon-4": "./img/site/reason-local.png",
  "reason-icon-5": "./img/site/reason-support.png",
  "work-1": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/17_sample_17_整体院サイト.png",
  "work-2": "./img/site/work-dental-full.png",
  "work-3": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/18_sample_18_カフェサイト.png",
  "work-4": "./img/site/work-hair-full.png",
  "member-1": "./img/member-matsueda.jpg",
  "member-2": "./img/member-arai.jpg",
  "cta-shop": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/06_illust_06_お店.png",
  "cta-people": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/07_illust_07_打ち合わせ.png",
  "m-bn-1": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/11_result_11_相談シーン.png",
  "m-bn-2": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/13_result_13_スマホ閲覧.png",
  "m-bn-3": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/12_result_12_スマホLINE.png",
  "m-bn-4": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/18_sample_18_カフェサイト.png",
  "m-about-1": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/08_illust_08_学生アイコン.png",
  "m-about-2": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/09_illust_09_AIアイコン.png",
  "m-about-3": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/10_illust_10_地域店舗アイコン.png",
  "m-reason-1": "./img/site/reason-speed.png",
  "m-reason-2": "./img/site/reason-idea.png",
  "m-reason-3": "./img/site/reason-local.png",
  "m-reason-4": "./img/site/reason-support.png",
  "m-work-1": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/17_sample_17_整体院サイト.png",
  "m-work-2": "./img/site/work-dental-full.png",
  "m-work-3": "./img/ミセミル_全素材_透過PNG/image1_メイン素材/18_sample_18_カフェサイト.png",
  "m-work-4": "./img/site/work-hair-full.png",
  "m-member-1": "./img/member-matsueda.jpg",
  "m-member-2": "./img/member-arai.jpg",
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
