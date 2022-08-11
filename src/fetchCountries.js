const BASIC_URL = `https://restcountries.com/v3.1/name`;
const FILTER_RESPONSE = `fields=name,capital,population,flags,languages`;

//Экспорт стран выборки
//Создадим выборку только в том случае, если имя не является пустой строкой

export default function fetchCountries(name) {
  if (name) {
    return fetch(`${BASIC_URL}/${name}?${FILTER_RESPONSE}`).then(
      onSuccessFetch
    );
  }
}

//fetch выдаст ошибку, если 404
//иначе fetch будет анализировать ответ
function onSuccessFetch(response) {
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
}
