// example.js

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

var map = L.map('map', {
    zoom: 12,
    center: [41.86, -87.67],
    layers: [
        layers.BEFORE,
        layers.AFTER,
    ],
    timeDimension: true,
    timeDimensionOptions: {
        timeInterval: "2014-09-30/2014-10-30",
        period: "PT1H"
    },
    timeDimensionControl: true,
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

////////////////////////////////////////////////

var exLayer = L.tileLayer()

var tdExLayer = L.timeDimension.layer.geoJson(exLayer, {

});

tdExLayer.addTo(map);

////////////////////////////////////////////////


var wmsUrl = "http://thredds.socib.es/thredds/wms/observational/hf_radar/hf_radar_ibiza-scb_codarssproc001_aggregation/dep0001_hf-radar-ibiza_scb-codarssproc001_L1_agg.nc"
var wmsLayer = L.tileLayer.wms(wmsUrl, {
    layers: 'sea_water_velocity',
    format: 'image/png',
    transparent: true,
    attribution: 'SOCIB HF RADAR | sea_water_velocity'
});

// Create and add a TimeDimension Layer to the map
var tdWmsLayer = L.timeDimension.layer.wms(wmsLayer);
tdWmsLayer.addTo(map);