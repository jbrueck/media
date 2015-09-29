/* Indicia, the OPAL Online Recording Toolkit.
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
 */

var displayReportMetadata;

jQuery(document).ready(function($) {

  /**
   * When clicking on an entry in the list of reports available, display the title and description of that report
   * in the metadata panel on the report_picker.
   */
  displayReportMetadata = function (control, path) {
    // safe for Windows paths
    path = path.replace('\\', '/');
    path = path.split('/');
    var current = indiciaData.reportList;
    $.each(path, function (idx, item) {
      current = current[item];
      if (current.type === 'report') {
        $('#' + control + ' .report-metadata').html('<strong>' + current.title + '</strong><br/>' +
          '<p>' + current.description + '</p>');
        $('#picker-more').show();
      } else {
        current = current['content'];
      }
    });
  }

  function showMoreInfo() {
    var rpt = $('ul.treeview input:checked').val();
    $.ajax({
      dataType: "jsonp",
      url: indiciaData.read.url+'index.php/services/report/requestReport',
      data: {"reportSource":"local","report":rpt+'.xml', 'wantRecords':0, 'wantColumns':1, 'wantCount':0, 'wantParameters':1,
        "auth_token":indiciaData.read.auth_token, "nonce":indiciaData.read.nonce},
      success: function(data) {
        if (typeof data.columns!=="undefined") {
          var rows='';
          $.each(data.columns, function(field, def) {
            if (typeof def.display==="undefined") {
              def.display='Not set';
            }
            rows += '<tr><th schope="row">' + field + '</th><td>' + def.display + '</td></tr>';
          });
          $.fancybox('<table class="report-metadata ui-widget"><caption>Report columns</caption>' +
              '<thead class="ui-widget-header"><tr><th>Field</th><th>Title</th></tr></thead>' +
              '<tbody>' + rows + '</tbody></table>');
        }
      },
      error: function() {
        alert('Report information could not be obtained');
      }
    });
  }

  $('#picker-more').click(showMoreInfo);

  $('#picker-more').hide();

});