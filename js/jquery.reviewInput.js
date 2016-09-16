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
    /**
     * General purpose code to retrieve the display value from a variety of form inputs.
     * @param el Form element
     * @returns string
     */
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

    /**
     * Repopulate the value in the review summary when an input is changed in a species checklist grid row.
     */
    function handleGridInputChange() {
      var $table = $(this).closest('table');
      var $row = $(this).closest('tr');
      var $td = $(this).closest('td');
      var reviewTableBody = $('#review-' + $table.attr('id') + ' tbody');
      $(reviewTableBody).find('tr:nth-child(' + ($row.index() + 1) + ') ' +
          'td[headers="review-' + $td.attr('headers') + '"]').html(getValue(this));
    }

    $.each(this, function () {
      var div = this;
      var container = $(div).find('#' + this.id + '-content');
      var content = '';

      div.settings = $.extend({}, $.fn.reviewInput.defaults, options);

      // Trap new rows in species checklists so they can be reflected in output
      if (typeof window.hook_species_checklist_new_row !== 'undefined') {
        window.hook_species_checklist_new_row.push(function (data, row) {
          var $table = $(row).closest('table');
          var reviewTableBody = $('#review-' + $table.attr('id') + ' tbody');
          var rowTemplate;
          var value;
          var $td;
          if (!$(reviewTableBody).find('tr:nth-child(' + ($(row).index() + 1) + ')').length) {
            $.each($table.find('thead tr:first-child th:visible'), function (idx) {
              $td = $(row).find('td[headers="' + this.id + '"]');
              if (idx === 0) {
                value = $(row).find('.scTaxonCell').html();
              } else if ($td.hasClass('scAddMediaCell')) {
                value = 'photos';
              } else {
                value = getValue($td.find('input'));
              }
              rowTemplate += '<td headers="review-' + this.id + '">' + value + '</td>';
            });
            $(reviewTableBody).append('<tr>' + rowTemplate + '</tr>');
          }
        });
      }

      // Trap changes to inputs to update the review
      indiciaFns.on('change', '.ctrl-wrap :input:visible:not(.ac_input)', {}, handleInputChange);
      // autocompletes don't fire when picking from the list, so use blur instead.
      indiciaFns.on('blur', '.ctrl-wrap input.ac_input:visible', {}, handleInputChange);

      // Initial population of basic inputs
      $.each($('.ctrl-wrap :input:visible').not('button,#imp-georef-search'), function () {
        var label;
        // skip buttons, place searches etc
        if ($.inArray(this.id, div.settings.exclude) === -1 &&
          $.inArray($(this).attr('name'), div.settings.exclude) === -1) {
          label = $(this).parent('.ctrl-wrap').find('label').text()
            .replace(/:$/, '');
          content += '<tr id="review-' + this.id + '"><th>' + label + '</th><td>' + getValue(this) + '</td></tr>\n';
        }
      });
      $(container).append('<table><tbody>' + content + '</tbody></table>');

      // Initial population of species checklists
      $.each($('table.species-grid'), function () {
        var head = '';
        $.each($(this).find('thead tr:first-child th:visible'), function () {
          head += '<th id="review-' + this.id + '">' + $(this).text() + '</th>';
        });
        $(container).append('<table id="review-' + this.id + '"><thead><tr>' + head + '</tr></thead>' +
            '<tbody></tbody></table>');
      });

      // Trap changes to species checklist inputs to update the review
      indiciaFns.on('change', 'table.species-grid :input:visible:not(.ac_input)', {}, handleGridInputChange);
      // autocompletes don't fire when picking from the list, so use blur instead.
      indiciaFns.on('blur', 'table.species-grid input.ac_input:visible', {}, handleGridInputChange);
    });
    return this;
  };

  jQuery.fn.reviewInput.defaults = {
    exclude: ['sample:entered_sref_system']
  };
}(jQuery));
