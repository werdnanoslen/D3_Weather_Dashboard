const API_KEY = "3ac9e3b42d9cdee2";

var city;
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
    inputTimer = window.setTimeout //wait for entire word to be inputted to cut down on load
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
    $($dayEl).removeClass("buttonSelected");
    $dayEl = $($newDayEl);
    day = $dayEl.text(); //how do I capture dates?
    $dayEl.addClass("buttonSelected");
    getWeatherReport();
}

function getWeatherReport()
{
    var url = "http://api.wunderground.com/api/"
        +API_KEY
        +"/conditions/tide/hourly10day/q/"
        +city
        +".json";
    $.ajax
        ({
            url: url,
            dataType: "jsonp",
            success: function(weatherData) 
            {
                weatherReport = jQuery.parseJSON(weatherData);
                updateUI();
            }
        });
}

function updateUI()
{
    alert("");
}

