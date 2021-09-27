// Не переписанный на стрелочные функции код

"use strict";

const CARDS_AMOUNT = 18;
const CARDS_IN_PAGE = 6;
const DEBOUNCE_INTERVAL = 300;

const namesArray = ['bosch-2000','bosch-3000','bosch-6000','bosch-9000','makita-td-110'];
const brandsArray = ['BOSCH','Makida','Vagner','Mega','Proline'];
const titlesArray = [
    'Перфоратор BOSCH BFG 2000',
    'Перфоратор BOSCH BFG 3000',
    'Перфоратор BOSCH BFG 6000',
    'Перфоратор BOSCH BFG 9000',
    'Шуруповёрт Makiga-td-110'
];
const flagArray = ['new','promo','none'];
const typeArray = ['electric','pneumatic'];
const FlagNameToFlagTitle = {
    new: 'Новинка',
    promo: 'Акция'
};


const cardsArray = [];

for (let i = 0; i < CARDS_AMOUNT; i++) {
    cardsArray.push(createCard());
}


function createCard () {
    let price = getRandomInteger(5000,20000);
    const card = {
        title: `${titlesArray[getRandomInteger(0,titlesArray.length - 1)]}`,
        url: `img/catalog/${namesArray[getRandomInteger(0,namesArray.length - 1)]}.jpg`,
        brand: `${brandsArray[getRandomInteger(0,brandsArray.length - 1)]}`,
        price: price,
        discount: getRandomInteger(0,1) === 1 ? Math.floor((price * 1.15) / 500) * 500 : 0,
        flag: flagArray[getRandomInteger(0,flagArray.length - 1)],
        type: typeArray[getRandomInteger(0,typeArray.length - 1)]
    };

    return card;
}

function getRandomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}


let page = 0;
let catalogList = document.querySelector('.catalog-list');
const paginationItems = document.querySelectorAll('.pagination-item a');

for (let elem of paginationItems) {
    elem.addEventListener('click', ()=> {
        event.preventDefault();
        for (let elem of paginationItems) {
            elem.parentNode.classList.remove('pagination-item-current');
        }
        elem.parentNode.classList.add('pagination-item-current');
        page = Number(elem.textContent) - 1;
        insertCards(page);
    })
}

insertCards(page);

function insertCards(page) {

    let insertableCatalogList = document.createElement('ul');

    insertableCatalogList.className = 'catalog-list';

    let startItem = page * CARDS_IN_PAGE;

    for (let i = startItem; i < startItem + CARDS_IN_PAGE ; i++) {

        const catalogItem = document.createElement('li');

        catalogItem.className = 'catalog-item';
        catalogItem.innerHTML =
        `
            ${cardsArray[i].flag ? checkPromo(cardsArray[i].flag) : ''}

            <div class="actions">
                <a class="buy" href="#">Купить</a>
                <a class="bookmark" href="#">В закладки</a>
            </div>
            <div class="image">
                <img src="${cardsArray[i].url}" width="218" height="168" alt="${cardsArray[i].title}">
            </div>
            <h3 class="item-title">${cardsArray[i].title}</h3>
            <span class="discount">${cardsArray[i].discount} Р.</span>
            <a class="button price" href="#">${cardsArray[i].price} Р.</a>
        `;

        insertableCatalogList.append(catalogItem);
    
    }

    function checkPromo(flag) {

        const flagBlock = `<div class="flag flag-${flag}">
            <span class="visually-hidden">${FlagNameToFlagTitle[flag]}</span>
        </div>`;
 
        return flagBlock;

    }

    catalogList.innerHTML = insertableCatalogList.innerHTML;

}


let sortType = 'price';
let sortDirection = 'up';

const sortingByPriceBtn = document.querySelector('.by-price');
const sortingByTypeBtn = document.querySelector('.by-type');
const sortingByFunctionalBtn = document.querySelector('.by-functional');

let sortingUpBtn = document.querySelector('.sorting-up-button');
let sortingDownBtn = document.querySelector('.sorting-down-button');

sortingByPriceBtn.addEventListener('click', (evt)=> {
    evt.preventDefault();
    debounce(sortingCards);
});

sortingByTypeBtn.addEventListener('click', (evt)=> {
    evt.preventDefault();
    debounce(sortingCards);
});

sortingByFunctionalBtn.addEventListener('click', (evt)=> {
    evt.preventDefault();
    debounce(sortingCards);
});

sortingUpBtn.addEventListener('click', (evt)=> {
    evt.preventDefault();
    sortDirection = 'up';
    debounce(sortingCards);

    sortingDownBtn.classList.remove('indicator-checked');
    sortingUpBtn.classList.add('indicator-checked');
});

sortingDownBtn.addEventListener('click', (evt)=> {
    evt.preventDefault();
    sortDirection = 'down';
    debounce(sortingCards);

    sortingUpBtn.classList.remove('indicator-checked');
    sortingDownBtn.classList.add('indicator-checked');
});


