var startTime = new Date().getTime();
var map = L.map('map').setView([32.22, -110.93], 11);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'youhaowei.op72jf9g',
    accessToken: 'pk.eyJ1IjoieW91aGFvd2VpIiwiYSI6ImNpanFyOTl0ZTAzcnZ1eWx4M3R4YWh4cjkifQ.euhHOxoz-qgt9e93YGqlSQ'
}).addTo(map);

// create a red polyline from an array of LatLng points
//var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
var colorScale = d3.scale.category20();
var i = 0;
d3.csv("tr-201510-dula500dir-utlldst.csv", function(error, data){
    console.log("file loaded: " + (new Date().getTime() - startTime) + " ms.")
    if (error) {
        alert(error);
    }
    console.log(data.length)
    data = data.filter(function(d,i){ return i % 2 === 0;})
    console.log(data.length)
    //console.log(data);
    var paths = {};
    for (var d in data) {
        d = data[d];
        //console.log(d);
        //console.log(d.LocationLatitude);
        //console.log(d.LocationLongitute);
        var l = L.latLng(d.LocationLatitude,d.LocationLongitute)
        //console.log(l);
        if (paths[d.TripID]) {
            paths[d.TripID].push(l);
        } else {
            paths[d.TripID] = [l];
        }
    }
    console.log("Data Loop Done: " + (new Date().getTime() - startTime) + " ms.")
    polylines = [];
    for (var p in paths) {
        //console.log(paths[p]);
        var polyline = L.polyline(paths[p], {color: "#111", className: "t" + p}).addTo(map);
        polylines.push(polyline);
        polyline.on("click", function(e) {
            e.target.setStyle({ color: colorScale(i) });
            e.target.bringToFront();
            i++;
        })

    }
    console.log("All Done: " + (new Date().getTime() - startTime) + " ms.")

}
/*, function(error, rows) {
    console.log(error + ": " + rows);
}*/)
