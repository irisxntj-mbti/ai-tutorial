/* ============================================
   Main JS — AI Tutorial Showcase
   Intersection Observer animations + utilities
   ============================================ */

(function () {
  'use strict';

  /* ---- Intersection Observer for fade-in ---- */
  function initScrollAnimations() {
    var targets = document.querySelectorAll('.fade-in, .fade-in-children');

    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      /* Fallback: show everything immediately */
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---- Scroll indicator click ---- */
  function initScrollIndicator() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    indicator.addEventListener('click', function () {
      var nextSection = document.querySelector('#how-it-works');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ---- Lazy image loading preparation ---- */
  function initLazyImages() {
    var lazyImages = document.querySelectorAll('img[data-src]');

    if (!lazyImages.length) return;

    if (!('IntersectionObserver' in window)) {
      lazyImages.forEach(function (img) {
        img.src = img.dataset.src;
      });
      return;
    }

    var imageObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('is-loaded');
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: '200px 0px',
      }
    );

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  /* ---- Prevent 300ms tap delay on mobile ---- */
  function initTouchOptimizations() {
    /* Modern browsers handle this via viewport meta, but just in case */
    document.addEventListener('touchstart', function () {}, { passive: true });
  }

  /* ---- Initialize everything on DOM ready ---- */
  function init() {
    initScrollAnimations();
    initSmoothScroll();
    initScrollIndicator();
    initLazyImages();
    initTouchOptimizations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
