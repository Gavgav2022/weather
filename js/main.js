let burger = document.querySelector('.burger');
let header = document.querySelector('.header');
let menu = document.querySelector('.menu__list');
let body = document.querySelector('body');
const navigationBar = document.querySelector('.weather__main-navigation');
const removeBtn = document.querySelector('.weather__card-remove');

let grafic;
let graph;
let activeCard;
let weatherToday = [];
let weatherParam = document.querySelectorAll('.weather__card-det');
const btnAddCard = document.querySelector('.weather__add-btn');
const switcherList = document.querySelector('.weather__list-switch');

let cards = document.querySelector('.weather__cards');
let cardsArray = document.querySelectorAll('.weather__card');

const suggestions = document.getElementById('suggestions');
const cityInput = document.querySelector('.weather__city-input');

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

burger.addEventListener('click', (e) => {
    burger.classList.toggle('active');
    header.classList.toggle('active');
    menu.classList.toggle('active');
    body.classList.toggle('lock');
});


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
                        cards.classList.remove('hide');
                        nameCity = e.target.textContent;
                        suggestions.innerHTML = '';
                        createCard();
                        navigationBar.classList.remove('hide');
                    });
                }
            })
            .catch(error => console.error('Ошибка:', error));
    }
});

async function getWeather(latit, longi) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latit}&lon=${longi}&lang=ua&units=metric&appid=0945ae1477922f36b0dd171422352f14`);
        let result = await response.json();
        week = result.daily;
        hourly = result.hourly;
        weatherToday = result.current;
        return result, hourly;
    } catch (error) {
        console.error(error);
    }
};


async function createCard() {
    cardArr = document.querySelectorAll('.weather__card');
    if (cardArr.length < 1) {
        newCardCreator();
    }
    activeCard = document.querySelector('.active-card');
    activeCard.classList.add('done');
    let weatherParam = activeCard.querySelectorAll('.weather__card-det');
    let cardTitle = activeCard.querySelector('.weather__card-name');
    graph = activeCard.querySelector('.weather__grafic');

    await getWeather(lat, lon);
    addToDataArray();
    weatherParam[0].textContent = `${navigationArray[count].weatherToday.temp} °C`;
    weatherParam[1].textContent = `${navigationArray[count].weatherToday.feels_like} °C`;
    weatherParam[2].textContent = `${navigationArray[count].weatherToday.humidity} %`;
    weatherParam[3].textContent = `${navigationArray[count].weatherToday.pressure} mm.`;
    weatherParam[4].textContent = `${navigationArray[count].weatherToday.wind_speed} m/s.`;
    weatherParam[5].textContent = navigationArray[count].weatherToday.weather[0].main;
    cardTitle.textContent = `Weather now in: ${navigationArray[count].nameCity}`;
    scaleConstructor();
    weatherClear();
    activeCard = document.querySelector('.active-card');
    graph = activeCard.querySelector('.weather__grafic');
    createChart(graph, labels);
    changePeriod();
};

function changePeriod() {
    activeCard = document.querySelector('.active-card');
    graph = activeCard.querySelector('.weather__grafic');
    let daysCheckbox = activeCard.querySelectorAll('.weather__checkbox');
    for (let i = 0; i < 2; i++) {
        daysCheckbox[i].addEventListener('click', (e) => {
            period = +e.target.value;
            if (lat !== 100) {
                weatherClear();
                activeCard = document.querySelector('.active-card');
                console.log(labels, hour);
                graph = activeCard.querySelector('.weather__grafic');
                scaleConstructor();
                createChart(graph, labels);
            }
        })
    }
};

cardSwither();

function weatherClear() {
    let graficCard = document.querySelector('.active-card');
    graficCard.querySelector('.weather__grafic-container').innerHTML = `<canvas class="weather__grafic" id="myChart"></canvas>`;
};

function createChart(grafic, lab) {
    new Chart(grafic, {
        type: 'bar',
        data: {
            labels: lab,
            datasets: [{
                label: `${navigationArray[count].nameCity}`,
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

btnAddCard.addEventListener('click', (e) => {
    cardsArray = document.querySelectorAll('.weather__card');
    console.log(cardsArray.length);
    if (cardsArray.length < 5) {
        hideCards();
        newCardCreator();
        locationFinder();
        createCard();
        addPagination();
        cardSwither();
    } else {
        e.target.classList.add('hide');
    }

    if (cardsArray.length === 5) {
        e.target.classList.add('hide');
    }
});



removeBtn.addEventListener('click', (e) => {
    let conf = confirm("Delete this card?");
    if (conf) {
        cardsArray = document.querySelectorAll('.weather__card');
        let btnsPagination = document.querySelectorAll('.weather__switch-button');
        for (let i = 0; i < btnsPagination.length; i++) {
            if (btnsPagination[i].classList.contains('btn-active')) {
                if (btnsPagination.length === 1) {
                    btnsPagination[i].closest('.weather__item-swither').remove();
                    cardsArray[i].remove();
                    navigationBar.classList.add('hide');
                } else {
                    navigationBar.classList.remove('hide');
                    btnsPagination[i - 1].classList.add('btn-active');
                    cardsArray[i - 1].classList.add('active-card');
                    cardsArray[i - 1].classList.remove('hide');
                    count = i - 1;
                    btnsPagination[i].closest('.weather__item-swither').remove();
                    cardsArray[i].remove();
                    cardsArray = document.querySelectorAll('.weather__card');
                    btnsPagination = document.querySelectorAll('.weather__switch-button');
                    for (let i = 0; i < btnsPagination.length; i++) {
                        btnsPagination[i].textContent = i + 1;
                    }
                    cardSwither();
                    break;
                }
            }
        };
    }
});

function removeActive() {
    let btnsPagination = document.querySelectorAll('.weather__switch-button');
    for (let i = 0; i < btnsPagination.length; i++) {
        btnsPagination[i].classList.remove('btn-active');
    }
};

function locationFinder() {
    cardsArray = document.querySelectorAll('.weather__card');
    for (let i = 0; i < cardsArray.length; i++) {
        if (cardsArray[i].classList.contains('active-card')) {
            count = i;
        }
    }
}

function cardSwither() {
    let btnsPagination = document.querySelectorAll('.weather__switch-button');
    btnsPagination[btnsPagination.length - 1].addEventListener('click', (e) => {
        removeActive();
        e.target.classList.add('btn-active');
        cardsArray = document.querySelectorAll('.weather__card');
        for (let i = 0; i < cardsArray.length; i++) {
            cardsArray[i].classList.remove('active-card');
            cardsArray[i].classList.add('hide');
        };
        count = btnsPagination.length - 1;
        cardsArray[btnsPagination.length - 1].classList.add('active-card');
        cardsArray[btnsPagination.length - 1].classList.remove('hide');
        changePeriod();
    })
}

function addPagination() {
    cardsArray = document.querySelectorAll('.weather__card');
    let btnsPagination = document.querySelectorAll('.weather__switch-button');
    for (btn of btnsPagination) {
        btn.classList.remove('btn-active');
    }
    switcherList.insertAdjacentHTML('beforeend', `<li class="weather__item-swither"><button
    class="weather__switch-button btn-active">${cardsArray.length}</button>
