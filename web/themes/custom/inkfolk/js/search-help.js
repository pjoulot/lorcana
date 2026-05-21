/**
 * @file
 * Topnav search-syntax help popover.
 *
 * Toggles the `[card:...]`-style search shorthand reference rendered in
 * page.html.twig (the `?` button inside the search pill). The panel is
 * server-rendered and translatable; this only wires open/close, with the
 * usual dismissers (Escape, click-outside) and aria-expanded bookkeeping.
 * The topnav lives outside the /cards AJAX swap root, so a single attach
 * holds for the page lifetime.
 */
((Drupal, once) => {
  'use strict';

  Drupal.behaviors.inkfolkSearchHelp = {
    attach(context) {
      once('if-search-help', '.if-topnav__search-help', context).forEach((trigger) => {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (!panel) {
          return;
        }

        const close = () => {
          panel.hidden = true;
          trigger.setAttribute('aria-expanded', 'false');
        };
        const open = () => {
          panel.hidden = false;
          trigger.setAttribute('aria-expanded', 'true');
        };

        trigger.addEventListener('click', (event) => {
          event.preventDefault();
          panel.hidden ? open() : close();
        });

        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && !panel.hidden) {
            close();
            trigger.focus();
          }
        });

        document.addEventListener('click', (event) => {
          if (!panel.hidden && !event.target.closest('.if-topnav__searchwrap')) {
            close();
          }
        });
      });
    },
  };
})(Drupal, once);
