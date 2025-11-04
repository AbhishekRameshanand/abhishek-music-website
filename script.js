document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.primary-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = nav ? Array.from(nav.querySelectorAll('a')) : [];

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.classList.toggle('is-open', isOpen);
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('is-open');
        }
      });
    });
  }

  const animated = document.querySelectorAll('[data-animate]');
  if (animated.length) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      animated.forEach(el => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      animated.forEach(el => observer.observe(el));
    }
  }

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const backToTop = document.querySelector('a[href="#top"]');
  const topAnchor = document.getElementById('top');
  if (backToTop && topAnchor) {
    backToTop.addEventListener('click', event => {
      event.preventDefault();
      topAnchor.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const gallery = document.querySelector('.gallery-slider');
  if (gallery) {
    const track = gallery.querySelector('.gallery-track');
    const slides = Array.from(gallery.querySelectorAll('.gallery-slide'));
    const prev = gallery.querySelector('.gallery-nav.prev');
    const next = gallery.querySelector('.gallery-nav.next');
    let ticking = false;

    const spacing = () => {
      const styles = getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap || '0');
    };

    const step = () => {
      if (!slides.length) return track.clientWidth;
      return slides[0].offsetWidth + spacing();
    };

    const clampScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

    const update = () => {
      const maxScroll = clampScroll();
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= maxScroll - 1;
    };

    const smoothScroll = delta => {
      track.scrollBy({ left: delta, behavior: 'smooth' });
    };

    prev.addEventListener('click', () => smoothScroll(-step()));
    next.addEventListener('click', () => smoothScroll(step()));

    track.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener('resize', () => {
      window.requestAnimationFrame(update);
    });

    update();
  }
});
