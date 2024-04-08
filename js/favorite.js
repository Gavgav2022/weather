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
let btnFavorit;
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
const informWindow = document.querySelector('.weather__input-info');

let nameCity;
let lon;
let lat;
let hourly = [];
let weekly = [];
let labels = [];
let hour = [];

let urlWeather;
let period = 1;
let count = 0;
let objLocation = {};
const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


let num1;
let num2;
let card;
let card1;

let navigationArray = [];
let locStor = JSON.parse(localStorage.getItem('cards'));
if (locStor) {
    navigationArray = locStor;
    startBuilder();
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