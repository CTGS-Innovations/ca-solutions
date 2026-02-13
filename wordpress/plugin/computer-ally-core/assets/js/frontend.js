/**
 * Computer Ally Core — Frontend JavaScript
 *
 * Handles add-on request buttons on the customer repair status page.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Add-on request buttons
    var buttons = document.querySelectorAll('.ca-request-addon');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var token = this.dataset.token;
        var catalogId = this.dataset.catalogId;
        var button = this;

        if (!token || !catalogId) return;

        button.disabled = true;
        button.textContent = 'Requesting...';

        fetch(caCore.restUrl + 'repair/' + encodeURIComponent(token) + '/addon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ catalogItemId: catalogId }),
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.success) {
              button.textContent = 'Requested';
              button.classList.add('requested');
            } else {
              button.textContent = data.message || 'Already requested';
              button.classList.add('requested');
            }
          })
          .catch(function () {
            button.textContent = 'Error — try again';
            button.disabled = false;
          });
      });
    });
  });
})();
