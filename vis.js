d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
	    this.parentNode.appendChild(this);
	  });
};

var startTime = new Date().getTime();
var map = L.map('map').setView([32.22, -110.93], 11);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 20,
    id: 'youhaowei.op72jf9g',
    accessToken: 'pk.eyJ1IjoieW91aGFvd2VpIiwiYSI6ImNpanFyOTl0ZTAzcnZ1eWx4M3R4YWh4cjkifQ.euhHOxoz-qgt9e93YGqlSQ'
}).addTo(map);

var globals = {
	timeExtent: [new Date(2015, 10, 1, 8, 0, 0), new Date(2015, 10, 1, 12, 0, 0)]
};

// create a red polyline from an array of LatLng points
//var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
var colorScale = d3.scale.category20();
var i = 0;
var selectSection;
d3.csv("tr_all_final1.csv", function(error, data){
    console.log("file loaded: " + (new Date().getTime() - startTime) + " ms.")
    if (error) {
        alert(error);
    }
		var q = quadtree(data);
    console.log(data.length)
    //data = data.filter(function(d,i){ return i % 1 === 0;})
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
            currPath.dates.push(new Date(Number(d.unixtime)));
        } else {
            //console.log("World!");
            if (currPath.tid >= 0) {
                //console.log(currPath.tid);
                paths.push(currPath);
            }
            var date = new Date(Number(d.unixtime))
            currPath = {
							tid: d.TripID,
							date: date,
							dates: [date],
							path: [l]
						};
        }
    }
    delete data;
    console.log("Data Loop Done: " + (new Date().getTime() - startTime) + " ms.")
    //console.log(paths)

		console.log(paths[0])
		var tidToPath = paths.reduce(function(o, path) {
			o[path.tid] = path;
			return o;
		}, {});

    for (var p in paths) {
        //console.log(paths[p]);
        var polyline = L.polyline(paths[p].path, {color: "#fff", opacity: 0.05, weight: 2, className: "t" + paths[p].tid}).addTo(map);
				paths[p].polyline = polyline
        //polylines.push(polyline);
    //    polyline.on("click", function(e) {
    //        e.target.setStyle({ color: colorScale(i), opacity: 0.75, weight:6});
    //        e.target.bringToFront();
    //        console.log(e.target._path);
    //        i++;
    //    })
    }
    console.log("All Done: " + (new Date().getTime() - startTime) + " ms.")

		var lastBrushSet = [];
		var lastHour = 8;
		var lastTimeoutID = null;
		var circs = [];

		map.doubleClickZoom.disable();
		selectSection = function(e, bnds, llbnds) {
			var no_change = false;	
			if(e) {
				var EPS = 0.002;
				var x0 = e.latlng.lng - EPS;
				var x1 = e.latlng.lng + EPS;
				var y0 = e.latlng.lat - EPS;
				var y1 = e.latlng.lat + EPS;
			} else if(bnds){
				var x0 = bnds[0];
				var y0 = bnds[1];
				var x1 = bnds[2];
				var y1 = bnds[3];
			} else {
				no_change = true;	
			}

			lastBrushSet
				.map(tid => tidToPath[tid])
				.filter(x => x)
				.map(x => x.polyline)
				.forEach(line => {
					line.setStyle({ color: '#fff', opacity: 0.05 });
				});

			lastBrushSet = no_change ? lastBrushSet : q(x0, y0, x1, y1);

			if(llbnds) {
				lastBrushSet = lastBrushSet.filter(tid => {
					var factor = 0.5;
					if(!tidToPath[tid]) return false;
					var path = tidToPath[tid].path;
					var inBox = path.filter(ll => llbnds.contains(ll)).length 
					var total = path.length;
					return inBox > total * factor;j
				});
			}

			if(lastTimeoutID !== null || circs.length) {
				clearTimeout(lastTimeoutID);
				circs.forEach(c => map.removeLayer(c.circle));
			}

			circs = lastBrushSet
				.map(tid => tidToPath[tid])
				.filter(x => x)
				.map(collection => {
					var path = collection.path;
					return {
						circle: L.circle(path[0], 15, { color: '#FFA500', opacity: 0 }),
						index: 0,
						path: path,
						tid: collection.tid
					};
				});

			circs.forEach(c => c.circle.addTo(map));

			lastBrushSet
				.map(tid => tidToPath[tid])
				.filter(x => x)
				.map(x => x.polyline)
				.forEach(line => {
					line.setStyle({ color: '#f00', opacity: 0.1 });
				});

			var REAL_SEC_PER_VIS_SEC = 300;

			function daySeconds(d) {
				return d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds() + d.getMilliseconds() / 1000;
			}
			var vis_start = daySeconds(new Date());
			var data_start = daySeconds(globals.timeExtent[0]);
			var t = Date.now();

			function update() {
				var vis_diff = (daySeconds(new Date()) - vis_start);
				var data_diff = REAL_SEC_PER_VIS_SEC * vis_diff;

				var hour = Math.floor(((data_diff + data_start) / 3600) % 24);
				var minute = Math.floor(((data_diff + data_start) / 60) % 60);
				document.getElementById('clock-div').textContent = 
					hour + ':' + (minute < 10 ? '0' + minute : minute)

				circs.forEach(function(c) {
					var pathOb = tidToPath[c.tid];
					var dates = pathOb.dates;
					while(c.index < dates.length - 1 && 
								daySeconds(dates[c.index]) - (data_diff + data_start) < 0)
						c.index++;

					if(c.index === 0 || c.index >= dates.length - 1) {
						c.circle.setStyle({ opacity: 0 });
						//console.log('nope', c.index)
						//console.log(daySeconds(dates[0]) / 3600, daySeconds(dates[0]) % 3600);
					} else {
						//console.log('yep')
						c.circle.setStyle({ opacity: 1 });
						var f = ((data_diff + data_start) - daySeconds(dates[c.index])) / 
								(daySeconds(dates[c.index + 1]) - daySeconds(dates[c.index]))

						var a = c.path[c.index];
						var b = c.path[c.index + 1];
						var lat = a.lat + (b.lat - a.lat) * f;
						var lng = a.lng + (b.lng - a.lng) * f;
						var point = L.latLng(lat, lng);

						c.circle.setLatLng(point);
					}

				});
				if(circs.length)
					lastTimeoutID = setTimeout(update, 0);
				//console.log(Date.now() - t);
				t = Date.now();
			}
			lastTimeoutID = setTimeout(update, 0);

		}
		map.on('dblclick', selectSection);
		map.dragging.disable();

		var start = null;
		var rect = null;
		map.on('mousedown', e => {
			start = e.latlng;
			rect = L.rectangle(L.latLngBounds(start, start), { color: '#B00', }).addTo(map);
		});
		map.on('mousemove', e => {
			if(start) {
				x0 = Math.min(start.lng, e.latlng.lng);
				x1 = Math.max(start.lng, e.latlng.lng);
				y0 = Math.min(start.lat, e.latlng.lat);
				y1 = Math.max(start.lat, e.latlng.lat);
				var sw = L.latLng(y0, x0);
				var ne = L.latLng(y1, x1);
				rect.setBounds(L.latLngBounds(sw, ne));
			}
		});
		map.on('mouseup', e => {
			if(!start || !e) return;
			x0 = Math.min(start.lng, e.latlng.lng);
			x1 = Math.max(start.lng, e.latlng.lng);
			y0 = Math.min(start.lat, e.latlng.lat);
			y1 = Math.max(start.lat, e.latlng.lat);
			selectSection(undefined, [x0, y0, x1, y1], rect.getBounds());
			start = null;
			map.removeLayer(rect);
		});


		console.log('really done');
});



