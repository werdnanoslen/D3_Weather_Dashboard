const API_KEY = "81adde7daaaf8da5";

var city;
var newCity;
var day;
var $dayEl;
var inputTimer;
var weatherReport;
var tideReport;
var time;
var temperature;
var humidity;
var tide;
var tideReport;
var tideToday;
var tideTomorrow;
var tide2Days;
var dayTide;
var dayTime;
var dayTemperature;
var dayHumidity;
var barTemperature;
var barHumidity;

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
	draw();
}

function getWeatherReport()
{
    /*$.ajax //couldn't get this to work :(
    ({
        url: "http://autocomplete.wunderground.com/aq?query="+city,
        type: "GET",
        dataType: "jsonp",
        success: function(data)
        {
            city = data[0]['l'];
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
            currentHour = parseInt(weatherReport['hourly_forecast'][0]['FCTTIME']['hour_padded']);
			time = []; //final length should be 72 = 24*3
			temperature = [];
			humidity = [];
			for (i=0; i<72; ++i)
			{
				if (i<currentHour) //no value for hours up to now
				{
					time[i] = i;
					temperature[i] = null;
					humidity[i] = null;
				}
				else 
				{
					time[i] = parseInt(weatherReport['hourly_forecast'][i-currentHour]['FCTTIME']['hour_padded']);
					temperature[i] = parseInt(weatherReport['hourly_forecast'][i-currentHour]['temp']['english']);
					humidity[i] = parseInt(weatherReport['hourly_forecast'][i-currentHour]['humidity']);
				}
			}
			
			getValsByDay();
			draw();
			
			$.ajax
			({
				url: "http://api.wunderground.com/api/"
					+API_KEY
					+"/tide/q/"
					+city
					+".json",
				dataType: "jsonp",
				success: function(tideData) 
				{
					tideReport = tideData;
					tideToday = [];
					tideTomorrow = [];
					tide2Days = [];
					var counter = 0;
					while (parseInt(tideReport['tide']['tideSummary'][counter]['date']['mday'])==(1+parseInt(weatherReport['hourly_forecast'][0]['FCTTIME']['mday'])))
					{
						tideToday.push(parseFloat(tideReport['tide']['tideSummary'][counter++]['data']['height']));
					}
					while (parseInt(tideReport['tide']['tideSummary'][0]['date']['mday'])==(2+parseInt(weatherReport['hourly_forecast'][0]['FCTTIME']['mday'])))
					{
						tideTomorrow.push(parseFloat(tideReport['tide']['tideSummary'][counter++]['data']['height']));
					}
					while (parseInt(tideReport['tide']['tideSummary'][0]['date']['mday'])==(3+parseInt(weatherReport['hourly_forecast'][0]['FCTTIME']['mday'])))
					{
						tide2Days.push(parseFloat(tideReport['tide']['tideSummary'][counter++]['data']['height']));
					}
					getValsByDay();
					draw();
				},
				error: function(jqXHR, textStatus, errorThrown)
				{
					tideReport = null;
					tideToday = [];
					tideTomorrow = [];
					tide2Days = [];
					getValsByDay();
					draw();
				}
			});
        },
		error: function(jqXHR, textStatus, errorThrown)
		{
			weatherReport = null;
            currentHour = null;
			time = [];
			temperature = [];
			humidity = [];
			for (i=0; i<72; ++i)
			{
				time[i] = null;
				temperature[i] = null;
				humidity[i] = null;
			}
			getValsByDay();
			draw();
		}
    });
}

function getValsByDay()
{
	dayTime = [];
	dayTemperature = [];
	dayHumidity = [];
	for (i=day, j=0; i<(day+24); ++i, ++j)
	{
		dayTime[j] = time[i];
		dayTemperature[j] = temperature[i];
		dayHumidity[j] = humidity[i];
	}
	if(day == 0) dayTide = tideToday;
	else if (day == 12)	dayTide = tideTomorrow;
	else dayTide = tide2Days;
}

function draw()
{
	drawTemperature();
	drawHumidity();
	drawTide();
}

function drawTemperature()
{
	var data = [];
	for (i=0; i<dayTime.length; ++i)
	{
		data[i] = {time: dayTime[i], temperature: dayTemperature[i]};
	}
	
	var barWidth = 20;
	var width = (barWidth + 10) * data.length;
	var height = 300;

	var x = d3.scale.linear()
		.domain([0, data.length])
		.range([0, width]);
	var y = d3.scale.linear()
		.domain([0, 100])
		.rangeRound([0, height]);
	
	if(barTemperature !== undefined) barTemperature.remove();
	barTemperature = d3.select("#temperatureGraph").
		append("svg:svg").
		attr("width", width).
		attr("height", height);
	barTemperature.selectAll("text").
		data(data).
		enter().
		append("svg:text").
		attr("x", function(datum, index) { return x(index) + barWidth; }).
		attr("y", function(datum) { return height - y(datum.temperature); }).
		attr("dx", -barWidth/2).
		attr("dy", "1.2em").
		attr("text-anchor", "middle").
		text(function(datum) { return datum.temperature;}).
		attr("fill", "white");
}

function drawHumidity()
{
	var data = [];
	for (i=0; i<dayTime.length; ++i)
	{
		data[i] = {time: dayTime[i], humidity: dayHumidity[i]};
	}
	
	var barWidth = 20;
	var width = (barWidth + 10) * data.length;
	var height = 300;

	var x = d3.scale.linear()
		.domain([0, data.length])
		.range([0, width]);
	var y = d3.scale.linear()
		.domain([0, 100])
		.rangeRound([0, height]);

	
	if(barHumidity !== undefined) barHumidity.remove();
	barHumidity = d3.select("#humidityGraph").
		append("svg:svg").
		attr("width", width).
		attr("height", height);

	barHumidity.selectAll("rect").
		data(data).
		enter().
		append("svg:rect").
		attr("x", function(datum, index) { return x(index); }).
		attr("y", function(datum) { return height - y(datum.humidity); }).
		attr("height", function(datum) { return y(datum.humidity); }).
		attr("width", barWidth).
		attr("fill", "#2d578b");
	barHumidity.selectAll("text").
		data(data).
		enter().
		append("svg:text").
		attr("x", function(datum, index) { return x(index) + barWidth; }).
		attr("y", function(datum) { return height - y(datum.humidity); }).
		attr("dx", -barWidth).
		attr("dy", "1.2em").
		attr("text-anchor", "middle").
		attr("font-size", "12px").
		text(function(datum) { return datum.humidity;}).
		attr("fill", "white");
}

function drawTide()
{
	var data = [];
	for (i=0; i<dayTide.length; ++i)
	{
		data[i] = {time: i, tide: dayTide[i]};
	}
	
	var barWidth = 20;
	var width = (barWidth + 10) * data.length;
	var height = 300;
	
	var x = d3.scale.linear()
		.domain([0, data.length])
		.range([0, width]);
	var y = d3.scale.linear()
		.domain([d3.min(data, function(datum) { return datum.tide; }), d3.max(data, function(datum) { return datum.tide; })])
		.rangeRound([0, height]);
		
	if(barTide !== undefined) barTide.remove();
	barTide = d3.select("#tideGraph").
		append("svg:svg").
		attr("width", width).
		attr("height", height);

	barTide.selectAll("rect").
		data(data).
		enter().
		append("svg:rect").
		attr("x", function(datum, index) { return x(index); }).
		attr("y", function(datum) { return height - y(datum.tide); }).
		attr("height", function(datum) { return y(datum.tide); }).
		attr("width", barWidth).
		attr("fill", "#2d578b");
	barTide.selectAll("text").
		data(data).
		enter().
		append("svg:text").
		attr("x", function(datum, index) { return x(index) + barWidth; }).
		attr("y", function(datum) { return height - y(datum.tide); }).
		attr("dx", -barWidth).
		attr("dy", "1.2em").
		attr("text-anchor", "middle").
		attr("font-size", "12px").
		text(function(datum) { return datum.tide;}).
		attr("fill", "white");
}