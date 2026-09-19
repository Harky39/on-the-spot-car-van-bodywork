/* On The Spot Car & Van Bodywork — main.js */
(function () {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu after choosing a link (mobile)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Highlight active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(nav ? nav.querySelectorAll('a[href^="#"]') : []);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var ro = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          ro.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.transitionDelay = delay + "ms";
      ro.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Before / after comparison slider ---------- */
  var baSlider = document.getElementById("baSlider");
  if (baSlider) {
    var baHandle = document.getElementById("baHandle");

    function setBaPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      baSlider.style.setProperty("--pos", pct + "%");
      if (baHandle) baHandle.setAttribute("aria-valuenow", String(Math.round(pct)));
    }

    function baPosFromEvent(e) {
      var r = baSlider.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }

    var baDragging = false;
    baSlider.addEventListener("pointerdown", function (e) {
      baDragging = true;
      try { baSlider.setPointerCapture(e.pointerId); } catch (_) {}
      setBaPos(baPosFromEvent(e));
    });
    baSlider.addEventListener("pointermove", function (e) {
      if (baDragging) setBaPos(baPosFromEvent(e));
    });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      baSlider.addEventListener(ev, function () { baDragging = false; });
    });

    if (baHandle) {
      baHandle.addEventListener("keydown", function (e) {
        var cur = parseFloat(baSlider.style.getPropertyValue("--pos")) || 50;
        if (e.key === "ArrowLeft") { setBaPos(cur - 4); e.preventDefault(); }
        else if (e.key === "ArrowRight") { setBaPos(cur + 4); e.preventDefault(); }
      });
    }
  }

  /* ---------- Quote form -> pre-filled email ---------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("name").value || "").trim();
      var phone = (document.getElementById("phone").value || "").trim();
      var type = document.getElementById("type").value;
      var message = (document.getElementById("message").value || "").trim();

      if (!name || !phone) {
        form.reportValidity ? form.reportValidity() : null;
        return;
      }

      var subject = "Quote request — On The Spot Car & Van Bodywork";
      var body =
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Vehicle type: " + type + "\n\n" +
        (message || "(no details provided)") + "\n";

      window.location.href =
        "mailto:peter.hark89@gmail.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
