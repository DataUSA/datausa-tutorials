/*-----------------------------------------------------------------------*/
/* Build the map of congestion relief projects                           */
/*-----------------------------------------------------------------------*/

//Inspired by http://leafletjs.com/examples/choropleth.html
//Additional information taken from http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

/*-----------------------------------------------------------------------*/
/* Globals                                                               */
/*-----------------------------------------------------------------------*/
var cbsaURL = "json/CBSAs_Feb2013_delineation.json";
var markers = []; //Array to store markers

/*-----------------------------------------------------------------------*/
/* Main functionality
/*-----------------------------------------------------------------------*/
//Center map at geographical center of contiguous US, Lebanon, Kansas
var map = L.map( 'viz_map', {
    center: [39.5, -98.5],
    minZoom: 2,
    zoom: 3
});

//Control where we show the MSA Name
var info = L.control();

//First arg is url template to fetch tiles, second is attribution statement
L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="Open StreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16"> | Icons from <a href="https://mapicons.mapsmarker.com">Maps Icons Collections</a>',
    subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
}).addTo( map );

//Read json data of cbsas, store
//var cbsaData = {};
getJSON(cbsaURL).then(function(response) {
    cbsaData.type = response.type;
    cbsaData.features = response.features;

});

/*--------------------------------------------------------------------*/
/* Info control to hold MSA name, from                                */
/* http://leafletjs.com/examples/choropleth.html#map                  */
/*--------------------------------------------------------------------*/
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the info control
// based on feature properties passed
info.update = function (name) {
    this._div.innerHTML = '<h4>Metro Area</h4><br>' + (name ? name : "Select a metro area");
};

info.addTo(map);

/*--------------------------------------------------------------------*/
/* Read the congestion relief projects into memory                    */
/*--------------------------------------------------------------------*/
initializeCongestionProjects();

if (DEBUG_MODE) {
    logProjects();
}

function logProjects() {
    for (var i = 0; i < congestionProjects.length; i++) {
	console.log(congestionProjects[i].principal_place_zip + "|" + congestionProjects[i].latitude + "|" + congestionProjects[i].project_description);
    }
}

