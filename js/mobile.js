/* ===========================================================================
   アワノテ — スマホ版サイト 挙動 (mobile.js)
   ・ハンバーガー → ドロワー開閉（スクリム / Esc / ナビタップで閉じる）
   ・?hero=a|b|c でヒーローのバリエーションを切替（比較プレビュー用）
   =========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------- hero variant */
  try {
    var params = new URLSearchParams(location.search);
    var hero = (params.get("hero") || "").toLowerCase();
    if (hero === "a" || hero === "b" || hero === "c") {
      document.body.setAttribute("data-hero", hero);
    }
  } catch (e) { /* noop */ }

  /* ----------------------------------------------------------- drawer */
  var drawer = document.getElementById("drawer");
  var scrim = document.getElementById("scrim");
  var openBtn = document.getElementById("openDrawer");
  var closeBtn = document.getElementById("closeDrawer");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("open");
    if (scrim) scrim.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open");
    if (scrim) scrim.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (scrim) scrim.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  // ドロワー内リンクをタップしたら閉じる（アンカー遷移は許可）
  document.querySelectorAll(".drawer nav a[data-nav], .drawer-cta a").forEach(function (a) {
    a.addEventListener("click", function () {
      setTimeout(closeDrawer, 120);
    });
  });

  /* ------------------------------------------------- works rail 右矢印 */
  var rail = document.querySelector(".works-rail");
  var railNext = document.getElementById("worksNext");
  if (rail && railNext) {
    function updateArrow() {
      // scrollWidth が clientWidth 以下（未確定 or スクロール不要）のときは矢印を出さない判定にしない
      var scrollable = rail.scrollWidth - rail.clientWidth > 4;
      var atEnd = scrollable && rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
      railNext.hidden = scrollable ? atEnd : false;
    }
    railNext.addEventListener("click", function () {
      var card = rail.querySelector(".work-card");
      var step = card ? card.getBoundingClientRect().width + 13 : rail.clientWidth * 0.8;
      var atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
      rail.scrollBy({ left: atEnd ? -rail.scrollWidth : step, behavior: "smooth" });
    });
    rail.addEventListener("scroll", updateArrow, { passive: true });
    window.addEventListener("resize", updateArrow);
    // 初期判定はレイアウト・フォント確定後に行う（早すぎると scrollWidth が未確定で誤判定）
    updateArrow();
    requestAnimationFrame(updateArrow);
    window.addEventListener("load", updateArrow);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateArrow);
  }
})();
