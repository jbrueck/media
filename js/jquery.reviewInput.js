(function ($) {
  'use strict';

  jQuery.fn.reviewInput = function (options) {
    $.each(this, function() {
      var div = this;
      var container = $(div).find('#' + this.id + '-content');
      var content = '';

      this.settings = $.extend({}, $.fn.reviewInput.defaults, options);

      indiciaFns.on('change', '.ctrl-wrap input:visible', {}, function () {
        $('#review-' + this.id.replace(':', '\\:') + ' td').html($(this).val());
      });

      // Initial population
      $.each($('.ctrl-wrap input:visible'), function () {
        var label = $(this).parent('.ctrl-wrap').find('label').html()
            .replace(/:$/, '');
        content += '<tr id="review-' + this.id + '"><th>' + label + '</th><td>' + $(this).val() + '</td></tr>\n';
      });
      $(container).append('<table><tbody>' + content + '</tbody></table>');
    });
    return this;
  };

  jQuery.fn.reviewInput.defaults = {};
}(jQuery));
