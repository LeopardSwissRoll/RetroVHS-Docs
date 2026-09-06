/* RetroVHS 문서 내비게이션 — 페이지 목록·언어 전환·절 링크를 한 곳에서 관리한다.
   각 페이지는 <nav data-site-nav></nav> 하나만 두고 이 스크립트를 끝에서 불러온다.
   언어는 <html lang="ko"> 로, 현재 페이지는 파일명으로 판정한다. 폴더 구조: <lang>/<page>.html, 그림은 ../img/ 공유.
   새 언어판을 만들면 AVAILABLE 에 코드를 추가한다. 페이지를 늘리면 PAGES 에 한 줄 추가한다. */
(function () {
  var PAGES = [
    { file: "index.html", t: { ko: "개론", en: "Overview", ja: "概要", zh: "概述" } }
  ];
  var LANGS = [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
    { code: "zh", label: "中文" }
  ];
  var AVAILABLE = ["en", "ko", "ja", "zh"];                       // 파생된 언어판만. 없는 언어는 링크를 만들지 않는다.

  var lang = (document.documentElement.getAttribute("lang") || "ko").slice(0, 2);
  var file = location.pathname.split("/").pop() || "index.html";
  if (file.indexOf(".html") < 0) file = "index.html";
  var nav = document.querySelector("nav[data-site-nav]");
  if (!nav) return;

  var tabs = PAGES.map(function (p) {
    var cur = p.file === file ? ' class="cur"' : "";
    return '<a' + cur + ' href="' + p.file + '">' + (p.t[lang] || p.t.en) + "</a>";
  }).join("");

  var langs = LANGS.filter(function (l) { return AVAILABLE.indexOf(l.code) >= 0; }).map(function (l) {
    return l.code === lang ? "<span>" + l.label + "</span>"
                           : '<a href="../' + l.code + "/" + file + '">' + l.label + "</a>";
  }).join(" · ");

  var secs = Array.prototype.slice.call(document.querySelectorAll("main section[id] > h2")).map(function (h) {
    return '<a href="#' + h.parentNode.id + '">' + h.textContent.replace(/\s+/g, " ").trim() + "</a>";
  }).join("");

  // 언어판이 하나뿐이면 전환 표시 자체를 두지 않는다 (2026-09-06: 한국어 먼저 확정, 다른 언어는 그 뒤)
  var langHtml = AVAILABLE.length > 1 ? '<span class="lang">' + langs + "</span>" : "";
  // 페이지가 하나뿐이면 탭 줄을 두지 않는다 (2026-09-06: 개론 단일 페이지). 언어 전환은 언어판이 둘 이상일 때만.
  var tabsHtml = (PAGES.length > 1 || AVAILABLE.length > 1) ? '<div class="tabs">' + (PAGES.length > 1 ? tabs : "") + langHtml + "</div>" : "";
  nav.innerHTML = tabsHtml + (secs ? '<div class="secs">' + secs + "</div>" : "");

  // 없는 그림은 회색 자리표시자로 — onerror 를 페이지마다 쓰지 않아도 되게 여기서 단다.
  Array.prototype.slice.call(document.querySelectorAll("figure img")).forEach(function (img) {
    img.addEventListener("error", function () {
      img.classList.add("missing");
      img.alt = (img.getAttribute("data-missing") || img.alt || "figure") + " (to be captured)";
    });
  });
})();