function dist2(n1, x, y) {
	var d1 = (n1.LocationLatitude - x);
	var d2 = (n1.LocationLongitute - y);
	return d1*d1 + d2*d2;
}

function quadtree(data) {
	var root = (d3.geom.quadtree()
			.x(d => d.LocationLongitute)
			.y(d => d.LocationLatitude)
						 )(data.filter((d, i) => i % 20 === 0));

	return function idsInRect(x0, y0, x3, y3) {
		var ids = {};
		root.visit(function(node, x1, y1, x2, y2) {
		  var p = node.point;
		  if (p) {
				var lat = Number(p.LocationLatitude);
				var lon = Number(p.LocationLongitute);
				if(lon <= x3 && lat <= y3 && lon >= x0 && lat >= y0)
					ids[p.TripID] = true;
			}
		  return x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0;
		 });
		return Object.keys(ids);
	};
}

hours = []
for(var i = 0; i < 24; i++)
	hours.push(i);

var rect = document.getElementById('time-selector').getBoundingClientRect();

var width = rect.width;
var height = rect.height;

var xScale = d3.scale.linear()
	.domain([0, 24])
	.range([0, width]);

var groups = d3.select('#time-selector')
	.selectAll('rect')
	.data(hours)
	.enter()
	.append('g')
	.attr('transform', function(d) {
		return 'translate(' + xScale(d) + ',0)'
	})
	.classed('time-box', true)
	.on('click', function(d) {
		globals.timeExtent[0] = new Date(2015, 1, 1, d, 0, 0);
		selectSection();
	})

groups
	.append('rect')
	.attr('width', d => xScale(1) - xScale(0))
	.attr('height', d => height)
	.attr('fill', 'white')
	.attr('stroke', 'black')

d3.selectAll('.time-box')
	.append('text')
	.attr('y', 20)
	.attr('x', 5)
	.text(d => d + ':00')
