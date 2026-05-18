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
