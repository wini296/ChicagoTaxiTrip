
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
    AFTER: new L.LayerGroup(),
};

// Create map
var map = L.map("map-id", {
    center: [41.86, -87.67], 
    zoom: 12, 
    layers: [
        layers.BEFORE,
        layers.AFTER,
    ]
});

// Add lightmap tile layer to map
lightmap.addTo(map);

// Overlays object
var overlays = {
    "Before departure": layers.BEFORE,
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
//     "dropoff_lat":199.0,
//     "dropoff_lng":510.0,
//     "fare":4.5,
//     "pickup_lat":199.0,
//     "pickup_lng":510.0,
//     "trip_end":"1/13/2016 6:15",
//     "trip_id":1,
//     "trip_start":"1/13/2016 6:15"
// }

d3.json('http://chicago-cabs.herokuapp.com/api/taxidata', function(response) {
    
    console.log(`response: ${typeof response}`);
    console.log(response);

    var pickupLat = [];
    var pickupLon = [];
    var dropLat = [];
    var dropLon = [];
    var fare = [];
    var pickupTime = [];
    var dropTime = [];
    var tripID = [];

    for (var i = 0; i < response.length; i++) {
        pickupLat.push(response[i].pickup_lat);
        pickupLon.push(response[i].pickup_lng);
        dropLat.push(response[i].dropoff_lat);
        dropLon.push(response[i].dropoff_lng);
        fare.push(response[i].fare);
        pickupTime.push(response[i].trip_start);
        dropTime.push(response[i].trip_end);
        tripID.push(response[i].trip_id);
    };

    console.log(`dropoff lat: ${dropLat}`);

    var locationCount = {
        BEFORE: 0,
        AFTER: 0,
    };

    // for (var i = 0; i < data.length; i++) {

    // };
});