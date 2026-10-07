/* Shared, progressive motion layer. No information is hidden by default. */
(() => {
  'use strict';
  const { gsap, ScrollTrigger, Lenis } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('#main-nav');
  const menuButton = document.querySelector('.menu-toggle');
  const completed = new WeakSet();
  const media = gsap.matchMedia();
  let restore = () => {};

  media.add({
    reduced: '(prefers-reduced-motion: reduce)',
    compact: '(max-width: 600px)',
    fine: '(hover: hover) and (pointer: fine)',
  }, (context) => {
    const { reduced, compact, fine } = context.conditions;
    if (reduced) return;
    root.classList.add('ponte-motion');
    const events = new AbortController();
    const listen = (target, event, handler, options = {}) =>
      target?.addEventListener(event, handler, { ...options, signal: events.signal });
    const distance = compact ? 16 : 30;
    const duration = compact ? 0.6 : 0.8;
    const stagger = compact ? 0.05 : 0.09;
    const originals = [];
    const running = new Map();
    let leaving = false;
    let exitTimer;
    let menuTween;
    let lenis;
    let tick;

    if (Lenis && fine && !compact) {
      lenis = new Lenis({
        lerp: 0.1, smoothWheel: true, syncTouch: false, autoRaf: false,
        prevent: (node) => node.matches?.('textarea, select, [data-lenis-prevent]') ||
          (node.id === 'main-nav' && node.classList.contains('is-open')),
      });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Split only explicit desktop lines, preserving text and inline emphasis.
    // Mobile retains the original wrapping and its existing hidden <br> rule.
    function lines(title) {
      if (compact || !title.querySelector(':scope > br')) return [title];
      originals.push([title, title.innerHTML]);
      const nodes = Array.from(title.childNodes);
      title.replaceChildren();
      let line = document.createElement('span');
      line.className = 'motion-line';
      title.append(line);
      nodes.forEach((node) => {
        if (node.nodeName === 'BR') {
          title.append(node);
          line = document.createElement('span');
          line.className = 'motion-line';
          title.append(line);
        } else line.append(node);
      });
      return Array.from(title.querySelectorAll(':scope > .motion-line'));
    }

    function reveal(element, delay = 0) {
      if (completed.has(element)) return;
      completed.add(element);
      const isTitle = element.matches('h1,h2');
      const isImage = element.matches('.editorial-photo > img, .photo-card > img');
      const targets = isTitle ? lines(element) : [element];
      // Follow the layout's left/right placement; centered photographs alternate.
      const bounds = element.getBoundingClientRect();
      const center = bounds.left + bounds.width / 2;
      const imageIndex = Array.from(document.querySelectorAll('.editorial-photo > img,.photo-card > img')).indexOf(element);
      const side = Math.abs(center - innerWidth / 2) < innerWidth * 0.08
        ? (imageIndex % 2 === 0 ? -1 : 1)
        : (center < innerWidth / 2 ? -1 : 1);
      const lateral = element.closest('.reading-aside') && !isTitle;
      const from = isTitle
        ? { opacity: 0, y: compact ? 20 : 40, clipPath: 'inset(0 0 100% 0)' }
        : isImage
          ? { opacity: 0, x: side * (compact ? 14 : 40), scale: 1.04,
              clipPath: side < 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }
          : lateral
            ? { opacity: 0, x: side * (compact ? 10 : 24), y: 0 }
            : { opacity: 0, y: distance };
      const tween = gsap.fromTo(targets, from, {
        opacity: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0 0 0% 0)',
        duration: isTitle || isImage ? (compact ? 0.7 : 1) : duration,
        ease: isTitle || isImage ? 'power4.out' : 'power3.out',
        delay, stagger: isTitle ? stagger : 0,
        clearProps: 'opacity,transform,clipPath',
        onComplete: () => running.delete(element),
      });
      running.set(element, tween);
    }

    // A short usable entrance; controls are never disabled by this sequence.
    gsap.fromTo(document.body, { opacity: 0.92 }, {
      opacity: 1, duration: 0.6, clearProps: 'opacity',
    });
    if (header) gsap.fromTo(header, { opacity: 0, y: -12 }, {
      opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
      clearProps: 'opacity,transform',
    });
    const hero = document.querySelector('.hero');
    const entrance = hero
      ? hero.querySelectorAll('.hero__eyebrow,.hero__intro,h1,.hero__description,.hero__actions')
      : document.querySelectorAll('.page-intro .breadcrumb,.page-intro h1,.page-intro > p');
    entrance.forEach((element, i) => reveal(element, 0.1 + i * stagger));

    // One trigger per content region; long prose remains block-level.
    const groups = document.querySelectorAll(
      '.section-heading,.section-heading--split,.reading-aside,.prose,.photo-grid,.people-grid,' +
      '.publications,.contact-inner,.contact-information,.form-panel,.schedule-note,.footer-top,.footer-nav',
    );
    groups.forEach((group) => {
      const children = Array.from(group.children).flatMap((element) =>
        element.matches('.home-contact-heading') ? Array.from(element.children) : [element],
      ).filter((element) =>
        element.matches('h2,h3,p,.overline,.button,.home-section-icon,.person-card,.photo-card,' +
          '.publication-link,.publication-empty,.contact-email-address,.form-field,a') &&
        !completed.has(element),
      );
      if (!children.length) return;
      ScrollTrigger.create({
        trigger: group, start: 'top 82%', once: true,
        onEnter: () => children.forEach((element, i) => reveal(element, Math.min(i, 5) * stagger)),
      });
    });
    document.querySelectorAll('main h2').forEach((title) => {
      if (title.closest('.reading-aside,.section-heading,.section-heading--split,.form-panel,.schedule-note')) return;
      ScrollTrigger.create({ trigger: title, start: 'top 82%', once: true, onEnter: () => reveal(title) });
    });
    document.querySelectorAll('.editorial-photo > img,.photo-card > img').forEach((image) => {
      ScrollTrigger.create({ trigger: image, start: 'top 85%', once: true, onEnter: () => reveal(image) });
    });

    // Move the photographic figure as a whole: original image crop is preserved.
    if (!compact && fine) {
      document.querySelectorAll('.editorial-photo').forEach((figure) => {
        gsap.fromTo(figure, { y: -12 }, {
          y: 12, ease: 'none',
          scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
        });
      });
    }
    const arrow = document.querySelector('.hero__scroll span');
    if (arrow) {
      const float = gsap.to(arrow, { y: 5, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
      ScrollTrigger.create({ trigger: arrow, start: 'top bottom', end: 'bottom top',
        onToggle: (self) => self.isActive ? float.play() : float.pause() });
    }

    // Retain the header's existing position, size and document flow.
    let lastY = window.scrollY;
    let travel = 0;
    let direction = 0;
    let hidden = false;
    function showHeader() {
      hidden = false;
      gsap.to(header, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', overwrite: true });
    }
    function onScroll() {
      if (!header || !fine || compact) return;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (Math.abs(delta) < 2) return;
      const next = Math.sign(delta);
      travel = next === direction ? travel + Math.abs(delta) : Math.abs(delta);
      direction = next;
      if (y < 80 || header.contains(document.activeElement) || menuButton?.getAttribute('aria-expanded') === 'true') {
        if (hidden) showHeader();
        return;
      }
      if (travel < 70) return;
      if (direction < 0 && hidden) showHeader();
      else if (direction > 0 && !hidden) {
        hidden = true;
        gsap.to(header, { y: -20, opacity: 0, duration: 0.4, overwrite: true, ease: 'power3.out' });
      }
    }
    listen(window, 'scroll', onScroll, { passive: true });
    listen(header, 'focusin', showHeader);

    window.PonteMotion = {
      menu(open, finish) {
        if (!nav || getComputedStyle(menuButton).display === 'none') { finish(); return; }
        menuTween?.kill();
        gsap.killTweensOf(nav.children);
        if (open) {
          finish();
          showHeader();
          nav.inert = false;
          menuTween = gsap.timeline()
            .fromTo(nav, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.3, clearProps: 'opacity,transform' })
            .fromTo(nav.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3,
              stagger: 0.035, clearProps: 'opacity,transform' }, 0.06);
        } else {
          nav.inert = true;
          menuTween = gsap.timeline({ onComplete: () => {
            finish(); gsap.set([nav, ...nav.children], { clearProps: 'opacity,transform' });
          } })
            .to(Array.from(nav.children).reverse(), { opacity: 0, y: 6, stagger: 0.02, duration: 0.15 })
            .to(nav, { opacity: 0, y: -8, duration: 0.15 }, '-=0.08');
        }
      },
    };

    listen(document, 'focusin', (event) => {
      running.forEach((tween, element) => {
        if (element === event.target || element.contains(event.target)) tween.progress(1);
      });
      lenis?.scrollTo(window.scrollY, { immediate: true });
    });
    listen(document, 'click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target || link.hasAttribute('download') || link.classList.contains('skip-link')) return;
      const url = new URL(link.href, location.href);
      if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin) return;
      const samePage = url.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '') && url.search === location.search;
      if (samePage && url.hash) {
        let target;
        try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
        if (!target) return;
        event.preventDefault();
        const focus = () => {
          const temporary = !target.hasAttribute('tabindex');
          if (temporary) target.tabIndex = -1;
          target.focus({ preventScroll: true });
          if (temporary) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        };
        history.pushState(null, '', url.hash);
        if (lenis) lenis.scrollTo(target, { duration: 0.9, onComplete: focus });
        else { target.scrollIntoView({ behavior: 'smooth' }); setTimeout(focus, 650); }
        return;
      }
      if (samePage || leaving) return;
      event.preventDefault();
      leaving = true;
      const navigate = () => location.assign(url.href);
      exitTimer = setTimeout(navigate, 450);
      gsap.to([document.querySelector('main'), document.querySelector('footer'), header].filter(Boolean), {
        opacity: 0, y: compact ? 0 : -8, duration: 0.3, ease: 'power2.in',
        overwrite: true, onComplete: () => { clearTimeout(exitTimer); navigate(); },
      });
    });
    restore = () => {
      leaving = false;
      hidden = false;
      clearTimeout(exitTimer);
      menuTween?.progress(1);
      running.forEach((tween) => tween.progress(1));
      gsap.set([document.body, header, document.querySelector('main'), document.querySelector('footer')].filter(Boolean), {
        clearProps: 'opacity,transform',
      });
      lenis?.resize();
      ScrollTrigger.refresh();
    };
    listen(window, 'pageshow', (event) => { if (event.persisted) restore(); });
    listen(window, 'popstate', () => { lenis?.scrollTo(window.scrollY, { immediate: true }); });
    const refresh = () => { lenis?.resize(); ScrollTrigger.refresh(); };
    document.querySelectorAll('img').forEach((image) => { if (!image.complete) listen(image, 'load', refresh, { once: true }); });
    document.fonts?.ready.then(() => { if (!events.signal.aborted) refresh(); });
    listen(window, 'load', refresh, { once: true });

    return () => {
      running.forEach((tween) => tween.progress(1));
      events.abort();
      clearTimeout(exitTimer);
      menuTween?.kill();
      if (nav && menuButton) {
        const open = menuButton.getAttribute('aria-expanded') === 'true';
        nav.classList.toggle('is-open', open);
        nav.inert = !open && getComputedStyle(menuButton).display !== 'none';
      }
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      originals.forEach(([title, html]) => { title.innerHTML = html; });
      gsap.set([nav, ...Array.from(nav?.children || [])].filter(Boolean), { clearProps: 'opacity,transform' });
      root.classList.remove('ponte-motion');
      delete window.PonteMotion;
    };
  });
})();
