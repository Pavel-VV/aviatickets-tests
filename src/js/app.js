// import api from './services/apiService';
// api.countries().then(res => console.log(res));
// api.cities().then(res => console.log(res))
// export NODE_OPTIONS=--openssl-legacy-provider

import '../css/style.css';
import './plugins';
import locations from './store/locations';
import favorites from './store/favorites'
import formUI from './views/form';
import currencyUI from './views/currency';
import ticketsUI from './views/tickets';
// import favoritesTicketsUI from './views/favoritesTickets';

document.addEventListener('DOMContentLoaded',() => {
    initApp();
    const form = formUI.form;

    // Events
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        onFormSubmit();
    });

    // Handlers
    async function initApp() {
        // console.log(locations)
        await locations.init();
        formUI.setAutocompleteDate(locations.shortCitiesList)
    };

    let params = {};

    async function onFormSubmit() {
        // собрать данные из инпутов и затем отправить на сервер запрос по выбранным данным из полей ввода
        const origin = locations.getCityCodeByKey(formUI.originValue);
        const destination = locations.getCityCodeByKey(formUI.destinationValue);
        const depart_date = formUI.departValue;
        const return_date = formUI.returnValue;
        const currency = currencyUI.currencyValue;
        // CODE, CODE, 2023-09, 2023-10
        // console.log(origin, destination, depart_date, return_date, currency); 
        
        // const result = await locations.getPrices(origin, destination, depart_date, return_date);
        if(params === (origin + destination +  depart_date + return_date + currency)){ // проверяем, менялись ли параметры запроса
            alert('билеты по данному запросу выданы');
            return;
        };
       
        await locations.fetchTickets({
            origin,
            destination,
            depart_date,
            return_date,
            currency,
        });

        params =  origin + destination +  depart_date + return_date + currency; // записываем параметры запроса билетов

        // console.log(locations.lastSearch);
        ticketsUI.renderTickets(locations.lastSearch);
        favorites.addNewTickets(locations.lastSearch);
    }
    
});

//нажатие на кнопку "добавить в избраное"
document.addEventListener('click', ({target}) => { //деструктуризация event, получение target(елемент на который было нажатие)
    if(target.classList.contains('add-favorite')) { // проверка что нажатие было именно на кнопку
        const parent = target.closest('[data-ticket-id]');
        const ticketId = parent.dataset.ticketId; // Дата-атрибуты, записанные в dataset с помощью camelCase, в HTML будут иметь названия в kebab-case. Браузер преобразует camelCase в kebab-case, поэтому что бы найти data-ticket-id, нужно искать ticketId
        favorites.addFavoriteTicket(ticketId); // вызов функции поиска избраного билета по id
        // console.log(ticketId);
    }
    
});

// нажатие на кнопку DELETE у избранного билета
document.addEventListener('click', ({target}) => { // деструктуризация event и выделение действия нажатия
    if(target.classList.contains('delete-favorite')) { // проверяем, есть ди у элемента класс 'delete-favorite'
        const parent = target.closest('[data-ticket-id]'); // ищем предка с атрибутом [data-ticket-id]
        const ticketId = parent.dataset.ticketId; // узнаем значение атрибута [data-ticket-id] ищется через camelCase
        favorites.deleteFavoriteTicket(ticketId); // вызываем функцию удаления одного выбраного билета из массива избранных билетов
    };
});

// locations.init().then(res => {
//     console.log(res);
//     console.log(locations);
//     console.log(locations.getCitiesByCountryCode("IN"))
// })


/**
 * повесил индивидуальный айдишник на каждый билет, и привязал его в разметке билета
 * нужно реализовать отслеживание нажатия на кнопку "доюавить в избраное"
 */