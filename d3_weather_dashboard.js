API_KEY = "3ac9e3b42d9cdee2";

var url = "http://api.wunderground.com/api/"
		+API_KEY
		+"/conditions/tide/hourly10day/q/"
		+SEARCH_LOCATION
		+".json";
$.ajax
({
	url: url,
	dataType: "jsonp",
	success: function(weatherData) 
	{
		// use the JSON data here for your visualization
	}
});
