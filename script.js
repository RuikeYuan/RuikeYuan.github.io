(function () {
  var root = document.documentElement;

  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", function () {
    var current = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Mobile menu
  var links = document.getElementById("navLinks");
  document.getElementById("menuToggle").addEventListener("click", function () {
    links.classList.toggle("open");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") links.classList.remove("open");
  });

  // Nav border on scroll
  var nav = document.getElementById("nav");
  addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", scrollY > 8);
  }, { passive: true });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Active nav link
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = links.querySelectorAll("a");
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { so.observe(s); });
  }

  // Project filters
  var chips = document.querySelectorAll("#filters .chip");
  var cards = document.querySelectorAll("#projectGrid .card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.dataset.filter;
      cards.forEach(function (card) {
        var show = f === "all" || card.dataset.tags.split(" ").indexOf(f) !== -1;
        card.classList.toggle("hidden", !show);
        if (show) card.classList.add("in");
      });
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Language toggle (EN / 中文)
  var ZH = window.I18N_ZH || {};
  var I18N_SELECTOR = "h1,h2,h3,h4,main p,.tl-body li,.nav-links a,a.btn,button.chip," +
    "figcaption span,.date,.place,.kind,.score,.date-sm,.badge,.stats span,.pipeline span," +
    ".arch li,.links a,footer span:not(#year)";
  var meta = {
    en: { title: document.title, desc: document.querySelector('meta[name="description"]').content },
    zh: {
      title: "袁瑞科 Ruike Yuan — 软件 / 数据 / AI 工程师",
      desc: "袁瑞科（Ruike Yuan），常驻荷兰的软件工程师、数据工程师与 AI 工程师。后端、云平台、数据管道与应用机器学习。"
    }
  };
  var originals = [];
  document.querySelectorAll(I18N_SELECTOR).forEach(function (el) {
    var key = el.textContent.replace(/\s+/g, " ").trim();
    if (ZH[key] !== undefined) originals.push({ el: el, en: el.innerHTML, zh: ZH[key] });
  });
  var langBtn = document.getElementById("langToggle");

  function setLang(lang) {
    originals.forEach(function (o) { o.el.innerHTML = lang === "zh" ? o.zh : o.en; });
    root.setAttribute("lang", lang === "zh" ? "zh" : "en");
    document.title = meta[lang].title;
    document.querySelector('meta[name="description"]').content = meta[lang].desc;
    langBtn.textContent = lang === "zh" ? "EN" : "中";
    langBtn.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
  }

  var lang = "en";
  var param = new URLSearchParams(location.search).get("lang");
  if (param === "zh" || param === "en") lang = param;
  else {
    try { lang = localStorage.getItem("lang") || lang; } catch (e) {}
  }
  if (lang === "zh") setLang("zh");

  langBtn.addEventListener("click", function () {
    lang = lang === "zh" ? "en" : "zh";
    setLang(lang);
    try { localStorage.setItem("lang", lang); } catch (e) {}
  });
})();
