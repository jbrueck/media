/**
 * Indicia, the OPAL Online Recording Toolkit.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/gpl.html.
 *
 * @package Media
 * @author  Indicia Team
 * @license http://www.gnu.org/licenses/gpl.html GPL 3.0
 * @link    http://code.google.com/p/indicia/
 */

(function ($) {
  'use strict';

  jQuery.fn.reviewInput = function (options) {

    function getValue(el) {
      if ($(el).is(':checkbox:checked')) {
        return '&#10004';
      }
      if ($(el).is(':checkbox')) {
        return '';
      }
      if ($(el).is('select')) {
        return $(el).find('option:selected').html();
      }
      return $(el).val();
    }

    /**
     * Repopulate the value in the review summary when an input is changed.
     */
    function handleInputChange() {
      $('#review-' + this.id.replace(/:/g, '\\:') + ' td').html(getValue(this));
    }

    $.each(this, function () {
      var div = this;
      var container = $(div).find('#' + this.id + '-content');
      var content = '';

      div.settings = $.extend({}, $.fn.reviewInput.defaults, options);

      indiciaFns.on('change', '.ctrl-wrap :input:visible:not(.ac_input)', {}, handleInputChange);
      // autocompletes don't fire when picking from the list, so use blur instead.
      indiciaFns.on('blur', '.ctrl-wrap input.ac_input:visible', {}, handleInputChange);

      // Initial population
      $.each($('.ctrl-wrap :input:visible'), function () {
        var label = $(this).parent('.ctrl-wrap').find('label').html()
            .replace(/:$/, '');
        content += '<tr id="review-' + this.id + '"><th>' + label + '</th><td>' + getValue(this) + '</td></tr>\n';
      });
      $(container).append('<table><tbody>' + content + '</tbody></table>');
    });
    return this;
  };

  jQuery.fn.reviewInput.defaults = {};
}(jQuery));
