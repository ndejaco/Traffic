/*

Code that will do crossfilter on time

*/

dateBin = []

TC_WIDTH = 1800, TC_HEIGHT = 200;

BC_HEIGHT = 100, BC_WIDTH=1000;

function setupTimeCtrl(paths) {

    var timeFilter = crossfilter(paths);
    var dateExtent = d3.extent(paths, function(d) { return d.date; });
    var timeFilterByDateValue = timeFilter.dimension(function(d) { return getDateValue(d.date);  });

    function getDateValue(date) {
        return date.getMonth() - dateExtent[0].getMonth() + date.getDate * 0.01;
    }

    console.log(dateExtent);
    var margin = {top:10, right:10, bottom:20, left:10},
            x,
            y = d3.scale.linear().range([BC_HEIGHT, 0]),
            axis = d3.svg.axis().orient("bottom"),
            brush = d3.svg.brush()
    var svg = d3.select("#timeCtrl").append("svg")
    .attr("width", TC_WIDTH + margin.left + margin.right).attr("height", TC_HEIGHT + margin.top + margin.bottom);

    for (var d = dateExtent[0]; d <= dateExtent[1]; d.setDate(d.getDate()+1)) {
        dateBin.push(timeFilterByDateValue.filter(d).length);
    }

    var xScale = d3.time.scale().range(dateExtent).domain([0,BC_WIDTH]);
    var countExtent = d3.extent(dateBin, function(d){ return d; });
    var yScale = d3.scale.linear().range(0,countExtent[1]).domain([BC_HEIGHT,0]);
    svg.selectAll(".bar").data(dateBin).enter().append("rect").attr("class", "bar").attr("x", function(d,i) {
            var da = dateExtent[0];
            da.setDate(da.getDate()+i);
            return xScale(da);
        }).attr("y", BC_HEIGHT)
        .attr("width", function(d,i){
            return i / dateBin.length * BC_WIDTH;
        }).attr("height", function(d,i) {
            return yScale(d);
        });




}