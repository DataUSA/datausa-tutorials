/*----------------------------------------------------------------*/
/* Functions to retrieve data from USA Spending, geocode it,      */
/* and format for display on the leaflet map                      */
/* Zip codes courtest of US Postal Service,                       */
/* http://www.unitedstateszipcodes.org/zip-code-database/         */
/*----------------------------------------------------------------*/

/*----------------------------------------------------------------*/
/* Global variables                                               */
/*----------------------------------------------------------------*/
var congestionProjects = []; //Array to store objects for the congestion projects
var zipCodes = []
var DEBUG_MODE = false;

/*------------------------------------------------------------------*/
/* Read a local json file with all USA spending data from FY16      */
/* From Department of Transportation, store in global array         */
/*------------------------------------------------------------------*/
function initializeCongestionProjects() {

    var assistanceFile;
    if (DEBUG_MODE) {
	assistanceFile = "./json/debug_test_assistance.json";
    } else {
	assistanceFile = "./json/assistance.json";
    }
    getJSON(assistanceFile).then(function(response) {
	fields = ["recipient_city_name", "recipient_county_name",
		  "recipient_zip", "fed_funding_amount",
		  "total_funding_amount", "principal_place_code",
		  "principal_place_state_code", "principal_place_zip",
		  "principal_place_cc", "project_description"];
		  
	for (var i = 0; i < response.length; i++) {
	    var newProject = {};
	    for (var j = 0; j < fields.length; j++) {
		newProject[fields[j]] = response[i][fields[j]];
	    }
	    //Normalize zip ahead of time, treat separately
	    newProject.principal_place_zip = normalizeZipCode(response[i].principal_place_zip);
	    congestionProjects.push(newProject);
	}
    }).then(function() {
	initializeZipCodes();
    });
    return true;
}
/*------------------------------------------------------------------*/
/* You pass it the name of a metro area, and it looks up congestion */
/* construction projects in local json file pulled from USA Spending*/
/* and passes back an array of objects                              */
/*------------------------------------------------------------------*/
function filterCongestionProjects(msaName) {
    var results = [];

    var stateNames = retrieveStatesInMSA(msaName);
    
    //Loop through the array of objects in congestionProjects
    for (var i = 0; i < congestionProjects.length; i++) {
	for (var j=0; j < stateNames.length; j++) {
	    if (congestionProjects[i].principal_place_state_code == stateNames[j]) {
		//if the state matches the msa then
		var newRow = congestionProjects[i];
		//Create a new object with all relevant fields included
		results.push(newRow);
		break;
	    }
	}
    }
    return results;
}

/*----------------------------------------------------------------*/
/* You pass it an MSA name, it gives you back an array            */
/* of relevant state codes                                        */
/*----------------------------------------------------------------*/
function retrieveStatesInMSA(msaName) {
    var statesString = msaName.split(", ")[1];
    var cleanStatesString = statesString.replace(/ Micro Area/gi, ''); //Get rid of Micro Area
    cleanStatesString = cleanStatesString.replace(/ Metro Area/gi, ''); //also get rid of Metro Area label
    return cleanStatesString.split("-");
}

/*----------------------------------------------------------------*/
/* Read the json database of zip code centroids                   */
/* Store in global array                                          */
/*----------------------------------------------------------------*/
function initializeZipCodes() {
    var zipcodesFile = "./json/zip_code_database.json";
    getJSON(zipcodesFile).then(function(response) {
	fields = ["zip", "latitude", "longitude"];
		  
	for (var i = 0; i < response.length; i++) {
	    var newZipCodeObject = {};
	    var fiveCharZipCode = '';
	    newZipCodeObject.latitude = response[i].latitude;
	    newZipCodeObject.longitude = response[i].longitude;

	    newZipCodeObject.zip = normalizeZipCode(response[i].zip);

	    zipCodes.push(newZipCodeObject);
	}
    }).then(function() {
	joinZipsToProjects();
    });

	;
    return true;    
}
/*-----------------------------------------------------------------------*/
/* Pass it a string you know to be a zip code, and it normalizes it to   */
/* five chars                                                            */
/*-----------------------------------------------------------------------*/
function normalizeZipCode(myZip) {
    //Prepend 0s if less than 5 chars long
    //Don't forget zip plus 4!

    var fiveCharZipCode;
    
    if (myZip.length == 3) {
	fiveCharZipCode = '00' + myZip;
    } else if (myZip.length == 4) {
	fiveCharZipCode = '0' + myZip;
    } else if (myZip.length == 7) {
	fiveCharZipCode = '00' + myZip.substr(0,3);
    } else if (myZip.length == 8) {
	fiveCharZipCode = '0' + myZip.substr(0,4);
    } else if (myZip.length > 8) {
	fiveCharZipCode = myZip.substr(0,5);
    } else {
	fiveCharZipCode = myZip;
    }
    return fiveCharZipCode;
}
/*--------------------------------------------------------------------*/
/* Join zip code information into congestionProjects array            */
/*--------------------------------------------------------------------*/
function joinZipsToProjects() {
    //Loop through congestion projects
    for (var i = 0; i < congestionProjects.length; i++) {
	for (var j = 0; j < zipCodes.length; j++) {
	    if (congestionProjects[i].principal_place_zip == zipCodes[j].zip) {
		//Add to congestion Projects object
		congestionProjects[i].latitude = zipCodes[j].latitude;
		congestionProjects[i].longitude = zipCodes[j].longitude;
		break;
	    }
	}
    }
    return true;
}
