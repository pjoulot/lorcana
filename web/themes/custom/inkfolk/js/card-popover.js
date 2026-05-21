/**
 * @file
 * Hover/tap preview popover for inline `[card:...]` chips (.if-card-link).
 *
 * Desktop (fine pointer + hover): the popover opens on hover/focus after a
 * short intent delay and closes on leave/blur. Coarse pointers (touch): the
 * first tap opens the preview and suppresses navigation; a second tap on the
 * same chip follows the link. Escape always closes; the link still works
 * without JS.
 *
 * Each card's fragment is fetched once from data-card-preview and cached for
 * the page lifetime. One shared popover element is reused for every chip.
 */
((Drupal, once) => {
  'use strict';

  const OPEN_DELAY = 120;
  const CLOSE_DELAY = 160;
  const GAP = 10;

  const cache = new Map();
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let popover = null;
  let openTimer = null;
  let closeTimer = null;
  let activeLink = null;
  let abortController = null;

  function getPopover() {
    if (popover) {
      return popover;
    }
    popover = document.createElement('div');
    popover.className = 'if-card-popover';
    popover.setAttribute('role', 'tooltip');
    popover.hidden = true;
    // Keep the popover open while the pointer is over it (desktop).
    popover.addEventListener('mouseenter', () => window.clearTimeout(closeTimer));
    popover.addEventListener('mouseleave', scheduleClose);
    document.body.appendChild(popover);
    return popover;
  }

  function position(link) {
    const el = getPopover();
    const rect = link.getBoundingClientRect();
    const { offsetWidth: pw, offsetHeight: ph } = el;
    const vw = document.documentElement.clientWidth;

    let left = rect.left + window.scrollX + rect.width / 2 - pw / 2;
    left = Math.max(8 + window.scrollX, Math.min(left, window.scrollX + vw - pw - 8));

    // Prefer above the chip; flip below when there isn't room.
    let top = rect.top + window.scrollY - ph - GAP;
    el.classList.remove('if-card-popover--below');
    if (rect.top < ph + GAP) {
      top = rect.bottom + window.scrollY + GAP;
      el.classList.add('if-card-popover--below');
    }

    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
  }

  function render(link, html) {
    const el = getPopover();
    el.innerHTML = html;
    el.hidden = false;
    // Position after layout so width/height are known.
    requestAnimationFrame(() => position(link));
  }

  function open(link) {
    activeLink = link;
    const url = link.dataset.cardPreview;
    if (!url) {
      return;
    }

    if (cache.has(url)) {
      render(link, cache.get(url));
      return;
    }

    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    fetch(url, { signal: abortController.signal, headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then((response) => (response.ok ? response.text() : Promise.reject(response.status)))
      .then((html) => {
        cache.set(url, html);
        // Only render if this link is still the one the user is on.
        if (activeLink === link) {
          render(link, html);
        }
      })
      .catch(() => {
        /* Aborted or failed — leave the chip as a plain link. */
      });
  }

  function close() {
    if (popover) {
      popover.hidden = true;
      popover.innerHTML = '';
    }
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    activeLink = null;
  }

  function scheduleOpen(link) {
    window.clearTimeout(closeTimer);
    window.clearTimeout(openTimer);
    openTimer = window.setTimeout(() => open(link), OPEN_DELAY);
  }

  function scheduleClose() {
    window.clearTimeout(openTimer);
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(close, CLOSE_DELAY);
  }

  function attachHover(link) {
    link.addEventListener('mouseenter', () => scheduleOpen(link));
    link.addEventListener('mouseleave', scheduleClose);
    link.addEventListener('focus', () => open(link));
    link.addEventListener('blur', close);
  }

  function attachTap(link) {
    link.addEventListener('click', (event) => {
      // First tap previews; a second tap on the already-active chip navigates.
      if (activeLink !== link || (popover && popover.hidden)) {
        event.preventDefault();
        open(link);
      }
    });
  }

  Drupal.behaviors.inkfolkCardPopover = {
    attach(context) {
      const links = once('card-popover', '.if-card-link[data-card-preview]', context);
      if (!links.length) {
        return;
      }
      links.forEach((link) => (canHover ? attachHover(link) : attachTap(link)));

      // Bind global dismissers once.
      once('card-popover-global', 'body').forEach((body) => {
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            close();
          }
        });
        if (!canHover) {
          // Tapping anywhere outside an open preview dismisses it.
          body.addEventListener('click', (event) => {
            if (activeLink && !event.target.closest('.if-card-link, .if-card-popover')) {
              close();
            }
          });
        }
        window.addEventListener('scroll', () => {
          if (activeLink) {
            position(activeLink);
          }
        }, { passive: true });
      });
    },
  };
})(Drupal, once);
