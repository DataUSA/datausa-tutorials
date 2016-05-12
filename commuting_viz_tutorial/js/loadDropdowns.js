//------------------------------------------------------------------//
// Load correct values into MSA dropdown based on state selection   //
// https://css-tricks.com/dynamic-dropdowns/                        // 
//------------------------------------------------------------------//

/*-------------------------------------------------------------------*/
/* Globals                                                           */
/*-------------------------------------------------------------------*/
var cbsasLayer; // Handle for leaflet layer
var msas; //Holds list of msas in this state

$("#select_state").change(function() {
    var $dropdown = $(this);
    
    $.getJSON("./json/msas.json", function(dictionary) {

	//Get the value from the left-hand dropdown
	var state = $dropdown.val();
	//Look up the corresponding MSAs from the dictionary
	msas = retrieveMsasByState(state, dictionary.data);
							
	//Load the MSA names into the dropdown
	var $secondChoice = $("#select_msa");
	$secondChoice.empty();
	$.each(msas, function(index, value) {
	    $secondChoice.append("<option>" + value + "</option>");
	});

	    //Remove the old features
	if (cbsasLayer) {
	    map.removeLayer( cbsasLayer );
	}
    

	//Create new blank feature collection
	cbsasInMyState = {};
	cbsasInMyState.type = "FeatureCollection";
	cbsasInMyState.features = [];
	//For each feature in cbsaData, if it is in the state,
	for (var i = 0; i < cbsaData.features.length; i++) {
	    for (var j = 0; j < msas.length; j++) {
		if (cbsaData.features[i].properties.CBSA_Title == msas[j]) {
		    cbsasInMyState.features.push(cbsaData.features[i]);
		    break;
		}
	    }
	}
	//then add it to the new feature collections
	cbsasLayer = L.geoJson(cbsasInMyState).addTo(map);

	//Zoom map to the state
	map.fitBounds(cbsasLayer.getBounds());

    });

});

/*----------------------------------------------------------------------*/
/* Redraw the bar chart when a new MSA is selected                      */
/*----------------------------------------------------------------------*/
$("#select_msa").change(function() {
    var $dropdown = $(this);
    var msaName = $dropdown.val();
    var data = msaSubset(data4, msaName);
    viz_bar.data(data).draw();

    //Zoom map to the selected MSA

    //Get data from USASpending

    //Display on Map

});
