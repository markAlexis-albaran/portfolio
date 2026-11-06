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


  // Prototypes. Each one is set up by a function, so a walkthrough at the end of a case study
  // can run its own copy. The copies are taken here, before any prototype starts, so every
  // walkthrough round begins from the same state as the page did.
  var DEMOS = {};
  var PRISTINE = {};
  if (document.querySelector(".walk")) {
    document.querySelectorAll(".try").forEach(function (t) {
      t.classList.forEach(function (c) { if (c !== "try" && !PRISTINE[c]) PRISTINE[c] = t.cloneNode(true); });
    });
  }
  var demo = function (key, init) {
    DEMOS[key] = init;
    var el = document.querySelector(".try." + key);
    if (el) init(el);
  };

  // Columna: token switcher. The card stays the same component; only its tokens change.
  demo("tokens-demo", function (tkDemo) {
    var brands = {
      kochzeit:   { color: "#B4441C", font: "Serif", rcard: "14", rbtn: "26", tag: "Rezept",   title: "Herbstsuppe in 20 Minuten",     btn: "Zum Rezept",  logo: "Kochzeit" },
      sternblick: { color: "#E0004F", font: "Sans, bold", rcard: "2", rbtn: "2", tag: "Exklusiv", title: "Das große Comeback des Jahres", btn: "Weiterlesen", logo: "Sternblick" },
      fernweg:    { color: "#1F6F6A", font: "Sans, regular", rcard: "24", rbtn: "26", tag: "Reisen", title: "Drei Tage an der Ostsee",    btn: "Zur Reise",   logo: "Fernweg" }
    };
    var card = tkDemo.querySelector(".tk-card");
    tkDemo.querySelectorAll('input[name^="tk-brand"]').forEach(function (r) {
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
  });

  // yumm: compare two grills. Ticking products fills the bar; at two, "Jetzt vergleichen" opens the table.
  demo("compare-demo", function (cmp) {
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
  });

  // tvguideplus: jetzt / 20:15 / 22:00 tabs switch the list
  demo("guide-demo", function (guide) {
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
  });

  // pflegePro: the heart saves the lesson, and Favoriten switches from its empty state
  demo("fav-demo", function (fav) {
    var heartBtn = fav.querySelector(".pf-heart");
    heartBtn.addEventListener("click", function () {
      var saved = heartBtn.getAttribute("aria-pressed") !== "true";
      heartBtn.setAttribute("aria-pressed", saved ? "true" : "false");
      fav.querySelector(".pf-empty").hidden = saved;
      fav.querySelector(".pf-saved").hidden = !saved;
      fav.querySelector("[role=status]").textContent = saved ? "Saved. It now appears in Favoriten." : "Removed. Favoriten is empty again.";
    });
  });

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

  demo("flow-write", initFlowWrite);
  demo("flow-plan", initFlowPlan);

  // tvguideplus: live search with labeled results
  demo("search-demo", function (sr) {
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
  });

  // tvguideplus: filter panel with removable chips
  demo("filter-demo", function (fl) {
    var flDraw = function () {
      var time = fl.querySelector('input[name^="fl-time"]:checked').value;
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
          fl.querySelector('input[name^="fl-time"]:checked').focus();
        });
      });
    };
    fl.querySelectorAll("input").forEach(function (i) { i.addEventListener("change", flDraw); });
    flDraw();
  });

  // yumm: "Jump to Best Price" appears once you're reading, and hides at the product
  demo("sticky-demo", function (st) {
    var sc = st.querySelector(".st-scroll"), jump = st.querySelector(".st-jump"), best = st.querySelector('[id^="st-best"]');
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
  });

  // yumm: product card sections open on demand
  demo("card-demo", function (cardDemo) {
    cardDemo.querySelectorAll(".pc-toggle").forEach(function (b) {
      b.addEventListener("click", function () {
        var open = b.getAttribute("aria-expanded") !== "true";
        b.setAttribute("aria-expanded", open ? "true" : "false");
        cardDemo.querySelector('[id="' + b.getAttribute("aria-controls") + '"]').hidden = !open;
      });
    });
  });

  // Columna: block editor with a slash menu and autosave
  demo("editor-demo", function (ed) {
    var edIn = ed.querySelector('[id^="ed-input"]'), menu = ed.querySelector(".ed-menu"), blocks = ed.querySelector(".ed-blocks");
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
  });

  // Columna: schedule or publish, and the status changes
  demo("schedule-demo", function (sch) {
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
  });

  // pflegePro: watching lessons moves the progress on the home screen
  demo("progress-demo", function (pg) {
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
  });

  // pflegePro: filter exercises by need
  demo("exfilter-demo", function (exf) {
    exf.querySelectorAll(".ex-chips button").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-f");
        exf.querySelectorAll(".ex-chips button").forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        exf.querySelectorAll(".ex-list li").forEach(function (li) { li.hidden = f !== "Alle" && li.getAttribute("data-cat") !== f; });
      });
    });
  });

  // Walkthrough at the end of a case study: a pointer taps through the project's prototypes on its
  // own, from beginning to end. It drives real copies of the prototypes above, so every screen is
  // the prototype's own; a page can add static screens of its own inside the stage (data-scene).
  // Visitors can pause it, it waits while off screen, and with reduced motion it only starts when asked.
  // Each case study's script is in WALKS below, under the walk's data-walk name.
  var WALKS = {
    springin: {
      scroller: ".wish-demo__phone", // the phone's screen scrolls; the frame stays put
      scenes: ["flow-write", "flow-plan"],
      run: function (w) {
        var moment = function (value) {
          var r = w.scene("flow-plan").querySelector('input[value="' + value + '"]');
          r.checked = true;
          r.dispatchEvent(new Event("change", { bubbles: true }));
          w.scene("flow-plan").querySelector(".wish-demo__phone").scrollTop = 0;
        };
        return w.seq([
          function () { w.show("home"); w.step(0); return w.hold(1800); },
          function () { return w.tap("home", ".hm-open"); },
          function () { w.show("flow-write"); w.step(1); return w.hold(1000); },
          function () { return w.tap("flow-write", '.sp-days [data-day="12"]'); },
          function () { return w.tap("flow-write", '[data-t="off"]'); },
          function () { return w.tap("flow-write", ".wd-add"); },
          function () { return w.tap("flow-write", ".wd-add"); },
          function () { return w.hold(900); }, // the limit note
          function () { return w.tap("flow-write", ".wd-remove", 1); },
          function () { return w.tap("flow-write", ".fw-save"); },
          function () { return w.hold(1400); }, // the calendar, now with four wishes
          function () { w.step(2); return w.tap("flow-write", ".sp-sum"); }, // the summary card opens the list
          function () { w.show("flow-plan"); return w.hold(1400); },
          function () { return w.tap("flow-plan", ".sp-rv__withdraw", 3); },
          function () { return w.hold(700); },
          function () { return w.tap("flow-plan", ".sp-toast__undo"); },
          function () { return w.tap("flow-plan", ".sp-handin"); },
          function () { moment("closed"); w.step(3); return w.hold(2800); },
          function () { moment("out"); w.step(4); return w.hold(1800); },
          function () { return w.scrollTo("flow-plan", ".wish-demo__phone", "end", 3200); }
        ]);
      }
    },
    tvguideplus: {
      // One flow from Home (rebuilt from my Home design, with the menu) through search, the TV
      // guide and its filter
      scenes: ["search-demo", "guide-demo"],
      compose: function (copy) {
        var fl = copy("filter-demo");
        var close = document.createElement("button");
        close.type = "button";
        close.className = "wk-fl-close";
        close.textContent = "×";
        fl.querySelector(".fl-top").appendChild(close);
        DEMOS["filter-demo"](fl);
        return { "filter-demo": fl };
      },
      run: function (w) {
        var home = w.scene("home");
        return w.seq([
          function () { home.querySelector(".tgh-menu-panel").hidden = true; w.show("home"); w.step(0); return w.hold(2200); },
          function () { w.step(1); return w.tap("home", ".tgh-search"); },
          function () { w.show("search-demo"); return w.hold(700); },
          function () { return w.tap("search-demo", "input"); },
          function () { return w.type("search-demo", "input", "bar"); },
          function () { return w.hold(2600); }, // results, each labeled Sendung, VOD or News
          function () { w.step(2); return w.tap("search-demo", ".tg-logo"); }, // the logo goes back to Home
          function () { w.show("home"); return w.hold(800); },
          function () { return w.tap("home", ".tgh-menu"); },
          function () { home.querySelector(".tgh-menu-panel").hidden = false; return w.hold(900); },
          function () { return w.tap("home", ".tgh-menu-item"); },
          function () { w.show("guide-demo"); return w.hold(1300); },
          function () { return w.tap("guide-demo", '[data-slot="2015"]'); },
          function () { return w.hold(1400); },
          function () { w.step(3); return w.tap("guide-demo", ".tg-filter"); },
          function () { w.show("filter-demo"); return w.hold(1000); },
          function () { return w.tap("filter-demo", 'input[value="Heute um 20:15"]'); },
          function () { return w.tap("filter-demo", 'input[value="Spielfilme"]'); },
          function () { return w.hold(800); },
          function () { return w.tap("filter-demo", ".wk-fl-close"); },
          function () { // back in the guide: only the 20:15 films
            w.scene("guide-demo").querySelectorAll(".tg-list li").forEach(function (li) {
              li.hidden = li.querySelector(".tg-genre").textContent.indexOf("Spielfilm") !== 0;
            });
            w.show("guide-demo");
            return w.hold(2800);
          }
        ]);
      }
    },
    columna: {
      // Writing and scheduling in one CMS window (the same article), then the article's card as a
      // preview, where the brand swaps
      scenes: [],
      compose: function (copy) {
        var ed = copy("editor-demo"), sch = copy("schedule-demo"), tk = copy("tokens-demo");
        ed.querySelector(".ed-bar").appendChild(sch.querySelector(".sc-pill"));
        var body = sch.querySelector(".sc-body");
        var prev = document.createElement("button");
        prev.type = "button";
        prev.className = "sc-btn sc-btn--ghost wk-preview";
        prev.textContent = "Preview";
        prev.hidden = true;
        body.appendChild(prev);
        ed.querySelector(".ed-window").appendChild(body);
        DEMOS["editor-demo"](ed);
        DEMOS["schedule-demo"](ed);
        // The preview opens in the same kind of window as the editor
        var win = document.createElement("div");
        win.className = "ed-window wk-win";
        win.innerHTML = '<div class="ed-bar"><span class="ed-dots" aria-hidden="true"><i></i><i></i><i></i></span><strong>Columna</strong><span class="ed-crumb">Preview · Herbstsuppe in 20 Minuten</span></div><div class="wk-win__body"></div>';
        var winBody = win.querySelector(".wk-win__body");
        while (tk.firstChild) winBody.appendChild(tk.firstChild);
        tk.appendChild(win);
        DEMOS["tokens-demo"](tk);
        return { "editor-demo": ed, "tokens-demo": tk };
      },
      run: function (w) {
        return w.seq([
          function () { w.show("editor-demo"); w.step(0); return w.hold(1400); },
          function () { return w.tap("editor-demo", "input"); },
          function () { return w.type("editor-demo", "input", "Fertig in 20 Minuten."); },
          function () { return w.key("editor-demo", "input", "Enter"); },
          function () { return w.hold(1300); }, // Saving…, then Draft saved
          function () { return w.type("editor-demo", "input", "/"); },
          function () { return w.hold(600); },
          function () { return w.tap("editor-demo", '[data-b="recipe"]'); },
          function () { return w.hold(1600); },
          function () { w.step(1); return w.tap("editor-demo", '[data-a="schedule"]'); },
          function () { return w.hold(700); },
          function () { return w.tap("editor-demo", '[data-a="confirm"]'); },
          function () { w.scene("editor-demo").querySelector(".wk-preview").hidden = false; return w.hold(1800); },
          function () { w.step(2); return w.tap("editor-demo", ".wk-preview"); },
          function () { w.show("tokens-demo"); return w.hold(1600); },
          function () { return w.tap("tokens-demo", 'input[value="sternblick"]'); },
          function () { return w.hold(1800); },
          function () { return w.tap("tokens-demo", 'input[value="fernweg"]'); },
          function () { return w.hold(2400); }
        ]);
      }
    },
    yumm: {
      // One article page: the comparison at the top, the article, and the Best Overall card further
      // down, with the Jump to Best Price button over it all
      scroller: ".st-scroll",
      scenes: [],
      compose: function (copy) {
        var page = copy("sticky-demo"), cmp = copy("compare-demo"), card = copy("card-demo");
        var sc = page.querySelector(".st-scroll"), first = sc.firstChild;
        ["cd-h", "cd-products", "cd-table", "cd-bar"].forEach(function (c) { sc.insertBefore(cmp.querySelector("." + c), first); });
        var status = cmp.querySelector("[role=status]");
        if (status) page.querySelector(".st-phone").appendChild(status);
        var best = page.querySelector('[id^="st-best"]'), pc = card.querySelector(".pc-card");
        pc.id = best.id;
        pc.tabIndex = -1;
        pc.classList.add("wk-best");
        best.replaceWith(pc);
        DEMOS["sticky-demo"](page);
        DEMOS["compare-demo"](page);
        DEMOS["card-demo"](page);
        return { article: page };
      },
      run: function (w) {
        return w.seq([
          function () { w.show("article"); w.step(0); return w.hold(1400); },
          function () { return w.tap("article", ".cd-check input", 0); },
          function () { return w.tap("article", ".cd-check input", 1); },
          function () { return w.hold(500); },
          function () { return w.tap("article", ".cd-go"); },
          function () { return w.hold(2600); }, // both grills side by side
          function () { // reading on: the button appears once the article starts
            w.step(1);
            var sc = w.scene("article").querySelector(".st-scroll");
            return w.scrollTo("article", ".st-scroll", sc.querySelector(".st-h").offsetTop - sc.offsetTop - 60, 2400);
          },
          function () { return w.hold(600); },
          function () { return w.tap("article", ".st-jump"); },
          function () { return w.hold(1800); },
          function () { w.step(2); return w.tap("article", ".pc-toggle", 0); },
          function () { return w.hold(1200); },
          function () { return w.tap("article", ".pc-toggle", 1); },
          function () { return w.hold(2400); }
        ]);
      }
    },
    pflegepro: {
      // One phone, built in the page from the prototypes' screens (plus a placeholder video player):
      // Home, the program, a lesson, the player and Favoriten. The script moves between them.
      scenes: [],
      run: function (w) {
        var app = w.scene("app");
        var $ = function (sel) { return app.querySelector(sel); };
        var screen = function (name) {
          app.querySelectorAll(".wk-screen").forEach(function (el) { el.hidden = el.getAttribute("data-screen") !== name; });
        };
        var lesson = function (title, meta) {
          $(".wk-les-title").textContent = title;
          $(".wk-les-meta").textContent = meta;
          var art = $('[data-screen="lesson"] .pf-img use'); // each lesson has its own illustration
          if (art) art.setAttribute("href", title === "Ausführung" ? "#ill-lift" : "#ill-basics");
          $('[data-screen="lesson"] .pf-heart').setAttribute("aria-pressed", "false");
        };
        var bar = function (pct, ms) {
          var b = $(".hm2-bar span");
          b.style.transition = ms ? "width " + ms + "ms cubic-bezier(0.12, 0.23, 0.5, 1)" : "none";
          b.style.width = pct + "%";
        };
        var reset = function () {
          bar(0);
          $(".hm2-meta").textContent = "0 of 5 lessons watched";
          app.querySelectorAll(".pg-lesson").forEach(function (l) { l.setAttribute("aria-pressed", "false"); });
          $(".pf-empty").hidden = false;
          $(".pf-saved").hidden = true;
          $(".wk-pl__bar span").style.transition = "none";
          $(".wk-pl__bar span").style.width = "0";
          $(".wk-pl__now").textContent = "0:00";
        };
        // The placeholder video plays to the end: the line fills and the clock runs (sped up)
        var play = function () {
          var line = $(".wk-pl__bar span");
          void line.offsetWidth;
          line.style.transition = "width 3600ms linear";
          line.style.width = "100%";
          var t = 0;
          var tick = function () {
            t += 6;
            $(".wk-pl__now").textContent = "0:" + (t < 10 ? "0" : "") + (t === 60 ? "00" : t);
            if (t === 60) { $(".wk-pl__now").textContent = "1:00"; return w.hold(500); }
            return w.hold(360).then(tick);
          };
          return w.hold(360).then(tick);
        };
        return w.seq([
          function () { reset(); screen("home"); w.step(0); return w.hold(1600); },
          function () { return w.tap("app", '[data-screen="home"] .hm2-prog'); },
          function () { screen("program"); w.step(1); return w.hold(1000); },
          function () { return w.tap("app", ".pg-lesson", 0); },
          function () { lesson("Grundwissen", "Beine Lagern · ▶ 1 min"); screen("lesson"); return w.hold(1000); },
          function () { return w.tap("app", '[data-screen="lesson"] .pf-play'); },
          function () { screen("player"); return w.hold(500); },
          play,
          function () { // back on Home, the bar fills
            app.querySelectorAll(".pg-lesson")[0].setAttribute("aria-pressed", "true");
            screen("home");
            w.step(2);
            return w.hold(700);
          },
          function () {
            bar(20, 1200);
            $(".hm2-meta").textContent = "1 of 5 lessons watched";
            return w.hold(2200);
          },
          function () { w.step(3); return w.tap("app", '[data-screen="home"] .hm2-prog'); },
          function () { screen("program"); return w.hold(900); },
          function () { return w.tap("app", ".pg-lesson", 1); },
          function () { lesson("Ausführung", "Beine Lagern · ▶ 40 sec"); screen("lesson"); return w.hold(1000); },
          function () { return w.tap("app", '[data-screen="lesson"] .pf-heart'); },
          function () { $('[data-screen="lesson"] .pf-heart').setAttribute("aria-pressed", "true"); return w.hold(1200); },
          function () { w.step(4); return w.tap("app", '[data-screen="lesson"] .pf-tabbar span'); }, // Home
          function () { screen("home"); return w.hold(800); },
          function () { return w.tap("app", '[data-screen="home"] .hm2-tiles span', 1); }, // the Favoriten tile
          function () { screen("favoriten"); return w.hold(1300); },
          function () { $(".pf-empty").hidden = true; $(".pf-saved").hidden = false; return w.hold(2800); }
        ]);
      }
    }
  };

  document.querySelectorAll(".walk").forEach(function (walkEl) {
    var cfg = WALKS[walkEl.getAttribute("data-walk")];
    if (!cfg) return;
    var stage = walkEl.querySelector(".walk__stage");
    var pointer = walkEl.querySelector(".walk__pointer");
    var toggle = walkEl.querySelector(".walk__toggle");
    var stepList = walkEl.querySelector(".walk__steps");
    var stepEls = walkEl.querySelectorAll(".walk__steps li");
    var paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var off = true, started = false, scenes = {};
    stage.querySelectorAll("[data-scene]").forEach(function (el) { scenes[el.getAttribute("data-scene")] = el; });

    // How the round is running. "normal": as visitors see it. "fast": skipping ahead to a step the
    // visitor clicked, with no waiting. "tally": an instant dry run that adds up every wait, so the
    // walkthrough knows how long each step takes.
    var mode = "normal", target = 0, runId = 0, CANCEL = {};
    var cur = 0, inStep = 0, stepMs = [], stepStart = [], total = 0;
    var TAP_MS = 1390; // a tap's own waits: appear, press, click, let go

    // Waits that stand still while paused or off screen, and end at once when the round is restarted
    var hold = function (ms) {
      var id = runId;
      if (mode === "tally") { stepMs[cur] = (stepMs[cur] || 0) + ms; return Promise.resolve(); }
      if (mode === "fast") return id === runId ? Promise.resolve() : Promise.reject(CANCEL);
      return new Promise(function (done, fail) {
        var left = ms, t0 = performance.now();
        (function loop() {
          if (id !== runId) return fail(CANCEL);
          var now = performance.now();
          if (!paused && !off) { left -= now - t0; inStep += now - t0; }
          t0 = now;
          progress();
          if (left <= 0) done(); else setTimeout(loop, 40);
        })();
      });
    };

    // Progress: the line between the numbers fills blue as the round moves on, numbers already
    // passed turn blue, and the timer shows time played out of the whole round
    var fill = document.createElement("span");
    fill.className = "walk__fill";
    fill.setAttribute("aria-hidden", "true");
    stepList.appendChild(fill);
    var clock = document.createElement("span");
    clock.className = "walk__time label";
    clock.setAttribute("aria-hidden", "true");
    toggle.parentNode.insertBefore(clock, toggle);
    // The same progress and time at the bottom of the board, so they stay in view while the
    // visitor watches the phone
    var bar = document.createElement("div");
    bar.className = "walk__bar";
    bar.innerHTML = '<span class="walk__track"><span class="walk__track-fill"></span></span><span class="walk__bar-time"></span>';
    stage.appendChild(bar);
    var barFill = bar.querySelector(".walk__track-fill"), barTime = bar.querySelector(".walk__bar-time");
    var fmt = function (ms) { var t = Math.round(ms / 1000); return Math.floor(t / 60) + ":" + (t % 60 < 10 ? "0" : "") + (t % 60); };
    var progress = function () {
      if (!total) return;
      var n = stepEls.length, f = stepMs[cur] ? Math.min(1, inStep / stepMs[cur]) : 0;
      var frac = cur >= n - 1 ? 1 : (cur + f) / (n - 1);
      fill.style.width = "calc((100% - 40px) * " + frac.toFixed(4) + ")";
      var played = Math.min(total, stepStart[cur] + inStep);
      clock.textContent = fmt(played) + " / " + fmt(total);
      barTime.textContent = clock.textContent;
      barFill.style.width = (100 * played / total).toFixed(2) + "%";
    };

    // A fresh copy of a prototype: no panel, title, caption or notes, and its own ids and radio
    // names, so it never steers the prototype above it
    var copy = function (key) {
      var el = PRISTINE[key].cloneNode(true);
      el.querySelectorAll(".try__head, .try__caption, .callouts").forEach(function (x) { x.remove(); });
      el.querySelectorAll(".try__body").forEach(function (b) { while (b.firstChild) b.parentNode.insertBefore(b.firstChild, b); b.remove(); });
      el.querySelectorAll("[id]").forEach(function (x) { x.id += "-walk"; });
      ["for", "aria-controls", "aria-labelledby", "aria-describedby"].forEach(function (a) {
        el.querySelectorAll("[" + a + "]").forEach(function (x) {
          x.setAttribute(a, x.getAttribute(a).split(" ").map(function (v) { return v + "-walk"; }).join(" "));
        });
      });
      el.querySelectorAll("input[name]").forEach(function (r) { r.name += "-walk"; });
      el.classList.remove("try");
      el.classList.add("walk__scene");
      el.setAttribute("data-copy", key);
      return el;
    };
    var made = [];
    var build = function () {
      if (cfg.compose) {
        // A walkthrough that merges prototypes: compose returns the screens it built and started
        made.forEach(function (k) { scenes[k].remove(); delete scenes[k]; });
        var built = cfg.compose(copy);
        made = Object.keys(built);
        made.forEach(function (k) {
          scenes[k] = built[k];
          scenes[k].classList.add("walk__scene");
          stage.insertBefore(scenes[k], pointer);
        });
      }
      cfg.scenes.forEach(function (key) {
        if (scenes[key]) scenes[key].remove();
        scenes[key] = copy(key);
        stage.insertBefore(scenes[key], pointer);
        DEMOS[key](scenes[key]);
      });
      fit();
      if (typeof fitPhones === "function") fitPhones(); // new copies of the screens get the same size
    };
    // The stage is as tall as its tallest screen, so the page doesn't jump between screens
    var fit = function () {
      var current = Object.keys(scenes).filter(function (k) { return !scenes[k].hidden; })[0];
      var tallest = 0;
      stage.style.minHeight = "";
      Object.keys(scenes).forEach(function (k) {
        Object.keys(scenes).forEach(function (j) { scenes[j].hidden = j !== k; });
        tallest = Math.max(tallest, scenes[k].offsetHeight);
      });
      Object.keys(scenes).forEach(function (j) { scenes[j].hidden = j !== current; });
      stage.style.minHeight = tallest + "px";
    };
    var api = {
      hold: hold,
      seq: function (fns) { return fns.reduce(function (p, f) { return p.then(f); }, Promise.resolve()); },
      scene: function (name) { return scenes[name]; },
      show: function (name) {
        Object.keys(scenes).forEach(function (k) { scenes[k].hidden = k !== name; });
        if (cfg.scroller) { var sc = scenes[name].querySelector(cfg.scroller); if (sc) sc.scrollTop = 0; }
      },
      step: function (n) {
        cur = n;
        inStep = 0;
        if (mode === "fast" && n >= target) mode = "normal"; // arrived: play on as usual from here
        if (mode === "tally") return;
        stepEls.forEach(function (li, i) {
          li.classList.toggle("is-current", i === n);
          li.classList.toggle("is-done", i < n);
          var b = li.querySelector(".walk__n");
          if (i === n) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
        });
        // On a HiFi board, the top-right label names the step on screen
        var label = walkEl.querySelector(".walk__label--r");
        if (label) label.textContent = stepEls[n].querySelector(".walk__name").textContent;
        progress();
      },
      // The pointer appears on the element (a checkbox or radio: on its label), presses in while two
      // rings pulse out, and the element is clicked at the deepest point of the press
      tap: function (name, sel, i) {
        var el = scenes[name].querySelectorAll(sel)[i || 0];
        if (mode !== "normal") {
          el.dispatchEvent(new MouseEvent("click", { bubbles: true })); // no pointer while skipping or measuring
          return hold(TAP_MS);
        }
        var aim = el.matches("input[type=checkbox], input[type=radio]") ? (el.closest("label") || el) : el;
        var sr = stage.getBoundingClientRect(), r = aim.getBoundingClientRect(), shift = 0;
        var sc = cfg.scroller ? el.closest(cfg.scroller) : null;
        if (sc) {
          var pr = sc.getBoundingClientRect();
          if (r.bottom > pr.bottom - 24 || r.top < pr.top + 24) {
            var to = Math.max(0, Math.min(sc.scrollHeight - sc.clientHeight, sc.scrollTop + r.top - pr.top - pr.height / 2));
            shift = to - sc.scrollTop;
            sc.scrollTo({ top: to, behavior: "smooth" });
          }
        }
        pointer.classList.remove("is-on");
        pointer.style.left = (r.left - sr.left + r.width / 2) + "px"; // left/top, so the press never shifts it
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
          el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          return hold(700);
        }).then(function () {
          pointer.classList.remove("is-tapping");
          pointer.classList.remove("is-on");
        });
      },
      // Typing, one letter at a time
      type: function (name, sel, text) {
        var input = scenes[name].querySelector(sel);
        return text.split("").reduce(function (p, ch) {
          return p.then(function () {
            input.value += ch;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            return hold(110);
          });
        }, Promise.resolve());
      },
      key: function (name, sel, key) {
        scenes[name].querySelector(sel).dispatchEvent(new KeyboardEvent("keydown", { key: key, bubbles: true }));
        return hold(300);
      },
      // Scroll a screen to a position ("end" for the bottom), smoothly, over ms
      scrollTo: function (name, sel, top, ms) {
        var sc = scenes[name].querySelector(sel);
        var to = top === "end" ? sc.scrollHeight : top;
        if (mode === "normal") sc.scrollTo({ top: to, behavior: "smooth" }); else sc.scrollTop = to;
        return hold(ms);
      }
    };

    // Start a round, from the beginning or from a step: rebuild the screens, then skip ahead
    // instantly to that step and play on from there. Starting again cancels the round before.
    var start = function (k) {
      runId++;
      var id = runId;
      target = k || 0;
      mode = target > 0 ? "fast" : "normal";
      pointer.classList.remove("is-on", "is-tapping");
      build();
      cfg.run(api).then(function () {
        if (id === runId) start(0); // round again
      }, function (e) { if (e !== CANCEL) throw e; });
    };

    var setPaused = function (p) {
      paused = p;
      walkEl.classList.toggle("is-paused", p);
      toggle.textContent = p ? "Play walkthrough" : "Pause walkthrough";
      toggle.setAttribute("aria-pressed", p ? "true" : "false");
    };
    setPaused(paused);
    toggle.addEventListener("click", function () { setPaused(!paused); });

    // Every number goes to its step
    stepEls.forEach(function (li, i) {
      var n = li.querySelector(".walk__n");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "walk__n";
      b.textContent = n.textContent;
      b.setAttribute("aria-label", "Go to step " + n.textContent + ": " + li.querySelector(".walk__name").textContent);
      n.replaceWith(b);
      b.addEventListener("click", function () { started = true; start(i); });
    });

    // The dry run that measures each step, then the stage set for the first round
    mode = "tally";
    build();
    cfg.run(api).then(function () {
      stepStart = [];
      total = 0;
      stepEls.forEach(function (li, i) { stepStart[i] = total; total += stepMs[i] || 0; });
      mode = "normal";
      cur = 0;
      inStep = 0;
      build();
      api.show(cfg.first || Object.keys(scenes)[0]);
      api.step(0);
      new IntersectionObserver(function (entries) {
        off = !entries[0].isIntersecting;
        if (!off && !started) { started = true; start(0); }
      }, { threshold: 0.35 }).observe(stage);
    });
    window.addEventListener("resize", fit);
    if (document.fonts) document.fonts.ready.then(fit);
  });

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
        meta: f.querySelector(".folder__meta").innerHTML,
        read: (f.querySelector(".read-time") || {}).outerHTML || "",
        metaText: f.querySelector(".folder__meta").textContent,
        splash: f.querySelector(".folder__preview").getAttribute("src"),
        big: f.querySelector(".folder__big").textContent,
        small: f.querySelector(".folder__caption").textContent,
        desc: f.querySelector(".folder__desc").textContent,
        problem: f.querySelector(".folder__problem").lastChild.textContent.trim(), // what the project set out to solve
        brand: f.style.getPropertyValue("--brand-dark").trim() // the project's own color, dark enough for white text
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
    orbCenter.innerHTML = '<span class="orbit__caption" aria-hidden="true"><span class="orbit__name"></span><span class="orbit__line"></span><span class="orbit__meta label"></span></span><a class="orbit__link label"></a>';
    orbView.appendChild(orbCenter);
    // the overview's way on: a Contact link where the opening line was, pointing down
    var orbContact = document.createElement("a");
    orbContact.className = "orbit__contact label";
    orbContact.href = "#contact";
    orbContact.innerHTML = 'Get in touch with me <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    orbView.appendChild(orbContact);
    // the front project's result and one-line description, floating on the left
    var orbFacts = document.createElement("div");
    orbFacts.className = "orbit__facts";
    orbFacts.setAttribute("aria-hidden", "true"); // the list says the same
    orbFacts.innerHTML = '<div class="orbit__facts-inner is-out"><span class="orbit__facts-label label">Problem</span><span class="orbit__problem"></span><span class="orbit__facts-label label">Result</span><span class="orbit__big"></span><span class="orbit__small"></span></div>';
    // the problem and result: in their own column on the right on desktop, and in the one column
    // under the name on phones (placed in orbSize)
    orbView.appendChild(orbFacts);
    var orbFactsInner = orbFacts.firstChild, orbFactsTimer = 0;
    orbView.appendChild(orbScene);
    orbDeck.appendChild(orbView);
    var orbLink = orbCenter.querySelector(".orbit__link");
    // An open project fills the screen under the site's top bar, in the page color, with no box:
    // "← All projects" top-left, a large cover, and everything about the project beside it (under
    // it on phones). It sits in the page itself, outside the flight, so it can span the full width.
    var orbPanel = document.createElement("div");
    orbPanel.className = "orbit__panel";
    orbPanel.setAttribute("role", "dialog");
    orbPanel.setAttribute("aria-modal", "true");
    orbPanel.innerHTML = '<div class="container orbit__panel-inner">' +
      '<button type="button" class="orbit__close label"><span aria-hidden="true">&larr;</span> All projects</button>' +
      '<div class="orbit__panel-grid"><a class="orbit__panel-cover" tabindex="-1" aria-hidden="true"></a>' +
      '<div class="orbit__panel-body"><p class="orbit__panel-name"></p><p class="orbit__panel-desc"></p><p class="orbit__panel-meta label"></p>' +
      '<p class="orbit__panel-label label">Problem</p><p class="orbit__panel-problem"></p><p class="orbit__panel-label orbit__panel-label--result label">Result</p><p class="orbit__panel-big"></p><p class="orbit__panel-small"></p>' +
      '<div class="orbit__panel-cta"><a class="orbit__link orbit__panel-link label"></a><span class="orbit__panel-read"></span></div></div></div></div>';
    document.body.appendChild(orbPanel);
    var orbClose = orbPanel.querySelector(".orbit__close");

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
    // The overview at the end (desktop): every project at once, scattered around the opening line,
    // after the owner's reference. x and y are fractions of the view from its center, w the card
    // width as a fraction of the view width. The first project gets the largest spot.
    var ORB_SLOTS = [
      { x: -0.110, y: -0.120, w: 0.219 },
      { x: 0.319, y: -0.170, w: 0.171 },
      { x: 0.116, y: -0.354, w: 0.128 },
      { x: -0.389, y: -0.092, w: 0.124 },
      { x: -0.295, y: -0.355, w: 0.085 }
    ];
    // On phones the overview scatters small square covers down the screen, like the desktop
    // layout: each at its own spot and size, never overlapping, with even space around them (the
    // logo sits in the middle of each cover, so the square crop keeps all of it). x, y and w are in
    // units of the view's width, from the middle; the Get in touch pill sits under them (ORB_PILL),
    // and the whole block is scaled down if the screen is short.
    var ORB_SLOTS_PHONE = [
      { x: -0.18, y: -0.72, w: 0.30 },
      { x: 0.25, y: -0.50, w: 0.26 },
      { x: -0.27, y: -0.20, w: 0.25 },
      { x: 0.20, y: 0.02, w: 0.24 },
      { x: -0.08, y: 0.36, w: 0.27 }
    ];
    var ORB_PILL = 0.72, ORB_TOP = -0.87, ORB_BOTTOM = 0.78;
    var orbSlotPx = []; // each cover's resting spot in px, from the view's middle: x, y and width
    var ORB_OV = 1.0, ORB_HOLD = 0.8; // scrolling into the overview, then holding it, in projects
    var orbLastOpen = -1, orbG = 0, orbActive = -1, orbOvOn = false, orbOvState = false;
    var orbSpecks = [];
    for (var q = 0; q < 140; q++) {
      var sq = document.createElement("span");
      sq.className = "orbit__speck";
      sq.setAttribute("aria-hidden", "true");
      sq.style.width = sq.style.height = (4 + Math.round(orbRand() * 12)) + "px";
      orbScene.appendChild(sq);
      orbSpecks.push({ el: sq, fx: (orbRand() - 0.5) * 1.6, fy: (orbRand() - 0.5) * 1.3, z: (orbRand() * (orbN + 1.5) - 1.5) * ORB_D });
    }

    var orbPhone = false, orbCH = 194, orbCW = 300, orbNavH = 72, orbSeg = 0, orbH = 0, orbW = 0, orbRestY = 0, orbCurrent = -2; // -1 is the opening view
    var orbSize = function () {
      orbNavH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
      orbSeg = Math.round(window.innerHeight * 0.8); // scrolling per project
      var W = orbDeck.clientWidth, phone = W < 810;
      orbH = window.innerHeight - orbNavH;
      orbOvOn = true;
      orbView.classList.toggle("is-phone", phone);
      if (phone && orbFacts.parentNode !== orbCenter) orbCenter.insertBefore(orbFacts, orbCenter.querySelector(".orbit__link"));
      if (!phone && orbFacts.parentNode !== orbView) orbView.appendChild(orbFacts);
      // extra scrolling for the opening view and for the overview at the end
      orbDeck.style.height = orbH + (orbN + 0.5 + (orbOvOn ? ORB_OV + ORB_HOLD : 0)) * orbSeg + "px";
      var cw = phone ? Math.min(W * 0.6, 280) : Math.min(460, W * 0.4), ch = cw * 20 / 31; // smaller on phones, to leave room for the text under it
      orbCW = cw;
      orbCH = ch;
      orbCards.forEach(function (c) { c.h = ch; });
      orbW = W;
      if (phone) {
        var k = Math.min(1, (orbH - 32) / ((ORB_BOTTOM - ORB_TOP) * W)); // a short screen scales it down
        var shift = -(ORB_TOP + ORB_BOTTOM) / 2 * W * k; // centered in the view
        orbSlotPx = ORB_SLOTS_PHONE.map(function (sl) { return { x: sl.x * W * k, y: sl.y * W * k + shift, w: sl.w * W * k }; });
        orbContact.style.top = (orbH / 2 + ORB_PILL * W * k + shift) + "px";
      } else {
        orbSlotPx = ORB_SLOTS.map(function (sl) { return { x: sl.x * W, y: sl.y * orbH, w: sl.w * W }; });
        orbContact.style.top = "";
      }
      orbRestY = phone ? -orbH / 2 + ch / 2 + 20 : -orbH * 0.25; // where a card settles: centered, above the caption
      orbPhone = phone;
      // on phones the text column starts just under the resting card, so the two never overlap
      orbView.style.setProperty("--col-top", Math.round(orbH / 2 + orbRestY + ch / 2 + 20) + "px");
      orbView.style.perspectiveOrigin = "50% " + (orbH / 2 + orbRestY) + "px"; // cards come from straight behind that spot
      orbCards.forEach(function (c) {
        c.slices.forEach(function (sl) {
          sl.style.width = cw + "px";
          sl.style.height = ch + "px";
          sl.style.left = (-cw / 2) + "px";
          sl.style.top = (-ch / 2) + "px";
          sl.firstChild.style.backgroundSize = "cover"; // a square card shows the middle of the cover
          sl.firstChild.style.backgroundPosition = "center";
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
        orbFactsInner.querySelector(".orbit__problem").textContent = pr.problem;
        orbFactsInner.querySelector(".orbit__big").textContent = pr.big;
        orbFactsInner.querySelector(".orbit__small").textContent = pr.small;
        orbFactsInner.classList.remove("is-out");
      }, 220);
      orbCenter.querySelector(".orbit__name").textContent = pr.name;
      orbCenter.querySelector(".orbit__line").textContent = pr.desc;
      orbCenter.querySelector(".orbit__meta").innerHTML = pr.meta;
      orbLink.href = pr.href;
      orbLink.style.setProperty("--cta", pr.brand);
      orbLink.innerHTML = 'Read case study &rarr;<span class="visually-hidden">: ' + pr.name + '</span>';
    };
    // When the scrolling stops, the cards drift gently, like feathers: a slow bob, sway and tilt,
    // each card on its own rhythm. The drift eases in after a stop and fades out while scrolling.
    // A card's place in the overview, blended with where the flight left it. The last project
    // glides from the front; the others come back from the distance.
    var orbShape = function (c, h) { // a card's height; its width stays the same
      h = Math.round(h);
      if (c.h === h) return;
      c.h = h;
      c.slices.forEach(function (sl) { sl.style.height = h + "px"; sl.style.top = (-h / 2) + "px"; });
    };
    var orbPlace = function (c, i, g, rz, flyOp, t) {
      orbShape(c, orbPhone ? orbCH + (orbCW - orbCH) * g : orbCH); // square as it settles on a phone
      var sl = orbSlotPx[i % orbSlotPx.length];
      var tx = sl.x, ty = sl.y, ts = sl.w / orbCW;
      var bob = Math.sin(t * 1.1 + i * 1.7) * 6 * orbAmp;
      var last = i === orbN - 1;
      var sx = last ? 0 : tx, sy = last ? orbRestY : ty, sz = last ? rz : -1800, ss = last ? 1 : ts, so = last ? flyOp : 0;
      var x = sx + (tx - sx) * g, y = sy + (ty - sy) * g + bob, z = sz * (1 - g), sc = ss + (ts - ss) * g;
      var op = so + (1 - so) * g;
      c.el.style.visibility = op <= 0.01 ? "hidden" : "";
      var o = op.toFixed(2);
      if (c.op !== o) { c.op = o; c.slices.forEach(function (s2) { s2.style.opacity = o; }); }
      if (c.fill !== "1.00") { c.fill = "1.00"; c.slices.forEach(function (s2) { s2.firstChild.style.opacity = 1; }); }
      c.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px," + z.toFixed(1) + "px) scale(" + sc.toFixed(4) + ")";
    };
    var orbSetActive = function (i) {
      if (orbActive === i) return;
      var wasOpen = orbActive >= 0;
      orbActive = i;
      orbView.classList.toggle("is-active", i >= 0);
      if (i < 0) { orbHideView(); return; }
      orbLastOpen = i;
      // the back button (or the back gesture on a phone) closes the panel instead of leaving the page
      if (!wasOpen) history.pushState({ orbPanel: true }, "", window.location.href);
      var pr = orbProjects[i];
      var cover = orbPanel.querySelector(".orbit__panel-cover");
      cover.href = pr.href;
      cover.style.backgroundImage = "url('" + pr.splash + "')";
      orbPanel.setAttribute("aria-label", pr.name);
      orbPanel.querySelector(".orbit__panel-name").textContent = pr.name;
      orbPanel.querySelector(".orbit__panel-meta").innerHTML = pr.meta.replace(/\s*<span class="read-time">[\s\S]*?<\/span>$/, "");
      orbPanel.querySelector(".orbit__panel-read").innerHTML = pr.read;
      orbPanel.querySelector(".orbit__panel-problem").textContent = pr.problem;
      orbPanel.querySelector(".orbit__panel-big").textContent = pr.big;
      orbPanel.querySelector(".orbit__panel-small").textContent = pr.small;
      orbPanel.querySelector(".orbit__panel-desc").textContent = pr.desc;
      var link = orbPanel.querySelector(".orbit__panel-link");
      link.href = pr.href;
      link.style.setProperty("--cta", pr.brand);
      link.innerHTML = 'Read case study &rarr;<span class="visually-hidden">: ' + pr.name + '</span>';
      orbShowView(i);
    };
    // The cover grows from its spot in the overview into the large cover, and shrinks back on
    // the way out, so it's always clear where the view came from and where it goes back to
    var orbFlip = function (i, opening) {
      var cover = orbPanel.querySelector(".orbit__panel-cover");
      var from = orbCards[i].slices[0].getBoundingClientRect(), to = cover.getBoundingClientRect();
      if (!to.width || !from.width || !cover.animate) return null;
      var k = [{ transform: "translate(" + (from.left - to.left) + "px," + (from.top - to.top) + "px) scale(" + (from.width / to.width) + "," + (from.height / to.height) + ")" }, { transform: "none" }];
      return cover.animate(opening ? k : k.reverse(), { duration: opening ? 520 : 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
    };
    var orbShowView = function (i) {
      orbPanel.scrollTop = 0;
      orbPanel.classList.add("is-open");
      orbFlip(i, true); // measured before the page is locked
      orbCards[i].el.style.opacity = 0; // it's the one that grew
      orbClose.focus({ preventScroll: true });
    };
    var orbHideView = function () {
      var i = orbLastOpen;
      var done = function () {
        orbPanel.classList.remove("is-open", "is-closing");
        if (i >= 0) orbCards[i].el.style.opacity = "";
      };
      orbPanel.classList.add("is-closing");
      var anim = i >= 0 ? orbFlip(i, false) : null;
      if (anim) anim.onfinish = done; else done();
    };
    // In the overview a click on a cover opens its view. Clicks are worked out from the covers'
    // resting spots. "← All projects", Esc or Back closes it again.
    var orbInside = function (r, x, y) { return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };
    var orbHit = function (x, y) {
      var c0 = orbScene.getBoundingClientRect(), hit = -1;
      orbCards.forEach(function (c, i) {
        var sl = orbSlotPx[i % orbSlotPx.length], w = sl.w, h = orbPhone ? w : w * 20 / 31;
        var cx = c0.left + sl.x, cy = c0.top + sl.y;
        if (orbInside({ left: cx - w / 2, right: cx + w / 2, top: cy - h / 2, bottom: cy + h / 2 }, x, y)) hit = i;
      });
      return hit;
    };
    orbView.addEventListener("mousemove", function (e) {
      orbView.style.cursor = orbG >= 0.9 && orbActive < 0 && orbHit(e.clientX, e.clientY) >= 0 ? "pointer" : "";
    });
    orbView.addEventListener("click", function (e) {
      if (orbG < 0.9 || orbActive >= 0 || e.target.closest(".orbit__contact, .orbit__link")) return;
      e.preventDefault();
      var card = e.target.closest(".orbit__card"); // a cover in focus, opened with Enter
      var i = card ? orbCards.findIndex(function (c) { return c.el === card; }) : orbHit(e.clientX, e.clientY);
      if (i < 0) return;
      orbSetActive(i);
      orbClose.focus({ preventScroll: true });
    });
    var orbShut = function () {
      var was = orbActive;
      if (was < 0) return;
      if (history.state && history.state.orbPanel) { history.back(); return; } // popstate below closes it
      orbSetActive(-1);
      if (orbOvState) orbCards[was].el.focus({ preventScroll: true });
    };
    orbClose.addEventListener("click", orbShut);
    window.addEventListener("popstate", function () {
      var was = orbActive;
      if (was < 0) return;
      orbSetActive(-1);
      if (orbOvState) orbCards[was].el.focus({ preventScroll: true });
    });
    // While the view is open the page under it stays put: scrolling outside the view (or past its
    // end) is held back. Locking the page with overflow: hidden would unstick the top bar.
    var orbHold = function (e) {
      if (orbActive < 0) return;
      var inView = e.target.closest && e.target.closest(".orbit__panel");
      if (!inView || orbPanel.scrollHeight <= orbPanel.clientHeight) e.preventDefault();
    };
    window.addEventListener("wheel", orbHold, { passive: false });
    window.addEventListener("touchmove", orbHold, { passive: false });
    document.addEventListener("keydown", function (e) {
      if (orbActive >= 0 && [" ", "PageDown", "PageUp", "End", "Home", "ArrowDown", "ArrowUp"].indexOf(e.key) >= 0 && !(e.target.closest && e.target.closest(".orbit__panel"))) e.preventDefault();
      if (e.key === "Escape" && orbActive >= 0) orbShut();
    });
    orbCards.forEach(function (c, i) {
      c.el.setAttribute("aria-label", orbProjects[i].name + ", " + orbProjects[i].metaText);
    });
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
      var raw = (orbNavH - orbDeck.getBoundingClientRect().top) / orbSeg - 1.5;
      // the flight stops on the last project. On desktop the cards then settle into the overview
      // (g goes 0 to 1) and hold it; on phones the last project scrolls away with the page.
      var p = Math.max(-1.5, Math.min(orbN - 1, raw));
      var g = orbOvOn ? Math.max(0, Math.min(1, (raw - (orbN - 1)) / ORB_OV)) : 0;
      g = g * g * (3 - 2 * g);
      orbG = g;
      if (g < 0.9 && orbActive >= 0) orbSetActive(-1);
      orbView.classList.toggle("is-overview", g > 0.5);
      // in the overview the cards can be tabbed to; Enter opens one like a click
      var ov = g >= 0.9;
      if (ov !== orbOvState) {
        orbOvState = ov;
        orbScene.setAttribute("aria-hidden", ov ? "false" : "true");
        orbCards.forEach(function (c) { c.el.tabIndex = ov ? 0 : -1; });
      }
      var out = Math.max(0, Math.min(1, (p - (orbN - 1) - 0.1) / 0.28)); // at the same time as the last card leaves
      out = out * out * (3 - 2 * out); // ease in and out
      orbCards.forEach(function (c, i) {
        var rel = i - p;
        var rz = -rel * ORB_D; // 0 = in focus; below 0 still ahead; above 0 flying past the visitor
        var op = 1;
        op *= Math.max(0, Math.min(1, (1.4 - rel) / 0.3));         // the next card shows in the distance as an outlined box
        // a card fades as it bursts past; on phones sooner, before it grows over the name
        op *= orbPhone ? (rz > 0 ? Math.max(0, 1 - rz / 160) : 1) : (rz > 220 ? Math.max(0, 1 - (rz - 220) / 300) : 1);
        if (g > 0) { orbPlace(c, i, g, rz, op, t); return; }
        orbShape(c, orbCH);
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
      orbFacts.style.opacity = ((1 - out) * (1 - g)).toFixed(3);
      // the opening line fades out while the first card comes in, then the first project's name fades in
      var show = p < -0.5 ? 1 - Math.max(0, Math.min(1, (p + 0.95) / 0.45)) : Math.max(0, Math.min(1, (p + 0.5) / 0.35));
      // into the overview, the last project's name fades out and the opening line fades back in
      // into the overview the last project's name fades out and the Contact link fades in
      var cOp = g <= 0 ? show * (1 - out) : g < 0.5 ? show * (1 - 2 * g) : 0;
      orbCenter.style.opacity = cOp.toFixed(3);
      var kOp = g < 0.5 ? 0 : 2 * g - 1;
      orbContact.style.opacity = kOp.toFixed(3);
      orbContact.style.visibility = kOp <= 0.02 ? "hidden" : "visible";
      var colTop = orbPhone && !orbCenter.classList.contains("is-intro"); // a phone's column hangs from its top
      orbCenter.style.transform = "translateY(calc(" + (colTop ? "0%" : "-50%") + " + " + (Math.sin(t * 0.85 + 2) * 5 * orbAmp - out * 40).toFixed(2) + "px))";
      orbCenter.style.visibility = out >= 1 || show <= 0 || cOp <= 0.02 ? "hidden" : ""; // so a faded link can't be tabbed to or clicked
      if (g < 0.5) orbSetCaption(p < -0.5 ? -1 : Math.floor(Math.max(0, Math.min(orbN - 1, p + 0.7)))); // switches as the next card appears
    };
    orbSize();
    orbDraw();
    // "All projects" on a case study links to #all: open on the overview, every project at once
    var orbToOverview = function () {
      if (window.location.hash !== "#all") return;
      var at = orbOvOn ? orbN - 1 + ORB_OV + ORB_HOLD * 0.3 : orbN - 1;
      var top = orbDeck.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.round(top - orbNavH + (at + 1.5) * orbSeg), behavior: "instant" }); // no smooth scroll through the whole flight
    };
    orbToOverview();
    window.addEventListener("load", orbToOverview);
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
  if (anchorLinks.length) {
    // The active section is the last one whose top has passed 40% of the screen. Checked on every
    // scroll (once per frame), so a jump from a menu link or a fast flick never skips it.
    var anchorSections = [].slice.call(document.querySelectorAll(".case-section[id]"));
    var anchorList = document.querySelector(".anchors__list");
    var activeId = null, anchorTick = false;
    var markActive = function () {
      anchorTick = false;
      var line = window.innerHeight * 0.4, id = null;
      anchorSections.forEach(function (sec) { if (sec.getBoundingClientRect().top <= line) id = sec.id; });
      if (id === activeId) return;
      activeId = id;
      anchorLinks.forEach(function (link) {
        var on = id !== null && link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", on);
        if (on) { link.setAttribute("aria-current", "location"); } else { link.removeAttribute("aria-current"); }
        // The menu scrolls sideways on small screens: bring the active section into view, centered
        if (on && anchorList.scrollWidth > anchorList.clientWidth) {
          var lr = link.getBoundingClientRect(), mr = anchorList.getBoundingClientRect();
          anchorList.scrollTo({ left: anchorList.scrollLeft + lr.left - mr.left - (mr.width - lr.width) / 2, behavior: "smooth" });
        }
      });
    };
    window.addEventListener("scroll", function () {
      if (!anchorTick) { anchorTick = true; requestAnimationFrame(markActive); }
    }, { passive: true });
    window.addEventListener("resize", markActive);
    markActive();
  }
  // Phones that fit the screen. A walkthrough phone or a fixed-size prototype phone is scaled down
  // (CSS zoom, so taps and the pointer still line up) until it fits the width and the height left
  // under the sticky bars. Prototype phones that grow with their content get that height as a
  // maximum and scroll inside instead.
  var fitPhones = function () {
    var bars = 0;
    document.querySelectorAll(".nav, .anchors").forEach(function (b) {
      var pos = getComputedStyle(b).position;
      if (pos === "sticky" || pos === "fixed") bars += b.offsetHeight;
    });
    var avail = Math.max(360, window.innerHeight - bars - 24);
    document.documentElement.style.setProperty("--fit-h", avail + "px");
    var size = function (el, box, w, h) {
      el.style.zoom = "";
      var z = Math.min(1, avail / h, box.clientWidth / w);
      if (z < 1) el.style.zoom = Math.max(0.55, z).toFixed(3);
    };
    // Walkthrough phones are 356 x 720
    document.querySelectorAll(".walk--hifi:not(.walk--desktop) .walk__stage").forEach(function (stage) {
      var cs = getComputedStyle(stage);
      var box = { clientWidth: stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) };
      // The whole board fits the screen, labels and progress bar included, not only the phone
      var pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      stage.querySelectorAll(".walk__scene").forEach(function (sc) { size(sc, box, 356, 720 * avail / Math.max(1, avail - pad)); });
    });
    // Fixed-size prototype phones: measured once at full size
    document.querySelectorAll(".try .pf-phone, .try .st-phone").forEach(function (ph) {
      ph.style.zoom = "";
      if (!ph.dataset.w) { ph.dataset.w = ph.offsetWidth; ph.dataset.h = ph.offsetHeight; }
      size(ph, ph.parentNode, +ph.dataset.w, +ph.dataset.h);
    });
  };
  // Two phones in a panel (pflegePro). Side by side when both fit at full size. When only one
  // does, "swap": the first screen shows alone, and the first tap in it shrinks it to the left
  // while the arrow and the second screen come in. On phones both screens are made smaller
  // first, so the same swap fits; they only stack if even that doesn't fit.
  var GAPS = 28 + 2 * 16; // the arrow and the two gaps around it
  var layoutPairs = function () {
    document.querySelectorAll(".try .pf-pair").forEach(function (pair) {
      var first = pair.querySelector(".pf-phone");
      var w = +first.dataset.w || 270, shown = w * (parseFloat(first.style.zoom) || 1);
      var room = pair.clientWidth, s = (room - shown - GAPS) / shown;
      if (room < 2 * shown + GAPS && s < 0.45) {
        // Phones: both screens get smaller, so the small first screen still fits beside the second
        var z = (room - GAPS) / (w * 1.45);
        pair.querySelectorAll(".pf-phone").forEach(function (ph) { ph.style.zoom = z.toFixed(3); });
        shown = w * z;
        s = (room - shown - GAPS) / shown;
      }
      var mode = room >= 2 * shown + GAPS ? "" : s >= 0.4 ? "swap" : "stack";
      pair.classList.toggle("pf-pair--swap", mode === "swap");
      pair.classList.toggle("pf-pair--stack", mode === "stack");
      pair.style.setProperty("--pf-w", w + "px");
      pair.style.setProperty("--pf-s", Math.min(1, s).toFixed(3));
      if (pair.dataset.swap) return;
      pair.dataset.swap = "1";
      first.addEventListener("click", function (e) {
        if (!e.target.closest("button")) return; // only a real action (a lesson, the heart) moves on
        if (!pair.classList.contains("pf-pair--swap") || pair.classList.contains("is-open")) return;
        var before = first.getBoundingClientRect().left;
        pair.classList.add("is-open");
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        var dx = before - first.getBoundingClientRect().left;
        first.animate(
          [{ transform: "translateX(" + dx + "px) scale(1)" }, { transform: "scale(" + getComputedStyle(pair).getPropertyValue("--pf-s") + ")" }],
          { duration: 500, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
        );
      });
    });
  };
  var fitAll = function () { fitPhones(); layoutPairs(); };
  var fitTimer;
  fitAll();
  window.addEventListener("load", fitAll);
  window.addEventListener("resize", function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitAll, 150); });
})();
