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
    day = $dayEl.text(); //how do I capture dates?
    $dayEl.addClass("buttonSelected"); //display button selection
    getWeatherReport();
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
	
	var newCity = $.getJSON("http://autocomplete.wunderground.com/aq?query="+city);
	document.write(JSON.stringify(newCity));
	

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
            updateUI();
        }
    });
}

function updateUI()
{
    //alert(weatherReport['hourly_forecast'][0]['temp']['metric']);
    //alert(weatherReport['FCTTIME']['pretty']);
}

