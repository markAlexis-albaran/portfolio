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

  // SpringIn: write a wish on the calendar
  var calDemo = document.querySelector(".cal-demo");
  if (calDemo) {
    var types = { off: ["Off", "Day off"], early: ["Early", "Early shift"], late: ["Late", "Late shift"], night: ["Night", "Night shift"] };
    var wishes = { 6: "off", 15: "night", 25: "off" };
    var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var dayGrid = calDemo.querySelector(".sp-days");
    var pick = calDemo.querySelector(".sp-pick");
    var removeBtn = calDemo.querySelector(".sp-pick__remove");
    var calSay = function (m) { calDemo.querySelector("[role=status]").textContent = m; };
    var openDay = null;
    var label = function (d) { return (d < 10 ? "0" : "") + d + ".Mar (" + dayNames[(d - 1) % 7] + ")"; };
    var drawCal = function () {
      dayGrid.innerHTML = "";
      for (var d = 1; d <= 31; d++) {
        var b = document.createElement("button");
        b.type = "button";
        b.dataset.day = d;
        var w = wishes[d];
        b.innerHTML = d + (w ? '<span class="wd-tag wd-tag--' + w + '">' + (w === "night" ? "N" : types[w][0]) + "</span>" : "");
        b.setAttribute("aria-label", d + " March" + (w ? ", wish: " + types[w][1] : ", no wish"));
        if (openDay === d) b.classList.add("is-open");
        b.addEventListener("click", function () { openPick(+this.dataset.day); });
        dayGrid.appendChild(b);
      }
      var keys = Object.keys(wishes).map(Number).sort(function (a, b) { return a - b; });
      calDemo.querySelector(".sp-sum__n").textContent = keys.length + (keys.length === 1 ? " Wunsch" : " Wünsche") + " written";
      calDemo.querySelector(".sp-sum__list").textContent = keys.length ? keys.map(label).join(" · ") : "Nothing yet";
    };
    var openPick = function (d) {
      openDay = d;
      pick.hidden = false;
      pick.querySelector(".sp-pick__h").textContent = "Wish for " + label(d);
      pick.querySelectorAll("[data-t]").forEach(function (o) { o.setAttribute("aria-pressed", wishes[d] === o.dataset.t ? "true" : "false"); });
      removeBtn.hidden = !wishes[d];
      drawCal();
      pick.querySelector("[data-t]").focus();
    };
    var closePick = function () {
      var d = openDay;
      openDay = null;
      pick.hidden = true;
      drawCal();
      var b = dayGrid.querySelector('[data-day="' + d + '"]');
      if (b) b.focus();
    };
    pick.querySelectorAll("[data-t]").forEach(function (o) {
      o.addEventListener("click", function () {
        wishes[openDay] = o.dataset.t;
        calSay("Wish for " + label(openDay) + ": " + types[o.dataset.t][1] + ".");
        closePick();
      });
    });
    removeBtn.addEventListener("click", function () {
      delete wishes[openDay];
      calSay("Wish for " + label(openDay) + " removed.");
      closePick();
    });
    drawCal();
  }

  // SpringIn: review, withdraw and undo
  var rv = document.querySelector(".review-demo");
  if (rv) {
    var rvTypes = { off: ["off", "Day off"], night: ["night", "Night shift"] };
    var rvAll = [
      { d: "06.Mar (Sat)", t: "off", alt: "No alternative · fixed wish" },
      { d: "12.Mar (Fri)", t: "off", alt: "or 13.Mar (Sat) · Day off" },
      { d: "15.Mar (Mon)", t: "night", alt: "or 16.Mar (Tue) · Night shift" },
      { d: "25.Mar (Thu)", t: "off", alt: "or 27.Mar (Sat) · Day off" }
    ];
    var rvList = rv.querySelector(".sp-rv");
    var toast = rv.querySelector(".sp-toast");
    var lastRemoved = null;
    var rvSay = function (m) { rv.querySelector("[role=status]").textContent = m; };
    var drawRv = function () {
      var shown = rvAll.filter(function (w) { return !w.gone; });
      rv.querySelector(".sp-rv__h").textContent = shown.length + " wishes for March";
      rv.querySelector(".sp-handin").textContent = "Hand in " + shown.length + " wishes →";
      rvList.innerHTML = "";
      shown.forEach(function (w) {
        var li = document.createElement("li");
        li.innerHTML = '<div class="sp-rv__top"><span>' + w.d + '</span><span class="wd-tag wd-tag--' + rvTypes[w.t][0] + '">' + rvTypes[w.t][1] + '</span></div>' +
          '<p class="sp-rv__alt">' + w.alt + '</p><div class="sp-rv__actions"><span class="sp-rv__change" aria-hidden="true">Change</span>' +
          '<button type="button" class="sp-rv__withdraw">Withdraw<span class="visually-hidden"> wish for ' + w.d + '</span></button></div>';
        li.querySelector(".sp-rv__withdraw").addEventListener("click", function () {
          w.gone = true;
          lastRemoved = w;
          toast.querySelector(".sp-toast__msg").textContent = "Wish for " + w.d + " withdrawn.";
          toast.hidden = false;
          drawRv();
          rvSay("Wish for " + w.d + " withdrawn. Undo is available.");
          toast.querySelector(".sp-toast__undo").focus();
        });
        rvList.appendChild(li);
      });
    };
    toast.querySelector(".sp-toast__undo").addEventListener("click", function () {
      if (!lastRemoved) return;
      lastRemoved.gone = false;
      rvSay("Wish for " + lastRemoved.d + " is back.");
      lastRemoved = null;
      toast.hidden = true;
      drawRv();
      rvList.querySelector(".sp-rv__withdraw").focus();
    });
    drawRv();
  }

  // SpringIn: the result once the plan is out, two scenarios
  var rs = document.querySelector(".result-demo");
  if (rs) {
    var rsData = {
      all: [
        ["06.Mar (Sat)", "Your wish · Day off", true],
        ["12.Mar (Fri)", "Alternative · 13.Mar (Sat), day off", true],
        ["15.Mar (Mon)", "Your wish · Night shift", true],
        ["25.Mar (Thu)", "Alternative · 27.Mar (Sat), day off", true]
      ],
      one: [
        ["25.Mar (Thu)", "You're on the late shift. Your wish (day off) and both alternatives couldn't be fitted.", false],
        ["06.Mar (Sat)", "Your wish · Day off", true],
        ["12.Mar (Fri)", "Alternative · 13.Mar (Sat), day off", true],
        ["15.Mar (Mon)", "Your wish · Night shift", true]
      ]
    };
    var rsDraw = function (key) {
      var rows = rsData[key];
      rs.querySelector(".rs-sub").textContent = "The March plan is out." + (key === "one" ? " 3 of 4 wishes granted." : "");
      rs.querySelector(".rs-banner").hidden = key !== "all";
      rs.querySelector(".rs-list").innerHTML = rows.map(function (r) {
        return '<li class="' + (r[2] ? "" : "is-no") + '"><div class="rs-top"><span>' + r[0] + '</span><span class="rs-badge rs-badge--' + (r[2] ? 'yes">✓ Granted' : 'no">Not granted') + '</span></div>' +
          '<span class="rs-detail">' + r[1] + '</span>' +
          (r[2] ? '' : '<div class="rs-pointer"><strong>Can\'t live with this?</strong>Talk to your Stationsleitung, or arrange it with a colleague.</div>') + '</li>';
      }).join("");
    };
    rs.querySelectorAll('input[name="rs"]').forEach(function (r) { r.addEventListener("change", function () { rsDraw(r.value); }); });
    rsDraw("all");
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
