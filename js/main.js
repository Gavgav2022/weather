let burger = document.querySelector('.burger');
let header = document.querySelector('.header');
let menu = document.querySelector('.menu__list');
let body = document.querySelector('body');
const removeBtn = document.querySelector('.weather__card-remove');
let grafic;
let graph;
let activeCard;
let weatherToday = [];
let arrayFavorit = [];
let weatherParam = document.querySelectorAll('.weather__card-det');
const btnAddCard = document.querySelector('.weather__add-btn');
const switcherList = document.querySelector('.weather__list-switch');
let cards = document.querySelector('.weather__cards');
let cardsArray = document.querySelectorAll('.weather__card');
const suggestions = document.getElementById('suggestions');
const cityInput = document.querySelector('.weather__city-input');
const navigationBar = document.querySelector('.weather__main-navigation ');
const infoText = document.querySelector('.weather__info');
let switchBtn = `<li class="weather__item-swither"><button
class="weather__switch-button btn-active"></button>
</li>`;
let inputElement = document.querySelector('.weather__city-input');
let formWeather = document.forms.weatherForm;
let locStor = JSON.parse(localStorage.getItem('cards'));
const informWindow = document.querySelector('.weather__input-info');

let nameCity;
let lon;
let lat;
let hourly = [];
let weekly = [];
let labels = [];
let hour = [];
let navigationArray = [];

let urlWeather;
let period = 1;
let count = 0;
let objLocation = {};
const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


let num1;
let num2;
let card;
let card1;

burger.addEventListener('click', (e) => {
    burger.classList.toggle('active');
    header.classList.toggle('active');
    menu.classList.toggle('active');
    body.classList.toggle('lock');
});



function createNewCard(counter) {

    num1 = Math.floor((Math.random()) * 1000);
    num2 = Math.floor((Math.random()) * 1000);
    card1 = `<div class="weather__card-info">
    <h3 class="weather__card-name">${navigationArray[counter].nameCity}</h3>
    <ul class="weather__card-list">
        <li class="weather__card-item"><span
                class="weather__card-subtitle">Temperature: ${Math.round(navigationArray[counter].weatherToday.temp)}°C</span> <span
                class="weather__card-det"></span></li>
        <li class="weather__card-item"><span class="weather__card-subtitle">Feels
                like: ${Math.round(navigationArray[counter].weatherToday.feels_like)}°C</span> <span class="weather__card-det"></span></li>
        <li class="weather__card-item"><span
                class="weather__card-subtitle">Humidity: ${navigationArray[counter].weatherToday.humidity}%</span>
            <span class="weather__card-det"></span>
        </li>
        <li class="weather__card-item"><span
                class="weather__card-subtitle">Pressure: ${navigationArray[counter].weatherToday.pressure}mm.</span>
            <span class="weather__card-det"></span>
        </li>
        <li class="weather__card-item"><span class="weather__ardt-subtitle">Wind
                speed: ${navigationArray[counter].weatherToday.wind_speed}m/s.</span> <span class="weather__card-det"></span></li>
        <li class="weather__card-item"><span
                class="weather__card-subtitle">Description: ${navigationArray[counter].weatherToday.weather[0].main}</span> <span
                class="weather__card-det"></span></li>
    </ul>
</div>
<div class="weather__grafics-wrapper">
    <div class="weather__grafic-container">
        <canvas class="weather__grafic" id="myChart"></canvas>
    </div>
    <div class="weather__grafic-container hide">
        <canvas class="weather__grafic-5" id="myChart1"></canvas>
    </div>
    <div class="weather__period">
    <button class="weather__period-btn btn-active" value="1">
    1 day
</button>

<button class="weather__period-btn" value="5">
    5 day
</button>
<button class="weather__btn-favorit" type="button">Favorit</button>
    </div>
</div>`
    card = `<li class="weather__card card-active">
    <div class="weather__card-info">
    <h3 class="weather__card-name">${navigationArray[counter].nameCity}</h3>
    <ul class="weather__card-list">
        <li class="weather__card-item"><span
                class="weather__card-subtitle">Temperature: ${Math.round(navigationArray[counter].weatherToday.temp)}°C</span> <span
                class="weather__card-det"></span></li>
        <li class="weather__card-item"><span class="weather__card-subtitle">Feels
                like: ${Math.round(navigationArray[counter].weatherToday.feels_like)}°C</span> <span class="weather__card-det"></span></li>
        <li class="weather__card-item"><span
                class="weather__card-subtitle">Humidity: ${navigationArray[counter].weatherToday.humidity}%</span>
            <span class="weather__card-det"></span>
        </li>
        <li class="weather__card-item"><span
                class="weather__card-subtitle">Pressure: ${navigationArray[counter].weatherToday.pressure}mm.</span>
            <span class="weather__card-det"></span>
        </li>
        <li class="weather__card-item"><span class="weather__ardt-subtitle">Wind
                speed: ${navigationArray[counter].weatherToday.wind_speed}m/s.</span> <span class="weather__card-det"></span></li>
        <li class="weather__card-item"><span
                class="weather__card-subtitle">Description: ${navigationArray[counter].weatherToday.weather[0].main}</span> <span
                class="weather__card-det"></span></li>
    </ul>
</div>
<div class="weather__grafics-wrapper">
    <div class="weather__grafic-container">
        <canvas class="weather__grafic" id="myChart"></canvas>
    </div>
    <div class="weather__grafic-container hide">
        <canvas class="weather__grafic-5" id="myChart1"></canvas>
    </div>
    <div class="weather__period">
    <button class="weather__period-btn btn-active" value="1">
    1 day
</button>

<button class="weather__period-btn" value="5">
    5 day
</button>
<button class="weather__btn-favorit" type="button">Favorit</button>
    </div>
</div>
    </li>`;
};

