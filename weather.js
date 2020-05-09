// Wrap entire doc in ready function
$(document).ready(function () {

	  //history initialize value
	  var history = [];
	  //check if there is something in local storage
	  if (JSON.parse(window.localStorage.getItem("history"))) {
			  history = JSON.parse(window.localStorage.getItem("history"));// this is an array
		} else {
			history = [];
	  };
	
	  // on initial load refresh buttons
	  var restoreButtons = function() {
		  for (var i = 0; i < history.length; i++) {
			createList(history[i].cityName);
		  }
	  };
	  restoreButtons();

// Create global variables
  var searchBtn = $("#searchBtn");
  var baseUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
  var apiKey = "d059ce46f32043aab54a12981f788806";
  var currentDate = moment().format("l");

  // Create event listener for Search button
  searchBtn.on("click", function (event) {
    //prevent the page from reloading
    event.preventDefault();

    var queryCity = $(".form-control").val().trim();

    getWeather(queryCity,event);
  	getForecast(queryCity);
    // Clear input area for next city
    $("#searchCity").val("");
  });

  $(".list-group").on("click", "li.recentCity", function () {
    var queryCity = event.target.id;
    getWeather(queryCity);
    getForecast(queryCity);
  });

  // Get current weather
  function getWeather(inVal, e) {

    // create AJAX queryUrl
    var queryUrl = baseUrl + inVal + "&appid=" + apiKey;
    // Make AJAX call
    //$.ajax({everything})
    $.ajax({
      url: queryUrl,
      method: "GET",
	  dataType: "json",
	  // If city exists and call is successful
      success: function (weather) {
        // Show Weather Card
        $("#currentWeather").attr("style", "display: block");
        // Find weather icon
        var weatherIcon = "<img src='http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'/>";
        var weatherReport = $(".weatherReport");
        // Empty any data on card showing current weather
        weatherReport.empty();

        // Add city name, current date, and icon to H5 on weather card
        weatherReport.append($("<h5 class='card-title' id='currentCity'>" + weather.name +" (" + currentDate +")" + weatherIcon +"</h5>"));
        // Add temperature in Fahrenheit, Humidity, Wind Speed, and UV Index as red button
        var currentTemp = Math.round(((weather.main.temp - 273.15) * (9 / 5) + 32) * 10) / 10;
        weatherReport.append($("<p class='card-text'> Temperature: " + currentTemp + " &deg F</p>"));
        weatherReport.append($("<p class='card-text'>Humidity: " + weather.main.humidity + "%</p>"));
        weatherReport.append($("<p class='card-text'>Wind Speed: " + weather.wind.speed + "MPH</p>"));
        // this requires a different call using the latitude and longitude from first call
        var UVindexURL =
          "http://api.openweathermap.org/data/2.5/uvi?lat=" + weather.coord.lat + "&lon=" + weather.coord.lon + "&appid=" + apiKey;

        $.ajax({
          url: UVindexURL,
          method: "GET",
        }).then(function (response) {
          var uvIndex = response.value;
          weatherReport.append($("<p class='card-text'>UV Index: " + "<button type='button' class='btn UVbtn'>" +	uvIndex + "</button></p>"));
		    // Check UV index and change button colors 		
          if (uvIndex < 4) {
            $(".UVbtn").addClass("btn-secondary");
          } else if (uvIndex > 3 && uvIndex < 7) {
            $(".UVbtn").addClass("btn-warning");
          } else {
            $(".UVbtn").addClass("btn-danger");
          }
		});

		if ($(e.target).hasClass('btn-primary')) {

      // Loop through history to check if input is already on the recent list
      for (var i=0; i<history.length;i++) {
        if (inVal === history[i].cityName) {
          return;
        }}
        createList(inVal);
        var historyObj = {"cityName":inVal};
        history.push(historyObj);
        window.localStorage.setItem('history',JSON.stringify(history));
        } 
  },
	// If city does not exist and AJAX call returns error
      error: function () {
		//empty current weather divs
		var weatherReport = $(".weatherReport");
        weatherReport.empty();
        return;
      },
    });
  }

  // Creates list on left side of window
  function createList(inVal) {

	var liCity = $("<li class='list-group-item recentCity' id='" + inVal + "'>");
    liCity.append(inVal);
    var recentSearches = $(".list-group");
	recentSearches.prepend(liCity);

// }
}

  // Gets 5-day forecast
  function getForecast(inVal) {
    $(".forecastRow").empty();

    var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + inVal + "&appid=" + apiKey;

    $.ajax({
      url: forecastUrl,
      method: "GET",
    }).then(function (forecast) {
      $(".weatherForecast").attr("style", "display: block");
      // need to add date, icon, temp, humidity
      var fiveDay = [
        forecast.list[0],
        forecast.list[8],
        forecast.list[16],
        forecast.list[24],
        forecast.list[32],
      ];

	  console.log(fiveDay);
      for (var i = 0; i < fiveDay.length; i++) {
        var kelvinTemp = fiveDay[i].main.temp;
        var temp =
          Math.round(((kelvinTemp - 273.15) * (9 / 5) + 32) * 100) / 100;

        var eachDay = fiveDay[i].dt_txt;
        var cutDate = eachDay.split("", 10);
        var actualDate = cutDate.join("");
        var formatDate = moment(actualDate).format("l");

        var forecastCol = $("<div class='col-sm'>");
        var forecastCard = $("<div class='card forecast-card'>");
        var cardBody = $("<div class='card-body forecast'>");
        forecastCol.append(forecastCard);
        forecastCard.append(cardBody);
		    var dateTitle = $("<h6 class='card-title hfuture'>" + formatDate + "<h3>");
	    	var cardIcon = $("<img src='http://openweathermap.org/img/w/" + fiveDay[i].weather[0].icon + ".png'/>");
		    cardBody.append(dateTitle, cardIcon);
        $(".forecastRow").append(forecastCol);

        var cardTemp = $("<p class='card-text pfuture'>Temp: " + temp + " &deg F</p>");
        var cardHum = $("<p class='card-text pfuture'>Humidity: " + fiveDay[i].main.humidity + "%</p>");
        cardBody.append(cardTemp, cardHum);
      }
	});
  }

});

