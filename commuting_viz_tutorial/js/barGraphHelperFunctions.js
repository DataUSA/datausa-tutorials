//---------------------------------------------------------------//
// Geographical utilty and helper functions
//P. Viechnicki, 19 April 2016
//---------------------------------------------------------------//

//---------------------------------------------------------------//
// Look up two-letter state code
// P. Viechnicki, 20 April 2016
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
		if (msaMatch(key, dictionary[i][9]) == true) {
			results.push(dictionary[i][9]);
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
