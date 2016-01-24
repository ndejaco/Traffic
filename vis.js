var startTime = new Date().getTime();
var map = L.map('map').setView([32.22, -110.93], 11);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 25,
    id: 'youhaowei.op72jf9g',
    accessToken: 'pk.eyJ1IjoieW91aGFvd2VpIiwiYSI6ImNpanFyOTl0ZTAzcnZ1eWx4M3R4YWh4cjkifQ.euhHOxoz-qgt9e93YGqlSQ'
}).addTo(map);

// create a red polyline from an array of LatLng points
//var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
var colorScale = d3.scale.category20();
var i = 0;
d3.csv("tr_all_filt_7col.csv", function(error, data){
    console.log("file loaded: " + (new Date().getTime() - startTime) + " ms.")
    if (error) {
        alert(error);
    }
    console.log(data.length)
    data = data.filter(function(d,i){ return i % 2 === 0;})
    console.log(data.length)
    //console.log(data);
    var paths = [];
    var currPath = {tid: -1};
    for (var d in data) {
        d = data[d];
        //console.log(d);
        //console.log(d.LocationLatitude);
        //console.log(d.LocationLongitute);
        var l = L.latLng(d.LocationLatitude,d.LocationLongitute)

        //console.log(l);
        if (currPath.tid == d.TripID) {
            //console.log("Hello");
            currPath.path.push(l)
        } else {
            //console.log("World!");
            if (currPath.tid >= 0) {
                //console.log(currPath.tid);
                paths.push(currPath);
            }
            var date = new Date(d.unixtime);
            currPath = {tid: d.TripID, date: date, path: [l]};
        }
    }
    delete data;
    console.log("Data Loop Done: " + (new Date().getTime() - startTime) + " ms.")
    //console.log(paths)
    for (var p in paths) {
        //console.log(paths[p]);
        var polyline = L.polyline(paths[p].path, {color: "#fff", opacity: 0.05, weight: 2, className: "t" + p}).addTo(map);
        //polylines.push(polyline);
        polyline.on("click", function(e) {
            e.target.setStyle({ color: colorScale(i), opacity: 0.75, weight:6});
            e.target.bringToFront();
            i++;
        })
    }
    console.log(paths);
    console.log("All Done: " + (new Date().getTime() - startTime) + " ms.")
}
/*, function(error, rows) {
    console.log(error + ": " + rows);
}*/)
