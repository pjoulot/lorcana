/**
 * @file
 * Encyclopedia loading fallback.
 *
 * Modern Chromium handles cross-document fade via @view-transition;
 * everywhere else this script flips `is-navigating` on <html> for the
 * brief moment between a click and the new document painting,
 * driving the CSS that dims the grid and shows a spinner.
 */
((Drupal, once) => {
  /**
   * Grid↔list view-mode toggle for /cards.
   *
   * Reads/writes ?view=list (or no param = grid) and sets the
   * data-view-mode attribute on .view-cards so card.css picks up
   * the alternate layout. Injects a small two-button segmented
   * control into the content_top region next to the active-filter
   * chip strip.
   */
  Drupal.behaviors.inkfolkViewToggle = {
    attach(context) {
      once('if-view-toggle', '.view-cards', context).forEach((view) => {
        const params = new URLSearchParams(window.location.search);
        const initial = params.get('view') === 'list' ? 'list' : 'grid';
        view.setAttribute('data-view-mode', initial);

        // Inject the toggle into the content_top wrapper if present;
        // fall back to prepending it inside the view itself.
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
        if (top) {
          top.appendChild(toggle);
        } else {
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

  /**
   * Mobile filter drawer — turns the encyclopedia sidebar into a
   * bottom-sheet drawer on small viewports. The drawer is the
   * same .if-sidebar DOM, just CSS-transformed off-screen until
   * <body class="if-drawer-open"> is set by the trigger button.
   * Backdrop, escape-key, and a footer "Show results" button all
   * close it. Body scroll locks while open.
   */
  Drupal.behaviors.inkfolkFilterDrawer = {
    attach(context) {
      once('if-filter-drawer', '.if-sidebar', context).forEach((sidebar) => {
        // Trigger button — visible only on mobile via CSS.
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

        const top = document.querySelector('.if-main__content-top');
        if (top) {
          top.prepend(trigger);
        }

        // Backdrop.
        const backdrop = document.createElement('div');
        backdrop.className = 'if-sidebar-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);

        // "Show results" footer inside the sidebar (drawer mode only).
        const showResults = document.createElement('button');
        showResults.type = 'button';
        showResults.className = 'if-btn if-btn--primary if-sidebar-close';
        showResults.textContent = Drupal.t('Show results');
        sidebar.appendChild(showResults);

        const open = () => {
          document.body.classList.add('if-drawer-open');
          trigger.setAttribute('aria-expanded', 'true');
        };
        const close = () => {
          document.body.classList.remove('if-drawer-open');
          trigger.setAttribute('aria-expanded', 'false');
        };

        trigger.addEventListener('click', open);
        backdrop.addEventListener('click', close);
        showResults.addEventListener('click', close);
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && document.body.classList.contains('if-drawer-open')) {
            close();
          }
        });
      });
    },
  };

  Drupal.behaviors.inkfolkEncyclopediaLoader = {
    attach(context) {
      // Inject the spinner overlay into the view container exactly once.
      once('if-encyclopedia-loader-element', '.view-cards', context).forEach(
        (view) => {
          const loader = document.createElement('div');
          loader.className = 'if-loader';
          loader.setAttribute('aria-hidden', 'true');
          view.appendChild(loader);
        },
      );

      // Wire facet/sidebar/pager link clicks to flip <html.is-navigating>.
      // The encyclopedia uses standard full-page reloads (Facets 3.x
      // links widget has no AJAX support); this gives us a smooth dim
      // until the next document paints.
      const links = once(
        'if-encyclopedia-loader-link',
        '.if-sidebar a[href], .view-cards .pager a[href]',
        context,
      );
      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          document.documentElement.classList.add('is-navigating');
        });
      });
    },
  };

  // BFCache restore returns us to a stale "is-navigating" state — strip it.
  window.addEventListener('pageshow', () => {
    document.documentElement.classList.remove('is-navigating');
  });
})(Drupal, once);