function favoritMover() {
    activeCard = document.querySelector('.card-active');
    let btnFavorit = activeCard.querySelector('.weather__btn-favorit');
    btnFavorit.addEventListener('click', (e) => {
        e.target.classList.toggle('active-favorite');
        let parentCard = btnFavorit.closest('.weather__card');
        parentCard.classList.toggle('favorit');
        cardsArray = document.querySelectorAll('.weather__card');
        arrayFavorit = [];
        let number = 0;
        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i].classList.contains('favorit')) {
                arrayFavorit[number] = navigationArray[i];
                number++;
                console.log(arrayFavorit);
            }
        }
    })
};
formWeather.addEventListener('submit', (e) => {
    e.preventDefault();
});

function periodSwither() {
    activeCard = document.querySelector('.card-active');
    let periodBtns = activeCard.querySelectorAll('.weather__period-btn');
    let grafic = activeCard.querySelectorAll('.weather__grafic-container');
    for (let i = 0; i < periodBtns.length; i++) {
        periodBtns[i].addEventListener('click', (e) => {
            grafic[0].classList.add('hide');
            grafic[1].classList.add('hide');
            periodBtns[0].classList.remove('btn-active');
            periodBtns[1].classList.remove('btn-active');
            periodBtns[i].classList.add('btn-active');
            grafic[i].classList.remove('hide');
        })
    }

};

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
            hour.push(Math.round(navigationArray[count].weekly[i].temp.eve));
            labels.push(`${dayNow}`);
            if (data === 6) {
                data = 0;
            } else {
                data++;
            }
        }
    }
};

