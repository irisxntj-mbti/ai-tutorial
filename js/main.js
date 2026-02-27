/* ============================================
   Main JS — 视频轮播 + 滚动淡入动画
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCarousels();
  initScrollAnimations();
  initAutoStopOnScroll();
});

/* ---- Video Carousel ---- */
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.parentElement.querySelectorAll('.carousel-dot');
    let current = 0;
    let startX = 0;
    let deltaX = 0;
    let isDragging = false;

    function goTo(index) {
      if (index < 0 || index >= slides.length) return;
      pauseAllVideos(carousel);
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // Touch events
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      if (!isDragging) return;
      deltaX = e.touches[0].clientX - startX;
      const offset = -current * 100 + (deltaX / track.offsetWidth) * 100;
      track.style.transform = `translateX(${offset}%)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isDragging = false;
      track.style.transition = '';
      if (Math.abs(deltaX) > 50) {
        goTo(deltaX > 0 ? current - 1 : current + 1);
      } else {
        goTo(current);
      }
      deltaX = 0;
    });

    // Dot click
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    // Click anywhere on slide to toggle play/pause
    carousel.querySelectorAll('.carousel-slide').forEach(slide => {
      const video = slide.querySelector('video');
      const btn = slide.querySelector('.play-btn');
      if (!video || !btn) return;

      slide.addEventListener('click', () => {
        if (video.paused) {
          pauseAllVideos(carousel);
          video.play();
          btn.classList.add('hidden');
        } else {
          video.pause();
          btn.classList.remove('hidden');
        }
      });

      video.addEventListener('ended', () => {
        btn.classList.remove('hidden');
      });
    });
  });
}

function pauseAllVideos(container) {
  container.querySelectorAll('video').forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
  container.querySelectorAll('.play-btn').forEach(b => b.classList.remove('hidden'));
}

/* ---- Auto-stop video when scrolled out of view ---- */
function initAutoStopOnScroll() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          const carousel = entry.target.closest('.carousel');
          if (carousel) pauseAllVideos(carousel);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.carousel-slide video').forEach(v => {
    observer.observe(v);
  });
}

/* ---- Scroll Fade-in Animation ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
