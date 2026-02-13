/**
 * Computer Ally Core — Admin JavaScript
 *
 * Enhancements for the ticket editing experience in wp-admin.
 */

(function ($) {
  'use strict';

  $(document).ready(function () {
    // Auto-populate ticket title from job number + customer
    var $title = $('#title');
    var $jobNum = $('#ca_job_number');
    var $customer = $('#ca_customer_id');

    if ($title.length && $jobNum.length && !$title.val()) {
      function updateTitle() {
        var job = $jobNum.val();
        var customer = $customer.find('option:selected').text().trim();
        if (job && customer && customer !== '— Select —') {
          $title.val(job + ' — ' + customer);
        }
      }
      $customer.on('change', updateTitle);
    }

    // Visual status change confirmation
    var $statusSelect = $('#ca_status');
    if ($statusSelect.length) {
      var originalStatus = $statusSelect.val();
      $statusSelect.on('change', function () {
        if ($(this).val() !== originalStatus) {
          $(this).css('border-color', '#66B87A');
        } else {
          $(this).css('border-color', '');
        }
      });
    }
  });
})(jQuery);
