/*-------------------------------------------------*/
/* Calls DataUSA API, draws a horizontal bar graph */
/*-------------------------------------------------*/

/*-------------------------------------------------*/
/* Globals                                         */
/*-------------------------------------------------*/
//URL for dataUSA api call
var vets_url = "https://api.datausa.io/api/?sumlevel=state&show=geo&required=conflict_total%2Cconflict_wwii%2Cconflict_korea%2Cconflict_vietnam%2Cconflict_gulf90s%2Cconflict_gulf01";

//d3plus visualization object
var viz_bar;

/*---------------------------------------------------------*/
/* Encapsulate building the bar chart                      */
/* pass in an array of values, and it builds the bar chart */
/*---------------------------------------------------------*/
function buildViz(data) {
    var visualization = d3plus.viz()
	.container("#vets_viz")
	.data(data)
	.type("bar")
	.y("conflict_total")
	.x("state")
    	.id("geo")
	.ui(
	    [
		{
		    "method": "y",
		    "label": "Choose conflict",
		    "value": ["conflict_total", "conflict_wwii",
			      "conflict_korea", "conflict_vietnam",
			      "conflict_gulf90s", "conflict_gulf01"]
		}
	    ]
	)
	.draw()
    
    return true;
}

//Data for input to d3plus needs to be in form of array of objects
 var fakeData = [
     {
	 "geo": "Maine",
	 "state": "Maine",
	 "conflict_total":20,
	 "test": 15
     }, {
	 "geo": "New Hampshire",
	 "state": "New Hampshire",
	 "conflict_total":20,
	 "test": 10
     }, {"geo": "Vermont",
	 "state": "Vermont",
	 "conflict_total":30,
	 "test": 5
	}];

//Get real data from DataUSA API
getJSON(vets_url).then(function(data) {
    

    //Transform it into array of objects
    var vetsData = objectify(data);
    var vetsData2 = addStateNames(vetsData);

    //Pass to d3plus
    buildViz(fakeData);

});

