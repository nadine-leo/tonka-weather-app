//Timestamp             /////////////////////

function convertTime(time) {
  let date = new Date(time);
  let hours = date.getHours();
  let min = date.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayWeek = days[date.getDay()];

  let timestamp = document.querySelector(".current-time");
  timestamp.innerHTML = `${dayWeek} ${hours}:${min}`;
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function formatDateNumber(timestamp) {
  let date = new Date(timestamp * 1000);
  return date.getDate();
}

// Forecast /////////////////////////////

function displayForecast(response) {
  let forecastData = response.data.daily;
  let forecastRow = document.querySelector(".forecast-wrapper");
  let forecastHTML = `
          <strong>5 DAY FORECAST</strong>
          <div class="row forecast-row">`;

  forecastData.forEach(function (dailyData, index) {
    if (index > 0 && index < 6) {
      forecastHTML += `
              <div class="col-2 forecast-weather-card">
                <div class="forecast-date">
                  ${formatDate(dailyData.dt)} ${formatDateNumber(dailyData.dt)}
  
                  <img
                    class="icon-forecast"
                    src="http://openweathermap.org/img/wn/${
                      dailyData.weather[0].icon
                    }@2x.png"
                    alt= "daily weather"
                    class="icon-forecast"
                  />
                </div>
                <div class="forecast-temperature">
                  <span class="forecast-max">${Math.round(
                    dailyData.temp.max
                  )} ° </span>
                  <span class="forecast-min">${Math.round(
                    dailyData.temp.min
                  )} ° </span>
                </div>
              </div>
            `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastRow.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "257e74eb60b897c439a9569203b9000a";
  let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(displayForecast);
}

//Get Current Location and info      //////////////

function showCurrentTemp(response) {
  let tempToday = document.querySelector("#current-temperature");
  let weatherDescription = document.querySelector(".short-description");
  let cityName = document.querySelector("#city-name");
  let countryName = document.querySelector("#country-name");
  let minTemp = document.querySelector("#curr-min-temp");
  let maxTemp = document.querySelector("#curr-max-temp");
  let otherMaxTemp = document.querySelector("#max-temp");
  let feelsLikeT = document.querySelector(".feels-like-temp");
  let longWeatherDescription = document.querySelector(".long-description");
  let currWindSpeed = document.querySelector("#wind-speed");
  let currHumidity = document.querySelector("#humidity");
  let currVisibility = document.querySelector("#visibility");
  let weatherIcon = document.querySelector("#icon");

  let timeValueUnix = response.data.dt;
  let timezone = response.data.timezone;
  let timeValue = (timeValueUnix + timezone) * 1000;

  let coords = response.data.coord;

  celsius = response.data.main.temp;
  celsiusMax = response.data.main.temp_max;
  celsiusMin = response.data.main.temp_min;
  celsiusFeel = response.data.main.feels_like;

  tempToday.innerHTML = Math.round(celsius);
  weatherDescription.innerHTML = response.data.weather[0].main;
  longWeatherDescription.innerHTML = response.data.weather[0].description;
  cityName.innerHTML = response.data.name;
  countryName.innerHTML = response.data.sys.country;
  minTemp.innerHTML = Math.round(celsiusMin);
  maxTemp.innerHTML = Math.round(celsiusMax);
  otherMaxTemp.innerHTML = Math.round(celsiusMax);
  feelsLikeT.innerHTML = Math.round(celsiusFeel);
  currHumidity.innerHTML = Math.round(response.data.main.humidity);
  currVisibility.innerHTML = Math.round(response.data.visibility * 10) / 10000;
  currWindSpeed.innerHTML = Math.round(response.data.wind.speed);
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  convertTime(timeValue);
  getForecast(coords);
}

function retrievePosition(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  let apiKey = "257e74eb60b897c439a9569203b9000a";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showCurrentTemp);
}

function callNavigator() {
  navigator.geolocation.getCurrentPosition(retrievePosition);
  //let cityInput = document.querySelector("#submit-search-city");
  //cityInput.value = "";
}
//Weather API Location  & Forecast   ///////////////////////
function changeUnitstoC() {
  let units = document.querySelectorAll(".unit");
  units.forEach((placement) => {
    placement.innerHTML = " °C";
  });
}

function callWeatherApi(city) {
  let apiKey = "257e74eb60b897c439a9569203b9000a";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showCurrentTemp);
}

function changeCurrentCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input");
  let inputValue = cityInput.value;
  callWeatherApi(inputValue);
  changeUnitstoC();
}

function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let currentTemp = document.querySelector("#current-temperature");
  let minTemp = document.querySelector("#curr-min-temp");
  let maxTemp = document.querySelector("#curr-max-temp");
  let otherMaxTemp = document.querySelector("#max-temp");
  let feelTemp = document.querySelector(".feels-like-temp");

  currentTemp.innerHTML = Math.round(celsius);
  minTemp.innerHTML = Math.round(celsiusMin);
  maxTemp.innerHTML = Math.round(celsiusMax);
  otherMaxTemp.innerHTML = Math.round(celsiusMax);
  feelTemp.innerHTML = Math.round(celsiusFeel);

  changeUnitstoC();
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let currentTemp = document.querySelector("#current-temperature");
  let minTemp = document.querySelector("#curr-min-temp");
  let maxTemp = document.querySelector("#curr-max-temp");
  let otherMaxTemp = document.querySelector("#max-temp");
  let feelTemp = document.querySelector(".feels-like-temp");

  let units = document.querySelectorAll(".unit");

  let fahrenheit = (celsius * 9) / 5 + 32;
  let fahrenheitMin = (celsiusMin * 9) / 5 + 32;
  let fahrenheitMax = (celsiusMax * 9) / 5 + 32;
  let fahrenheitFeel = (celsiusFeel * 9) / 5 + 32;

  currentTemp.innerHTML = Math.round(fahrenheit);
  minTemp.innerHTML = Math.round(fahrenheitMin);
  maxTemp.innerHTML = Math.round(fahrenheitMax);
  otherMaxTemp.innerHTML = Math.round(fahrenheitMax);
  feelTemp.innerHTML = Math.round(fahrenheitFeel);

  units.forEach((placement) => {
    placement.innerHTML = " °F";
  });
}

let celsius = null;
let celsiusMax = null;
let celsiusMin = null;
let celsiusFeel = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", changeCurrentCity);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);
///////function calls///////

callNavigator();
