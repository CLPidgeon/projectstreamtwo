queue()
   .defer(d3.json, "/ftdb/data")
   .await(makeGraphs);

function makeGraphs(error, dataJson) {
   var TransferData = dataJson;
   var dateFormat = d3.time.format("%Y");
   TransferData.forEach(function (d) {
       d["season"] = dateFormat.parse(String(d["season"]));
       d["transfer_value"] = +d["transfer_value"];
       d["position"] = +d["position"];
       d["net_transfer"] = +d["net_transfer"];
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
    var directionDim  = ndx.dimension(function(d) {
        return d["transfer_direction"];
    });
    var typeDim = ndx.dimension(function(d){
        return d["transfer_type"];
    });
    var transferValueDim = ndx.dimension(function (d) {
    var value = d["transfer_value"];
        if (value < 1) {
            return "0 - 1";
        } if (value >= 1 & value < 10) {
            return "1 - 9"
        } if (value >= 10 & value < 20) {
            return "10 - 19"
        } if (value >= 20 & value < 30) {
            return "20 - 29"
        } if (value >= 30 & value < 40) {
            return "30 - 39"
        } if (value >= 40 & value < 50) {
            return "40 - 49"
        } if (value > 50) {
            return "50 +"
    }
});

    var netDim = ndx.dimension(function (d){
        return d["net_transfer"];
    });

    //calculating

    var netTransfersBySeason = seasonDim.group().reduceSum(function(d){return d["net_transfer"];});
    var numTransfersByType = typeDim.group();
    var clubGroup = clubDim.group();
    var seasonGroup = seasonDim.group();
    var all = ndx.groupAll();
    var totalTransfers = ndx.groupAll().reduceSum(function(d){return (d["net_transfer"] * 1000000);});
    var transferValueGroup = transferValueDim.group().reduceCount();
    var transferDirectionTotals = directionDim.group().reduceSum(function(d){return d.transfer_value;});

    //working out lowest and highest dates
    var minDate = seasonDim.bottom(1)[0]["season"];
    var maxDate = seasonDim.top(1)[0]["season"];
    var maxValue = netDim.top(1)[0]["net_transfer"];

    //Charts
    var transfersChart = dc.rowChart("#spendingChart");
    var transferValueChart = dc.rowChart("#valueChart");
    var netChart = dc.lineChart("#netChart");
    var transferTypeChart = dc.pieChart("#type-row-chart");
    var numberTransfers = dc.numberDisplay("#total-number");
    var transferTotal = dc.numberDisplay("#total-net");
    var biggestTransfer = dc.numberDisplay("#biggest-transfer");

   selectField = dc.selectMenu('#club-select')
       .width(100)
       .height(30)
       .dimension(clubDim)
       .group(clubGroup);

   selectField2 = dc.selectMenu('#season-select')
       .width(100)
       .height(30)
       .dimension(seasonDim)
       .group(seasonGroup);

       var oldHandler = selectField2.filterHandler();
    selectField2.filterHandler(function(dimension, filters) {
    	var parseFilters = filters.map(function(d) { return new Date(d);});
      oldHandler(dimension, parseFilters);
      return filters;
    });

   numberTransfers
       .formatNumber(d3.format("d"))
       .valueAccessor(function(d){return d;})
       .group(all);

   transferTotal
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d){return d;})
       .group(totalTransfers)
       .formatNumber(d3.format(".2s"));

   biggestTransfer
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d){return +d;})
       .group(netDim)
       .formatNumber(d3.format(".2s"));

var x = d3.scale.linear().domain([minDate, maxDate]);
var y = d3.scale.linear().domain([]);

var line = d3.svg.line()
	.x(function(d, season){
	return x(season);
	})
	.y(function(d){return y(d);});

var graph = d3.select("#netChart").append("svg:svg")
	.attr("width", "350")
	.attr("height", "200")
	.append("svg:g");

var xAxis = d3.svg.axis().scale(x).ticks(5);

//xAxisPosition = this.svg.selectAll("tick").filter((netTransfersBySeason) =>{
//	return netTransfersBySeason ===0;
//}).map((tick) => {
//	return d3.transform(d3.select(tick[0]).attr('transform')).translate[1];
//});

graph.append("svg:g")
	.attr("class", "x axis")
//	.attr('transform', 'translate(0,' + xAxisPosition + ')')
	.call(xAxis);

var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");

graph.append("svg:g")
	.attr("class", "y axis")
	.call(yAxisLeft);

graph.append("svg:path").attr("d", line(netTransfersBySeason));
   netChart
       .width(350)
       .height(200)
       .dimension(seasonDim)
       .group(netTransfersBySeason)
       .x(d3.time.scale().domain([minDate,maxDate]))
       .elasticY(true)
       .brushOn(false)
       .xAxisLabel("Season")
       .yAxisLabel("Net Spend(m)")
       .renderArea(true);

   transferValueChart
	.width(300)
	.height(200)
 	.dimension(transferValueDim)
	.group(transferValueGroup)
    .elasticX(true)
    .xAxis().ticks(4);

   transfersChart
       .width(350)
       .height(200)
       .dimension(directionDim)
       .group(transferDirectionTotals)
       .elasticX(true)
       .xAxis().ticks(5);

   transferTypeChart
    .width(300)
    .height(200)
    .dimension(typeDim)
    .group(numTransfersByType)
    .innerRadius(50);

   dc.renderAll();
}