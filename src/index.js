import './css/styles.css';
const debounce = require('lodash.debounce');
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

//Refs
const { searchInput, renderData, countryList } = {
  searchInput: document.querySelector('#search-box'),
  renderData: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

// Вешаем слушателя для Инпутаю   Используем debounce для предотвращения болтливого события
searchInput.addEventListener(
  'input',
  debounce(e => {
    const searchText = e.target.value.trim();

    //если  текст представляет собой пустую строку, разметка будет очищена и выборка не будет выполняться
    if (!searchText) {
      return markupClear();
    }
    //Fetch for countries возвращает массив объектов в соответствии с searchText
    //В зависимости от количества возвращенных объектов будет создана соответствующая разметка
    // При ошибке будет отображаться сообщение Notify

    fetchCountries(searchText).then(createMarkup).catch(onError);
  }, DEBOUNCE_DELAY)
);

//Функция для отображения сообщения, если выполняется catch
function onError() {
  Notify.failure('Oops, there is no country with that name');
}

//Функция очистки разметки
function markupClear() {
  renderData.innerHTML = '';
}

//Функция для создания разметки в зависимости от того, сколько объектов возвращено
function createMarkup(data) {
  if (data.length > 10) {
    onDataMoreTen();
  } else if (data.length < 10 && data.length >= 2) {
    onDataLessTenMoreTwo(data);
  } else {
    onDataLessOne(data);
  }
}

//Функция для отображения сообщения Notify, если возвращено более 10 объектов
function onDataMoreTen() {
  markupClear();
  Notify.info('Too many matches found. Please enter a more specific name.');
}

//Функция создания разметки, если количество возвращаемых объектов меньше 10, но больше или равно 2
function onDataLessTenMoreTwo(data) {
  const markup = data
    .map(object => {
      return `<p style="font-size: 16px"><img src="${object.flags.svg}" alt="flag" width="50" height"50" /> ${object.name.official}</p>`;
    })
    .join('');
  renderData.innerHTML = markup;
}

//Функция для создания разметки, если количество возвращаемых объектов равно 1
//Используем data[0], потому что знаем, что ответ будет массивом только с 1 объектом внутри

function onDataLessOne(data) {
  renderData.innerHTML = `
          <p style="font-size: 36px"><img src="${
            data[0].flags.svg
          }" alt="flag" width="50" height"50" /> ${data[0].name.official}</p>
        <p><b>Capital:</b> ${data[0].capital}</p>
        <p><b>Population:</b> ${data[0].population}</p>
        <p><b>Languages:</b> ${Object.values(data[0].languages)}</p>`;
}
