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
})();
