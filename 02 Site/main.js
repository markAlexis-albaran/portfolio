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

  // Home: the floating "Scroll down" button hides once the top of the cards is three quarters up the screen
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

  // Every page: the floating "Contact" button hides while the contact section is on screen
  var contactCta = document.querySelector(".contact-cta");
  var contactSection = document.getElementById("contact");
  if (contactCta && contactSection && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      contactCta.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(contactSection);
  }

  // Columna: token switcher. The card stays the same component; only its tokens change.
  var tkDemo = document.querySelector(".tokens-demo");
  if (tkDemo) {
    var brands = {
      kochzeit:   { color: "#B4441C", font: "Serif", rcard: "14", rbtn: "26", tag: "Rezept",   title: "Herbstsuppe in 20 Minuten",     btn: "Zum Rezept",  logo: "Kochzeit" },
      sternblick: { color: "#E0004F", font: "Sans, bold", rcard: "2", rbtn: "2", tag: "Exklusiv", title: "Das große Comeback des Jahres", btn: "Weiterlesen", logo: "Sternblick" },
      fernweg:    { color: "#1F6F6A", font: "Sans, regular", rcard: "24", rbtn: "26", tag: "Reisen", title: "Drei Tage an der Ostsee",    btn: "Zur Reise",   logo: "Fernweg" }
    };
    var card = tkDemo.querySelector(".tk-card");
    tkDemo.querySelectorAll('input[name="tk-brand"]').forEach(function (r) {
      r.addEventListener("change", function () {
        var b = brands[r.value];
        card.setAttribute("data-brand", r.value);
        card.querySelector(".tk-card__logo").textContent = b.logo;
        card.querySelector(".tk-card__tag").textContent = b.tag;
        card.querySelector(".tk-card__title").textContent = b.title;
        card.querySelector(".tk-card__btn").textContent = b.btn;
        ["color", "font", "rcard", "rbtn"].forEach(function (k) {
          var dd = tkDemo.querySelector('[data-tk="' + k + '"]');
          dd.textContent = b[k];
          dd.classList.remove("is-changed"); void dd.offsetWidth; dd.classList.add("is-changed");
        });
      });
    });
  }

  // yumm: compare two grills. Ticking products fills the bar; at two, "Jetzt vergleichen" opens the table.
  var cmp = document.querySelector(".compare-demo");
  if (cmp) {
    var boxes = cmp.querySelectorAll(".cd-check input");
    var bar = cmp.querySelector(".cd-bar");
    var table = cmp.querySelector(".cd-table");
    var products = cmp.querySelector(".cd-products");
    var go = cmp.querySelector(".cd-go");
    var cmpSay = function (m) { cmp.querySelector("[role=status]").textContent = m; };
    var update = function () {
      var n = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).length;
      bar.hidden = n === 0;
      cmp.querySelector(".cd-bar__count").textContent = n + " Produkt/e wurde ausgewählt";
      cmp.querySelector(".cd-bar__hint").textContent = n < 2 ? "Ein weiteres Produkt hinzufügen, um mit dem Vergleich zu beginnen" : "Bereit zum Vergleich";
      go.disabled = n < 2;
      cmpSay(n === 0 ? "Nothing selected." : n + " of 2 selected." + (n === 2 ? " Ready to compare." : ""));
    };
    boxes.forEach(function (b) { b.addEventListener("change", update); });
    cmp.querySelector(".cd-cancel").addEventListener("click", function () {
      boxes.forEach(function (b) { b.checked = false; });
      update();
      boxes[0].focus();
    });
    go.addEventListener("click", function () {
      bar.hidden = true;
      cmp.querySelectorAll(".cd-check").forEach(function (l) { l.hidden = true; });
      table.hidden = false;
      cmpSay("Comparing both grills side by side.");
      cmp.querySelector(".cd-back").focus();
    });
    cmp.querySelector(".cd-back").addEventListener("click", function () {
      table.hidden = true;
      cmp.querySelectorAll(".cd-check").forEach(function (l) { l.hidden = false; });
      boxes.forEach(function (b) { b.checked = false; });
      update();
      boxes[0].focus();
    });
  }

  // tvguideplus: jetzt / 20:15 / 22:00 tabs switch the list
  var guide = document.querySelector(".guide-demo");
  if (guide) {
    var slots = {
      now: { label: "jetzt", items: [
        ["SAT.1", "Spielfilm · Doku-Soap", "Auf Streife", "12:30–13:45", 45, true],
        ["Comedy Central", "Serien · Zeichentrick", "Futurama", "12:30–13:45", 45],
        ["RTL", "Unterhaltung · Casting", "Deutschland sucht den Superstar", "12:30–13:45", 45],
        ["ZDFneo", "Reportage · Doku", "Die Reportage", "12:30–13:45", 45],
        ["VOX", "Sports · Wrestling", "Wrestling: WWE Raw", "12:30–13:45", 45]
      ]},
      "2015": { label: "20:15", items: [
        ["ARD", "Spielfilm · Krimi", "Küstenwache Nord", "20:15–21:45", 0, true],
        ["ZDF", "Unterhaltung · Quiz", "Der große Quizabend", "20:15–22:15", 0],
        ["arte", "Reportage · Natur", "Die Alpen von oben", "20:15–21:00", 0],
        ["ProSieben", "Spielfilm · Action", "Mission Polarstern", "20:15–22:30", 0]
      ]},
      "2200": { label: "22:00", items: [
        ["ZDFneo", "Serien · Drama", "Hafenklinik", "22:00–22:45", 0],
        ["3sat", "Kultur · Talk", "Nachtgespräch", "22:00–23:00", 0, true],
        ["RTL", "Nachrichten", "Nachtjournal", "22:15–22:45", 0],
        ["VOX", "Serien · Comedy", "Die WG", "22:00–22:30", 0]
      ]}
    };
    var gList = guide.querySelector(".tg-list");
    var tabs = guide.querySelectorAll(".tg-tabs [role=tab]");
    var esc = function (s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; };
    var show = function (key) {
      gList.innerHTML = slots[key].items.map(function (i) {
        return '<li><span class="tg-ch">' + esc(i[0]) + '</span><span><span class="tg-genre">' + esc(i[1]) + '</span>' +
          '<span class="tg-title">' + esc(i[2]) + '</span>' +
          '<span class="tg-prog" aria-hidden="true"><span style="width:' + i[4] + '%"></span></span>' +
          '<span class="tg-time">' + esc(i[3]) + '</span>' + (i[5] ? '<span class="tg-tip">TAGESTIPP</span>' : '') + '</span></li>';
      }).join("");
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-slot") === key;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { show(t.getAttribute("data-slot")); });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        n.focus(); show(n.getAttribute("data-slot"));
      });
    });
    show("now");
  }

  // pflegePro: the heart saves the lesson, and Favoriten switches from its empty state
  var fav = document.querySelector(".fav-demo");
  if (fav) {
    var heartBtn = fav.querySelector(".pf-heart");
    heartBtn.addEventListener("click", function () {
      var saved = heartBtn.getAttribute("aria-pressed") !== "true";
      heartBtn.setAttribute("aria-pressed", saved ? "true" : "false");
      fav.querySelector(".pf-empty").hidden = saved;
      fav.querySelector(".pf-saved").hidden = !saved;
      fav.querySelector("[role=status]").textContent = saved ? "Saved. It now appears in Favoriten." : "Removed. Favoriten is empty again.";
    });
  }

  // SpringIn, decision 1: write a wish on the calendar, then add alternatives. One prototype.
  // Written as a function so the walkthrough at the end of the page can run its own copy.
  var initFlowWrite = function (fw) {
    var types = { off: ["Off", "Day off"], early: ["Early", "Early shift"], late: ["Late", "Late shift"], night: ["Night", "Night shift"] };
    var wishes = { 6: { t: "off", alts: [] }, 15: { t: "night", alts: [{ d: 16, t: "night" }] }, 25: { t: "off", alts: [{ d: 27, t: "off" }] } };
    var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // 1 March 2027 is a Monday
    var label = function (d) { return (d < 10 ? "0" : "") + d + ".Mar (" + dayNames[(d - 1) % 7] + ")"; };
    var fwCal = fw.querySelector(".fw-cal"), fwWish = fw.querySelector(".fw-wish");
    var dayGrid = fw.querySelector(".sp-days"), altsBox = fw.querySelector(".fw-alts");
    var list = fw.querySelector(".wd-list"), addBtn = fw.querySelector(".wd-add");
    var saveBtn = fw.querySelector(".fw-save"), removeBtn = fw.querySelector(".sp-pick__remove");
    var fwSay = function (m) { fw.querySelector("[role=status]").textContent = m; };
    var day = null, draft = null; // the wish being written: { t, alts, fixed }

    var drawCal = function () {
      dayGrid.innerHTML = "";
      for (var d = 1; d <= 31; d++) {
        var b = document.createElement("button");
        var w = wishes[d];
        b.type = "button";
        b.dataset.day = d;
        b.innerHTML = d + (w ? '<span class="wd-tag wd-tag--' + w.t + '">' + (w.t === "night" ? "N" : types[w.t][0]) + "</span>" : "");
        b.setAttribute("aria-label", d + " March" + (w ? ", wish: " + types[w.t][1] : ", no wish"));
        b.addEventListener("click", function () { openWish(+this.dataset.day); });
        dayGrid.appendChild(b);
      }
      var keys = Object.keys(wishes).map(Number).sort(function (a, b) { return a - b; });
      fw.querySelector(".sp-sum__n").textContent = keys.length + (keys.length === 1 ? " Wunsch" : " Wünsche") + " written";
      fw.querySelector(".sp-sum__list").textContent = keys.length ? keys.map(function (k) {
        var n = wishes[k].alts.length;
        return label(k) + (n ? " (+" + n + (n === 1 ? " alternative)" : " alternatives)") : "");
      }).join(" · ") : "Nothing yet";
    };

    // Alternatives on offer: nearby days, so they make sense for whichever day was tapped
    var candidates = function () {
      return [{ d: day + 1, t: draft.t }, { d: day - 1, t: "early" }, { d: day + 2, t: "off" }, { d: day, t: "late" }]
        .filter(function (o) { return o.d >= 1 && o.d <= 31 && !(o.d === day && o.t === draft.t); });
    };
    var drawAlts = function () {
      altsBox.hidden = !draft.t;
      saveBtn.disabled = !draft.t;
      if (!draft.t) return;
      list.innerHTML = "";
      draft.alts.forEach(function (o, i) {
        var li = document.createElement("li");
        li.innerHTML = '<span class="wd-num">' + (i + 1) + '</span><span>' + label(o.d) + '</span>' +
          '<span class="wd-tag wd-tag--' + o.t + '">' + types[o.t][1] + '</span>' +
          '<button class="wd-remove" type="button" aria-label="Remove ' + label(o.d) + ', ' + types[o.t][1] + '">&times;</button>';
        li.querySelector(".wd-remove").addEventListener("click", function () {
          draft.alts.splice(i, 1);
          drawAlts();
          fwSay(label(o.d) + " removed. " + draft.alts.length + " of 2 added.");
          (draft.alts.length ? list.querySelector(".wd-remove") : addBtn).focus();
        });
        list.appendChild(li);
      });
      var full = draft.alts.length >= 2;
      addBtn.hidden = full;
      fw.querySelector(".wd-limit").hidden = !full;
      fw.querySelector(".wd-count").textContent = draft.alts.length + " of 2";
      fw.querySelectorAll(".wd-option").forEach(function (o) {
        o.classList.toggle("is-on", o.getAttribute("data-option") === (draft.fixed ? "no" : "yes"));
      });
      fw.querySelector('input[name^="wd-alt"][value="' + (draft.fixed ? "no" : "yes") + '"]').checked = true;
    };

    var openWish = function (d) {
      day = d;
      var w = wishes[d];
      draft = w ? { t: w.t, alts: w.alts.slice(), fixed: w.fixed } : { t: null, alts: [], fixed: false };
      fw.querySelector(".fw-title").textContent = "Wish for " + label(d);
      fw.querySelectorAll("[data-t]").forEach(function (o) { o.setAttribute("aria-pressed", draft.t === o.dataset.t ? "true" : "false"); });
      removeBtn.hidden = !w;
      drawAlts();
      fwCal.hidden = true;
      fwWish.hidden = false;
      fw.querySelector(".fw-title").focus();
    };
    var backToCal = function () {
      var d = day;
      fwWish.hidden = true;
      fwCal.hidden = false;
      drawCal();
      var b = dayGrid.querySelector('[data-day="' + d + '"]');
      if (b) b.focus();
    };

    fw.querySelectorAll("[data-t]").forEach(function (o) {
      o.addEventListener("click", function () {
        draft.t = o.dataset.t;
        draft.alts = draft.alts.filter(function (a) { return !(a.d === day && a.t === draft.t); });
        fw.querySelectorAll("[data-t]").forEach(function (x) { x.setAttribute("aria-pressed", x === o ? "true" : "false"); });
        drawAlts();
        fwSay(types[draft.t][1] + " chosen. Would anything else also work?");
      });
    });
    addBtn.addEventListener("click", function () {
      var taken = function (o) { return draft.alts.some(function (a) { return a.d === o.d && a.t === o.t; }); };
      var next = candidates().filter(function (o) { return !taken(o); })[0];
      if (!next || draft.alts.length >= 2) return;
      draft.alts.push(next);
      drawAlts();
      fwSay(label(next.d) + ", " + types[next.t][1] + " added. " + draft.alts.length + " of 2." + (draft.alts.length >= 2 ? " Limit reached." : ""));
      if (draft.alts.length >= 2) list.querySelectorAll(".wd-remove")[1].focus();
    });
    fw.querySelectorAll('input[name^="wd-alt"]').forEach(function (r) {
      r.addEventListener("change", function () {
        draft.fixed = r.value === "no";
        drawAlts();
        fwSay(draft.fixed ? "No alternative. This stays a fixed wish." : "Yes, something else works.");
      });
    });
    saveBtn.addEventListener("click", function () {
      wishes[day] = { t: draft.t, alts: draft.fixed ? [] : draft.alts, fixed: draft.fixed };
      fwSay("Wish for " + label(day) + " saved: " + types[draft.t][1] + (wishes[day].alts.length ? ", with " + wishes[day].alts.length + " alternative" + (wishes[day].alts.length > 1 ? "s" : "") : "") + ".");
      backToCal();
    });
    removeBtn.addEventListener("click", function () {
      delete wishes[day];
      fwSay("Wish for " + label(day) + " removed.");
      backToCal();
    });
    fw.querySelector(".fw-back").addEventListener("click", backToCal);
    drawCal();
  };

  // SpringIn, decision 2: the same wishes before the deadline, after it, and once the plan is out
  var initFlowPlan = function (fp) {
    var fpTypes = { off: ["off", "Day off"], night: ["night", "Night shift"] };
    var fpAll = [
      { d: "06.Mar (Sat)", t: "off", alt: "No alternative · fixed wish" },
      { d: "12.Mar (Fri)", t: "off", alt: "or 13.Mar (Sat) · Day off" },
      { d: "15.Mar (Mon)", t: "night", alt: "or 16.Mar (Tue) · Night shift" },
      { d: "25.Mar (Thu)", t: "off", alt: "or 27.Mar (Sat) · Day off" }
    ];
    var rvList = fp.querySelector(".sp-rv"), toast = fp.querySelector(".sp-toast");
    var lastRemoved = null;
    var fpSay = function (m) { fp.querySelector("[role=status]").textContent = m; };
    var tagHtml = function (w) { return '<span class="wd-tag wd-tag--' + fpTypes[w.t][0] + '">' + fpTypes[w.t][1] + '</span>'; };
    var drawRv = function () {
      var shown = fpAll.filter(function (w) { return !w.gone; });
      fp.querySelector(".sp-rv__h").textContent = shown.length + " wishes for March";
      fp.querySelector(".sp-handin").textContent = "Hand in " + shown.length + " wishes →";
      rvList.innerHTML = "";
      shown.forEach(function (w) {
        var li = document.createElement("li");
        li.innerHTML = '<div class="sp-rv__top"><span>' + w.d + '</span>' + tagHtml(w) + '</div>' +
          '<p class="sp-rv__alt">' + w.alt + '</p><div class="sp-rv__actions"><span class="sp-rv__change" aria-hidden="true">Change</span>' +
          '<button type="button" class="sp-rv__withdraw">Withdraw<span class="visually-hidden"> wish for ' + w.d + '</span></button></div>';
        li.querySelector(".sp-rv__withdraw").addEventListener("click", function () {
          w.gone = true;
          lastRemoved = w;
          toast.querySelector(".sp-toast__msg").textContent = "Wish for " + w.d + " withdrawn.";
          toast.hidden = false;
          drawRv();
          fpSay("Wish for " + w.d + " withdrawn. Undo is available.");
          toast.querySelector(".sp-toast__undo").focus();
        });
        rvList.appendChild(li);
      });
      // after the deadline, the handed-in wishes are read-only
      fp.querySelector(".fp-handed").innerHTML = shown.map(function (w) {
        return '<li><div class="sp-rv__top"><span>' + w.d + '</span>' + tagHtml(w) + '</div><p class="sp-rv__alt">' + w.alt + '</p></li>';
      }).join("");
    };
    toast.querySelector(".sp-toast__undo").addEventListener("click", function () {
      if (!lastRemoved) return;
      lastRemoved.gone = false;
      fpSay("Wish for " + lastRemoved.d + " is back.");
      lastRemoved = null;
      toast.hidden = true;
      drawRv();
      rvList.querySelector(".sp-rv__withdraw").focus();
    });
    fp.querySelector(".fp-out .rs-list").innerHTML = [
      ["25.Mar (Thu)", "You're on the late shift. Your wish (day off) and both alternatives couldn't be fitted.", false],
      ["06.Mar (Sat)", "Your wish · Day off", true],
      ["12.Mar (Fri)", "Alternative · 13.Mar (Sat), day off", true],
      ["15.Mar (Mon)", "Your wish · Night shift", true]
    ].map(function (r) {
      return '<li class="' + (r[2] ? "" : "is-no") + '"><div class="rs-top"><span>' + r[0] + '</span><span class="rs-badge rs-badge--' + (r[2] ? 'yes">✓ Granted' : 'no">Not granted') + '</span></div>' +
        '<span class="rs-detail">' + r[1] + '</span>' +
        (r[2] ? '' : '<div class="rs-pointer"><span class="co-pin" aria-hidden="true">3</span><strong>Can\'t live with this?</strong>Talk to your Stationsleitung, or arrange it with a colleague.</div>') + '</li>';
    }).join("");
    var fpNames = { before: "Before the deadline", closed: "Deadline passed", out: "Plan is out" };
    fp.querySelectorAll('input[name^="fp"]').forEach(function (r) {
      r.addEventListener("change", function () {
        ["before", "closed", "out"].forEach(function (k) { fp.querySelector(".fp-" + k).hidden = k !== r.value; });
        fpSay(fpNames[r.value] + " shown.");
      });
    });
    drawRv();
  };

  // Copies for the walkthrough are taken before the prototypes start, so each run begins fresh
  var fwSource = document.querySelector(".flow-write"), fpSource = document.querySelector(".flow-plan");
  var walkEl = document.querySelector(".walk");
  var fwPristine = walkEl && fwSource ? fwSource.cloneNode(true) : null;
  var fpPristine = walkEl && fpSource ? fpSource.cloneNode(true) : null;
  if (fwSource) initFlowWrite(fwSource);
  if (fpSource) initFlowPlan(fpSource);

  // SpringIn walkthrough: a pointer clicks through the whole wish round on its own, from writing
  // a wish to the plan coming out. It drives a real copy of the two prototypes above, so every
  // screen is the prototype's own. Visitors can pause it; it waits while off screen, and with
  // reduced motion it only starts when asked.
  if (walkEl && fwPristine && fpPristine) {
    var stage = walkEl.querySelector(".walk__stage");
    var pointer = walkEl.querySelector(".walk__pointer");
    var walkToggle = walkEl.querySelector(".walk__toggle");
    var walkSteps = walkEl.querySelectorAll(".walk__steps li");
    var walkPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var walkOff = true, walkStarted = false, W = null, P = null;
    var H = walkEl.querySelector(".walk__home"); // the home screen: static, rebuilt from the screenshot

    // Waits that stand still while paused or off screen
    var hold = function (ms) {
      return new Promise(function (done) {
        var left = ms, t0 = performance.now();
        (function loop() {
          var now = performance.now();
          if (!walkPaused && !walkOff) left -= now - t0;
          t0 = now;
          if (left <= 0) done(); else setTimeout(loop, 40);
        })();
      });
    };
    var scene = function (pristine, cls) {
      var src = pristine.cloneNode(true);
      var el = document.createElement("div");
      el.className = "wish-demo walk__scene " + cls;
      var sw = src.querySelector(".fp-switch");
      if (sw) el.appendChild(sw); // kept, hidden: the walkthrough uses it to move between moments
      el.appendChild(src.querySelector(".wish-demo__phone"));
      el.querySelectorAll("input[type=radio]").forEach(function (r) { r.name += "-walk"; });
      return el;
    };
    var build = function () {
      stage.querySelectorAll(".walk__scene:not(.walk__home)").forEach(function (el) { el.remove(); });
      W = scene(fwPristine, "flow-write");
      P = scene(fpPristine, "flow-plan");
      P.hidden = true;
      stage.insertBefore(P, pointer);
      stage.insertBefore(W, P);
      initFlowWrite(W);
      initFlowPlan(P);
    };
    var phoneOf = function (el) { return el.querySelector(".wish-demo__phone"); };
    var markStep = function (n) {
      walkSteps.forEach(function (li, i) { li.classList.toggle("is-current", i === n); });
    };
    var show = function (el) {
      [H, W, P].forEach(function (s) { s.hidden = s !== el; });
      phoneOf(el).scrollTop = 0;
    };
    var moment = function (value) {
      var r = P.querySelector('input[value="' + value + '"]');
      r.checked = true;
      r.dispatchEvent(new Event("change", { bubbles: true }));
      phoneOf(P).scrollTop = 0;
    };
    // Scroll the phone's screen if the next button is below the fold, glide the pointer to it, tap
    var tap = function (find) {
      var el = find();
      var phone = el.closest(".wish-demo__phone");
      var pr = phone.getBoundingClientRect(), r = el.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      var shift = 0;
      if (r.bottom > pr.bottom - 24 || r.top < pr.top + 24) {
        var maxTop = phone.scrollHeight - phone.clientHeight;
        var to = Math.max(0, Math.min(maxTop, phone.scrollTop + r.top - pr.top - pr.height / 2));
        shift = to - phone.scrollTop;
        phone.scrollTo({ top: to, behavior: "smooth" });
      }
      // The pointer appears right on the button (where it will be once the screen has scrolled), taps, and goes
      pointer.classList.remove("is-on");
      // placed with left/top (not a transform), so the press only shrinks it and never shifts it
      pointer.style.left = (r.left - sr.left + r.width / 2) + "px";
      pointer.style.top = (r.top - shift - sr.top + r.height / 2) + "px";
      return hold(shift ? 500 : 250).then(function () {
        pointer.classList.add("is-on");
        return hold(300);
      }).then(function () {
        pointer.classList.remove("is-tapping");
        void pointer.offsetWidth; // restart the pulse even on back-to-back taps
        pointer.classList.add("is-tapping");
        return hold(140);
      }).then(function () {
        el.dispatchEvent(new MouseEvent("click", { bubbles: true })); // the screen reacts at the deepest point of the press
        return hold(700);
      }).then(function () {
        pointer.classList.remove("is-tapping");
        pointer.classList.remove("is-on");
      });
    };
    var q = function (root, sel, i) { return function () { return root().querySelectorAll(sel)[i || 0]; }; };
    var w = function () { return W; }, pl = function () { return P; };

    var run = function () {
      build();
      show(H);
      markStep(0);
      pointer.classList.remove("is-on");
      return hold(1800)
        .then(function () { return tap(function () { return H.querySelector(".hm-open"); }); })
        .then(function () { show(W); markStep(1); return hold(1000); })
        .then(function () { return tap(q(w, '.sp-days [data-day="12"]')); })
        .then(function () { return tap(q(w, '[data-t="off"]')); })
        .then(function () { return tap(q(w, ".wd-add")); })
        .then(function () { return tap(q(w, ".wd-add")); })
        .then(function () { return hold(900); }) // the limit note
        .then(function () { return tap(q(w, ".wd-remove", 1)); })
        .then(function () { return tap(q(w, ".fw-save")); })
        .then(function () { return hold(1400); }) // the calendar, now with four wishes
        .then(function () { pointer.classList.remove("is-on"); show(P); markStep(2); return hold(1400); })
        .then(function () { return tap(q(pl, ".sp-rv__withdraw", 3)); })
        .then(function () { return hold(700); })
        .then(function () { return tap(q(pl, ".sp-toast__undo")); })
        .then(function () { return tap(q(pl, ".sp-handin")); })
        .then(function () { pointer.classList.remove("is-on"); moment("closed"); markStep(3); return hold(2800); })
        .then(function () { moment("out"); markStep(4); return hold(1800); })
        .then(function () {
          var ph = phoneOf(P);
          ph.scrollTo({ top: ph.scrollHeight, behavior: "smooth" });
          return hold(3200);
        })
        .then(run); // start the round again
    };

    var setPaused = function (p) {
      walkPaused = p;
      walkEl.classList.toggle("is-paused", p);
      walkToggle.textContent = p ? "Play walkthrough" : "Pause walkthrough";
      walkToggle.setAttribute("aria-pressed", p ? "true" : "false");
    };
    setPaused(walkPaused);
    walkToggle.addEventListener("click", function () { setPaused(!walkPaused); });
    build();
    show(H);
    markStep(0);
    new IntersectionObserver(function (entries) {
      walkOff = !entries[0].isIntersecting;
      if (!walkOff && !walkStarted) { walkStarted = true; run(); }
    }, { threshold: 0.35 }).observe(stage);
  }

  // tvguideplus: live search with labeled results
  var sr = document.querySelector(".search-demo");
  if (sr) {
    var srData = [
      ["Baracks", "08:00 – 10:00 · Freitag 20.12 · SuperRTL", "Sendung"],
      ["Baracuda", "08:00 – 10:00 · Freitag 20.12 · ARD", "Sendung"],
      ["Barkeeper", "Netflix", "VOD"],
      ["Bar Mitzwa", "Netflix", "VOD"],
      ["Neue Bar in Kassel eröffnet", "„Halbvoll“ bietet familiären Charme", "News"],
      ["Luther", "Netflix", "VOD"],
      ["Luther – The Fallen Sun", "20:15 – 22:15 · Samstag 21.12 · ZDF", "Sendung"],
      ["Lustige Tiere im Zoo", "16:00 – 16:45 · Sonntag 22.12 · KiKA", "Sendung"],
      ["Lord of the Rings", "Prime Video", "VOD"],
      ["The Wicked", "Prime Video", "VOD"]
    ];
    var srIn = sr.querySelector("input");
    var srEsc = function (s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; };
    var srDraw = function () {
      var q = srIn.value.trim().toLowerCase();
      var list = sr.querySelector(".sr-list");
      if (!q) {
        sr.querySelector(".sr-h").textContent = "Top-Suchanfragen";
        list.innerHTML = ["The Wicked", "Lord of the Rings", "Luther"].map(function (s) {
          return '<li><span class="sr-suggest">' + s + '</span><span aria-hidden="true">⌕</span></li>';
        }).join("");
        sr.querySelector(".sr-all").hidden = true;
        return;
      }
      var hits = srData.filter(function (r) { return r[0].toLowerCase().indexOf(q) !== -1; });
      sr.querySelector(".sr-h").textContent = hits.length ? "Top Treffer" : "Keine Treffer";
      list.innerHTML = hits.length ? hits.map(function (r) {
        var at = r[0].toLowerCase().indexOf(q);
        var title = srEsc(r[0].slice(0, at)) + "<mark>" + srEsc(r[0].slice(at, at + q.length)) + "</mark>" + srEsc(r[0].slice(at + q.length));
        return '<li><span><span class="sr-title">' + title + '</span><span class="sr-meta">' + srEsc(r[1]) + '</span></span><span class="sr-type">' + r[2].toUpperCase() + '</span></li>';
      }).join("") : '<li class="sr-none">Try &ldquo;bar&rdquo; or &ldquo;lu&rdquo;.</li>';
      sr.querySelector(".sr-all").hidden = !hits.length;
    };
    srIn.addEventListener("input", srDraw);
    srDraw();
  }

  // tvguideplus: filter panel with removable chips
  var fl = document.querySelector(".filter-demo");
  if (fl) {
    var flDraw = function () {
      var time = fl.querySelector('input[name="fl-time"]:checked').value;
      var types = Array.prototype.map.call(fl.querySelectorAll('input[type="checkbox"]:checked'), function (c) { return c.value; });
      var chips = [];
      chips.push(time === "Jetzt im TV" ? '<span class="fl-chip fl-chip--default">Jetzt im TV</span>' :
        '<span class="fl-chip">' + time + '<button type="button" data-clear="time" aria-label="Remove filter ' + time + '">×</button></span>');
      chips.push('<span class="fl-chip fl-chip--default">Alle Sender</span>');
      if (!types.length) chips.push('<span class="fl-chip fl-chip--default">Alle Sendungsarten</span>');
      types.forEach(function (ty) { chips.push('<span class="fl-chip">' + ty + '<button type="button" data-clear="' + ty + '" aria-label="Remove filter ' + ty + '">×</button></span>'); });
      fl.querySelector(".fl-chips__list").innerHTML = chips.join("");
      fl.querySelectorAll("[data-clear]").forEach(function (b) {
        b.addEventListener("click", function () {
          var k = b.getAttribute("data-clear");
          if (k === "time") { fl.querySelector('input[value="Jetzt im TV"]').checked = true; }
          else { fl.querySelector('input[type="checkbox"][value="' + k + '"]').checked = false; }
          flDraw();
          fl.querySelector('input[name="fl-time"]:checked').focus();
        });
      });
    };
    fl.querySelectorAll("input").forEach(function (i) { i.addEventListener("change", flDraw); });
    flDraw();
  }

  // yumm: "Jump to Best Price" appears once you're reading, and hides at the product
  var st = document.querySelector(".sticky-demo");
  if (st) {
    var sc = st.querySelector(".st-scroll"), jump = st.querySelector(".st-jump"), best = st.querySelector("#st-best");
    var stCheck = function () {
      var pTop = best.offsetTop - sc.offsetTop, pBottom = pTop + best.offsetHeight;
      var inView = pBottom > sc.scrollTop && pTop < sc.scrollTop + sc.clientHeight;
      jump.hidden = !(sc.scrollTop > 80 && !inView);
    };
    sc.addEventListener("scroll", stCheck, { passive: true });
    jump.addEventListener("click", function () {
      sc.scrollTop = best.offsetTop - sc.offsetTop - 12;
      best.focus({ preventScroll: true });
    });
    stCheck();
  }

  // yumm: product card sections open on demand
  document.querySelectorAll(".card-demo .pc-toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", open ? "true" : "false");
      document.getElementById(b.getAttribute("aria-controls")).hidden = !open;
    });
  });

  // Columna: block editor with a slash menu and autosave
  var ed = document.querySelector(".editor-demo");
  if (ed) {
    var edIn = ed.querySelector("#ed-input"), menu = ed.querySelector(".ed-menu"), blocks = ed.querySelector(".ed-blocks");
    var status = ed.querySelector(".ed-status"), saveT = null;
    var saved = function () {
      status.classList.add("is-saving"); status.querySelector("span").textContent = "Saving…";
      clearTimeout(saveT);
      saveT = setTimeout(function () { status.classList.remove("is-saving"); status.querySelector("span").textContent = "Draft saved"; }, 900);
    };
    var add = function (html, cls) {
      var el = document.createElement(cls === "ed-block--img" || cls === "ed-block--recipe" ? "div" : "p");
      el.className = "ed-block " + (cls || ""); el.innerHTML = html; blocks.appendChild(el); saved();
    };
    var esc = function (s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; };
    var closeMenu = function () { menu.hidden = true; };
    edIn.addEventListener("input", function () {
      if (edIn.value === "/") { menu.hidden = false; }
      else if (edIn.value.charAt(0) !== "/") { closeMenu(); }
    });
    edIn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && edIn.value.trim() && edIn.value.charAt(0) !== "/") { add(esc(edIn.value.trim())); edIn.value = ""; }
      if (e.key === "ArrowDown" && !menu.hidden) { e.preventDefault(); menu.querySelector("button").focus(); }
      if (e.key === "Escape") { closeMenu(); edIn.value = ""; }
    });
    menu.querySelectorAll("button").forEach(function (b, i, all) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-b");
        if (k === "heading") add("Zutaten für 4 Personen", "ed-block--h");
        if (k === "image") add("Image block", "ed-block--img");
        if (k === "recipe") add("<strong>Recipe card</strong>800 g Hokkaido · 1 Stück Ingwer · 400 ml Kokosmilch · 20 Min.", "ed-block--recipe");
        edIn.value = ""; closeMenu(); edIn.focus();
      });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); all[(i + 1) % all.length].focus(); }
        if (e.key === "ArrowUp") { e.preventDefault(); if (i === 0) edIn.focus(); else all[i - 1].focus(); }
        if (e.key === "Escape") { closeMenu(); edIn.value = ""; edIn.focus(); }
      });
    });
  }

  // Columna: schedule or publish, and the status changes
  var sch = document.querySelector(".schedule-demo");
  if (sch) {
    var pill = sch.querySelector(".sc-pill"), panel = sch.querySelector(".sc-panel"), acts = sch.querySelector(".sc-actions"), reset = sch.querySelector(".sc-reset");
    var setState = function (label, cls) {
      pill.textContent = label; pill.className = "sc-pill" + (cls ? " " + cls : "");
      var draft = !cls; acts.hidden = !draft; reset.hidden = draft; panel.hidden = true;
    };
    sch.querySelector('[data-a="schedule"]').addEventListener("click", function () { panel.hidden = !panel.hidden; if (!panel.hidden) panel.querySelector("select").focus(); });
    sch.querySelector('[data-a="publish"]').addEventListener("click", function () { setState("Published", "is-published"); reset.focus(); });
    sch.querySelector('[data-a="confirm"]').addEventListener("click", function () {
      setState("Scheduled · " + sch.querySelector(".sc-date").value + ", " + sch.querySelector(".sc-time").value, "is-scheduled"); reset.focus();
    });
    reset.addEventListener("click", function () { setState("Draft", ""); sch.querySelector('[data-a="schedule"]').focus(); });
  }

  // pflegePro: watching lessons moves the progress on the home screen
  var pg = document.querySelector(".progress-demo");
  if (pg) {
    var lessonsBtns = pg.querySelectorAll(".pg-lesson");
    var pgDraw = function () {
      var done = pg.querySelectorAll('.pg-lesson[aria-pressed="true"]').length, total = lessonsBtns.length;
      pg.querySelector(".pg-meta").textContent = done + " of " + total + " lessons watched";
      pg.querySelector(".pg-bar span").style.width = Math.round(done / total * 100) + "%";
    };
    lessonsBtns.forEach(function (b) {
      b.addEventListener("click", function () { b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true"); pgDraw(); });
    });
    pgDraw();
  }

  // pflegePro: filter exercises by need
  var exf = document.querySelector(".exfilter-demo");
  if (exf) {
    exf.querySelectorAll(".ex-chips button").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-f");
        exf.querySelectorAll(".ex-chips button").forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        exf.querySelectorAll(".ex-list li").forEach(function (li) { li.hidden = f !== "Alle" && li.getAttribute("data-cat") !== f; });
      });
    });
  }

  // Projects: a flight through the work (after vadimcarazan.com). The section pins under the nav,
  // a full screen tall, and scrolling moves the camera forward: each project's loading-screen
  // card comes toward the visitor from the distance, settles above the caption, then bursts past
  // and fades, with small outlined squares drifting by in between. The project in focus is named
  // in the middle of the view with a link to its case study; its result and description float on
  // the left. With reduced motion on (or no JavaScript), the projects are a plain list. Screen
  // readers get that list either way; the 3D view is hidden from them.
  var orbDeck = document.querySelector(".deck");
  var orbList = orbDeck && orbDeck.querySelector(".folders");
  if (orbList && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var orbProjects = Array.prototype.slice.call(orbList.querySelectorAll(".folder")).map(function (f) {
      return {
        href: f.querySelector(".folder__link").getAttribute("href"),
        num: f.querySelector(".folder__num").textContent,
        name: f.querySelector(".folder__name").textContent,
        meta: f.querySelector(".folder__meta").textContent,
        splash: f.querySelector(".folder__preview").getAttribute("src"),
        big: f.querySelector(".folder__big").textContent,
        small: f.querySelector(".folder__caption").textContent,
        desc: f.querySelector(".folder__desc").textContent
      };
    });
    var orbN = orbProjects.length;
    var ORB_D = 1500;  // depth between projects, in px
    var ORB_P = 900;   // the perspective in style.css (.orbit)
    var ORB_SLICES = 1; // each card is one flat panel
    orbDeck.classList.add("is-orbit");
    var orbHeading = document.getElementById("work-title");
    if (orbHeading) orbHeading.classList.add("visually-hidden"); // the opening view shows the name instead
    orbList.removeAttribute("data-reveal");
    orbList.querySelectorAll("a").forEach(function (a) { a.tabIndex = -1; }); // kept for screen readers; the link in the middle is the one to tab to

    var orbView = document.createElement("div");
    orbView.className = "orbit";
    var orbScene = document.createElement("div");
    orbScene.className = "orbit__scene";
    orbScene.setAttribute("aria-hidden", "true");
    var orbCenter = document.createElement("div");
    orbCenter.className = "orbit__center";
    orbCenter.innerHTML = '<span class="orbit__caption" aria-hidden="true"><span class="orbit__name"></span><span class="orbit__meta label"></span></span><a class="orbit__link label"></a>';
    orbView.appendChild(orbCenter);
    // the front project's result and one-line description, floating on the left
    var orbFacts = document.createElement("div");
    orbFacts.className = "orbit__facts";
    orbFacts.setAttribute("aria-hidden", "true"); // the list says the same
    orbFacts.innerHTML = '<div class="orbit__facts-inner is-out"><span class="orbit__big"></span><span class="orbit__small"></span><span class="orbit__desc"></span></div>';
    orbView.appendChild(orbFacts);
    var orbFactsInner = orbFacts.firstChild, orbFactsTimer = 0;
    orbView.appendChild(orbScene);
    orbDeck.appendChild(orbView);
    var orbLink = orbCenter.querySelector(".orbit__link");

    var orbCards = orbProjects.map(function (pr) {
      var card = document.createElement("a");
      card.className = "orbit__card";
      card.href = pr.href;
      card.tabIndex = -1;
      var slices = [];
      for (var k = 0; k < ORB_SLICES; k++) {
        var sl = document.createElement("span");
        sl.className = "orbit__slice" + (k === 0 ? " is-first" : "") + (k === ORB_SLICES - 1 ? " is-last" : "");
        // the card starts as an empty outlined box, like the small squares around it; the image fades in on top as it comes closer
        sl.innerHTML = '<span class="orbit__img" style="background-image:url(\'' + pr.splash + '\')"></span>';
        card.appendChild(sl);
        slices.push(sl);
      }
      orbScene.appendChild(card);
      return { el: card, slices: slices };
    });
    // small outlined squares scattered through the depth, the same on every visit
    var orbSeed = 7;
    var orbRand = function () { orbSeed = (orbSeed * 16807) % 2147483647; return (orbSeed - 1) / 2147483646; };
    // each card appears at its own spot away from the middle, and glides to the center as it comes closer
    orbCards.forEach(function (c, i) {
      var ang = (i * 2.4 + orbRand() * 0.8) % (Math.PI * 2); // spread around the middle, never twice in a row on the same side
      c.ox = Math.cos(ang) * (0.28 + orbRand() * 0.12);
      c.oy = Math.sin(ang) * (0.22 + orbRand() * 0.1);
    });
    var orbSpecks = [];
    for (var q = 0; q < 140; q++) {
      var sq = document.createElement("span");
      sq.className = "orbit__speck";
      sq.style.width = sq.style.height = (4 + Math.round(orbRand() * 12)) + "px";
      orbScene.appendChild(sq);
      orbSpecks.push({ el: sq, fx: (orbRand() - 0.5) * 1.6, fy: (orbRand() - 0.5) * 1.3, z: (orbRand() * (orbN + 1.5) - 1.5) * ORB_D });
    }

    var orbNavH = 72, orbSeg = 0, orbH = 0, orbW = 0, orbRestY = 0, orbCurrent = -2; // -1 is the opening view
    var orbSize = function () {
      orbNavH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
      orbSeg = Math.round(window.innerHeight * 0.8); // scrolling per project
      var W = orbDeck.clientWidth, phone = W < 810;
      orbH = window.innerHeight - orbNavH;
      orbDeck.style.height = orbH + (orbN + 0.9) * orbSeg + "px"; // extra scrolling for the opening and closing views
      var cw = phone ? Math.min(W * 0.72, 320) : Math.min(460, W * 0.4), ch = cw * 20 / 31;
      orbW = W;
      orbRestY = -orbH * (phone ? 0.27 : 0.25); // where a card settles: centered, above the caption
      orbView.style.perspectiveOrigin = "50% " + (orbH / 2 + orbRestY) + "px"; // cards come from straight behind that spot
      orbCards.forEach(function (c) {
        c.slices.forEach(function (sl) {
          sl.style.width = cw + "px";
          sl.style.height = ch + "px";
          sl.style.left = (-cw / 2) + "px";
          sl.style.top = (-ch / 2) + "px";
          sl.firstChild.style.backgroundSize = cw + "px " + ch + "px";
          sl.style.borderRadius = "14px";
        });
      });
    };
    var orbSetCaption = function (i) {
      if (i === orbCurrent) return;
      orbCurrent = i;
      // the opening view: the section's name in the middle, before any card has arrived
      orbCenter.classList.toggle("is-intro", i < 0);
      orbLink.hidden = i < 0;
      if (i < 0) {
        orbCenter.querySelector(".orbit__name").textContent = "Problems I've untangled.";
        orbCenter.querySelector(".orbit__meta").textContent = "";
        orbFactsInner.classList.add("is-out");
        return;
      }
      var pr = orbProjects[i];
      // the facts fade out, change, then fade back in
      orbFactsInner.classList.add("is-out");
      clearTimeout(orbFactsTimer);
      orbFactsTimer = setTimeout(function () {
        orbFactsInner.querySelector(".orbit__big").textContent = pr.big;
        orbFactsInner.querySelector(".orbit__small").textContent = pr.small;
        orbFactsInner.querySelector(".orbit__desc").textContent = pr.desc;
        orbFactsInner.classList.remove("is-out");
      }, 220);
      orbCenter.querySelector(".orbit__name").textContent = pr.name;
      orbCenter.querySelector(".orbit__meta").textContent = pr.meta;
      orbLink.href = pr.href;
      orbLink.innerHTML = 'Read case study &rarr;<span class="visually-hidden">: ' + pr.name + '</span>';
    };
    // When the scrolling stops, the cards drift gently, like feathers: a slow bob, sway and tilt,
    // each card on its own rhythm. The drift eases in after a stop and fades out while scrolling.
    var orbLastScroll = -1e9, orbAmp = 0, orbLastT = 0;
    var orbDraw = function (now) {
      now = now || performance.now();
      // a frame's time can be a little earlier than the last scroll's, so the step never goes below 0
      var dt = Math.max(0, Math.min(64, now - orbLastT)); orbLastT = Math.max(orbLastT, now);
      var want = now - orbLastScroll > 180 ? 1 : 0;
      orbAmp = Math.max(0, Math.min(1, orbAmp + (want - orbAmp) * Math.min(1, dt / (want ? 900 : 200))));
      var t = now / 1000;
      // in projects; it starts at -1.5 with no card in view, and the first card appears in the
      // distance only once the visitor scrolls on
      var p = (orbNavH - orbDeck.getBoundingClientRect().top) / orbSeg - 1.5;
      // after the last project it runs on a little: the last card bursts past and fades while
      // the caption and the facts drift up and fade, then the contact section scrolls in
      p = Math.max(-1.5, Math.min(orbN - 1 + 0.4, p));
      var out = Math.max(0, Math.min(1, (p - (orbN - 1) - 0.1) / 0.28)); // at the same time as the last card leaves
      out = out * out * (3 - 2 * out); // ease in and out
      orbCards.forEach(function (c, i) {
        var rel = i - p;
        var rz = -rel * ORB_D; // 0 = in focus; below 0 still ahead; above 0 flying past the visitor
        var op = 1;
        op *= Math.max(0, Math.min(1, (1.4 - rel) / 0.3));         // the next card shows in the distance as an outlined box
        op *= rz > 220 ? Math.max(0, 1 - (rz - 220) / 300) : 1;    // a card fades as it bursts past
        if (op <= 0.01) { c.el.style.visibility = "hidden"; return; }
        c.el.style.visibility = "";
        if (c.op !== op.toFixed(2)) { c.op = op.toFixed(2); c.slices.forEach(function (sl) { sl.style.opacity = c.op; }); }
        // the image fills the box only once the card before it has gone
        var fill = Math.max(0, Math.min(1, (0.75 - rel) / 0.35)).toFixed(2);
        if (c.fill !== fill) { c.fill = fill; c.slices.forEach(function (sl) { sl.firstChild.style.opacity = fill; }); }
        var a = orbAmp;
        var bob = Math.sin(t * 1.1 + i * 1.7) * 9 * a;          // up and down, in px
        var sway = Math.sin(t * 0.7 + i * 2.3) * 1.6 * a;       // turning left and right, in deg
        var tilt = Math.sin(t * 0.9 + i * 1.1) * 1.4 * a;       // in its own plane, in deg
        var rock = Math.sin(t * 0.8 + i * 2.9) * 1.6 * a;       // forward and back, in deg
        // fixed decimals: a tiny number written as 1e-7 isn't valid CSS and the browser would skip it
        var f = Math.max(0, Math.min(1, -rz / (1.4 * ORB_D))); f = f * f * (3 - 2 * f); // 1 when it appears, 0 in focus
        var x = c.ox * orbW * f, y = orbRestY + c.oy * orbH * f;
        c.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + (y + bob).toFixed(2) + "px," + rz.toFixed(1) + "px) rotateY(" + sway.toFixed(3) + "deg) rotateZ(" + tilt.toFixed(3) + "deg) rotateX(" + rock.toFixed(3) + "deg)";
      });
      var cam = p * ORB_D;
      orbSpecks.forEach(function (sp, k) {
        var rz = cam - sp.z;
        if (rz > 520 || rz < -3000) { sp.el.style.visibility = "hidden"; return; }
        sp.el.style.visibility = "";
        var op = rz > 220 ? 1 - (rz - 220) / 300 : rz < -2200 ? 1 - (-2200 - rz) / 800 : 1;
        sp.el.style.opacity = (Math.max(0, Math.min(1, op)) * (1 - out)).toFixed(3);
        sp.el.style.transform = "translate3d(" + (sp.fx * orbW).toFixed(1) + "px," + (orbRestY + sp.fy * orbH + Math.sin(t + k) * 4 * orbAmp).toFixed(1) + "px," + rz.toFixed(1) + "px)";
      });
      // the facts drift with the cards
      orbFacts.style.transform = "translateY(" + (Math.sin(t * 0.95 + 0.6) * 7 * orbAmp - out * 40).toFixed(2) + "px) rotate(" + (Math.sin(t * 0.7) * 0.6 * orbAmp).toFixed(3) + "deg)";
      orbFacts.style.opacity = (1 - out).toFixed(3);
      // the opening line fades out while the first card comes in, then the first project's name fades in
      var show = p < -0.5 ? 1 - Math.max(0, Math.min(1, (p + 0.95) / 0.45)) : Math.max(0, Math.min(1, (p + 0.5) / 0.35));
      orbCenter.style.opacity = (show * (1 - out)).toFixed(3);
      orbCenter.style.transform = "translateY(calc(-50% + " + (Math.sin(t * 0.85 + 2) * 5 * orbAmp - out * 40).toFixed(2) + "px))";
      orbCenter.style.visibility = out >= 1 || show <= 0 ? "hidden" : ""; // so a faded link can't be tabbed to or clicked
      orbSetCaption(p < -0.5 ? -1 : Math.floor(Math.max(0, Math.min(orbN - 1, p + 0.7)))); // switches as the next card appears
    };
    orbSize();
    orbDraw();
    window.addEventListener("scroll", function () { orbLastScroll = performance.now(); orbDraw(); }, { passive: true });
    // the drift needs a frame loop, but only while the section is on screen
    var orbOnScreen = false;
    var orbLoop = function (now) { if (!orbOnScreen) return; orbDraw(now); requestAnimationFrame(orbLoop); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var was = orbOnScreen;
        orbOnScreen = entries[0].isIntersecting;
        if (orbOnScreen && !was) requestAnimationFrame(orbLoop);
      }).observe(orbDeck);
    }
    window.addEventListener("resize", function () { orbSize(); orbDraw(); });
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
    var done = !rotator;
    var paused = false;

    // Typing: every letter is in the page from the start (so nothing reflows). Each frame works out
    // how far along the word the cursor is, as a fraction of letters (2.4 = two letters and 40% of
    // the third), so the cursor glides continuously while each letter fades in as it passes.
    // The whole word eases in and out, so the glide starts and ends softly.
    var TYPE_MS = 65, DELETE_MS = 32, HOLD_MS = 1800, GAP_MS = 350;
    var chars = [], boxes = [], pos = 0, phase = "hold", clock = 0, last = null, raf = null;
    var cursor = document.createElement("span");
    cursor.className = "rotator__cursor";
    var ease = function (t) { return 0.5 - Math.cos(Math.PI * t) / 2; }; // slow, faster, slow

    var build = function (text, visible) {
      word.textContent = "";
      chars = [];
      text.split(" ").forEach(function (part, i) {
        if (i > 0) { var gap = document.createElement("span"); gap.textContent = " "; word.appendChild(gap); chars.push(gap); }
        var group = document.createElement("span");
        group.className = "rotator__group"; // keeps each word on one line when the line wraps on phones
        part.split("").forEach(function (letter) {
          var c = document.createElement("span");
          c.className = "rotator__char";
          c.textContent = letter;
          group.appendChild(c);
          chars.push(c);
        });
        word.appendChild(group);
      });
      word.appendChild(cursor);
      measure();
      render(visible ? chars.length : 0);
    };

    // Each letter's left edge, right edge and line, measured once per word (and on resize)
    var measure = function () {
      boxes = chars.map(function (c) { return { l: c.offsetLeft, r: c.offsetLeft + c.offsetWidth, y: c.offsetTop }; });
    };
    var render = function (p) {
      pos = p;
      chars.forEach(function (c, i) { c.style.opacity = Math.max(0, Math.min(1, p - i)); });
      var i = Math.min(Math.floor(p), chars.length - 1), f = p - i, b = boxes[i];
      cursor.style.transform = "translate(" + (b.l + f * (b.r - b.l)) + "px," + b.y + "px)";
    };
    var setPhase = function (p) {
      phase = p;
      clock = 0;
      cursor.classList.toggle("is-blinking", p === "hold" || p === "gap");
    };

    var tick = function (now) {
      clock += last === null ? 0 : Math.min(now - last, 100); // a background tab doesn't skip ahead
      last = now;
      var n = chars.length;
      if (phase === "typing") {
        var t = Math.min(1, clock / (n * TYPE_MS));
        render(ease(t) * n);
        if (t === 1) setPhase("hold");
      } else if (phase === "hold" && clock >= HOLD_MS) {
        setPhase("deleting");
        if (toolsLine) toolsLine.classList.add("is-changing");
      } else if (phase === "deleting") {
        var d = Math.min(1, clock / (n * DELETE_MS));
        render((1 - ease(d)) * n);
        if (d === 1) setPhase("gap");
      } else if (phase === "gap" && clock >= GAP_MS) {
        index = (index + 1) % words.length; // loop back to the first skill
        build(words[index], false);
        if (toolsLine && tools[index]) {
          var list = toolsLine.querySelector(".rotator-tools__list");
          list.textContent = "";
          tools[index].split(", ").forEach(function (name) {
            var tag = document.createElement("span");
            tag.className = "tool-tag";
            tag.textContent = name;
            list.appendChild(tag);
          });
          toolsLine.classList.remove("is-changing");
        }
        setPhase("typing");
      }
      raf = requestAnimationFrame(tick);
    };

    if (rotator) {
      build(words[0], true);
      setPhase("hold");
      var remeasure = function () { measure(); render(pos); };
      window.addEventListener("resize", remeasure);
      if (document.fonts) document.fonts.ready.then(remeasure);
    }
    var startWords = function () { if (!done && !raf) { last = null; raf = requestAnimationFrame(tick); } };
    var stopWords = function () { cancelAnimationFrame(raf); raf = null; };
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
