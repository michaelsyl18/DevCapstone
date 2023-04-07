const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const currentTempEl = document.getElementById("current-temp");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const weatherForecastEl = document.getElementById("weather-forecast");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("search-city");
const stateInput = document.getElementById("search-state");


const recentCitiesElement = document.getElementById("recent-cities")
var recentCities = [] // ['Dallas,Texas']

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

document.addEventListener("DOMContentLoaded", function seed() {
  const city = document.getElementById("search-city");
  const state = document.getElementById("search-state");

  city.value = "Dallas";
  state.value = "Texas";
});

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const button = document.getElementById("searchBtn"); // Get the button element by ID

// Button handler for the Recent City buttons.
// Does the following:
// 1. Call the OpenWeather API w/ city & state
// 2. Call the OpenWeather API w/ latitude & longitude
// 3. Update DOM elements with data from ^ response
// 4. Update the Search Box with the city & state
function recentCityButtonHandler(cityStateString) {
  // Define the API URL with the city and state parameters
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityStateString}&appid=${API_KEY}`;

  // Use the fetch API to make a request to the API URL
  fetch(apiUrl)
    .then(response => response.json()) // Convert the response to JSON format
    .then(data => {

  // Extract the latitude and longitude coordinates from the API response
      const lat = data.coord.lat;
      const long = data.coord.lon;

      // Log the coordinates to the console
      console.log(`The coordinates for ${cityStateString} are: ${lat}, ${long}`);

      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`)
        .then(res => res.json())
        .then(wData => {
          console.log(wData)
          showWeatherData(wData);
      });

      // set search to the recent city.
      const city = cityStateString.split(',')[0]
      const state = cityStateString.split(',')[1]
      document.getElementById("search-city").value = city;
      document.getElementById("search-state").value = state;
    })
    .catch(error => {
      // Handle any errors that may occur during the API request
      console.error(`Error fetching data: ${error}`);
    });
}

button.addEventListener("click", function () {
  // Add a click event listener to the button

// Define the city and state to search for
  const city = document.getElementById('search-city');
  const state = document.getElementById('search-state');

  // Define the API URL with the city and state parameters
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.value.trim()},${state.value.trim()}&appid=${API_KEY}`;

  // Use the fetch API to make a request to the API URL
  fetch(apiUrl)
    .then(response => response.json()) // Convert the response to JSON format
    .then(data => {

  // Extract the latitude and longitude coordinates from the API response
      const lat = data.coord.lat;
      const long = data.coord.lon;

      // Log the coordinates to the console
      console.log(`The coordinates for ${city}, ${state} are: ${lat}, ${long}`);

      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(wData => {

          console.log(wData)
          showWeatherData(wData);
          })
    })
    .catch(error => {
      // Handle any errors that may occur during the API request
      console.error(`Error fetching data: ${error}`);
    });

    // do a POST call to the server. The server responds with a list of recent cities.
    // We set our global variable, recentCities, to the response. 
    postToRecentCities(city.value.trim(), state.value.trim())
      .then(response => recentCities = response);
});

async function postToRecentCities(city, state) {
  const cityStateString = `${city},${state}` 
  const rawResponse = await fetch('/api/addToRecent', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: cityStateString
  })
  const content = await rawResponse.json();
  console.log(content)
  return content;
}


setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const hour = time.getHours();
  const date = time.getDate();
  const day = time.getDay();
  const hoursIn24HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn24HrFormat < 10 ? "0" + hoursIn24HrFormat : hoursIn24HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function animateTemp(data) {
  // Pass data as an argument
  const currentTemp = Number(currentTempEl.innerText.slice(0, -2));
  const maxTemp = Math.max(...data.daily.map((day) => day.temp.max));
  let temp = 0;

  const interval = setInterval(() => {
    if (temp >= currentTemp) {
      clearInterval(interval);
    } else {
      temp++;
      currentTempEl.innerHTML = `
        <img src="http://openweathermap.org/img/wn//${data.current.weather[0].icon}.png" alt="weather icon" class="w-icon">
        <div class="temp">${temp}&#176;F</div>
      `;
    }
  }, 10);

  setTimeout(() => {
    currentTempEl.innerHTML = `
      <img src="http://openweathermap.org/img/wn//${data.current.weather[0].icon}.png" alt="weather icon" class="w-icon">
      <div class="temp">${currentTemp}&#176;F</div>
    `;
  }, 1000);

  currentTempEl.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 1000,
    easing: "ease-in-out",
  });

  weatherIcon.animate(
    [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
    {
      duration: 1000,
      easing: "ease-in-out",
    }
  );
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div> `;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <div class="temp">Night - ${day.temp.night}&#176;F</div>
                <div class="temp">Day - ${day.temp.day}&#176;F</div>
            </div>`;
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&deg;F</div>
                <div class="temp">Day - ${day.temp.day}&deg;F</div>
            </div>`;
    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;

  // Display recent cities.
  let recentCitiesButtons = "";
  console.log('recentCities', recentCities);
  recentCities['recentCities'].forEach((city, idx) => { // ['Dallas,Texas', 'Seattle,Washington']
    // recentCityButtonHandler('Seattle,Washington')
    recentCitiesButtons += `
      <div><button onclick="recentCityButtonHandler('${city}')">${city}</button></div>
    `
  })

  recentCitiesElement.innerHTML = recentCitiesButtons;
}

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

stateInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});