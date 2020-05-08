// Wrap entire doc in ready function
$(document).ready(function(){

var searchBtn = $("#searchBtn");
// Create global variables for AJAX calls
var baseUrl = "http://api.openweathermap.org/data/2.5/weather?q=" 
var apiKey = "d059ce46f32043aab54a12981f788806"
var currentDate = moment().format("l");


// 1. Create event listener for Search button that makes AJAX call to open weather API
searchBtn.on("click", function(){
    
    createList();
    getWeather();
    getForecast();
    // Clear input area for next city
    $("#searchCity").val("");

})

// Get current weather
function getWeather() {

    // localStorage.setItem(JSON.stringify("recentSearches", recentSearches));
    var queryCity = $(".form-control").val().trim()

    // create AJAX queryUrl
    var queryUrl = baseUrl + queryCity + "&appid=" + apiKey;
    // Make AJAX call 
    $.ajax({
        url: queryUrl,
        method: "GET" 
    }).then(function(weather) {

        // Show Weather Card
        $("#currentWeather").attr("style", "display: block");
        // var weatherIcon = $("<img src='/img/w/'" + weather.weather[0].icon + "/>");
        var weatherReport = $(".weatherReport")
        weatherReport.empty();
        
        // Add city name, current date, and icon to H5 on card
        weatherReport.append($("<h5 class='card-title' id='currentCity'>" + weather.name + " (" + currentDate + ")</h5>"));
        // Add temperature in Fahrenheit, Humidity, Wind Speed, and UV Index as red button
        var currentTemp = Math.round(((weather.main.temp-273.15)*(9/5)+32)*10)/10;
        weatherReport.append($("<p class='card-text'> Temperature: " + currentTemp + "  Degrees F</p>"));
        weatherReport.append($("<p class='card-text'>Humidity: " + weather.main.humidity + "%</p>"));
        weatherReport.append($("<p class='card-text'>Wind Speed: " + weather.wind.speed + "MPH</p>"));
            // this requires a different call using the latitude and longitude from first call
            var UVindexURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + weather.coord.lat + "&lon=" + weather.coord.lon
                + "&appid=" + apiKey;

                $.ajax({
                    url: UVindexURL,
                    method: "GET"
                }).then(function(response) {

                    var uvIndex = response.value
                    weatherReport.append($("<p class='card-text'>UV Index: " + "<button type='button' class='btn UVbtn'>" + uvIndex + "</button></p>"));
                    if (uvIndex < 4) {
                        $(".UVbtn").addClass("btn-secondary");
                    } else if (uvIndex > 3 && uvIndex < 7) {
                        $(".UVbtn").addClass("btn-warning");
                    } else {
                        $(".UVbtn").addClass("btn-danger");
                    }
                })

    })
}

// Creates list on left side of window
function createList() {
    var queryCity = $(".form-control").val().trim()

     // Create li elements for the new city, append to li element, and prepend li element to list-group
     var liCity = $("<li class='list-group-item recentCity' id='" + queryCity + "'>")
     liCity.append(queryCity);
     var recentSearches = $(".list-group")
     recentSearches.prepend(liCity);
}

// Gets 5-day forecast
function getForecast() {
    $(".forecastRow").empty();
    var queryCity = $(".form-control").val().trim();
    var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + queryCity + "&appid=" + apiKey;

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function(forecast){


        $(".weatherForecast").attr("style", "display: block");
        // need to add date, icon, temp, humidity
         var fiveDay = [forecast.list[0], 
                        forecast.list[8],
                        forecast.list[16],
                        forecast.list[24],
                        forecast.list[32]
                    ];

                    console.log(fiveDay);
        for (var i=0; i<fiveDay.length;i++) {
            // console.log(fiveDay[i].main.temp);
            var kelvinTemp = fiveDay[i].main.temp;
            var temp = Math.round(((kelvinTemp-273.15)*(9/5)+32)*100)/100;
            console.log(temp);

            var eachDay = fiveDay[i].dt_txt;
            var cutDate = eachDay.split("",10);
            var actualDate = cutDate.join('');
            var formatDate = moment(actualDate).format("l");
            console.log(formatDate);

            var forecastCol = $("<div class='col-sm'>");
            var forecastCard = $("<div class='card'>")
            var cardBody = $("<div class='card-body forecast'>")
            forecastCol.append(forecastCard);
            forecastCard.append(cardBody);
            var dateTitle = $("<h6 class='card-title hfuture'>" + formatDate + "<h3>");
            cardBody.append(dateTitle);
            $(".forecastRow").append(forecastCol);

            console.log(fiveDay);
            var cardTemp = $("<p class='card-text pfuture'>Temp: " + temp + " Degrees F</p>");
            var cardHum = $("<p class='card-text pfuture'>Humidity: " + fiveDay[i].main.humidity + "%</p>");
            cardBody.append(cardTemp, cardHum);


        }

    })
}

// Create event listeners for li elements
$(".list-group").on("click", "li.recentCity", function(){
    console.log(this.id);
    var queryCity = this.id;
    //  getWeather(queryCity);
    // console.log($(this).val("id"));
    // var queryCity = JSON.stringify($(this).val("id"));
    // console.log(queryCity);

} )


});

// Create event listener for the target names in the recent city list to run the getWeather() and getForecast() functions

// 2. When search button is clicked, input area resets, current city is prepended to list-group card,
//     - current weather populates in top right card
//     - 5-day Forecast populates underneath main card on 5 smaller cards in sub row

// 3. When page opens, browser pulls last city from local storage, shows info on main screen, and shows recent cities in left-side-bar

// 4. Create click event for each li element so that when it's clicked, the current weather and 5-day forecast for that city populate

// FOR TUTORINTG, still to be done
    // Set and get local storage
    // Add Icons
    // Add Degrees symbol
    // Create event listeners for each of the li
    // For some reason I have to define the queryCity in each function even tho I had it global