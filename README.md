# weatherapp.homework
Create a dynamic weather dashboard using Open Weather Maps 

For this homework project, I was to create a dynamic weather dashboard using Open Weather API and jQuery. When the user first logs on, the page just shows the city input and the search button. When the user clicks search, the city is added to a list of recent searches, the current weather populates, and then the 5-day forecast populates underneath.

First, I created the html skeleton and got an idea of how the page needed to look and where the dynamic elements would be added. From there, I created a few global variables and a click event for the search button. I originally started with two functions to get the weather and to get the forecast, but refactored into three so that I could call specific parts of the functions again. I separated the list builder into its own function so that it does not affect the getweather and getforecast functions when a list element is created. 

Once I had all three functions working for cities input by the user, I created a second click event for the list-group, adding a listener for the group itself (hard coded into html) that grabs the recentCity class and pulls its id. From there, the id is input into the queryUrl as the queryCity. In order to make this work without repeating functions, I added if conditions into each function that checked whether the queryterm should be picked from the input or the list click. 

Last, I set the recent searches to localStorage, called a function to get them when the page loads, and show the last searched city when the user opens the page. 
