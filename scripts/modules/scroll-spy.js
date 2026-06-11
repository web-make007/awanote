const ACTIVE_CLASS_NAME = "is-active";
const ACTIVE_ATTRIBUTE_NAME = "aria-current";
const ACTIVE_ATTRIBUTE_VALUE = "page";
const DEFAULT_HEADER_SELECTOR = ".site-header";
const DEFAULT_NAV_SELECTOR = ".global-nav a[href^='#'], .mobile-quick-nav a[href^='#']";

const getSectionTop = (section) => section.getBoundingClientRect().top + window.scrollY;

const collectNavItems = (navSelector) =>
  Array.from(document.querySelectorAll(navSelector))
    .map((link) => {
      const targetId = link.getAttribute("href")?.slice(1);
      if (!targetId) return null;

      const section = document.getElementById(targetId);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

const sortNavItemsBySectionTop = (navItems) =>
  [...navItems].sort((leftItem, rightItem) => getSectionTop(leftItem.section) - getSectionTop(rightItem.section));

const setActiveLink = (navItems, activeLink) => {
  navItems.forEach(({ link }) => {
    const isActive = link === activeLink;
    link.classList.toggle(ACTIVE_CLASS_NAME, isActive);

    if (isActive) {
      link.setAttribute(ACTIVE_ATTRIBUTE_NAME, ACTIVE_ATTRIBUTE_VALUE);
    } else {
      link.removeAttribute(ACTIVE_ATTRIBUTE_NAME);
    }
  });
};

const findActiveItem = (sectionItems, markerY) => {
  let activeItem = null;

  for (const item of sectionItems) {
    if (getSectionTop(item.section) <= markerY) {
      activeItem = item;
      continue;
    }

    break;
  }

  return activeItem;
};

const createSectionHighlighter = ({ header, navItems }) => {
  let currentActiveLink = null;
  let isQueued = false;

  const updateActiveSection = () => {
    const sectionItems = sortNavItemsBySectionTop(navItems);
    const headerHeight = header?.offsetHeight ?? 0;
    const markerY = window.scrollY + headerHeight + Math.min(window.innerHeight * 0.18, 140);
    const activeItem = findActiveItem(sectionItems, markerY);

    if (!activeItem && markerY < getSectionTop(sectionItems[0].section)) {
      currentActiveLink = null;
      setActiveLink(navItems, null);
    } else {
      const nextActiveLink = activeItem?.link ?? sectionItems[sectionItems.length - 1].link;
      if (currentActiveLink !== nextActiveLink) {
        currentActiveLink = nextActiveLink;
        setActiveLink(navItems, nextActiveLink);
      }
    }

    isQueued = false;
  };

  const queueUpdate = () => {
    if (isQueued) return;
    isQueued = true;
    window.requestAnimationFrame(updateActiveSection);
  };

  navItems.forEach(({ link }) => {
    link.addEventListener("click", () => {
      currentActiveLink = link;
      setActiveLink(navItems, link);
      window.requestAnimationFrame(queueUpdate);
    });
  });

  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate);
  window.addEventListener("load", queueUpdate);

  queueUpdate();
};

export const initScrollSpy = ({
  headerSelector = DEFAULT_HEADER_SELECTOR,
  navSelector = DEFAULT_NAV_SELECTOR,
} = {}) => {
  const navItems = collectNavItems(navSelector);
  if (navItems.length === 0) return;

  const header = document.querySelector(headerSelector);
  createSectionHighlighter({ header, navItems });
};
