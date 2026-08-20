(() => {
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const progress = document.querySelector('.page-progress span');
  const backToTop = document.querySelector('.back-to-top');
  const mobileBreakpoint = 1160;

  const closeMenu = () => {
    menuBtn?.classList.remove('open');
    navLinks?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.setAttribute('aria-label', 'Open navigation');
  };

  const openMenu = () => {
    menuBtn?.classList.add('open');
    navLinks?.classList.add('open');
    document.body.classList.add('menu-open');
    menuBtn?.setAttribute('aria-expanded', 'true');
    menuBtn?.setAttribute('aria-label', 'Close navigation');
  };

  const updateScrollUI = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 24);
    backToTop?.classList.toggle('show', y > 520);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.width = `${Math.min(100, Math.max(0, (y / max) * 100))}%`;
    }
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  menuBtn?.addEventListener('click', () => {
    navLinks?.classList.contains('open') ? closeMenu() : openMenu();
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > mobileBreakpoint) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (!navLinks?.classList.contains('open')) return;
    if (navLinks.contains(e.target) || menuBtn?.contains(e.target)) return;
    closeMenu();
  });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Reveal animation with graceful fallback.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: '0px 0px -4% 0px' });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('visible'));
  }

  // Preselect enquiry type when arriving from a relevant CTA.
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const enquirySelect = document.querySelector('#type');
  if (enquirySelect && type) {
    const typeMap = {
      speaking: 'Speaking Invitation',
      career: '1:1 Career Session',
      'personal-branding': 'Personal Branding'
    };
    const desired = typeMap[type];
    if (desired) enquirySelect.value = desired;
  }

  // Static preview form: validate and prepare the entered details without pretending delivery.
  document.querySelectorAll('[data-enquiry-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const success = form.querySelector('.form-success');
      success?.classList.add('show');
      success?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Lightweight image viewer for the real portfolio photography.
  const zoomTargets = document.querySelectorAll([
    '.home-photo-card', '.about-portrait', '.story-photo', '.expertise-photo-card',
    '.gallery-photo', '.proof-photo', '.visual-story', '.insight-visual figure', '.session-visual'
  ].join(','));

  if (zoomTargets.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');
    lightbox.innerHTML = '<div class="lightbox-inner"><button class="lightbox-close" type="button" aria-label="Close image preview">×</button><img alt=""><div class="lightbox-caption"></div></div>';
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let previousFocus = null;

    const openLightbox = target => {
      const img = target.querySelector('img');
      if (!img) return;
      previousFocus = document.activeElement;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      const caption = target.querySelector('figcaption')?.textContent?.trim() || img.alt || '';
      lbCaption.textContent = caption;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.removeAttribute('src');
      previousFocus?.focus?.();
    };

    zoomTargets.forEach(target => {
      if (!target.querySelector('img')) return;
      target.tabIndex = 0;
      target.setAttribute('role', 'button');
      target.setAttribute('aria-label', `View image: ${target.querySelector('img').alt || 'portfolio photo'}`);
      target.addEventListener('click', () => openLightbox(target));
      target.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(target);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }
})();
