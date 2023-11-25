import favoritesTicketsUI from '../views/favoritesTickets';

// сделать проверку добавлялся ли билет в избраное, если добавлялся, то его больше не добавлять, потом с помощью этого массива, делать проверку и для рендера билетов
// реализовать удаление разметки избранных билетов
class Favorites {
    constructor(ticketsUI) {
        this.searchTickets = null; //список всех запрошенных билетов
        this.favoritesTickets = []; // избранные билеты
        this.renderTicket = ticketsUI.renderFavoriteTicket.bind(ticketsUI);
        this.clearFavoriteTicket = ticketsUI.clearFavoriteTicket.bind(ticketsUI);
    }

    addNewTickets(tickets) {
        this.searchTickets = tickets; // через эту функцию попадают списки всех запрошенных билетов, нужен чтоб в дальнейшем по id билета искать избранный билет
    }

    addFavoriteTicket(ticketId) {
        const favoriteTicket = this.searchTickets.find(ticket => {
           return ticket.ticket_id === ticketId;
        });

        if (this.favoritesTickets.find(ticket => ticket.ticket_id === ticketId)) {
            alert ('Билет уже в избранном');
            return;
        };

        this.favoritesTickets.push(favoriteTicket); //добавление билетов в массив избраного

        this.renderTicket(favoriteTicket); // рендер одного билета в избраное
    };

    deleteFavoriteTicket(ticketId) {
        // console.log(this.favoritesTickets);
        this.favoritesTickets = this.favoritesTickets.reduce((acc, ticket) => {
            // console.log(ticket);
            if(ticket.ticket_id === ticketId){
                return acc;
            };
            acc.push(ticket);
            return acc;
        }, []);

        this.clearFavoriteTicket(ticketId); // удаление выбраного билета из разметки страницы
    };
};

const favorites = new Favorites(favoritesTicketsUI);

export default favorites;