/*--------------------------------------------------------------------*/
/* Functions to help with various parts of the map interactivity      */
/* Mainly borrowed from http://leafletjs.com/examples/choropleth.html */
/*--------------------------------------------------------------------*/

/*--------------------------------------------------------------------*/
/* Globals                                                            */
/*--------------------------------------------------------------------*/

/*--------------------------------------------------------------------*/
/* Functions                                                          */
/*--------------------------------------------------------------------*/

/*--------------------------------------------------------------------*/
/* Highlight a feature as we hover                                    */
/*--------------------------------------------------------------------*/
function highlightFeatureOnHover(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}
/*--------------------------------------------------------------------*/
/* Highlight a feature on select                                      */
/*--------------------------------------------------------------------*/
function highlightFeatureOnSelect(e) {
    var layer = e;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

/*--------------------------------------------------------------------*/
/* Define what happens on mouseout                                    */
/*--------------------------------------------------------------------*/
function resetHighlight(e) {
    cbsasLayer.resetStyle(e.target);
}

/*--------------------------------------------------------------------*/
/* click listener that zooms to the CBSA                              */
/*--------------------------------------------------------------------*/
function zoomToClickedFeature(e) {
    map.fitBounds(e.target.getBounds());
    info.update(e.target.feature.properties.CBSA_Title);
    updateBarGraph(e.target.feature.properties.CBSA_Title);
}
function zoomToDropdownFeature(e) {
    map.fitBounds(e.getBounds());
}

/*--------------------------------------------------------------------*/
/* doubleclick listener that zooms to the state                       */
/*--------------------------------------------------------------------*/
function zoomToState() {
    map.fitBounds(cbsasLayer.getBounds());
}

/*--------------------------------------------------------------------*/
/* Add listeners to each CBSA for mouseovers, clicks, and mouseouts   */
/*--------------------------------------------------------------------*/
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeatureOnHover,
        mouseout: resetHighlight,
        click: zoomToClickedFeature,
	dblclick: zoomToState
    });

}

/*--------------------------------------------------------------------*/
/* Return default style for CBSAs                                     */
/*--------------------------------------------------------------------*/
function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

/*--------------------------------------------------------------------*/
/* Find the leaflet feature which matches your menu selection         */
/*--------------------------------------------------------------------*/
function findFeature(msaName) {
    for (var feature in cbsasLayer._layers) {
	if (cbsasLayer._layers[feature].feature.properties.CBSA_Title
	    == msaName) {
	    return cbsasLayer._layers[feature];
	}
    }
    alert("Couldn't find a matching feature in this layer for " + msaName);
    return null;
}

