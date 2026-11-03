// Entrance and scroll reveals, plus the active link in the case study anchor menu.

(function () {
  var items = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { el.classList.add("is-visible"); }, delay);
        revealObserver.unobserve(el);
      });
    }, { rootMargin: "0px 0px -10% 0px" });

    items.forEach(function (el) {
      // The large block starts off screen, so it plays on load instead of waiting to be seen
      if (el.getAttribute("data-reveal") === "large") {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { el.classList.add("is-visible"); });
        });
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // Hero: rotate the words on the lower line once, then rest on the last word.
  // A Pause button lets visitors stop it (WCAG 2.2.2 Pause, Stop, Hide).
  var rotator = document.querySelector(".rotator");
  var toggle = document.querySelector(".rotator-toggle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rotator && !reduceMotion) {
    var words = rotator.getAttribute("data-words").split("|");
    var word = rotator.querySelector(".rotator__word");
    var index = 0;
    var timer = null;

    function step() {
      word.classList.add("is-leaving");
      setTimeout(function () {
        index += 1;
        word.textContent = words[index];
        word.classList.remove("is-leaving");
        word.classList.add("is-entering");
        word.getBoundingClientRect(); // let the browser place it below before sliding up
        word.classList.remove("is-entering");
        if (index >= words.length - 1) finish();
      }, 400);
    }

    function start() { timer = setInterval(step, 2600); }
    function stop() { clearInterval(timer); timer = null; }
    function finish() {
      stop();
      if (toggle) toggle.hidden = true; // nothing moves any more
    }

    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", function () {
        var paused = toggle.getAttribute("aria-pressed") === "true";
        if (paused) {
          start();
          toggle.setAttribute("aria-pressed", "false");
          toggle.textContent = "Pause animation";
        } else {
          stop();
          toggle.setAttribute("aria-pressed", "true");
          toggle.textContent = "Play animation";
        }
      });
    }
    start();
  }

  // Highlight the anchor for the section on screen
  var anchorLinks = document.querySelectorAll(".anchors__list a");
  if (anchorLinks.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        anchorLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    document.querySelectorAll(".case-section[id]").forEach(function (s) { sectionObserver.observe(s); });
  }
})();
