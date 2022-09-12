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

//Get Current Location and info      //////////////

function showCurrentTemp(response) {
  console.log(response);
  let currTemp = Math.round(response.data.main.temp);
  let minT = Math.round(response.data.main.temp_min);
  let maxT = Math.round(response.data.main.temp_max);
  let feelsT = Math.round(response.data.main.feels_like);
  let windSpeed = Math.round(response.data.wind.speed);
  let humidity = Math.round(response.data.main.humidity);
  let visibility = Math.round(response.data.visibility * 10) / 10000;
  let timeValueUnix = response.data.dt;
  let timezone = response.data.timezone;
  let timeValue = (timeValueUnix + timezone) * 1000;

  let tempToday = document.querySelector(".weather-temperature strong");
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

  tempToday.innerHTML = `${currTemp}`;
  weatherDescription.innerHTML = response.data.weather[0].main;
  longWeatherDescription.innerHTML = response.data.weather[0].description;
  cityName.innerHTML = response.data.name;
  countryName.innerHTML = response.data.sys.country;
  minTemp.innerHTML = minT;
  maxTemp.innerHTML = maxT;
  otherMaxTemp.innerHTML = maxT;
  feelsLikeT.innerHTML = feelsT;
  currHumidity.innerHTML = humidity;
  currVisibility.innerHTML = visibility;
  currWindSpeed.innerHTML = windSpeed;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  convertTime(timeValue);
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

callNavigator();

//Weather API Location     ///////////////////////

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
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", changeCurrentCity);
