const API_KEY = "81adde7daaaf8da5";

var city;
var newCity;
var day;
var $dayEl;
var inputTimer;
var weatherReport;

window.onload = initialize;

function initialize()
{
    setCity($("#city"));
    setDay($("#dayToday"));
}

function setCity($newCityEl)
{
    window.clearTimeout(inputTimer);
    inputTimer = window.setTimeout
	(
		function()
		{
			city = $($newCityEl).val();
			getWeatherReport();
		},
		1000
	)
}

function setDay($newDayEl)
{
    $($dayEl).removeClass("buttonSelected"); //clear selected button
    $dayEl = $($newDayEl); //set new selected button
	day = $dayEl.attr('title'); //starting index for arrays in updateVals()
    $dayEl.addClass("buttonSelected"); //display button selection
	updateVals();
}

function getWeatherReport()
{
    /*$.ajax
    ({
        url: "http://autocomplete.wunderground.com/aq?query="+city, 
        type: "GET",
        dataType: "jsonp",
        success: function(data)
        {
            city = data[0]['l'];
			alert(city);
        }
    });*/

    var url = "http://api.wunderground.com/api/"
        +API_KEY
        +"/hourly10day/q/"
        +city
        +".json";
    $.ajax
    ({
        url: url,
        dataType: "jsonp",
        success: function(weatherData) 
        {
            weatherReport = weatherData;
            updateVals();
        }
    });
}

function updateVals()
{
	var currentHour = parseInt(weatherReport['hourly_forecast'][0]['FCTTIME']['hour_padded']);
	var temperatures = []; //final length should be 72 = 24*3
	for (i=0; i<72; ++i)
	{
		if (i<currentHour)
		{
			temperatures[i] = -1; //no value
		}
		else 
		{
			temperatures[i] = weatherReport['hourly_forecast'][i-currentHour]['temp']['english'];
		}
	}
}

