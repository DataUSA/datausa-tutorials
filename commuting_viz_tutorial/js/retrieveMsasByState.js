//---------------------------------------------------------------//
// Geographical utilty and helper functions
//P. Viechnicki, 19 April 2016
//---------------------------------------------------------------//

//---------------------------------------------------------------//
// Look up two-letter state code
// P. Viechnicki, 20 April 2016
//---------------------------------------------------------------//

function lookupAbbreviation(name) {
	var result = "State not found";
	switch(name) {
		case("Alabama"):
			result = "AL";
			break;
		case("Alaska"):
			result = "AK";
			break;
		case("Arizona"):
			result = "AZ";
			break;
		case("Arkansas"):
			result = "AR";
			break;
		case("California"):
			result = "CA";
			break;
		case("Colorado"):
			result = "CO";
			break;
		case("Connecticut"):
			result = "CT";
			break;
		case("Delaware"):
			result = "DE";
			break;
		case("Florida"):
			result = "FL";
			break;
		case("Georgia"):
			result = "GA";
			break;
		case("Hawaii"):
			result = "HI";
			break;
		case("Idaho"):
			result = "ID";
			break;
		case("Illinois"):
			result = "IL";
			break;
		case("Indiana"):
			result = "IN";
			break;
		case("Iowa"):
			result = "IA";
			break;
		case("Kansas"):
			result = "KS";
			break;
		case("Kentucky"):
			result = "KY";
			break;
		case("Louisiana"):
			result = "LA";
			break;
		case("Maine"):
			result = "ME";
			break;
		case("Maryland"):
			result = "MD";
			break;
		case("Massachusetts"):
			result = "MA";
			break;
		case("Michigan"):
			result = "MI";
			break;
		case("Minnesota"):
			result = "MN";
			break;
		case("Mississippi"):
			result = "MS";
			break;
		case("Missouri"):
			result = "MO";
			break;
		case("Montana"):
			result = "MT";
			break;
		case("Nebraska"):
			result = "NE";
			break;
		case("Nevada"):
			result = "NV";
			break;
		case("New Hampshire"):
			result = "NH";
			break;
		case("New Jersey"):
			result = "NJ";
			break;
		case("New Mexico"):
			result = "NM";
			break;
		case("New York"):
			result = "NY";
			break;
		case("North Carolina"):
			result = "NC";
			break;
		case("North Dakota"):
			result = "ND";
			break;
		case("Ohio"):
			result = "OH";
			break;
		case("Oklahoma"):
			result = "OK";
			break;
		case("Oregon"):
			result = "OR";
			break;
		case("Pennsylvania"):
			result = "PA";
			break;
		case("Rhode Island"):
			result = "RI";
			break;
		case("South Carolina"):
			result = "SC";
			break;
		case("South Dakota"):
			result = "SD";
			break;
		case("Tennessee"):
			result = "TN";
			break;
		case("Texas"):
			result = "TX";
			break;
		case("Utah"):
			result = "UT";
			break;
		case("Vermont"):
			result = "VT";
			break;
		case("Virginia"):
			result = "VA";
			break;
		case("Washington"):
			result = "WA";
			break;
		case("West Virginia"):
			result = "WV";
			break;
		case("Wisconsin"):
			result = "WI";
			break;
		case("Wyoming"):
			result = "WY";
		}
	return result;
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
		var matchingMSA = {};
		matchingMSA.name = dictionary[i][9];
		matchingMSA.cbsafp = dictionary[i][8];
		results.push(matchingMSA);
			//results.push(dictionary[i][9]);
	    }
	}
	return results;
}
