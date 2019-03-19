
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

// Layer initialization
var layers = {
    BEFORE: new L.LayerGroup(),
    TRANSIT: new L.LayerGroup(),
    AFTER: new L.LayerGroup(),
};

// Create map
var map = L.map("map-id", {
    center: [41.86, -87.67], 
    zoom: 12, 
    layers: [
        layers.BEFORE,
        layers.TRANSIT,
        layers.AFTER,
    ]
});

// Add lightmap tile layer to map
lightmap.addTo(map);

// Overlays object
var overlays = {
    "Before departure": layers.BEFORE,
    "In transit": layers.TRANSIT,
    "After arrival": layers.AFTER
};

// Control for layers 
L.control.layers(null, overlays).addTo(map);

// Create a legend 
var info = L.control({
    position: "bottomright"
});

// Add div class legend on layer control addition
info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
};

info.addTo(map);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//   Use D3 to get the json data   //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Example entry:
// {
//     "geometry":{
//         "coordinates":[41.90120699,-87.67635599],
//         "type":"Point"
//     },
//     "properties":{
//         "fare":6.25,
//         "trip_id":"02847db485a2d331ad991e73aadd1e7930ebde97",
//         "trip_start":"12/31/2016 1:30"
//     },
//     "type":"Feature"
// },

var parser = d3.timeParse

d3.json('http://chicago-cabs.herokuapp.com/api/dropoffdata', function(dropoffData) {
    d3.json('http://chicago-cabs.herokuapp.com/api/pickupdata', function(pickupData) {

        var pickupTime = [];
        var dropoffTime = [];
        var pickupLat = [];
        var pickupLon = [];
        var dropoffLat = [];
        var dropoffLon = [];
        var fare = [];
        var tripID = [];

        for (var i = 0; i < pickupData.length; i++) {
            pickupTime.push(Date.now(new Date(pickupData[i].properties.trip_start)));
            dropoffTime.push(Date.now(new Date(dropoffData[i].properties.trip_end)));
            pickupLat.push(pickupData[i].geometry.coordinates[0]);
            pickupLon.push(pickupData[i].geometry.coordinates[1]);
            dropoffLat.push(dropoffData[i].geometry.coordinates[0]);
            dropoffLon.push(dropoffData[i].geometry.coordinates[1]);
            fare.push(pickupData[i].properties.fare);
            tripID.push(pickupData[i].properties.trip_id);        
        };

        var minTime = Math.min.apply(null, pickupTime);
        var maxTime = Math.max.apply(null, dropoffTime);

        var timeSel = minTime;
        
        console.log(`selected time: ${timeSel}`);
        // console.log(`pickup time: ${pickupTime[1]}`);

        var locationCount = {
            BEFORE: 0,
            TRANSIT: 0,
            AFTER: 0,
        };

        var tripStatus;

        // for (var i = 0; i < pickupTime.length; i++) {
        for (var i = 0; i < 200; i++) {

            var trip = Object.assign({}, pickupData[i], dropoffData[i]);

            if (timeSel < pickupTime[i]) {
                tripStatus = "BEFORE";
                var newMarker = L.marker([pickupLat[i], pickupLon[i]]);
                newMarker.addTo(layers[tripStatus]);
            }
            else if (timeSel > dropoffTime[i]) {
                tripStatus = "AFTER";
                var newMarker = L.marker([dropoffLat[i], dropoffLon[i]]);
                newMarker.addTo(layers[tripStatus]);
            }
            else {
                tripStatus = "TRANSIT";
            }

            locationCount[tripStatus]++;

            
            // newMarker.addTo(layers[tripStatus]);

            // newMarker.bindPopup()
        }        
        console.log(locationCount);

    });
});


var submit = d3.select("#myRange");

submit.on("click", function() {
    
    d3.event.preventDefault();

    
})