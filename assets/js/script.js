let weatherApiKey = "55e60517984814124890dfad8888e3a9";
let cities = [];

function searchCity() {
  const inputCity = $('#inputCity');
  const cityName = inputCity.val();
  sendCity(cityName);
  inputCity.val('');
}

function sendCity(city) {
  let cityAPI = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + weatherApiKey;
  $.ajax({
    url: cityAPI,
    method: 'GET',
  }).then(function (response) {
    if (!$.trim(response)) {
      alert('Invalid input for city!');
    }

    let latitude = response[0].lat;
    let longitude = response[0].lon;
    let currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + latitude + "&lon=" + longitude + "&appid=" + weatherApiKey;
    $.ajax({
      url: currentWeatherAPI,
      method: 'GET',
    }).then(function (data) {
      renderCurrentWeather(data);
    });

    let forecastAPI = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=" + latitude + "&lon=" + longitude + "&appid=" + weatherApiKey;
    $.ajax({
      url: forecastAPI,
      method: 'GET',
    }).then(function (dataforecast) {
      renderForecast(dataforecast);
      $('.displayed').removeClass('hidden');
    });
  });
}

function renderCurrentWeather(data) {
  $('#city').text(data.name).val(data.name);
  let found = false;
  for (let i = 0; i < cities.length; i++) {
    if (cities[i].name == data.name) {
      found = true;
      break;
    }
  }
  if (!found) {
    const city = {
      name: $('#city').val()
    };
    cities.push(city);
  }

  let today = dayjs();
  $('#today').text(today.format('ddd, MM/DD/YYYY'));
  $('#currentTemp').text("Temp: " + Math.floor(data.main.temp) + " °F");
  $('#currentHumid').text("Humidity: " + data.main.humidity + " %");
  $('#currentWind').text("Wind: " + data.wind.speed + " mph");
  let iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
  $('#currentIcon').attr('src', iconUrl);

  $('#history').on('click', '.direct', function () {
    sendCity($(this).val());
  });
}

function renderForecast(forecast) {
  let j = 0;
  const fiveForecast = forecast.list;
  for (let i = 0; i < fiveForecast.length; i++) {
    if (fiveForecast[i].dt_txt.includes('00:00:00')) {
      $('#date' + j).text(dayjs(fiveForecast[i].dt_txt).format('MM/DD/YYYY'));
      $('#temp' + j).text("Temp: " + Math.floor(fiveForecast[i].main.temp) + " °F");
      $('#humid' + j).text("Humidity: " + fiveForecast[i].main.humidity + " %");
      $('#wind' + j).text("Wind: " + fiveForecast[i].wind.speed + " mph");
      let iconSrc = "http://openweathermap.org/img/wn/" + fiveForecast[i].weather[0].icon + "@2x.png";
      $('#icon' + j).attr('src', iconSrc);
      j++;
    }
  }
}

$(document).ready(function () {
    $('#searchBtn').on('click', searchCity);
    $('#history').on('click', '.direct', function () {
      sendCity($(this).val());
    });
  });