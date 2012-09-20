const API_KEY = "81adde7daaaf8da5";

var city;
var newCity;
var day;
var $dayEl;
var inputTimer;
var weatherReport;
var temperature;
var humidity;

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
	day = parseInt($dayEl.attr('title')); //starting index for arrays in updateVals()
    $dayEl.addClass("buttonSelected"); //display button selection
	getValsByDay();
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
	currentHour = parseInt(weatherReport['hourly_forecast'][0]['FCTTIME']['hour_padded']);
	temperature = []; //final length should be 72 = 24*3
	humidity = [];
	for (i=0; i<72; ++i)
	{
		if (i<currentHour) //no value for hours up to now
		{
			temperature[i] = -1;
			humidity[i] = -1;
			tide[i] = -1;
		}
		else 
		{
			temperature[i] = weatherReport['hourly_forecast'][i-currentHour]['temp']['english'];
			humidity[i] = weatherReport['hourly_forecast'][i-currentHour]['humidity'];
		}
	}
	getValsByDay();
}

function getValsByDay()
{
	newTemperature = "";
	newHumidity = "";
	for (i=day; i<(day+24); ++i)
	{
		newTemperature += temperature[i]+", ";
		newHumidity += humidity[i]+", ";
	}
	$('#temperatureGraph').text(newTemperature);
	$('#humidityGraph').text(newHumidity);
}
