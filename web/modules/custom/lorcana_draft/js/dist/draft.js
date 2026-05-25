/* Placeholder draft bundle — replaced by the Vite/React build (commit 4).
 * Confirms the /draft route, library, and drupalSettings wiring end to end. */
(function () {
  'use strict';
  var el = document.getElementById('lorcana-draft-app');
  if (!el) {
    return;
  }
  var settings = (window.drupalSettings && window.drupalSettings.lorcanaDraft) || {};
  var count = (settings.sets || []).length;
  el.textContent = count
    ? 'Draft simulator — ' + count + ' draftable set(s) ready. React app lands in commit 4.'
    : 'Draft simulator — no draftable sets flagged yet (commit 3). React app lands in commit 4.';
})();
