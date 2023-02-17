var button = document.querySelector('#button');
var searchInput = document.querySelector('#cityInput');
var cityName = document.querySelector('#cityName');
var country = document.querySelector('#country');
var date = document.querySelector('#weatherDate');
var searchHistory = document.querySelector('#history');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var desc = document.querySelector('#desc');
var humi = document.querySelector('#humidity');
var emoji = document.querySelector('.emoji');
var emojiID = document.querySelector('#emojiID');
var forecast = document.querySelector('.forecast');
var todayDate = document.querySelector('#todayDate');
var dateInMain = document.querySelector('#dateInMain');

const apiKey = 'e662d4a594996143186312cf5ab644c4';

// Listen for the search button click
button.addEventListener('click', (event) => {
  event.preventDefault();

  // Get the search input value
  var searchTerm = searchInput.value;
  searchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
  
  // Create a new search history item
  const historyItemDiv = document.createElement('div');
  const historyItem = document.createElement('p');
  historyItem.textContent = searchTerm;
  historyItem.classList.add('historyCard');
  
    // Add the item to the search history
  historyItemDiv.appendChild(historyItem);
  searchHistory.appendChild(historyItemDiv);
  
  // Add a click listener to regenerate the search
  historyItem.addEventListener('click', () => {
    searchInput.value = searchTerm;
    searchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
    performSearch(searchTerm);
  });
  
  // Perform the initial search
  performSearch(searchTerm);
  getCurrentDay(); 

});

function performSearch(searchTerm) {
  // Your search logic goes here
  console.log(`Performing search for "${searchTerm}"`);
}


// fetches the data for the current day.
var getCurrentDay = function (event) {
    var searchValue = searchInput.value.trim();
    searchInput.value = "";
    let currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchValue + '&units=metric&appid=' + apiKey;
  
    fetch(currentUrl).then(function (response) {
        if (response.ok) {
          response.json()
          .then(function (data) {
            console.log(data);
            displayCurrentDay(data);
  
            // We need some info 
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            console.log(lat, lon);
            // make our second API call 
            getForecast(lat, lon);
          })
          .catch(function (){
            err()
          }); 
        }
    }); 
};
  

// Displays current day weather
var displayCurrentDay = (data) => {
    console.log(data.sys.country);
    todayDate.textContent = "Today";
    cityName.textContent = data.name + " " + data.sys.country;
    desc.textContent = data.weather[0].description;
    temp.textContent = data['main']['temp'] + " °C";
    wind.textContent = "Wind : " + data['wind']['speed'];
    humi.textContent = "Humidity : " + data['main']['humidity'];
    date.textContent = data['dt_txt'];
    
    // Remove the previous emoji element
    var oldEmoji = document.querySelector('.emoji');
    if (oldEmoji) {
      oldEmoji.remove();
    }
    
    const mainemoji = document.createElement("img")
    mainemoji.setAttribute("class", "emoji")
    mainemoji.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
    emojiID.append(mainemoji);
}
  
var getForecast = function (lat, lon) {

  console.log("in getforecast " + lat, lon);

  var secondUrl = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(secondUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    //   var dataArr = data.list;
      displayForecast(data)
    })
    .catch(function(error) {
      console.log(error)
    })
  }; 


var displayForecast = (data) => {
    forecast.innerHTML = "";
    console.log(data.list);
    for (var i = 0; i < 40; i+=8) {
        console.log("IN ARRAY!!! "+ data.list);
        const currentDay = data.list[i];

        const date = document.createElement ("div")
        date.setAttribute("class", "card-date temp")
        const dateEl = document.createElement ("h5")
        const dateObj = currentDay.dt_txt.split(" ")[0];
        dateEl.textContent = dateObj;
        date.append(dateEl)

        const forecastCard = document.createElement ("div")
        forecastCard.setAttribute("class", "forecastCard")
        const emoji = document.createElement("img");
        emoji.setAttribute("src", "https://openweathermap.org/img/wn/" + currentDay.weather[0].icon + "@2x.png")

        const forecasthr = document.createElement ("div")
        forecasthr.setAttribute("class", "forecasthr")
        const hr = document.createElement ("hr")
        forecasthr.append(hr)

        const desc = document.createElement ("div")
        desc.setAttribute("class", "card-num temp")
        const descEl = document.createElement ("p")
        descEl.textContent = currentDay.weather[0].description;
        desc.append(descEl)
        
        const temp = document.createElement ("div")
        temp.setAttribute("class", "card-num temp")
        const tempEl = document.createElement ("h4")
        tempEl.textContent = currentDay.main.temp + " °C";
        temp.append(tempEl)

        const wind = document.createElement ("div")
        wind.setAttribute("class", "card-num temp")
        const windEl = document.createElement ("p")
        windEl.textContent = "Wind: " + currentDay.wind.speed;
        wind.append(windEl)

        const humidity = document.createElement ("div")
        humidity.setAttribute("class", "card-num temp")
        const humiEl = document.createElement ("p")
        humiEl.textContent = "Humidity: " + currentDay.main.humidity;
        humidity.append(humiEl)

        forecastCard.append(date, emoji, forecasthr, desc, temp, wind, humidity)
        forecast.append(forecastCard)
    }
};
  

function err() {
  cityName.textContent = "Please enter a city name"
};