function sortingCards() {

    if (sortDirection === 'up') {
        cardsArray.sort((a, b) => a[sortType] > b[sortType] ? 1 : -1);
    } else {
        cardsArray.sort((a, b) => a[sortType] < b[sortType] ? 1 : -1);
    }
    
    insertCards(page);
    
}



//task 4

const contactsBtn = document.querySelector('.contacts-button');
const modalWrite = document.querySelector('.modal-write');
const modalCloseBtn = document.querySelector('.modal-close');

contactsBtn.addEventListener('click', onContactsBtnClick);


function onContactsBtnClick (evt) {
    evt.preventDefault();
    modalWrite.classList.add('modal-show');

    modalCloseBtn.addEventListener('click', onCloseBtnClick);
    document.addEventListener('keydown', onEscapeClick);
}

function onCloseBtnClick (evt) {
    evt.preventDefault();
    modalWrite.classList.remove('modal-show');

    modalCloseBtn.removeEventListener('click', onCloseBtnClick);
    document.removeEventListener('keydown', onEscapeClick);
}

function onEscapeClick(evt) {
    if (evt.key === 'Escape') {
        evt.preventDefault();
        onCloseBtnClick(evt);
    }
}



// task 5

let lastTimeout;
let timeout;
 
function debounce(callback) {
    if (lastTimeout) {
        clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(callback, DEBOUNCE_INTERVAL);  
}




//task 6

const brandsSet = new Set(getBrands(cardsArray));

function getBrands(arr) {
    const result = [];
    for (let elem of arr) {
        result.push(elem.brand);
    }
    return result;
}


let brandsFilterList = document.querySelector('.brand-set .filter-list');

insertBrandsFilterList();

function insertBrandsFilterList() {

    let insertableList = document.createElement('ul');

    brandsSet.forEach(elem => {
        let insertableListItem = document.createElement('li');
        insertableListItem.className = 'filter-option';

        insertableListItem.innerHTML = 
        `
            <input class="visually-hidden filter-input filter-input-checkbox" type="checkbox" name="${elem.toLowerCase()}" id="filter-${elem.toLowerCase()}">
            <label for="filter-${elem.toLowerCase()}">${elem}</label>
        `;
        insertableList.append(insertableListItem);
    });

    brandsFilterList.innerHTML = insertableList.innerHTML;

}





// task 7

const rangeBlock = document.querySelector('.range__block');
const rangeBar = document.querySelector('.range__bar');

const pointerMin = document.querySelector('.scroll_min');
const pointerMax = document.querySelector('.scroll_max');

const minPriceLable = document.getElementsByName('min-price');
const maxPriceLable = document.getElementsByName('max-price');

let minPrice = 0;
let maxPrice = 30000;

let priceStep = 30000 / (rangeBlock.offsetWidth - 20);


rangeBlock.addEventListener('mousedown', ()=> {

    pointerMin.onmousemove = (e)=> {
        pointerMinChangeRange(e);
    }

    pointerMax.onmousemove = (e)=> {
        pointerMaxChangeRange(e);
    }

});

rangeBlock.addEventListener('mouseup', ()=> {
    pointerMin.onmousemove = null;
    pointerMax.onmousemove = null;
});

rangeBlock.addEventListener('mouseout', ()=> {
    pointerMin.onmousemove = null;
    pointerMax.onmousemove = null;
});





let rangeBarWidth = rangeBar.offsetWidth;

let pointerMinPosition = 0;
let pointerMaxPosition = pointerMax.offsetLeft;



function pointerMinChangeRange(e) {

    e.preventDefault();

    if (event.clientX - rangeBlock.getBoundingClientRect().x - e.target.offsetWidth / 2 >= 0 && rangeBlock.getBoundingClientRect().x + pointerMaxPosition - 10 >= event.clientX)  {
        e.target.style.left = event.clientX - rangeBlock.getBoundingClientRect().x - e.target.offsetWidth / 2 + 'px';
        pointerMinPosition = pointerMin.offsetLeft;

        changeRangeBarWidth()

        minPrice = pointerMinPosition * priceStep;

        minPriceLable[0].value = `${Math.round(minPrice)}`;
    }

}

function pointerMaxChangeRange(e) {

    e.preventDefault();

    if (rangeBlock.getBoundingClientRect().x + rangeBlock.offsetWidth - 10 >= event.clientX && rangeBlock.getBoundingClientRect().x + pointerMinPosition + 30 <= event.clientX) {
        e.target.style.left = event.clientX - rangeBlock.getBoundingClientRect().x - e.target.offsetWidth / 2 + 'px';
        pointerMaxPosition = pointerMax.offsetLeft;
        
        changeRangeBarWidth()

        maxPrice = (pointerMaxPosition) * priceStep;

        maxPriceLable[0].value = `${Math.round(maxPrice)}`;
    } 

}


function changeRangeBarWidth() {
    rangeBarWidth = pointerMaxPosition - pointerMinPosition;
    rangeBar.style.width = rangeBarWidth + 'px';
    rangeBar.style.marginLeft = pointerMinPosition + 10 + 'px';
}






























// ТЫ НЕ ПРОЙДЁШЬ!!!!!!