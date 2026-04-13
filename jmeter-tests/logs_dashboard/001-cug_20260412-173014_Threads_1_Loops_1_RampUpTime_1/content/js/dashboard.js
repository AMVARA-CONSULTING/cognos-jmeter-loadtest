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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9285714285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "002-requests-10"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-12"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-11"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-13"], "isController": false}, {"data": [0.5, 500, 1500, "002-requests-14"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-13"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-16"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-15"], "isController": false}, {"data": [1.0, 500, 1500, "CUG-01"], "isController": false}, {"data": [0.0, 500, 1500, "002-requests"], "isController": true}, {"data": [1.0, 500, 1500, "002-requests-01"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-00"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-01"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-00"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-07"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-06"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-06"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-09"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-08"], "isController": false}, {"data": [1.0, 500, 1500, "CUG-LOGIN"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-03"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-02"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-07"], "isController": false}, {"data": [0.5, 500, 1500, "001-requests"], "isController": true}, {"data": [1.0, 500, 1500, "002-requests-05"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-08"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-04"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26, 0, 0.0, 163.8461538461538, 54, 1259, 85.0, 330.00000000000017, 992.649999999999, 1259.0, 5.728133950209298, 76.65875777979731, 14.256865843247413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["002-requests-10", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 16.190378289473685, 43.39706688596491], "isController": false}, {"data": ["002-requests-12", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 2.795649509803922, 12.149586397058824], "isController": false}, {"data": ["002-requests-11", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 17.394301470588236, 30.997242647058822], "isController": false}, {"data": ["001-requests-13", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 1397.9320860745613, 13.389185855263158], "isController": false}, {"data": ["002-requests-14", 1, 0, 0.0, 1259.0, 1259, 1259, 1259.0, 1259.0, 1259.0, 1259.0, 0.7942811755361397, 3.5091094122319304, 4.023375446783161], "isController": false}, {"data": ["002-requests-13", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 17.394301470588236, 30.997242647058822], "isController": false}, {"data": ["002-requests-16", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 20.194237385321102, 23.128404529816514], "isController": false}, {"data": ["002-requests-15", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 50.08997542134831, 56.4870084269663], "isController": false}, {"data": ["CUG-01", 2, 0, 0.0, 306.0, 114, 498, 306.0, 498.0, 498.0, 498.0, 2.336448598130841, 12.829932096962617, 1.833336375584112], "isController": false}, {"data": ["002-requests", 1, 0, 0.0, 2768.0, 2768, 2768, 2768.0, 2768.0, 2768.0, 2768.0, 0.361271676300578, 27.198747403359828, 18.090396947254337], "isController": true}, {"data": ["002-requests-01", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 15.042212701612904, 39.89730342741935], "isController": false}, {"data": ["002-requests-00", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 16.880580357142858, 44.17201450892857], "isController": false}, {"data": ["001-requests-01", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 19.155649038461537, 37.75540865384615], "isController": false}, {"data": ["001-requests-00", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 69.293212890625, 9.21630859375], "isController": false}, {"data": ["002-requests-07", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 16.974431818181817, 44.97514204545455], "isController": false}, {"data": ["001-requests-06", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 17.49936995967742, 40.84236391129032], "isController": false}, {"data": ["002-requests-06", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 17.28877314814815, 45.8080150462963], "isController": false}, {"data": ["002-requests-09", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 17.2119140625, 44.17201450892857], "isController": false}, {"data": ["002-requests-08", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 15.9912109375, 44.17201450892857], "isController": false}, {"data": ["CUG-LOGIN", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 11.083142510775861, 4.583950700431034], "isController": false}, {"data": ["002-requests-03", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 16.395970394736842, 43.39706688596491], "isController": false}, {"data": ["002-requests-02", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 16.08845338983051, 41.925979872881356], "isController": false}, {"data": ["001-requests-07", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 12.908584770114944, 28.802981321839084], "isController": false}, {"data": ["001-requests", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 399.86768180941357, 18.526053722993826], "isController": true}, {"data": ["002-requests-05", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 190.44861312984494, 9.515806686046512], "isController": false}, {"data": ["001-requests-08", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 532.562255859375, 9.4482421875], "isController": false}, {"data": ["002-requests-04", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 16.096443965517242, 42.64884159482759], "isController": false}]}, function(index, item){
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
