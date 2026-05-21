/**
 * @file
 * Encyclopedia (/cards) client behaviors.
 *
 * Facets 3.x ships no AJAX-with-Views integration of its own, so this
 * file provides a progressive-enhancement shim: facet clicks (and the
 * cost slider) fetch the target URL and swap the relevant regions in
 * place, instead of doing a full-page reload. Real <a hrefs> remain the
 * fallback when JS is off. The pager stays on Views' own AJAX.
 */
((Drupal, drupalSettings, once) => {
  'use strict';

  // The whole filterable region — sidebar facets, the summary-chip
  // strip, and the results view all live inside this single element,
  // so one innerHTML swap keeps them consistent after a filter change.
  const SWAP_ROOT = '.if-main--with-sidebar';
  const VIEW = '.view-cards';

  // Only one filter request is ever in flight; a newer click aborts
  // the older fetch so the latest selection always wins.
  let inflight = null;

  /**
   * Recursively merge a fetched page's drupalSettings into the live
   * one. Needed so behaviors re-attached after a swap (the cost slider,
   * Views' pager AJAX) read URL templates / dom-ids for the *new* state
   * rather than the state the page first loaded with.
   */
  function deepMerge(target, source) {
    Object.keys(source).forEach((key) => {
      const value = source[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        deepMerge(target[key], value);
      } else {
        target[key] = value;
      }
    });
    return target;
  }

  function applySettings(doc) {
    const json = doc.querySelector(
      'script[data-drupal-selector="drupal-settings-json"]',
    );
    if (!json) return;
    try {
      deepMerge(drupalSettings, JSON.parse(json.textContent));
    } catch (e) {
      // Malformed settings shouldn't break the swap — behaviors will
      // just re-run against the previous settings.
    }
  }

  // Facet links don't carry the client-only ?view= mode; merge it back
  // in so the grid/list toggle stays put across a filter change.
  function withViewMode(rawUrl) {
    const url = new URL(rawUrl, window.location.origin);
    const current = new URLSearchParams(window.location.search).get('view');
    if (current === 'list') {
      url.searchParams.set('view', 'list');
    } else {
      url.searchParams.delete('view');
    }
    return url;
  }

  async function navigate(rawUrl, { push = true, scrollTop = false } = {}) {
    const main = document.querySelector(SWAP_ROOT);
    if (!main) {
      window.location.href = rawUrl;
      return;
    }
    const url = withViewMode(rawUrl);

    const view = main.querySelector(VIEW);
    if (view) view.classList.add('is-loading');

    if (inflight) inflight.abort();
    inflight = new AbortController();

    let html;
    try {
      const response = await fetch(url.href, {
        credentials: 'same-origin',
        signal: inflight.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      html = await response.text();
    } catch (error) {
      if (error.name === 'AbortError') return;
      window.location.href = url.href; // Hard fallback on any failure.
      return;
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fresh = doc.querySelector(SWAP_ROOT);
    if (!fresh) {
      window.location.href = url.href;
      return;
    }

    Drupal.detachBehaviors(main, drupalSettings, 'unload');
    applySettings(doc);
    main.innerHTML = fresh.innerHTML;
    Drupal.attachBehaviors(main, drupalSettings);

    if (push) {
      window.history.pushState({ inkfolkFilter: true }, '', url.href);
    }
    // Paging jumps to a fresh slice of results — bring the top of the
    // grid back into view. Facet changes keep the scroll position.
    if (scrollTop) {
      main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function isPlainClick(event) {
    return !(
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    );
  }

  /**
   * Delegated click handler on the (persistent) swap root. Intercepts
   * facet links, summary chips, "Clear all", and the pager. The pager
   * is handled here too — Views' own AJAX drops the facet `f[]` params
   * when paging, so we route every results-changing link through the
   * one fetch that carries the full query string.
   */
  Drupal.behaviors.inkfolkAjaxFilters = {
    attach(context) {
      once('if-ajax-root', SWAP_ROOT, context).forEach((main) => {
        main.addEventListener('click', (event) => {
          const link = event.target.closest('a[href]');
          if (!link || !isPlainClick(event)) return;
          if (
            !link.closest('.if-sidebar, .if-main__content-top, .view-cards .pager')
          ) {
            return;
          }

          const dest = new URL(link.href, window.location.origin);
          if (
            dest.origin !== window.location.origin ||
            dest.pathname !== window.location.pathname
          ) {
            return; // Leaves real off-page links (e.g. a card) alone.
          }
          event.preventDefault();
          navigate(link.href, { scrollTop: !!link.closest('.pager') });
        });
      });
    },
  };

  window.addEventListener('popstate', () => {
    if (document.querySelector(SWAP_ROOT)) {
      navigate(window.location.href, { push: false });
    }
  });

  // ───── Cost range-slider → AJAX ─────────────────────────
  //
  // facets_range_widget's slider.js navigates by assigning
  // window.location.href inside its jQuery-UI `stop` callback. We wrap
  // Drupal.facets.addSlider so that callback routes through navigate()
  // instead. The accessor below captures whatever slider.js assigns
  // (whenever it loads) and hands callers a wrapped version, so this is
  // safe regardless of script load order.
  Drupal.facets = Drupal.facets || {};
  if (!Drupal.facets.inkfolkSliderWrapped) {
    let realAddSlider = Drupal.facets.addSlider;
    Object.defineProperty(Drupal.facets, 'addSlider', {
      configurable: true,
      get() {
        return function inkfolkAddSlider(facet, settings) {
          const patched = Object.assign({}, settings, {
            stop: (event, ui) => {
              const href = settings.range
                ? settings.url
                    .replace('__range_slider_min__', ui.values[0])
                    .replace('__range_slider_max__', ui.values[1])
                : settings.urls[`f_${ui.value}`];
              navigate(href);
            },
          });
          return realAddSlider.call(this, facet, patched);
        };
      },
      set(fn) {
        realAddSlider = fn;
      },
    });
    Drupal.facets.inkfolkSliderWrapped = true;
  }

  // ───── Grid ↔ list view-mode toggle ─────────────────────
  //
  // Reads/writes ?view=list (or no param = grid) and sets the
  // data-view-mode attribute on .view-cards so card.css picks up the
  // alternate layout. Injects a small segmented control into the
  // content_top region next to the active-filter chips.
  Drupal.behaviors.inkfolkViewToggle = {
    attach(context) {
      once('if-view-toggle', '.view-cards', context).forEach((view) => {
        const params = new URLSearchParams(window.location.search);
        const initial = params.get('view') === 'list' ? 'list' : 'grid';
        view.setAttribute('data-view-mode', initial);

        const toggle = document.createElement('div');
        toggle.className = 'if-view-toggle';
        toggle.setAttribute('role', 'group');
        toggle.setAttribute('aria-label', Drupal.t('View mode'));
        toggle.innerHTML = `
          <button type="button" class="if-view-toggle__btn" data-view="grid" aria-pressed="${initial === 'grid'}">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <rect x="1" y="1" width="6" height="6" rx="1"/>
              <rect x="9" y="1" width="6" height="6" rx="1"/>
              <rect x="1" y="9" width="6" height="6" rx="1"/>
              <rect x="9" y="9" width="6" height="6" rx="1"/>
            </svg>
            ${Drupal.t('Grid')}
          </button>
          <button type="button" class="if-view-toggle__btn" data-view="list" aria-pressed="${initial === 'list'}">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <rect x="1" y="2" width="14" height="2" rx="1"/>
              <rect x="1" y="7" width="14" height="2" rx="1"/>
              <rect x="1" y="12" width="14" height="2" rx="1"/>
            </svg>
            ${Drupal.t('List')}
          </button>
        `;

        const top = document.querySelector('.if-main__content-top');
        if (top && !top.querySelector('.if-view-toggle')) {
          top.appendChild(toggle);
        } else if (!top) {
          view.prepend(toggle);
        }

        toggle.addEventListener('click', (event) => {
          const button = event.target.closest('[data-view]');
          if (!button) return;
          const mode = button.dataset.view;
          view.setAttribute('data-view-mode', mode);
          toggle.querySelectorAll('[data-view]').forEach((b) => {
            b.setAttribute('aria-pressed', b.dataset.view === mode);
          });
          const url = new URL(window.location.href);
          if (mode === 'list') {
            url.searchParams.set('view', 'list');
          } else {
            url.searchParams.delete('view');
          }
          window.history.replaceState({}, '', url);
        });
      });
    },
  };

  // ───── Mobile filter drawer ──────────────────────────────
  //
  // Turns the encyclopedia sidebar into a bottom-sheet drawer on small
  // viewports. The backdrop and Escape-key handler are wired once for
  // the page lifetime (they survive AJAX swaps); the trigger and
  // "Show results" button live inside swapped regions, so they're
  // re-injected on each attach.
  let drawerBackdrop = null;

  const openDrawer = () => {
    document.body.classList.add('if-drawer-open');
    const trigger = document.querySelector('.if-sidebar-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  };
  const closeDrawer = () => {
    document.body.classList.remove('if-drawer-open');
    const trigger = document.querySelector('.if-sidebar-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  };

  Drupal.behaviors.inkfolkFilterDrawer = {
    attach(context) {
      if (!drawerBackdrop) {
        drawerBackdrop = document.createElement('div');
        drawerBackdrop.className = 'if-sidebar-backdrop';
        drawerBackdrop.setAttribute('aria-hidden', 'true');
        drawerBackdrop.addEventListener('click', closeDrawer);
        document.body.appendChild(drawerBackdrop);
        document.addEventListener('keydown', (event) => {
          if (
            event.key === 'Escape' &&
            document.body.classList.contains('if-drawer-open')
          ) {
            closeDrawer();
          }
        });
      }

      once('if-filter-drawer', '.if-sidebar', context).forEach((sidebar) => {
        const top = document.querySelector('.if-main__content-top');
        if (top && !top.querySelector('.if-sidebar-trigger')) {
          const trigger = document.createElement('button');
          trigger.type = 'button';
          trigger.className = 'if-sidebar-trigger';
          trigger.setAttribute('aria-expanded', 'false');
          trigger.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            ${Drupal.t('Filters')}
          `;
          trigger.addEventListener('click', openDrawer);
          top.prepend(trigger);
        }

        const showResults = document.createElement('button');
        showResults.type = 'button';
        showResults.className = 'if-btn if-btn--primary if-sidebar-close';
        showResults.textContent = Drupal.t('Show results');
        showResults.addEventListener('click', closeDrawer);
        sidebar.appendChild(showResults);
      });
    },
  };

  // ───── Loading spinner element ───────────────────────────
  //
  // A throbber overlay injected into the view; CSS reveals it while
  // .view-cards carries .is-loading (set by navigate() during a facet
  // fetch). Drupal's own .ajax-progress covers the pager.
  Drupal.behaviors.inkfolkEncyclopediaLoader = {
    attach(context) {
      once('if-encyclopedia-loader-element', '.view-cards', context).forEach(
        (view) => {
          const loader = document.createElement('div');
          loader.className = 'if-loader';
          loader.setAttribute('aria-hidden', 'true');
          view.appendChild(loader);
        },
      );
    },
  };

  /**
   * Card-detail image lightbox.
   *
   * The Twig template renders an invisible <button class="if-card-detail__zoom">
   * sitting on top of the card image. Activating it opens a full-viewport
   * overlay with the unstyled original (derived by stripping the
   * `/styles/{name}/public/` segment from the rendered <img src>).
   * Dismiss via Esc, backdrop, the close ✕, or clicking the image.
   */
  Drupal.behaviors.inkfolkCardLightbox = {
    attach(context) {
      once('if-card-lightbox', '.if-card-detail__zoom', context).forEach(
        (trigger) => {
          trigger.addEventListener('click', () => openLightbox(trigger));
        },
      );
    },
  };

  function openLightbox(trigger) {
    const img = trigger.parentElement.querySelector('.if-card-image img');
    if (!img) return;

    const styled = img.getAttribute('src');
    const fullSrc = styled
      .replace(/\/styles\/[^/]+\/public\//, '/')
      .split('?')[0];
    const alt = img.getAttribute('alt') || '';

    const overlay = document.createElement('div');
    overlay.className = 'if-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', Drupal.t('Card image, larger view'));

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'if-lightbox__close';
    close.setAttribute('aria-label', Drupal.t('Close'));
    close.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const full = document.createElement('img');
    full.className = 'if-lightbox__image';
    full.src = fullSrc;
    full.alt = alt;

    overlay.appendChild(close);
    overlay.appendChild(full);
    document.body.appendChild(overlay);
    document.body.classList.add('if-lightbox-open');

    const dismiss = () => {
      overlay.remove();
      document.body.classList.remove('if-lightbox-open');
      document.removeEventListener('keydown', onKey);
      trigger.focus();
    };
    const onKey = (event) => {
      if (event.key === 'Escape') dismiss();
    };

    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', (event) => {
      // Clicking backdrop, the image, or the close button all dismiss.
      if (
        event.target === overlay ||
        event.target === full ||
        event.target.closest('.if-lightbox__close')
      ) {
        dismiss();
      }
    });

    close.focus();
  }
})(Drupal, drupalSettings, once);
