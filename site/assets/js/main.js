/* REGIIS SECURITY — interactions */
(function () {
  'use strict';

  /* ---- Sticky header ---- */
  var hdr = document.querySelector('.hdr');
  var bar = document.querySelector('.sticky-bar');
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('is-stuck', y > 24);
    if (bar) bar.classList.toggle('is-on', y > 520);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mnav');
  if (burger && mnav) {
    var toggle = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      mnav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      toggle(burger.getAttribute('aria-expanded') !== 'true');
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') toggle(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggle(false);
    });
  }

  /* ---- Scroll reveal ---- */
  var rv = document.querySelectorAll('[data-rv]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var d = parseInt(el.getAttribute('data-rv'), 10) || 0;
        setTimeout(function () { el.classList.add('is-in'); }, d);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Animated counters ---- */
  var nums = document.querySelectorAll('[data-count]');
  if (nums.length && 'IntersectionObserver' in window) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduce) { el.textContent = target + suffix; return; }
        var t0 = null, dur = 1500;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * e) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { cio.observe(el); });
  }

  /* ---- FAQ: one open at a time ---- */
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---- Contact form (front-end only) ---- */
  var form = document.querySelector('[data-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var ok = form.querySelector('.form__ok');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
      /* Aucun back-end n'est branché : voir README.md § "Brancher le formulaire". */
      setTimeout(function () {
        if (ok) { ok.classList.add('is-on'); ok.scrollIntoView({ block: 'center' }); }
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Envoyer ma demande'; }
      }, 550);
    });
  }

  /* ---- Current year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
