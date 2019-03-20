
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//      Basic map layers setup     //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //


// Tile layer background
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var taxiIcon = L.icon({
    iconUrl: '../images/taxi_icon.png',

    iconSize:     [60, 60], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// Ugly, but binning like this allows for faster update after slider input (though initial render is still slow)
var layersArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];

var layers = {};
var overlays = {};
var layerCount = {};

// Why were we not doing it this way in class...
for (var i=0; i<layersArr.length; i++) {
    layers[layersArr[i]] = new L.LayerGroup();
    overlays[layersArr[i]] = layers[layersArr[i]];
    layerCount[layersArr[i]] = 0;
};

// Create map
var map = L.map("map-id", {
    center: [41.86, -87.67], 
    zoom: 12, 
    layers: []
});

// Add lightmap tile layer to map
lightmap.addTo(map);

// Control for layers 
// L.control.layers(null, overlays).addTo(map);

// // Create a legend 
// var info = L.control({
//     position: "bottomright"
// });
// // Add div class legend on layer control addition
// info.onAdd = function() {
//     var div = L.DomUtil.create("div", "legend");
//     return div;
// };
// info.addTo(map);



// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// //   Use D3 to get the json data   //
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// // Example entry from pickupdata:
// // {
// //     "geometry":{
// //         "coordinates":[41.90120699,-87.67635599],
// //         "type":"Point"
// //     },
// //     "properties":{
// //         "fare":6.25,
// //         "trip_id":"02847db485a2d331ad991e73aadd1e7930ebde97",
// //         "trip_start":"12/31/2016 1:30"
// //     },
// //     "type":"Feature"
// // },

// d3.json('https://chicago-cabs.herokuapp.com/api/dropoffdata', function(dropoffData) {
    d3.json('https://chicago-cabs.herokuapp.com/api/pickupdata', function(pickupData) {

        var pickupTime = [];
        // var dropoffTime = [];
        var pickupLat = [];
        var pickupLon = [];
        // var dropoffLat = [];
        // var dropoffLon = [];
        // var fare = [];
        // var tripID = [];

        // note: 
        // 1483164000000 = 00:00:00 on 12/31/16
        // 1483228800000 = 18:00:00 on 12/31/16
        // 1483250399000 = 23:59:59 on 12/31/16

        var timeRangeStart = 1483228800000 - 900000;
        var timeRangeEnd = 1483250399000 + 900000;
        var timeRange = timeRangeEnd - timeRangeStart;

        var currentTime = "18:00";

        d3.select('#current-time')
            .append('h2')
            .attr('id', 'current-time-header')
            .append('text')
            .text(`Selected Time: ${currentTime}`);

        for (var i = 0; i < pickupData.length; i++) {

            var p = new Date(pickupData[i].properties.trip_start).getTime();

            if (p>timeRangeStart && p<timeRangeEnd) {
                pickupTime.push(p);
                // dropoffTime.push(new Date(dropoffData[i].properties.trip_end).getTime());
                pickupLat.push(pickupData[i].geometry.coordinates[0]);
                pickupLon.push(pickupData[i].geometry.coordinates[1]);
                // dropoffLat.push(dropoffData[i].geometry.coordinates[0]);
                // dropoffLon.push(dropoffData[i].geometry.coordinates[1]);
                // fare.push(pickupData[i].properties.fare);
                // tripID.push(pickupData[i].properties.trip_id); 
            };       
        };

        // if we get load time up, set maxMarkers = pickupTime.length
        var maxMarkers = pickupTime.length;
        console.log(maxMarkers);

        // Useful for testing with timestamps etc
        // var minTime = Math.min.apply(null, pickupTime);
        // var maxTime = Math.max.apply(null, pickupTime);
        // var timeSel = minTime;

        var currentLayer = layersArr[0];
        console.log(`current layer: ${currentLayer}`);

        var tripStatus;


        // sketchy binning
        var temp = []
        for (var i=0; i<maxMarkers; i++) {
            var u = Math.round(((layersArr.length+1)*(pickupTime[i] - timeRangeStart)) / timeRange);
            temp.push(u);

            tripStatus = layersArr[u-1];
            var newMarker = L.marker([pickupLat[i], pickupLon[i]], {icon: taxiIcon});

            var pTime = new Date(pickupTime[i]);
            newMarker.bindPopup('Pickup Time: ' + pTime.getHours() + ':' + pTime.getMinutes() );
            
            newMarker.addTo(layers[tripStatus]);
            layerCount[tripStatus]++;
        };

        map.addLayer(layers["A"]);


        // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
        // //   Use D3/slider to update map   //
        // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

        var submit = d3.select("#myRange");

        submit.on("change", function() {
            
            d3.event.preventDefault();

            map.removeLayer(layers[currentLayer]);

            var input = submit.property("value");
            var newBin = Math.round(((layersArr.length-1)*input) / 100 );

            currentLayer = layersArr[newBin];

            map.addLayer(layers[currentLayer]);
            console.log(currentLayer);

            var currentTime = dataTime[newBin];

            d3.select('#current-time-header').remove('h2');
                
            d3.select('#current-time')
                .append('h2')
                .attr('id', 'current-time-header')
                .append('text')
                .text(`Selected Time: ${currentTime}`);

            
        });

    });
// });

var dataTime = d3.range(0, layersArr.length+1).map(function(d) {
    var x = d3.timeFormat('%H:%M');
    return x(new Date(2015, 12, 31, 18, d*20));
  });

var tickNum = 18;

for (var i=0; i<tickNum; i = i + 3) {
    d3.select('#timeline').append('text')
        .text(dataTime[i] + "-------------");  
};

d3.select('#timeline').append('text')
    .text(dataTime[tickNum]);
