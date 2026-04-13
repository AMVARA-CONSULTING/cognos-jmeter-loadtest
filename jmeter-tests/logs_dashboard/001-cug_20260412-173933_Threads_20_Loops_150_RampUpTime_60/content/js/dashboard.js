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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9663602451372235, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9998333333333334, 500, 1500, "002-requests-10"], "isController": false}, {"data": [0.991, 500, 1500, "002-requests-12"], "isController": false}, {"data": [0.9986666666666667, 500, 1500, "002-requests-11"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-13"], "isController": false}, {"data": [0.9665, 500, 1500, "002-requests-14"], "isController": false}, {"data": [0.9996666666666667, 500, 1500, "002-requests-13"], "isController": false}, {"data": [0.9925, 500, 1500, "002-requests-16"], "isController": false}, {"data": [0.9885, 500, 1500, "002-requests-15"], "isController": false}, {"data": [0.975, 500, 1500, "CUG-01"], "isController": false}, {"data": [0.3908333333333333, 500, 1500, "002-requests"], "isController": true}, {"data": [0.9996666666666667, 500, 1500, "002-requests-01"], "isController": false}, {"data": [0.9986666666666667, 500, 1500, "002-requests-00"], "isController": false}, {"data": [0.9978333333333333, 500, 1500, "001-requests-01"], "isController": false}, {"data": [0.9993333333333333, 500, 1500, "001-requests-00"], "isController": false}, {"data": [0.9998333333333334, 500, 1500, "002-requests-07"], "isController": false}, {"data": [0.9998333333333334, 500, 1500, "001-requests-06"], "isController": false}, {"data": [0.9995, 500, 1500, "002-requests-06"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "002-requests-09"], "isController": false}, {"data": [0.9988333333333334, 500, 1500, "002-requests-08"], "isController": false}, {"data": [0.925, 500, 1500, "CUG-LOGIN"], "isController": false}, {"data": [0.9995, 500, 1500, "002-requests-03"], "isController": false}, {"data": [0.9996666666666667, 500, 1500, "002-requests-02"], "isController": false}, {"data": [0.9996666666666667, 500, 1500, "001-requests-07"], "isController": false}, {"data": [0.8471666666666666, 500, 1500, "001-requests"], "isController": true}, {"data": [0.9938333333333333, 500, 1500, "002-requests-05"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-08"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "002-requests-04"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 69060, 0, 0.0, 86.20034752389148, 50, 3420, 62.0, 122.0, 170.0, 345.0, 193.5473022207773, 2812.0833874876685, 522.7359970026232], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["002-requests-10", 3000, 0, 0.0, 63.551666666666655, 51, 510, 58.0, 66.0, 90.94999999999982, 179.97999999999956, 8.519774396373984, 7.860273969320292, 21.107241861485505], "isController": false}, {"data": ["002-requests-12", 3000, 0, 0.0, 137.20799999999983, 78, 2998, 101.0, 197.0, 253.0, 854.6399999999921, 8.517331349741498, 4.845887428738328, 21.14277788858195], "isController": false}, {"data": ["002-requests-11", 3000, 0, 0.0, 66.88799999999998, 51, 839, 59.0, 67.0, 99.94999999999982, 219.97999999999956, 8.520185740049133, 12.584810794187813, 22.48114243265503], "isController": false}, {"data": ["001-requests-13", 3000, 0, 0.0, 97.21966666666702, 66, 358, 91.0, 120.0, 124.0, 315.0, 8.513729808270806, 1356.7796315931741, 12.995077822585221], "isController": false}, {"data": ["002-requests-14", 3000, 0, 0.0, 186.78933333333373, 70, 3420, 90.0, 233.0, 427.59999999999854, 2672.5999999999913, 8.52633643218294, 37.540998577878135, 43.22203104083831], "isController": false}, {"data": ["002-requests-13", 3000, 0, 0.0, 69.66100000000003, 54, 886, 62.0, 77.0, 109.94999999999982, 201.95999999999913, 8.526263734389833, 12.598984037946137, 22.49717967182411], "isController": false}, {"data": ["002-requests-16", 3000, 0, 0.0, 126.27833333333346, 71, 1445, 90.0, 200.9000000000001, 284.9499999999998, 553.9599999999991, 8.592246356887545, 37.82563886484253, 43.35476338027564], "isController": false}, {"data": ["002-requests-15", 3000, 0, 0.0, 131.48499999999999, 70, 2502, 90.0, 203.0, 300.9499999999998, 733.9899999999998, 8.59244323259171, 38.31824953045878, 43.22989090819261], "isController": false}, {"data": ["CUG-01", 40, 0, 0.0, 228.4, 107, 881, 220.0, 380.19999999999993, 584.5499999999992, 881.0, 0.6979584714709475, 3.8324497524428547, 0.5476656560809632], "isController": false}, {"data": ["002-requests", 3000, 0, 0.0, 1495.8200000000022, 1049, 6782, 1324.0, 1710.8000000000002, 2081.0, 5792.949999999999, 8.48250765546316, 638.4374159480687, 425.3041531241076], "isController": true}, {"data": ["002-requests-01", 3000, 0, 0.0, 63.25566666666666, 51, 997, 58.0, 65.0, 86.0, 170.98999999999978, 8.515663143074494, 7.939655593761709, 21.097056472329772], "isController": false}, {"data": ["002-requests-00", 3000, 0, 0.0, 68.35066666666673, 51, 1025, 58.0, 71.0, 112.0, 334.9599999999991, 8.515421428206482, 8.047671990224297, 21.09645763790725], "isController": false}, {"data": ["001-requests-01", 3000, 0, 0.0, 78.63400000000014, 57, 1921, 65.0, 92.0, 135.0, 287.97999999999956, 8.51694446100517, 10.609476205254104, 20.93388429092179], "isController": false}, {"data": ["001-requests-00", 3000, 0, 0.0, 83.44199999999996, 56, 773, 67.0, 124.0, 172.0, 277.0, 8.511121198365865, 94.31210525242567, 12.550579110871539], "isController": false}, {"data": ["002-requests-07", 3000, 0, 0.0, 63.927999999999955, 51, 707, 58.0, 66.0, 96.94999999999982, 183.96999999999935, 8.519338899301415, 7.949386252626796, 21.106162943005625], "isController": false}, {"data": ["001-requests-06", 3000, 0, 0.0, 63.31833333333327, 51, 512, 58.0, 66.0, 88.0, 169.0, 8.517282986727233, 9.238687429022642, 21.600129090070265], "isController": false}, {"data": ["002-requests-06", 3000, 0, 0.0, 65.23766666666657, 50, 1021, 58.0, 67.0, 94.0, 226.9499999999989, 8.519169551352133, 7.95129979010896, 21.105743393384014], "isController": false}, {"data": ["002-requests-09", 3000, 0, 0.0, 66.16733333333345, 51, 994, 58.0, 70.0, 104.0, 204.0, 8.519653420498855, 8.209714974107353, 21.106942150843302], "isController": false}, {"data": ["002-requests-08", 3000, 0, 0.0, 65.2979999999998, 51, 1006, 58.0, 67.0, 102.94999999999982, 197.0, 8.519484060045324, 7.625074123948553, 21.106522570243147], "isController": false}, {"data": ["CUG-LOGIN", 20, 0, 0.0, 271.90000000000003, 100, 1038, 186.0, 667.1000000000001, 1019.8499999999997, 1038.0, 0.35423935953523794, 0.9120798665846012, 0.37672525638073645], "isController": false}, {"data": ["002-requests-03", 3000, 0, 0.0, 65.00266666666664, 51, 1019, 58.0, 66.0, 96.0, 215.97999999999956, 8.516485076279318, 7.955018054948362, 21.099092763684574], "isController": false}, {"data": ["002-requests-02", 3000, 0, 0.0, 64.38866666666667, 50, 682, 58.0, 67.0, 96.0, 210.9499999999989, 8.515880698188672, 8.079297663384267, 21.097595452377774], "isController": false}, {"data": ["001-requests-07", 3000, 0, 0.0, 63.685333333333354, 52, 1000, 58.0, 65.0, 84.0, 181.96999999999935, 8.517331349741498, 9.552838662402795, 21.37567366767644], "isController": false}, {"data": ["001-requests", 3000, 0, 0.0, 483.65400000000017, 352, 2566, 434.0, 654.0, 709.0, 913.909999999998, 8.497139296436865, 2201.6610275386975, 102.10424795006514], "isController": true}, {"data": ["002-requests-05", 3000, 0, 0.0, 127.17100000000036, 78, 1514, 106.0, 188.0, 222.0, 560.9299999999985, 8.51568731531603, 418.4223628113903, 20.939110440658432], "isController": false}, {"data": ["001-requests-08", 3000, 0, 0.0, 97.35466666666672, 58, 336, 74.0, 169.0, 181.0, 294.9899999999998, 8.512014708761416, 725.3038412417044, 12.867772235510424], "isController": false}, {"data": ["002-requests-04", 3000, 0, 0.0, 65.15899999999996, 51, 712, 58.0, 68.0, 102.0, 208.9499999999989, 8.516654317517906, 7.948996573998371, 21.099512048936695], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 69060, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
