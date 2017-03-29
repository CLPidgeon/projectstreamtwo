queue()
   .defer(d3.json, "/ftdb/data")
   .await(makeGraphs);

function makeGraphs(error, dataJson) {
   var TransferData = dataJson;
   var dateFormat = d3.time.format("%Y/%Y");
   TransferData.forEach(function (d) {
       d["season"] = dateFormat.parse(d["season"]);
       d["transfer_value"] = +d["transfer_value"];
       d["position"] = +d["position"];
   });

   var ndx = crossfilter(TransferData);

   //defining the dimensions

    var seasonDim = ndx.dimension(function(d){
        return d["season"];
    });
    var positionDim = ndx.dimension(function(d){
        return d["position"];
    });
    var clubDim = ndx.dimension(function(d){
        return d["club"];
    });
    var playerDim = ndx.dimension(function(d){
        return d["player_name"];
    });
    var directionDim = ndx.dimension(function(d){
        return d["transfer_direction"];
    });
    var typeDim = ndx.dimension(function(d){
        return d["transfer_type"];
    });
    var valueDim = ndx.dimension(function(d){
        return d["transfer_value"];
    });


    //calculating
    var numTransfersBySeason = seasonDim.group();
    var numTransfersByType = typeDim.group();
    var clubGroup = clubDim.group();


    //working out lowest and highest dates
    var minDate = seasonDim.bottom(1)[0]["season"];
    var maxDate = seasonDim.top(1)[0]["season"];

    //Charts
    var SpendChart = dc.barChart("#spendingChart");
    var TransferValueChart = dc.pieChart("#valueChart");
    var NetSpendChart = dc.lineChart("#netChart");
    var TransferTypeChart = dc.rowChart("#type-row-chart");



   selectField = dc.selectMenu('#club-select')
       .width(100)
       .height(30)
       .dimension(clubDim)
       .group(clubGroup);

   SpendChart
       .width(350)
       .height(200)
       .margins({top:10,right:50,bottom:30,left:50})
       .dimension(seasonDim)
       .group(numTransfersBySeason)
       .x(d3.time.scale().domain([minDate, maxDate]))
       .elasticY(true)
       .xAxisLabel("Season")
       .yAxisLabel("Value(m)")
       .yAxis().ticks(5)


   TransferValueChart
       .width(190)
       .height(190)
       .slicesCap(4)
       .innerRadius(50)
       .dimension(typeDim)
       .group(numTransfersByType);

   NetSpendChart
       .width(350)
       .height(200)
       .dimension(seasonDim)
       .group(numTransfersBySeason)
       .x(d3.time.scale().domain([minDate,maxDate]))
       .xAxisLabel("Season")
       .yAxisLabel("Spend(m)");

   TransferTypeChart
    .width(300)
    .height(200)
    .dimension(typeDim)
    .group(numTransfersByType)
    .xAxis().ticks(4);


    dc.renderAll();
}