function createChart(grafic, lab) {
    new Chart(grafic, {
        type: 'bar',
        data: {
            labels: lab,
            datasets: [{
                label: `${nameCity}`,
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

function createGraph() {
    activeCard = document.querySelector('.card-active');
    let grafic = activeCard.querySelector('.weather__grafic');
    scaleConstructor();
    createChart(grafic, labels);
    grafic = activeCard.querySelector('.weather__grafic-5');
    period = 5;
    scaleConstructor();
    createChart(grafic, labels);
    period = 1;
}

function insertCard() {
    cards = document.querySelector('.weather__cards');
    cards.insertAdjacentHTML('beforeend', `${card}`);
}


async function getWeather(latit, longi) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latit}&lon=${longi}&lang=ua&units=metric&appid=0945ae1477922f36b0dd171422352f14`);
        let result = await response.json();
        weekly = result.daily;
        hourly = result.hourly;
        weatherToday = result.current;
        addToNavigation(count);
        return result;
    } catch (error) {
        console.error(error);
    }
};

async function getWeatherLoc(latit, longi) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latit}&lon=${longi}&lang=ua&units=metric&appid=0945ae1477922f36b0dd171422352f14`);
        let result = await response.json();
        weekly = result.daily;
        hourly = result.hourly;
        weatherToday = result.current;
        return result;
    } catch (error) {
        console.error(error);
    }
};

cityInput.addEventListener('input', function () {
    inputReader();
});

async function cardsEditor() {
    cardsArray = document.querySelectorAll('.weather__card');
    addToNavigation(count);
    await getWeather(navigationArray[count].lat, navigationArray[count].lon)
    createNewCard(count);
    cardsArray[count].innerHTML = `${card1}`;
    showHideNavigation()
    createGraph();
    periodSwither();
    switchBtnNumeration();
    btnSwitchAction();
    addToLocalStorege();
};

async function group() {
    addToNavigation(count);
    await getWeather(navigationArray[count].lat, navigationArray[count].lon)
    createNewCard(count);
    insertCard();
    favoritMover();
    showHideNavigation()
    createGraph();
    periodSwither();
    switchBtnNumeration();
    btnSwitchAction();
    addToLocalStorege();
};

function addToNavigation(num) {
    navigationArray[num] = {
        'lat': lat,
        'lon': lon,
        'nameCity': nameCity,
        'weekly': weekly,
        'hourly': hourly,
        'weatherToday': weatherToday
    };
};

function showHideNavigation() {
    cardsArray = document.querySelectorAll('.weather__card');
    if (cardsArray[0]) {
        navigationBar.classList.remove('hide');
    } else {
        navigationBar.classList.add('hide');
    }
};

function cardRemover() {
    cardsArray = document.querySelectorAll('.weather__card');
    for (let i = 0; i < cardsArray.length; i++) {
        if (cardsArray[i].classList.contains('card-active')) {
            cardsArray[i].remove();
            navigationArray.splice(i, 1);
            console.log(navigationArray, 'rem');
            addToLocalStorege();
        }
    };
    cardsArray = document.querySelectorAll('.weather__card');
    cardsArray[cardsArray.length - 1].classList.add('card-active');
    cardsArray[cardsArray.length - 1].classList.remove('hide');
    switchBtnNumeration();
    btnSwitchAction();
};

removeBtn.addEventListener('click', (e) => {
    cardsArray = document.querySelectorAll('.weather__card');
    if (cardsArray.length <= 1) {
        alert('You can not remove last card!')
    } else if (confirm('Are you sure?')) {
        cardRemover();
    }
});

function addToLocalStorege() {
    localStorage.setItem('cards', JSON.stringify(navigationArray));
    console.log(navigationArray);
};

if (locStor) {
    navigationArray = locStor;
    startBuilder();
    infoText.classList.add('hide')
};

async function startBuilder() {
    for (let i = 0; i < navigationArray.length; i++) {
        count = i;
        nameCity = navigationArray[i].nameCity;
        await buildFromLocalStor();
    }
    cardsArray = document.querySelectorAll('.weather__card');
    cardsArray[cardsArray.length - 1].classList.add('card-active');
    cardsArray[cardsArray.length - 1].classList.remove('hide');
};


async function buildFromLocalStor() {
    console.log(navigationArray);
    await getWeatherLoc(navigationArray[count].lat, navigationArray[count].lon)
    createNewCard(count);
    insertCard();
    favoritMover();
    showHideNavigation()
    createGraph();
    periodSwither();
    switchBtnNumeration();
    btnSwitchAction();
    activeCard = document.querySelector('.card-active');
    activeCard.classList.remove('card-active');
    activeCard.classList.add('hide');
    console.log(count);
};


btnAddCard.addEventListener('click', (e) => {
    cardsArray = document.querySelectorAll('.weather__card');
    if (cardsArray.length >= 5) {
        alert('5 cards max, remove one card!')
    } else {
        activeCard = document.querySelector('.card-active');
        activeCard.classList.remove('card-active');
        activeCard.classList.add('hide');
        count = cardsArray.length;
        cards.classList.add('hide');
        infoText.classList.remove('hide');
        navigationBar.classList.add('hide');
        e.target.classList.add('hide');
    }

});

function switchBtnNumeration() {
    cardsArray = document.querySelectorAll('.weather__card');
    switcherList.innerHTML = ``;
    for (let i = 0; i < cardsArray.length; i++) {
        switcherList.insertAdjacentHTML('beforeend', `<li class="weather__item-swither"><button
        class="weather__switch-button">${i+1}</button>
        </li>`);
    }
};

function btnSwitchAction() {
    let btnSwitchArray = document.querySelectorAll('.weather__switch-button');
    cardsArray = document.querySelectorAll('.weather__card');
    btnSwitchArray[btnSwitchArray.length - 1].classList.add('btn-active');
    for (let i = 0; i < btnSwitchArray.length; i++) {
        btnSwitchArray[i].addEventListener('click', (e) => {
            for (let j = 0; j < btnSwitchArray.length; j++) {
                cardsArray[j].classList.add('hide');
                cardsArray[j].classList.remove('card-active');
                btnSwitchArray[j].classList.remove('btn-active');
            }
            cardsArray[i].classList.add('card-active');
            cardsArray[i].classList.remove('hide');
            e.target.classList.add('btn-active');
            count = i;
        })
    }
};

inputElement.addEventListener('keydown', function (event) {
    // Проверяем, была ли нажата клавиша Enter (код клавиши 13)
    if (event.code === 'Enter') {
        let inputValue = cityInput.value;

        // Очистка предыдущих результатов
        suggestions.innerHTML = '';

        if (inputValue.length > 2) {
            cityInput.style.backgroundColor = 'transparent';
            informWindow.textContent = '';
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
                    let velue = location[0];
                    lat = +velue.getAttribute('lat');
                    lon = +velue.getAttribute('lon');
                    nameCity = velue.textContent;
                    suggestions.innerHTML = '';
                    cardsArray = document.querySelectorAll('.weather__card');
                    cards.classList.remove('hide');
                    infoText.classList.add('hide');
                    if (cardsArray[count]) {
                        cardsEditor();
                    } else {
                        group();
                    };
                    cardsArray = document.querySelectorAll('.weather__card');
                    if (cardsArray.length === count) {
                        btnAddCard.classList.remove('hide');
                    }
                })
                .catch(error => console.error('Ошибка:', error));
        } else {
            cityInput.style.backgroundColor = 'red';
            informWindow.textContent = 'More then 2 symbols!'
        }
    }
});

function inputReader() {
    let inputValue = cityInput.value;

    // Очистка предыдущих результатов
    suggestions.innerHTML = '';

    if (inputValue.length > 2) {
        cityInput.style.backgroundColor = 'transparent';
        informWindow.textContent = '';
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
                        nameCity = e.target.textContent;
                        suggestions.innerHTML = '';
                        cardsArray = document.querySelectorAll('.weather__card');
                        cards.classList.remove('hide');
                        infoText.classList.add('hide');
                        if (cardsArray[count]) {
                            cardsEditor();
                        } else {
                            group();
                        };
                        cardsArray = document.querySelectorAll('.weather__card');
                        if (cardsArray.length === count) {
                            btnAddCard.classList.remove('hide');
                        }
                    });
                }
            })
            .catch(error => console.error('Ошибка:', error));
    } else {
        cityInput.style.backgroundColor = 'red';
        informWindow.textContent = 'More then 2 symbols!'
    };
};