</li>`)
};

function hideCards() {
    cardsArray = document.querySelectorAll('.weather__card');
    for (let i = 0; i < cardsArray.length; i++) {
        cardsArray[i].classList.remove('active-card');
        cardsArray[i].classList.add('hide');
    };
};

function newCardCreator() {
    cards = document.querySelector('.weather__cards');
    let num1 = Math.floor(Math.random() * 1000);
    let num2 = Math.floor(Math.random() * 1000);
    cards.insertAdjacentHTML('beforeend', `<li class="weather__card active-card">
    <div class="weather__card-info">
        <h3 class="weather__card-name"></h3>
        <ul class="weather__card-list">
            <li class="weather__card-item"><span
                    class="weather__card-subtitle">Temperature:</span> <span
                    class="weather__card-det"></span></li>
            <li class="weather__card-item"><span class="weather__card-subtitle">Feels
                    like:</span> <span class="weather__card-det"></span></li>
            <li class="weather__card-item"><span
                    class="weather__card-subtitle">Humidity:</span>
                <span class="weather__card-det"></span>
            </li>
            <li class="weather__card-item"><span
                    class="weather__card-subtitle">Pressure:</span>
                <span class="weather__card-det"></span>
            </li>
            <li class="weather__card-item"><span class="weather__ardt-subtitle">Wind
                    speed:</span> <span class="weather__card-det"></span></li>
            <li class="weather__card-item"><span
                    class="weather__card-subtitle">Description:</span> <span
                    class="weather__card-det"></span></li>
        </ul>
    </div>
    <div class="weather__grafics-wrapper">
        <div class="weather__grafic-container">
            <canvas class="weather__grafic" id="myChart"></canvas>
        </div>
        <div class="weather__period">
            <label class="weather__label" for="d${num1}">1 day
                <input class="weather__checkbox" type="radio" name="field" id="d${num1}" value="1"
                    checked>
                <span class="weather__check-style"></span>
            </label>
    
            <label class="weather__label" for="${num2}">5 days
                <input class="weather__checkbox" type="radio" name="field" id="${num2}"
                    value="5">
                <span class="weather__check-style"></span>
            </label>
            <button class="weather__btn-add" type="button">Favorit</button>
        </div>
    </div>
    </li>`);
};

function addToDataArray() {
    navigationArray[count] = {
        'hourly': hourly,
        'week': week,
        'weatherToday': weatherToday,
        'nameCity': nameCity
    };
    console.log(navigationArray);
}

function scaleConstructor() {
    labels = [];
    hour = [];
    if (period === 1) {
        let data = new Date().getHours();

        for (let i = 0; i <= 23; i++) {
            hour.push(Math.round(navigationArray[count].hourly[i].temp));
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
            hour.push(Math.round(navigationArray[count].week[i].temp.eve));
            labels.push(`${dayNow}`);
            if (data === 6) {
                data = 0;
            } else {
                data++;
            }
        }
    }
};
