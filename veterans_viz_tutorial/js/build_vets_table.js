/*------------------------------------------------*/
/* Get data on vets per state from dataUSA API    */
/* then build a dynamic table with it             */
/*------------------------------------------------*/

/*------------------------------------------------*/
/* Globals                                        */
/*------------------------------------------------*/


var vetsURL = "https://api.datausa.io/api/?sumlevel=state&show=geo&required=conflict_total%2Cconflict_wwii%2Cconflict_korea%2Cconflict_vietnam%2Cconflict_gulf90s%2Cconflict_gulf01&year=latest";

var vetsData2 = [];

 var fakeData = [
     {
	 "state": "Maine",
	 "conflict_total":20,
	 "conflict_wwii": 15
     }, {
	 "state": "New Hampshire",
	 "conflict_total":20,
	 "conflict_wwii": 10
     }, {
	 "state": "Vermont",
	 "conflict_total":30,
	 "conflict_wwii": 5
	}];


/*------------------------------------------------*/
/* Main functionality                             */
/*------------------------------------------------*/


getJSON(vetsURL).then(function(response) {
    var vetsData = objectify(response);
    vetsData2 = addStateNames(vetsData);
    console.log(vetsData2);

    $('#vets_table').dynatable({
    table: {
	defaultColumnIdStyle: 'underscore'
    },
	dataset: {
	    records: fakeData
	}
    });
});


