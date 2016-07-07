/*-----------------------------------------------------------------------*/
/* Build the map of congestion relief projects                           */
/*-----------------------------------------------------------------------*/

//Inspired by http://leafletjs.com/examples/choropleth.html
//Additional information taken from http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

/*-----------------------------------------------------------------------*/
/* Globals                                                               */
/*-----------------------------------------------------------------------*/
var cbsaURL = "json/CBSAs_Feb2013_delineation.json";

/*-----------------------------------------------------------------------*/
/* Helper functions                                                      */
/*-----------------------------------------------------------------------*/
function readCBSA() {
    var result;
    getJSON(cbsaURL).then(function(response) {
	result = JSON.parse(JSON.stringify(response));
    });
    return result;
}

/*-----------------------------------------------------------------------*/
/* Main functionality
/*-----------------------------------------------------------------------*/
//Center map at geographical center of contiguous US, Lebanon, Kansas
var map = L.map( 'viz_map', {
    center: [39.5, -98.5],
    minZoom: 2,
    zoom: 3
});

//First arg is url template to fetch tiles, second is attribution statement
L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="Open StreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
    subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
}).addTo( map );

//Read json data of cbsas, store
var cbsaData = {};
getJSON(cbsaURL).then(function(response) {
    cbsaData.type = response.type;
    cbsaData.features = response.features;
    console.log(cbsaData);
    //Add all cbsas to map (yikes!)
//    L.geoJson(cbsaData).addTo(map);

});

//Add 1 msa to map

//

