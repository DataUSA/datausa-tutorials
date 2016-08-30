//---------------------------------------------------------------//
// Geographical utilty and helper functions
//---------------------------------------------------------------//

//---------------------------------------------------------------//
// Look up two-letter state code
//---------------------------------------------------------------//

function lookupAbbreviation(name) {
    var stateMap = {
        "Alabama": "AL",
        "Alaska": "AK",
        "Arizona": "AZ",
        "Arkansas": "AR",
        "California": "CA",
        "Colorado": "CO",
        "Connecticut": "CT",
        "Delaware": "DE",
        "District of Columbia": "DC",
        "Florida": "FL",
        "Georgia": "GA",
        "Hawaii": "HI",
        "Idaho": "ID",
        "Illinois": "IL",
        "Indiana": "IN",
        "Iowa": "IA",
        "Kansas": "KS",
        "Kentucky": "KY",
        "Louisiana": "LA",
        "Maine": "ME",
        "Maryland": "MD",
        "Massachusetts": "MA",
        "Michigan": "MI",
        "Minnesota": "MN",
        "Mississippi": "MS",
        "Missouri": "MO",
        "Montana": "MT",
        "Nebraska": "NE",
        "Nevada": "NV",
        "New Hampshire": "NH",
        "New Jersey": "NJ",
        "New Mexico": "NM",
        "New York": "NY",
        "North Carolina": "NC",
        "North Dakota": "ND",
        "Ohio": "OH",
        "Oklahoma": "OK",
        "Oregon": "OR",
        "Pennsylvania": "PA",
        "Puerto Rico": "PR",
        "Rhode Island": "RI",
        "South Carolina": "SC",
        "South Dakota": "SD",
        "Tennessee": "TN",
        "Texas": "TX",
        "Utah": "UT",
        "Vermont": "VT",
        "Virginia": "VA",
        "Washington": "WA",
        "West Virginia": "WV",
        "Wisconsin": "WI",
        "Wyoming": "WY"
    }
    if (name in stateMap) {
        return stateMap[name];
    }
    return "State not found";
}

//---------------------------------------------------------------//
// Return true if MSA falls within reference state               //
//---------------------------------------------------------------//
function msaMatch(stateFullName, MSAName) {

    var stateAbbreviation = lookupAbbreviation(stateFullName);

    //Create new regex object for matching
    var re = new RegExp(stateAbbreviation);

    return re.test(MSAName);
}

//---------------------------------------------------------------//
// Get array of msa names for the reference state                //
//---------------------------------------------------------------//
function retrieveMsasByState(key, dictionary) {
    var results = [];
    for (var i = 0; i < dictionary.length; i++) {
	var newMSA = {};
	if (msaMatch(key, dictionary[i][3]) == true) {
	    newMSA.name = dictionary[i][3];
	    newMSA.cbsafp = dictionary[i][8].replace(/31000US/, '');
	    results.push(newMSA);
	}
    }
    return results;
}

//---------------------------------------------------------------//
// Redraw the bar graph if we have a new MSA selected            //
//---------------------------------------------------------------//
function updateBarGraph(msaName) {
    var data = msaSubset(data4, msaName);
    viz_bar.data(data).draw();
    if (data) {
	return true;
    } else {
	alert ("Warning: no data found for metro area: " + msaName);
	return false;
    }
}

/*--------------------------------------------------*/
/* Get information from a URL                       */
/* From Haverbeke pg 308                            */
/*--------------------------------------------------*/
function get(url) {
    return new Promise(function(succeed, fail) {
      	var req = new XMLHttpRequest();
      	req.open("GET", url, true);
      	req.addEventListener("load", function() {
    	    if (req.status < 400)
        		succeed(req.responseText);
    	    else
        		fail(new Error("Request failed: " + req.statusText));
      	});
      	req.addEventListener("error", function() {
    	    fail(new Error("Network error"));
      	});
      	req.send(null);
    });
}
/*------------------------------------------------------------*/
/* Return a promise whose result is the content of the url    */
/* parsed as JSON                                             */
/* Haverbeke pg. 309                                          */
/*------------------------------------------------------------*/
function getJSON(url) {
    return get(url).then(JSON.parse);
}
/*------------------------------------------------------------------------*/
/* Return a promise whose result is the content of the url                */
/* parsed as XML doc.                                                     */
/* http://stackoverflow.com/questions/17604071/parse-xml-using-javascript */
/*------------------------------------------------------------------------*/
function getXML(url) {
    return get(url).then(function(response) {
	if (window.DOMParser)
	{
	    parser = new DOMParser();
	    xmlDoc = parser.parseFromString(response, "text/xml");
	}
	else // Internet Explorer
	{
	    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	    xmlDoc.async = false;
	    xmlDoc.loadXML(response);
	}
	return(xmlDoc);
    });
}

/*------------------------------------------------------------*/
/* Build array of field, value objects from headers, data     */
/*------------------------------------------------------------*/
function dataFold(data, header) {
    var result = [];
    var arrayLength = data.length;

    var elementLength = data[0].length;
    for (var i = 0; i < arrayLength; i++) {
    	var newObject = {};
    	for (var j = 0; j < elementLength; j++) {
  	    newObject[header[j]] = data[i][j];
    	}
    	result.push(newObject);
    }

    return result;
}
