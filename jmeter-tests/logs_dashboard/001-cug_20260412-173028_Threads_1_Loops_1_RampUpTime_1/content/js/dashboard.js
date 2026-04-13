/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9642857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "002-requests-10"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-12"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-11"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-13"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-14"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-13"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-16"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-15"], "isController": false}, {"data": [1.0, 500, 1500, "CUG-01"], "isController": false}, {"data": [0.5, 500, 1500, "002-requests"], "isController": true}, {"data": [1.0, 500, 1500, "002-requests-01"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-00"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-01"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-00"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-07"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-06"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-06"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-09"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-08"], "isController": false}, {"data": [1.0, 500, 1500, "CUG-LOGIN"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-03"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-02"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-07"], "isController": false}, {"data": [0.5, 500, 1500, "001-requests"], "isController": true}, {"data": [1.0, 500, 1500, "002-requests-05"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-08"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-04"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26, 0, 0.0, 97.80769230769232, 55, 377, 62.5, 171.3, 310.14999999999975, 377.0, 9.246088193456615, 123.73553909583927, 23.02666307343528], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["002-requests-10", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 16.190378289473685, 43.4313322368421], "isController": false}, {"data": ["002-requests-12", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 5.750868055555555, 25.055239898989896], "isController": false}, {"data": ["002-requests-11", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 25.47481142241379, 45.46066810344827], "isController": false}, {"data": ["001-requests-13", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 1422.8951590401784, 13.628278459821429], "isController": false}, {"data": ["002-requests-14", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 23.684265793010752, 27.2439936155914], "isController": false}, {"data": ["002-requests-13", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 24.23796106557377, 43.224897540983605], "isController": false}, {"data": ["002-requests-16", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 51.190043604651166, 58.65052688953489], "isController": false}, {"data": ["002-requests-15", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 45.9789787371134, 51.848421391752574], "isController": false}, {"data": ["CUG-01", 2, 0, 0.0, 257.5, 138, 377, 257.5, 377.0, 377.0, 377.0, 2.6490066225165565, 14.546254139072847, 2.0785906456953644], "isController": false}, {"data": ["002-requests", 1, 0, 0.0, 1301.0, 1301, 1301, 1301.0, 1301.0, 1301.0, 1301.0, 0.7686395080707148, 57.8588885953113, 38.51454410069178], "isController": true}, {"data": ["002-requests-01", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 16.653878348214285, 44.20689174107143], "isController": false}, {"data": ["002-requests-00", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 16.880580357142858, 44.20689174107143], "isController": false}, {"data": ["001-requests-01", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 19.4549560546875, 38.3758544921875], "isController": false}, {"data": ["001-requests-00", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 156.0, 6.41025641025641, 71.08248197115384, 9.452624198717949], "isController": false}, {"data": ["002-requests-07", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 13.74368106617647, 36.40567555147059], "isController": false}, {"data": ["001-requests-06", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 19.034402412280702, 44.45929276315789], "isController": false}, {"data": ["002-requests-06", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 16.378837719298247, 43.4313322368421], "isController": false}, {"data": ["002-requests-09", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 16.618399784482758, 42.6825161637931], "isController": false}, {"data": ["002-requests-08", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 16.281960227272727, 45.01065340909091], "isController": false}, {"data": ["CUG-LOGIN", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 22.367527173913043, 9.247622282608695], "isController": false}, {"data": ["002-requests-03", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 16.11328125, 42.6825161637931], "isController": false}, {"data": ["002-requests-02", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 16.652960526315788, 43.4313322368421], "isController": false}, {"data": ["001-requests-07", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 19.346039870689655, 43.238146551724135], "isController": false}, {"data": ["001-requests", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 423.3909058415033, 19.62539573120915], "isController": true}, {"data": ["002-requests-05", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 361.2922219669117, 18.06640625], "isController": false}, {"data": ["001-requests-08", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 516.4240056818181, 9.161931818181818], "isController": false}, {"data": ["002-requests-04", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 16.671316964285715, 44.20689174107143], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
