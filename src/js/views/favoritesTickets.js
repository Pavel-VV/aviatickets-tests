import currencyUI from './currency'

class FavoritesTicketsUI {
    constructor(currency) {
        this.container = document.querySelector('.dropdown-content');
        this.getCurrencySymbol = currency.getCurrencySymbol.bind(currency);
    }

    renderFavoriteTicket(ticket) {
        const currency = this.getCurrencySymbol();

        const renderTicket = FavoritesTicketsUI.favoriteTicketTemplate(ticket, currency);

        this.container.insertAdjacentHTML('afterbegin', renderTicket);
    }

    clearFavoriteTicket(ticketId) {
        const delTicket = this.container.querySelector(`[data-ticket-id = ${ticketId}]`);
        delTicket.innerHTML = '';
        // console.log(delTicket);

    }

    static favoriteTicketTemplate(ticket, currency) {
        
        return `
        <div data-ticket-id=${ticket.ticket_id} class="favorite-item  d-flex align-items-start">
            <img
            src=${ticket.airline_logo}
            class="favorite-item-airline-img"
            />
            <div class="favorite-item-info d-flex flex-column">
            <div
                class="favorite-item-destination d-flex align-items-center"
            >
                <div class="d-flex align-items-center mr-auto">
                <span class="favorite-item-city">${ticket.origin_name} </span>
                <i class="medium material-icons">flight_takeoff</i>
                </div>
                <div class="d-flex align-items-center">
                <i class="medium material-icons">flight_land</i>
                <span class="favorite-item-city">${ticket.destination_name}</span>
                </div>
            </div>
            <div class="ticket-time-price d-flex align-items-center">
                <span class="ticket-time-departure">${ticket.departure_at}</span>
                <span class="ticket-price ml-auto">${currency}${ticket.price}</span>
            </div>
            <div class="ticket-additional-info">
                <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
                <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
            </div>
            <a
                class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto"
                >Delete</a
            >
            </div>
        </div>
        `
    }

};

const favoritesTicketsUI = new FavoritesTicketsUI(currencyUI);

export default favoritesTicketsUI;