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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9660107870555333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "002-requests-10"], "isController": false}, {"data": [0.99175, 500, 1500, "002-requests-12"], "isController": false}, {"data": [0.999, 500, 1500, "002-requests-11"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-13"], "isController": false}, {"data": [0.96775, 500, 1500, "002-requests-14"], "isController": false}, {"data": [0.99975, 500, 1500, "002-requests-13"], "isController": false}, {"data": [0.99375, 500, 1500, "002-requests-16"], "isController": false}, {"data": [0.9875, 500, 1500, "002-requests-15"], "isController": false}, {"data": [0.9875, 500, 1500, "CUG-01"], "isController": false}, {"data": [0.39425, 500, 1500, "002-requests"], "isController": true}, {"data": [0.9995, 500, 1500, "002-requests-01"], "isController": false}, {"data": [0.99875, 500, 1500, "002-requests-00"], "isController": false}, {"data": [0.99875, 500, 1500, "001-requests-01"], "isController": false}, {"data": [0.993, 500, 1500, "001-requests-00"], "isController": false}, {"data": [0.9995, 500, 1500, "002-requests-07"], "isController": false}, {"data": [0.999, 500, 1500, "001-requests-06"], "isController": false}, {"data": [0.999, 500, 1500, "002-requests-06"], "isController": false}, {"data": [0.9995, 500, 1500, "002-requests-09"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-08"], "isController": false}, {"data": [0.925, 500, 1500, "CUG-LOGIN"], "isController": false}, {"data": [0.9995, 500, 1500, "002-requests-03"], "isController": false}, {"data": [1.0, 500, 1500, "002-requests-02"], "isController": false}, {"data": [0.99875, 500, 1500, "001-requests-07"], "isController": false}, {"data": [0.837, 500, 1500, "001-requests"], "isController": true}, {"data": [0.99575, 500, 1500, "002-requests-05"], "isController": false}, {"data": [1.0, 500, 1500, "001-requests-08"], "isController": false}, {"data": [0.9985, 500, 1500, "002-requests-04"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 46060, 0, 0.0, 86.55143291359013, 51, 5458, 62.0, 116.0, 159.0, 307.9800000000032, 149.14499056105845, 2166.3128086021866, 402.48034295900294], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["002-requests-10", 2000, 0, 0.0, 63.89499999999998, 52, 414, 58.0, 67.90000000000009, 92.0, 188.99, 6.547373521112005, 6.039894527950738, 16.209864600315584], "isController": false}, {"data": ["002-requests-12", 2000, 0, 0.0, 134.86200000000005, 81, 2608, 102.0, 177.0, 228.94999999999982, 674.5800000000004, 6.546473414771462, 3.7252342563451695, 16.239601336135227], "isController": false}, {"data": ["002-requests-11", 2000, 0, 0.0, 65.66249999999995, 52, 816, 59.0, 66.0, 93.0, 185.95000000000005, 6.547502127938191, 9.671885102591174, 17.265200435408893], "isController": false}, {"data": ["001-requests-13", 2000, 0, 0.0, 97.2305, 66, 347, 91.0, 119.0, 122.0, 300.0000000000009, 6.545959179398557, 1043.1891135789378, 9.991537302148384], "isController": false}, {"data": ["002-requests-14", 2000, 0, 0.0, 181.674, 73, 5458, 91.0, 213.0, 424.4999999999982, 2046.98, 6.549474732126483, 28.83652495718281, 33.1899748827644], "isController": false}, {"data": ["002-requests-13", 2000, 0, 0.0, 69.74649999999984, 55, 1491, 62.0, 75.0, 111.0, 209.98000000000002, 6.549946617935063, 9.680769929850072, 17.271646345457285], "isController": false}, {"data": ["002-requests-16", 2000, 0, 0.0, 124.28, 71, 2511, 90.0, 185.0, 239.94999999999982, 599.4500000000005, 6.5747516387568465, 28.944946008961384, 33.16397184033873], "isController": false}, {"data": ["002-requests-15", 2000, 0, 0.0, 139.76449999999983, 73, 2150, 91.0, 205.9000000000001, 303.89999999999964, 1125.0, 6.574643572135346, 29.32008849983892, 33.06711848165181], "isController": false}, {"data": ["CUG-01", 40, 0, 0.0, 228.05000000000004, 111, 655, 219.5, 374.0, 457.74999999999983, 655.0, 0.3488270689805529, 1.9153382396223946, 0.2737134276619866], "isController": false}, {"data": ["002-requests", 2000, 0, 0.0, 1486.0445000000002, 1068, 9735, 1330.5, 1693.0, 2074.749999999999, 5681.610000000001, 6.523284865326784, 490.97863466220804, 326.8866461020111], "isController": true}, {"data": ["002-requests-01", 2000, 0, 0.0, 63.997000000000064, 52, 807, 58.0, 65.0, 89.94999999999982, 185.94000000000005, 6.547073458164201, 6.103493247307516, 16.209121710095587], "isController": false}, {"data": ["002-requests-00", 2000, 0, 0.0, 65.90999999999997, 51, 787, 58.0, 67.0, 97.0, 233.99, 6.5470948903197925, 6.186653020747744, 16.20917477142455], "isController": false}, {"data": ["001-requests-01", 2000, 0, 0.0, 75.85049999999994, 56, 1543, 66.0, 89.0, 126.0, 207.98000000000002, 6.546109156370183, 8.14851549075362, 16.078880615334263], "isController": false}, {"data": ["001-requests-00", 2000, 0, 0.0, 98.5505000000001, 57, 2474, 67.0, 132.0, 189.0, 479.8100000000002, 6.543903045532478, 72.52209934851355, 9.649700780033243], "isController": false}, {"data": ["002-requests-07", 2000, 0, 0.0, 63.817500000000074, 52, 793, 58.0, 66.0, 93.0, 172.97000000000003, 6.5473306532926525, 6.110130091367999, 16.2097584689722], "isController": false}, {"data": ["001-requests-06", 2000, 0, 0.0, 65.61949999999995, 52, 878, 58.0, 68.0, 102.0, 208.0, 6.546387703265339, 7.1001679915600695, 16.59100133546309], "isController": false}, {"data": ["002-requests-06", 2000, 0, 0.0, 65.89050000000012, 51, 1016, 58.0, 72.0, 102.0, 203.93000000000006, 6.547566433245923, 6.110468418017921, 16.210342208559634], "isController": false}, {"data": ["002-requests-09", 2000, 0, 0.0, 63.584499999999814, 52, 542, 58.0, 65.0, 90.0, 170.0, 6.547373521112005, 6.3084487359067785, 16.209864600315584], "isController": false}, {"data": ["002-requests-08", 2000, 0, 0.0, 62.91650000000002, 51, 477, 58.0, 65.0, 91.0, 167.0, 6.547352087132162, 5.860820021066106, 16.209811534470173], "isController": false}, {"data": ["CUG-LOGIN", 20, 0, 0.0, 211.35000000000005, 99, 559, 158.0, 548.5000000000001, 558.7, 559.0, 0.17567128389357833, 0.4520018703502007, 0.1868222931251043], "isController": false}, {"data": ["002-requests-03", 2000, 0, 0.0, 63.12250000000001, 52, 1070, 58.0, 64.0, 88.0, 169.98000000000002, 6.546987730944992, 6.116139675073, 16.20890946825366], "isController": false}, {"data": ["002-requests-02", 2000, 0, 0.0, 63.120500000000064, 51, 415, 58.0, 66.0, 90.94999999999982, 174.0, 6.5470091625393225, 6.212066347595447, 16.20896252819306], "isController": false}, {"data": ["001-requests-07", 2000, 0, 0.0, 65.89300000000014, 52, 1070, 58.0, 70.90000000000009, 98.94999999999982, 194.93000000000006, 6.546387703265339, 7.343167473781717, 16.4183915034434], "isController": false}, {"data": ["001-requests", 2000, 0, 0.0, 500.5604999999995, 353, 2948, 438.0, 652.8000000000002, 722.7999999999993, 1303.7900000000002, 6.534516952170604, 1693.138072479841, 78.48822725089605], "isController": true}, {"data": ["002-requests-05", 2000, 0, 0.0, 127.10899999999994, 78, 1545, 107.0, 198.0, 230.94999999999982, 377.84000000000015, 6.545894905657289, 321.6349241903546, 16.084746837514523], "isController": false}, {"data": ["001-requests-08", 2000, 0, 0.0, 97.4165, 58, 341, 73.0, 168.0, 184.0, 287.60000000000036, 6.5442028179337335, 557.6284545210625, 9.892994103673262], "isController": false}, {"data": ["002-requests-04", 2000, 0, 0.0, 66.69200000000008, 51, 1180, 58.0, 68.0, 104.0, 204.99, 6.5468805750779895, 6.109828345906072, 16.208644173767304], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 46060, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
