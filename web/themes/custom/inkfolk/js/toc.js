/**
 * @file
 * Auto table of contents for the "On this page" block.
 *
 * Scans the page's main content for rich-text headings (.if-rt__body h2),
 * gives each a slug id, builds a numbered link list inside .if-toc, and
 * highlights the section nearest the top as you scroll.
 */
((Drupal, once) => {
  'use strict';

  const slugify = (text, i) =>
    (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50) || `section-${i + 1}`;

  Drupal.behaviors.inkfolkToc = {
    attach() {
      once('if-toc', '.if-toc').forEach((toc) => {
        const scope =
          document.querySelector('.region-content') ||
          document.querySelector('main') ||
          document;
        const headings = Array.from(scope.querySelectorAll('.if-rt__body h2'));

        if (!headings.length) {
          toc.hidden = true;
          return;
        }

        const nav = document.createElement('nav');
        nav.className = 'if-toc__nav';
        const items = [];

        headings.forEach((h, i) => {
          if (!h.id) {
            h.id = slugify(h.textContent, i);
          }
          const a = document.createElement('a');
          a.href = `#${h.id}`;
          const num = document.createElement('span');
          num.className = 'if-toc__num';
          num.textContent = String(i + 1).padStart(2, '0');
          a.appendChild(num);
          a.appendChild(document.createTextNode(h.textContent));
          nav.appendChild(a);
          items.push({ a, h });
        });

        const label = toc.querySelector('.if-toc__label');
        if (label) {
          label.insertAdjacentElement('afterend', nav);
        } else {
          toc.appendChild(nav);
        }

        const sync = () => {
          let active = items[0];
          items.forEach((item) => {
            if (item.h.getBoundingClientRect().top <= 120) {
              active = item;
            }
          });
          items.forEach((item) =>
            item.a.classList.toggle('is-active', item === active),
          );
        };
        sync();
        window.addEventListener('scroll', sync, { passive: true });
      });
    },
  };
})(Drupal, once);
