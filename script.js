const $ = document.querySelector.bind(document);

const heroBanner = $("#hero_wrapper");
const hero_wrapper = $("#hero");
const weatherForecast = $("#weatherForecast");

const r = $(":root");

const search_input = $("#search_input");
const search_btn = $(".search_button");
const alertTag = $("#alert");

const current_location = $("#current_location");
const current_country = $("#current_country");

const current_temperature = $("#current_temperature");
const current_conditionTxt = $("#current_condition-Txt");
const current_conditionImg = $("#currrent_condition-Img");
const current_update_time = $("#current_update-time");

const others_temperature = $("#others_temperature");
const others_conditionTxt = $("#others_condition-Txt");
const others_conditionImg = $("#cothers_condition-Img");
const others_update_time = $("#others_update-time");

const UV_index = $("#UV_index");
const realFeel = $("#realFeel");
const humidity = $("#humidity");
const cloud_cover = $("#cloud_cover");
const wind_vecolity = $("#wind_vecolity");
const visibility = $("#visibility");

let swiper;
const myswiper_wrapper = $(".swiper-wrapper");

const canvas = $("#myChart");
const ctx = canvas.getContext("2d");
let chartType = "line";
let myLineChart;

const myChartLabels = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const fetchData = (location) => {
  fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=376f52432ffa42df82331053230802&q=${location}&days=10&aqi=yes&alerts=no`
  )
    .then((data) => data.json())
    .then((res) => {
      successHandler(res);
    })
    .catch((err) => {
      errHandler();
    });
};

fetchData("Vietnam");

function searchHandler() {
  const location = search_input.value;

  myLineChart.destroy();

  fetchData(location);
}

function init_Chart(chartData) {
  myLineChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: myChartLabels,
      datasets: [
        {
          label: "°C",
          data: chartData,
          borderWidth: 1,
          borderColor: "#F3C246",
          backgroundColor: "#F3C246",
          color: "#F3C246",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        devicePixelRatio: 1,
      },
    },
  });
}

function init_Swiper() {
  swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function currentWeather_information(res) {
  current_location.innerText = `${res.location.name}`;
  current_country.innerText = `${res.location.country}`;

  current_temperature.innerHTML = `<h1>${res.current.temp_c}°C</h1>`;
  current_conditionTxt.innerText = `${res.current.condition.text}`;
  current_conditionImg.src = `${res.current.condition.icon}`;
  current_update_time.innerText = `${res.current.last_updated}`;

  UV_index.innerText = `UV index: ${res.current.uv} ${UV_index_danger(
    res.current.uv
  )}`;
  realFeel.innerText = `RealFeel: ${res.current.feelslike_c}°C`;
  humidity.innerText = `Humidity: ${res.current.humidity}%`;
  cloud_cover.innerText = `Cloud cover: ${res.current.cloud}%`;
  wind_vecolity.innerText = `Wind: ${res.current.wind_kph} km/h`;
  visibility.innerText = `Visibility: ${res.current.vis_km} km`;
}

function othersWeather_information(res) {
  init_Swiper();
  res.forecast.forecastday.map((day, index) => {
    if (index !== 0) {
      myswiper_wrapper.innerHTML += `
      <div class="swiper-slide">
        <div class="card">
          <div class="content">
            <div class="front">
              <h5 id="others_update-time">${day.date}<h5>
              <img class="others_condition-Img" src="${
                day.day.condition.icon
              }"/>
              <h5 class="others_temperature">${day.day.mintemp_c}°C - ${
        day.day.maxtemp_c
      }°C</h5>        
              <h5 class="others_condition-Txt">${day.day.condition.text}</h5>   
            </div>
            <div class="back">
              <div class="others_information">
                <div id="avgTemp">Avg Temperature: ${day.day.avgtemp_c}°C</div>
                <div id="humidity">Avg Humidity: ${day.day.avghumidity}%</div>
                <div id="UV_index">UV index: ${day.day.uv} ${UV_index_danger(
        day.day.uv
      )}</div>
                <div id="wind">Wind: ${day.day.maxwind_kph} km/h</div>
                <div id="Chance of snow">Chance of Snow: ${
                  day.day.daily_chance_of_snow
                }%</div>
                <div id="Chance of rain">Chance of Rain: ${
                  day.day.daily_chance_of_rain
                }%</div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div> 
      </div>`;
    }
  });
}

function UV_index_danger(UV_index) {
  let result = Number(UV_index);

  if (result >= 0 && result <= 2.9) {
    return "Low";
  }
  if (result >= 3.0 && result <= 5.9) {
    return "Medium";
  }
  if (result >= 6.0 && result <= 7.9) {
    return "High";
  }
  if (result >= 8.0 && result <= 10.9) {
    return "Very High";
  }
  if (result >= 11.0) {
    return "Extremely High";
  }
}

function successHandler(res) {
  console.log(res);

  changeDayNight(res.current.is_day);

  myswiper_wrapper.innerHTML = "";

  // heroBanner.setAttribute("style", "width: 60%");
  heroBanner.classList.remove("error");
  heroBanner.classList.add("success");

  hero_wrapper.classList.remove("col-12");
  hero_wrapper.classList.add("col-7");

  weatherForecast.classList.add("visible");
  weatherForecast.classList.remove("hidden");

  alertTag.classList.remove("visible");
  alertTag.classList.add("hidden");

  currentWeather_information(res);
  othersWeather_information(res);

  const chartData = res.forecast.forecastday[0].hour.map((hour) => {
    return hour.temp_c;
  });

  init_Chart(chartData);
}
function errHandler() {
  heroBanner.classList.remove("success");
  heroBanner.classList.add("error");

  hero_wrapper.classList.remove("col-7");
  hero_wrapper.classList.add("col-12");

  weatherForecast.classList.remove("visible");
  weatherForecast.classList.add("hidden");

  alertTag.classList.remove("hidden");
  alertTag.classList.add("visible");
}

function changeDayNight(res) {
  if (res === 0) {
    r.style.setProperty("--bg-color-2", "#212529");
    r.style.setProperty("--sd-color-1", "rgba(255, 255, 255, 0.1)");
    r.style.setProperty("--tx-color-2", "#0059b3");
    r.style.setProperty("--tx-color-3", "#ecf9ff");
    r.style.setProperty("--bg-color-1", "#ecf9ff");
  } else {
    r.style.setProperty("--bg-color-2", "#fff");
    r.style.setProperty("--sd-color-1", "rgba(0, 0, 0, 0.1)");
    r.style.setProperty("--tx-color-2", "#ecf9ff");
    r.style.setProperty("--tx-color-3", "#0059b3");
    r.style.setProperty("--bg-color-1", "#0059b3");
  }
}

// setInterval(fetchData, 5000);
