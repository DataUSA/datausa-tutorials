//------------------------------------------------------------------//
// Load correct values into MSA dropdown based on state selection   //
// https://css-tricks.com/dynamic-dropdowns/                        // 
//------------------------------------------------------------------//

/*-------------------------------------------------------------------*/
/* Globals                                                           */
/*-------------------------------------------------------------------*/
var cbsasLayer; // Handle for leaflet layer
var msas; //Holds list of msas in this state
var msaURL = "https://api.datausa.io/attrs/geo/?sumlevel=msa";
var constructionIcon = L.icon({
    iconUrl: './js/images/construction.png',
    shadowUrl: './js/images/marker-shadow.png'});

$("#select_state").change(function() {
    var $dropdown = $(this);
    
    $.getJSON(msaURL, function(dictionary) {
	//Get the value from the left-hand dropdown
	var state = $dropdown.val();
	//Look up the corresponding MSAs from the dictionary
	msas = retrieveMsasByState(state, dictionary.data);
							
	//Load the MSA names into the dropdown
	var $secondChoice = $("#select_msa");
	var fips;
	$secondChoice.empty();
	$secondChoice.append("<option selected=&quotselected&quot>Select Metro Area</option>");
	$.each(msas, function(index, value) {
	    fips = value.cbsafp.replace(/31000US/, '');
	    $secondChoice.append("<option>" + value.name + " | " + fips + "</option>");
	});

	    //Remove the old features
	if (cbsasLayer) {
	    map.removeLayer( cbsasLayer );
	}
    

	//Create new blank feature collection
	cbsasInMyState = {};
	cbsasInMyState.type = "FeatureCollection";
	cbsasInMyState.features = [];
	//temp variable to hold fips code
	var fiveDigitFips;
	//For each feature in cbsaData, if it is in the state,
	for (var i = 0; i < cbsaData.features.length; i++) {
	    fipsmatch = cbsaData.features[i].properties.CBSAFP.replace(
		    /31000US/, ""
	    );
	    for (var j = 0; j < msas.length; j++) {
		fiveDigitFips = msas[j].cbsafp.replace(/31000US/, ""); 
		if (cbsaData.features[i].properties.CBSAFP == fiveDigitFips) {
		    cbsasInMyState.features.push(cbsaData.features[i]);
		    break;
		}
	    }
	}
	
	//then add it to the new feature collections
	cbsasLayer = L.geoJson(cbsasInMyState, {
	    style: style,
	    onEachFeature: onEachFeature
	}).addTo(map);

	//Zoom map to the state
	zoomToState();

    });

});

/*----------------------------------------------------------------------*/
/* Redraw the bar chart when a new MSA is selected                      */
/*----------------------------------------------------------------------*/
$("#select_msa").change(function() {
    var $dropdown = $(this);

    var msaString = $dropdown.val();
    var temp = msaString.split(' | ');
    var msaName = temp[0];
    var msafips = temp[1].replace(/31000US/, '');
    updateBarGraph(msaName);

    //Zoom map to the selected MSA
    var e=findFeature(msafips);
    console.log("msa name =" + msaName);
    if (e) {
	zoomToDropdownFeature(e);
	highlightFeatureOnSelect(e);
	info.update(e.feature.properties.CBSA_Title);
	clearMarkers();
    } else {
	alert ("Couldn't identify CBSA matching menu selection.");
    }

    //Get data from USASpending
    var msaCongestionProjects = filterCongestionProjects(msaName);
    
    //Create a marker for each congestion relief project
    for (var i = 0; i < msaCongestionProjects.length; i++) {
	// Load it on the map
	if (msaCongestionProjects[i].latitude & msaCongestionProjects[i].longitude) {
	    var newMarker = L.marker([msaCongestionProjects[i].latitude,
				      msaCongestionProjects[i].longitude],
				     {icon: constructionIcon})
		.bindPopup(generateLabel(msaCongestionProjects[i]))
		.addTo(map);
	    markers.push(newMarker);
	}
    }

});
