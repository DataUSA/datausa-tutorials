/*-------------------------------------------------*/
/* Calls DataUSA API, draws a horizontal bar graph */
/*-------------------------------------------------*/

/*-------------------------------------------------*/
/* Globals                                         */
/*-------------------------------------------------*/
//URL for mean commute times api call
var url1 = "https://api.datausa.io/api/?show=geo&sumlevel=msa&required=mean_commute_minutes&year=latest";
//URL for msa names dictionary
var url2 = "https://api.datausa.io/attrs/geo/?sumlevel=msa";
//URL for national average commute times
var url3 = "https://api.datausa.io/api/?required=mean_commute_minutes&show=geo&sumlevel=all&year=latest&geo=01000US";

//More globals to hold stuff while getting asynchronous requests
var commuteTimes = [];
var msaNames = [];
//Global copy of array with MSA information
var data4 = [];
//d3plus visualization object
var viz_bar;

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

/*------------------------------------------------------------*/
/* Build the horizontal bar chart, passing in array of values */
/*------------------------------------------------------------*/
function buildViz(data) {
    viz_bar = d3plus.viz()
    	.container("#viz_bar")
    	.data(data)
      .format({"text": function(value, params) {

        // don't format location names
        if (params.key === "msaName") return value;

        // change "msaName" to "Location"
        if (value === "msaName") return "Location";

        // title case all other strings and replace underscores with spaces
        return d3plus.string.title(value.replace(/_/g, " "));
      }})
      .height(400)
    	.type("bar")
    	.id("msaName")
    	.x("mean_commute_minutes")
    	.y({"value": "msaName", "scale": "discrete"})
    	.title("Average Commute Times (minutes)")
    	.draw()
    return true;
}

/*-------------------------------------------------------*/
/* Add the names of each msa to the objects in the array */
/*-------------------------------------------------------*/
function addMSANames(data, msaNames) {
    var dataWithNames = [];

    //Only need fields 8 and 9
    //Add field 7 to back end of data where field 8 matches geo
    for (var i = 0; i < data.length; i++) {
    	var newDataRow = {};
    	newDataRow = data[i];
    	for (var j = 0; j < msaNames.length; j++) {
  	    if (msaNames[j][8] == data[i].geo) {
      		newDataRow.msaName = msaNames[j][3];
      		break;
  	    }
    	}
    	dataWithNames.push(newDataRow);
    }
    return dataWithNames;
}

/*-----------------------------------------------------------------*/
/* Return subset of data with top, bottom, myMSA, and national avg */
/*-----------------------------------------------------------------*/
function msaSubset(data, myMSA) {
    var filteredData=[];
    filteredData.push(maxMSA(data));
    for (var i = 0; i < data.length; i++) {
    	if (data[i].msaName == myMSA || data[i].geo == "01000US") {
  	    filteredData.push(data[i]);
    	}
    }
    filteredData.push(minMSA(data));

    return filteredData;
}

/*-----------------------------------------------------------------*/
/* Find min or max of the list of msas by commute time             */
/*-----------------------------------------------------------------*/
function minMSA(data) {
    var min = data[0];
    for (var i = 1; i < data.length; i++) {
    	if (data[i].mean_commute_minutes < min.mean_commute_minutes) {
  	    min = data[i];
    	}
    }
    return min;
}
function maxMSA(data) {
    var max = data[0];
    for (var i = 1; i < data.length; i++) {
    	if (data[i].mean_commute_minutes > max.mean_commute_minutes) {
  	    max = data[i];
    	}
    }
    return max;
}

/*--------------------------------------------------*/
/* You pass in an MSA name, and it updates the bar  */
/* chart accordingly                                */
/*--------------------------------------------------*/
function updateBarGraph(msa)
{
    // var myCity = msa.replace(/Metro Area/, "");
    var data5 = msaSubset(data4, msa);

    //Draw the commute times graph
    buildViz(data5);

}

/*--------------------------------------------------*/
/* Main functionality                               */
/*--------------------------------------------------*/
getJSON(url1).then(function(data) {
    var data1 = data.data;
    var headers = data.headers;
    //Merge headers with data
    commuteTimes = dataFold(data1, headers);
    return getJSON(url2);
}).then(function(msaNames) {
    //Add the explicit MSA names for each geo code
    var data3 = addMSANames(commuteTimes, msaNames.data);

    //Copy array of data to global array so we can reuse it
    for (var i = 0; i < data3.length; i++) {
	data4.push(data3[i]);
    }

    return getJSON(url3);
}).then(function (nationalAverage) {

    //Pull out the reference MSA, the national average, and the min and max
    var nationalAverageObject = dataFold(nationalAverage.data, nationalAverage.headers);
    nationalAverageObject[0].msaName = "National Average";
    data4.push(nationalAverageObject[0]);
    var myCity = "Aberdeen, SD"
    var data5 = msaSubset(data4, myCity);
//    console.log(data5);

    //Draw the commute times graph
    buildViz(data5);

    return true;
}).catch(function(error) {
    console.log("Failed to fetch data: " + error);
    alert("Failed to fetch data: " + error);
});
