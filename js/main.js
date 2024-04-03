let burger = document.querySelector('.burger');
let header = document.querySelector('.header');
let menu = document.querySelector('.menu__list');
let body = document.querySelector('body');
let daysCheckbox = document.querySelectorAll('.weather__checkbox');
let ctx = document.getElementById('myChart');
let grafic = document.querySelector('.weather__grafic');
let weatherMain = document.querySelector('.weather__main');
let weatherParam = document.querySelectorAll('.weather__content-det');
let nameCity = '';
let hourly = [];
let week = [];
let labels = [];
let hour = [];
let lat = 100;
let lon = 100;
let urlWeather;
let period = 1;

const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const formWeather = document.forms.weatherForm;

burger.addEventListener('click', (e) => {
    burger.classList.toggle('active');
    header.classList.toggle('active');
    menu.classList.toggle('active');
    body.classList.toggle('lock');
})

function weatherClear() {
    grafic.innerHTML = `<canvas id="myChart"></canvas>`;
    ctx = document.getElementById('myChart');
    console.log(ctx);
}


for (let i = 0; i < 2; i++) {
    daysCheckbox[i].addEventListener('click', (e) => {
        period = +e.target.value;
        if (lat !== 100) {
            craeteCards();
        }
    })
}

async function getWeather() {
    try {
        const response = await fetch(urlWeather);
        let result = await response.json();
        week = result.daily;
        hourly = result.hourly;
        weatherToday = result.current;
        return result, hourly;
    } catch (error) {
        console.error(error);
    }
}



async function craeteCards() {
    await getWeather();
    if (period === 1) {
        labels = [];
        hour = [];
        let data = new Date().getHours();
        weatherParam[0].textContent =  `${weatherToday.temp} °C`;
        weatherParam[1].textContent =  `${weatherToday.feels_like} °C`;
        weatherParam[2].textContent =  `${weatherToday.humidity} %`;
        weatherParam[3].textContent =  `${weatherToday.pressure} mm.`;
        weatherParam[4].textContent =  `${weatherToday.wind_speed} m/s.`;
        weatherParam[5].textContent =  weatherToday.weather[0].main;
    
        for (let i = 0; i <= 23; i++) {
            hour.push(Math.round(hourly[i].temp));
        }
        start = data;
        for (i = 1; i <= 24; i++) {
            data++;
            if (data === start) {
                labels.push(`${data}:00`);
                break;
            } else if (data < 24) {
                labels.push(`${data}:00`);
            } else {
                data = 0;
                labels.push(`${data}:00`);
            }
        }
    } else if (period === 5) {
        labels = [];
        hour = [];
        let data = new Date().getDay();
        for (let i = 1; i <= 5; i++) {
            let dayNow = dayOfWeek[data];
            console.log(data);
            hour.push(Math.round(week[i].temp.eve));
            labels.push(`${dayNow}`);
            if (data === 6) {
                data = 0;
            } else {
                data++;
            }
        }
    }
    weatherClear();
    createChart(labels);
}

function createChart(lab) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: lab,
            datasets: [{
                label: `${nameCity}`,
                data: hour,
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


const cityInput = document.getElementById('cityInput');
const suggestions = document.getElementById('suggestions');

cityInput.addEventListener('input', function () {
    const inputValue = this.value;

    // Очистка предыдущих результатов
    suggestions.innerHTML = '';

    if (inputValue.length > 2) {
        // Запрос к API Nominatim для получения городов
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(city => {
                    const li = document.createElement('li');
                    li.classList.add('weather__city');
                    li.setAttribute('lat', city.lat);
                    li.setAttribute('lon', city.lon);
                    li.textContent = `${city.display_name}`;
                    suggestions.appendChild(li);
                });
                let location = document.querySelectorAll('.weather__city');
                for (elem of location) {
                    elem.addEventListener('click', (e) => {
                        lat = +e.target.getAttribute('lat');
                        lon = +e.target.getAttribute('lon');
                        weatherMain.classList.remove('unvisible');
                        nameCity = e.target.textContent;
                        let city = document.querySelector('.weather__city-name');
                        city.textContent = `Weather now in: ${nameCity}`
                        urlWeather = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&lang=ua&units=metric&appid=0945ae1477922f36b0dd171422352f14`;
                        craeteCards();
                        suggestions.innerHTML = '';
                    });
                }

            })
            .catch(error => console.error('Ошибка:', error));
    }
});

