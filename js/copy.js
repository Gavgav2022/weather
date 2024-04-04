let weatherParam = document.querySelectorAll('.weather__card-det');
let cards = document.querySelector('.weather__cards');
let cardsArray = document.querySelectorAll('.weather__card');
let cardHTML = `<li class="weather__card active-card">
<h3 class="weather__card-name"></h3>
<ul class="weather__card-list">
    <li class="weather__card-item"><span
            class="weather__card-subtitle">Temperature:</span> <span
            class="weather__card-det"></span></li>
    <li class="weather__card-item"><span class="weather__card-subtitle">Feels
            like:</span> <span class="weather__card-det"></span></li>
    <li class="weather__card-item"><span class="weather__card-subtitle">Humidity:</span>
        <span class="weather__card-det"></span></li>
    <li class="weather__card-item"><span class="weather__card-subtitle">Pressure:</span>
        <span class="weather__card-det"></span></li>
    <li class="weather__card-item"><span class="weather__ardt-subtitle">Wind
            speed:</span> <span class="weather__card-det"></span></li>
    <li class="weather__card-item"><span
            class="weather__card-subtitle">Description:</span> <span
            class="weather__card-det"></span></li>
</ul>
<div class="weather__grafic-wrapper">
    <canvas class="weather__grafic" id="myChart"></canvas>
</div>
</li>`;
const suggestions = document.getElementById('suggestions');
const cityInput = document.querySelector('.weather__city-input');

let burger = document.querySelector('.burger');
let header = document.querySelector('.header');
let menu = document.querySelector('.menu__list');
let body = document.querySelector('body');
let daysCheckbox = document.querySelectorAll('.weather__checkbox');
let ctx = document.getElementById('myChart');
let grafic = document.querySelector('.weather__grafic');
let weatherMain = document.querySelector('.weather__cards');
let btnAdd = document.querySelector('.weather__add-btn');
let btnCards = document.querySelectorAll('.weather__item-swither');
let btnSwitch = document.querySelectorAll('.weather__switch-button');
let nameCity = '';
let hourly = [];
let week = [];
let labels = [];
let hour = [];
let navigationArray = [];
let lat = 100;
let lon = 100;
let urlWeather;
let period = 1;
let count = 0;
let objLocation = {};
const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const formWeather = document.forms.weatherForm;

burger.addEventListener('click', (e) => {
    burger.classList.toggle('active');
    header.classList.toggle('active');
    menu.classList.toggle('active');
    body.classList.toggle('lock');
});

btnAdd.addEventListener('click', (e) => {

    btnCards = document.querySelectorAll('.weather__item-swither');
    if (btnCards.length === 4) {
        e.target.classList.add('unvisible');
    }
    btnCards[btnCards.length - 1].insertAdjacentHTML('afterend', `<li class="weather__item-swither"><button class="weather__switch-button">${btnCards.length + 1}</button></li>`);
    count = btnSwitch.length;
    btnSwitch = document.querySelectorAll('.weather__switch-button');
    for (let i = 0; i < btnSwitch.length; i++) {
        btnSwitch[i].classList.remove('btn-active');
    }
    btnSwitch[btnSwitch.length - 1].classList.add('btn-active');
    insertCard();
})

for (let i = 0; i < 2; i++) {
    daysCheckbox[i].addEventListener('click', (e) => {
        period = +e.target.value;
        if (lat !== 100) {
            scaleConstructor();
            weatherClear();
        }
    })
};

function insertCard() {
    cardsArray = document.querySelectorAll('.weather__card');
    for (let i = 0; i < cardsArray.length; i++) {
        cardsArray[i].classList.add('unvisible');
    };
    cards.insertAdjacentHTML('beforeend', `${cardHTML}`);
}

async function getWeather(latit, longi) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latit}&lon=${longi}&lang=ua&units=metric&appid=0945ae1477922f36b0dd171422352f14`);
        let result = await response.json();
        console.log(result);
        week = result.daily;
        hourly = result.hourly;
        weatherToday = result.current;
        return result, hourly;
    } catch (error) {
        console.error(error);
    }
};

async function craeteCards() {
    let city = document.querySelector('.weather__card-name');
    city.textContent = `Weather now in: ${navigationArray[count].name}`;
    await getWeather(navigationArray[count].lat, navigationArray[count].lon);
    weatherParam[0].textContent = `${weatherToday.temp} °C`;
    weatherParam[1].textContent = `${weatherToday.feels_like} °C`;
    weatherParam[2].textContent = `${weatherToday.humidity} %`;
    weatherParam[3].textContent = `${weatherToday.pressure} mm.`;
    weatherParam[4].textContent = `${weatherToday.wind_speed} m/s.`;
    weatherParam[5].textContent = weatherToday.weather[0].main;
    scaleConstructor();
    weatherClear();
}

function scaleConstructor() {
    labels = [];
    hour = [];
    if (period === 1) {
        let data = new Date().getHours();

        for (let i = 0; i <= 23; i++) {
            hour.push(Math.round(hourly[i].temp));
        }
        let start = data;
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
        let data = new Date().getDay();
        for (let i = 1; i <= 5; i++) {
            let dayNow = dayOfWeek[data];
            hour.push(Math.round(week[i].temp.eve));
            labels.push(`${dayNow}`);
            if (data === 6) {
                data = 0;
            } else {
                data++;
            }
        }
    }
};

function createChart(lab) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lab,
            datasets: [{
                label: `${navigationArray[count].name}`,
                data: hour,
                borderWidth: 2
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
};

function weatherClear() {
    let graficCard = document.querySelector('.active-card');
    grafic = graficCard.querySelector('.weather__grafic-container').innerHTML = `<canvas class="grafic" id="myChart"></canvas>`;
    chart = graficCard.querySelector('.grafic');
    createChart(labels);
};

function createChart(lab) {
    new Chart(chart, {
        type: 'bar',
        data: {
            labels: lab,
            datasets: [{
                label: `${navigationArray[count].name}`,
                data: hour,
                borderWidth: 2
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


cityInput.addEventListener('input', function () {
    let inputValue = cityInput.value;

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
                for (let i = 0; i < location.length; i++) {
                    location[i].addEventListener('click', (e) => {
                        lat = +e.target.getAttribute('lat');
                        lon = +e.target.getAttribute('lon');
                        cards.classList.remove('unvisible');
                        cards.classList.add('active-card');
                        nameCity = e.target.textContent;
                        suggestions.innerHTML = '';
                        addToNavigation(count, nameCity, lat, lon);
                        craeteCards();
                    });
                }
            })
            .catch(error => console.error('Ошибка:', error));
    }
});

function addToNavigation(num, name, latitude, longitude) {
    let objLocation = {
        'lat': latitude,
        'lon': longitude,
        'name': name

    }
    navigationArray[num] = objLocation;
};