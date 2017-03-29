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
    var transferValueDimension = ndx.dimension(function (d) {
	    var value = d["transfer_value"];
		    if (value <1){
			    return "0 - 1";
		    } else if (value >=1 && value <=10){
			    return "1 - 10"
		    } else if (value >10 && value <=20){
			    return "10 - 20"
		    } else if (value >20 && value <=30){
			    return "20 - 30"
		    } else if (value >30 && value <=40){
			    return "30 - 40"
		    } else if (value >40 && value <=50){
			    return "40 - 50"
		    } else if (value >50){
			    return "50 +"
		    }
    });


    //calculating

    var numTransfersBySeason = seasonDim.group();
    var numTransfersByType = typeDim.group();
    var clubGroup = clubDim.group();
    var all = ndx.groupAll();
    var totalTransfers = ndx.groupAll().reduceSum(function(d){return d["transfer_value"];});
    var transferValueGroup = transferValueDimension.group().reduceSum(function(d){return d.transfer_value;});



    //working out lowest and highest dates
    var minDate = seasonDim.bottom(1)[0]["season"];
    var maxDate = seasonDim.top(1)[0]["season"];


    //Charts
    var SpendChart = dc.lineChart("#spendingChart");
    var transferValueChart = dc.rowChart("#valueChart")
    var NetSpendChart = dc.lineChart("#netChart");
    var TransferTypeChart = dc.pieChart("#type-row-chart");
    var numberTransfers = dc.numberDisplay("#total-number");
    var transferTotal = dc.numberDisplay("#total-net");




   selectField = dc.selectMenu('#club-select')
       .width(100)
       .height(30)
       .dimension(clubDim)
       .group(clubGroup);

   numberTransfers
       .formatNumber(d3.format("d"))
       .valueAccessor(function(d){return d;})
       .group(all);

   transferTotal
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d){return d;})
       .group(totalTransfers)
       .formatNumber(d3.format(".4s"));

   SpendChart
       .width(350)
       .height(200)
       .dimension(seasonDim)
       .group(numTransfersBySeason)
       .x(d3.time.scale().domain([minDate, maxDate]))
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("Season")
       .yAxisLabel("Value(m)")
       .yAxis().ticks(5);

   transferValueChart
	.width(300)
	.height(200)
 	.dimension(transferValueDimension)
	.group(transferValueGroup)
    .elasticX(true)
    .xAxis().ticks(4);

   NetSpendChart
       .width(350)
       .height(200)
       .dimension(seasonDim)
       .group(numTransfersBySeason)
       .x(d3.time.scale().domain([minDate,maxDate]))
       .elasticY(true)
       .elasticX(true)
       .xAxisLabel("Season")
       .yAxisLabel("Spend(m)");

   TransferTypeChart
    .width(300)
    .height(200)
    .dimension(typeDim)
    .group(numTransfersByType)
    .innerRadius(50);

    dc.renderAll();
}