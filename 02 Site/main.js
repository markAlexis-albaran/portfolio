// Entrance and scroll reveals, plus the active link in the case study anchor menu.

(function () {
  // Dark mode switch. Light is the default; the choice is remembered in this browser.
  var root = document.documentElement;
  var themeButton = document.querySelector(".theme-toggle");
  function labelTheme() {
    if (!themeButton) return;
    var light = root.getAttribute("data-theme") === "light";
    themeButton.setAttribute("aria-checked", light ? "false" : "true"); // on = dark mode
  }
  if (themeButton) {
    labelTheme();
    themeButton.addEventListener("click", function () {
      var light = root.getAttribute("data-theme") === "light";
      if (light) { root.removeAttribute("data-theme"); } else { root.setAttribute("data-theme", "light"); }
      try { localStorage.setItem("theme", light ? "dark" : "light"); } catch (e) {}
      labelTheme();
    });
  }

  // Phone menu: open and close the floating panel
  var navEl = document.querySelector(".nav");
  var menuBtn = document.querySelector(".nav__menu-btn");
  if (navEl && menuBtn) {
    var setMenu = function (open) {
      navEl.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    menuBtn.addEventListener("click", function () {
      setMenu(!navEl.classList.contains("is-open"));
    });
    // Close on Escape, on a tap outside, and after choosing a link
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navEl.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (navEl.classList.contains("is-open") && !navEl.contains(e.target)) setMenu(false);
    });
    navEl.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  // Home: the floating "Projects" button hides once the top of the cards is three quarters up the screen
  var scrollCta = document.querySelector(".scroll-cta");
  var work = document.getElementById("work");
  if (scrollCta && work) {
    var checkCta = function () {
      // Hidden once the visitor starts scrolling, or when the cards already fill the lower half
      scrollCta.classList.toggle("is-hidden", window.scrollY > 40 || work.getBoundingClientRect().top < window.innerHeight * 0.5);
    };
    checkCta();
    window.addEventListener("scroll", checkCta, { passive: true });
    window.addEventListener("resize", checkCta);
  }

  // SpringIn: live mini-prototype of "Would anything else also work?"
  var demo = document.querySelector(".wish-demo");
  if (demo) {
    var options = [
      { date: "13.Mar (Sat)", label: "Day off", cls: "off" },
      { date: "11.Mar (Thu)", label: "Early shift", cls: "early" },
      { date: "14.Mar (Sun)", label: "Day off", cls: "off" },
      { date: "12.Mar (Fri)", label: "Late shift", cls: "late" }
    ];
    var chosen = [];
    var list = demo.querySelector(".wd-list");
    var addBtn = demo.querySelector(".wd-add");
    var count = demo.querySelector(".wd-count");
    var limit = demo.querySelector(".wd-limit");
    var status = demo.querySelector("[role=status]");
    var say = function (msg) { status.textContent = msg; };
    var render = function () {
      list.innerHTML = "";
      chosen.forEach(function (o, i) {
        var li = document.createElement("li");
        li.innerHTML = '<span class="wd-num">' + (i + 1) + '</span><span>' + o.date + '</span>' +
          '<span class="wd-tag wd-tag--' + o.cls + '">' + o.label + '</span>' +
          '<button class="wd-remove" type="button" aria-label="Remove ' + o.date + ', ' + o.label + '">&times;</button>';
        li.querySelector(".wd-remove").addEventListener("click", function () {
          chosen.splice(i, 1);
          render();
          say(o.date + " removed. " + chosen.length + " of 2 added.");
          (chosen.length ? list.querySelector(".wd-remove") : addBtn).focus();
        });
        list.appendChild(li);
      });
      var full = chosen.length >= 2;
      addBtn.hidden = full;
      limit.hidden = !full;
      count.textContent = chosen.length + " of 2";
    };
    addBtn.addEventListener("click", function () {
      var next = options.filter(function (o) { return chosen.indexOf(o) < 0; })[0];
      if (!next || chosen.length >= 2) return;
      chosen.push(next);
      render();
      say(next.date + ", " + next.label + " added. " + chosen.length + " of 2." + (chosen.length >= 2 ? " Limit reached." : ""));
      if (chosen.length >= 2) list.querySelectorAll(".wd-remove")[1].focus();
    });
    demo.querySelectorAll('input[name="wd-alt"]').forEach(function (r) {
      r.addEventListener("change", function () {
        demo.querySelectorAll(".wd-option").forEach(function (o) {
          o.classList.toggle("is-on", o.getAttribute("data-option") === r.value);
        });
        say(r.value === "no" ? "No alternative. This stays a fixed wish." : "Yes, something else works.");
      });
    });
    render();
  }

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
    }, { rootMargin: "0px 0px 0px 0px" });

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

  // Hero: the rotating skill line (and its tools line) loops continuously.
  // The "Pause animation" button stays visible so visitors can stop it (WCAG 2.2.2 Pause, Stop, Hide).
  var hero = document.querySelector(".hero");
  var rotator = document.querySelector(".rotator");
  var toggle = document.querySelector(".rotator-toggle");
  var marquee = document.querySelector(".marquee");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hero && !reduceMotion && (rotator || marquee)) {
    var words = rotator ? rotator.getAttribute("data-words").split("|") : [];
    var word = rotator ? rotator.querySelector(".rotator__word") : null;
    var tools = rotator && rotator.getAttribute("data-tools") ? rotator.getAttribute("data-tools").split("|") : [];
    var toolsLine = document.querySelector(".rotator-tools");
    var index = 0;
    var timer = null;
    var done = !rotator;
    var paused = false;

    var step = function () {
      word.classList.add("is-leaving");
      if (toolsLine) toolsLine.classList.add("is-changing");
      setTimeout(function () {
        index = (index + 1) % words.length; // loop back to the first skill
        word.textContent = words[index];
        if (toolsLine && tools[index]) {
          toolsLine.textContent = tools[index];
          toolsLine.classList.remove("is-changing");
        }
        word.classList.remove("is-leaving");
        word.classList.add("is-entering");
        word.getBoundingClientRect(); // let the browser place it below before sliding up
        word.classList.remove("is-entering");
      }, 400);
    };
    var startWords = function () { if (!done && !timer) timer = setInterval(step, 2600); };
    var stopWords = function () { clearInterval(timer); timer = null; };
    // With no slider, nothing moves once the words finish, so the button goes away
    var finishIfStill = function () { if (!marquee && toggle) toggle.hidden = true; };

    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", function () {
        paused = !paused;
        hero.classList.toggle("is-paused", paused);
        if (paused) { stopWords(); } else { startWords(); }
        toggle.setAttribute("aria-pressed", paused ? "true" : "false");
        toggle.textContent = paused ? "Play animation" : "Pause animation";
      });
    }
    startWords();
  }

  // Contact: the address is stored in pieces and joined here, so it never appears whole
  // in the page code (most spam bots read the code without running scripts).
  // Then "Copy email" copies it instead of opening a mail app.
  var emailText = document.querySelector(".contact__email");
  var email = emailText ? emailText.getAttribute("data-user") + "@" + emailText.getAttribute("data-domain") : "";
  if (emailText) emailText.textContent = email;
  var copyButton = document.querySelector(".contact__copy");
  var copyStatus = document.querySelector(".contact__status");
  if (copyButton && email && navigator.clipboard && window.isSecureContext !== false) {
    copyButton.hidden = false; // only shown where copying works
    copyButton.addEventListener("click", function () {
      navigator.clipboard.writeText(email).then(function () {
        copyButton.textContent = "Copied";
        if (copyStatus) copyStatus.textContent = "Email address copied";
        setTimeout(function () {
          copyButton.textContent = "Copy email";
          if (copyStatus) copyStatus.textContent = "";
        }, 2000);
      });
    });
  }

  // How I work: line the loop bracket up with the 01 and 04 numbers
  var steps = document.querySelector(".steps");
  if (steps) {
    var loop = steps.querySelector(".steps__loop");
    var nums = steps.querySelectorAll(".steps__num");
    var placeLoop = function () {
      if (!loop || nums.length < 2) return;
      // Measure against the whole list: the middle of each number's text
      var box = steps.getBoundingClientRect();
      var mid = function (el) {
        var range = document.createRange();
        range.selectNodeContents(el); // the text itself, not the padded box
        var r = range.getBoundingClientRect();
        return r.top - box.top + r.height / 2;
      };
      loop.style.top = mid(nums[0]) + "px";
      loop.style.bottom = (box.height - mid(nums[nums.length - 1])) + "px";
    };
    placeLoop();
    window.addEventListener("resize", placeLoop);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeLoop);
  }

  // Highlight the anchor for the section on screen
  var anchorLinks = document.querySelectorAll(".anchors__list a");
  if (anchorLinks.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        anchorLinks.forEach(function (link) {
          var on = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("is-active", on);
          if (on) { link.setAttribute("aria-current", "location"); } else { link.removeAttribute("aria-current"); }
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    document.querySelectorAll(".case-section[id]").forEach(function (s) { sectionObserver.observe(s); });
  }
})();
