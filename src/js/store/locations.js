import api from '../services/apiService';
import {formatDate} from '../helpers/date';

export class Locations {
    constructor(api, helpers) {
        this.api = api;
        this.countries = null;
        this.cities = null;
        this.shortCitiesList = {}; // список городов для автокомплита {'City, Country': null}
        this.lastSearch = {};
        this.airlines = {};
        this.formatDate = helpers.formatDate;
    }

    async init() {
        const response = await Promise.all([
            this.api.countries(),
            this.api.cities(),
            this.api.airlines()
        ]);

        const [countries, cities, airlines] = response;
        this.countries = this.serializeCountry(countries);
        this.cities = this.serializeCities(cities);
        this.shortCitiesList = this.createShortCitiesList(this.cities);
        this.airlines = this.serializeAirlines(airlines);
        console.log(airlines);

        return response;        
    }

    getCityCodeByKey(key) {
        //приходит ключ в виде 'Москва,Россия', нужно по ключу найти код города
        const city = Object.values(this.cities).find(city => city.full_name === key);
        return city.code;
    }
    
    getCountryNameByCode(code) {
        // {'Contry code': {...}}
        return this.countries[code] ? this.countries[code].name : '';
    }

    getAirlineNameByCode(code) {
        return this.airlines[code] ? this.airlines[code].name : '';
    }

    getAirlineLogoByCode(code) {
        return this.airlines[code].logo;
    }

    getCityNameByCode(code) {
        return this.cities[code].name;
    }

    createShortCitiesList(cities) {
        // {'City,Country': null}
        // Object.entries(cities) => [key, value]
        return Object.entries(cities).reduce((acc,[, city]) => {
            acc[city.full_name] = null;
            return acc;
        },{})
    }

    serializeCountry(countries){
        // {'Country code': {...}}
        if(!Array.isArray(countries) || !countries.length) return {};
        return countries.reduce((acc, country) => {
            acc[country.code] = country;
            return acc;
        },{})
    }

    serializeCities(cities) {
        // {'City name, Country name': {...}}
        return cities.reduce((acc, city) => {
            city.name = city.name || city.name_translations.en;
            const country_name = this.getCountryNameByCode(city.country_code);
            const full_name = `${city.name},${country_name}`;
            acc[city.code] = {
                ...city,
                country_name,
                full_name,
            };
            return acc;
        },{})
    }
    serializeAirlines(airlines) {
        return airlines.reduce((acc, item) => {
            item.name = item.name || item.name_translations.en;
            item.logo = `http://pics.avs.io/200/200/${item.code}.png`;
            acc[item.code] = item;
            return acc;
        },{})
    }

    serializeTickets(tickets) {
        return Object.values(tickets).map(ticket => {
            const airline_name = this.getAirlineNameByCode(ticket.airline);
            const airline_logo = this.getAirlineLogoByCode(ticket.airline);
            const destination_name = this.getCityNameByCode(ticket.destination);
            const origin_name = this.getCityNameByCode(ticket.origin);
            const departure_at = this.formatDate(ticket.departure_at, 'dd MMM yyyy HH:mm');
            const return_at = this.formatDate(ticket.return_at, 'dd MMM yyy HH:mm');
            const ticket_id = 'id' + Math.round((Math.random() * Date.now())); // формирование индивидуального id билета
            return {
                ...ticket,
                airline_name,
                airline_logo,
                destination_name,
                origin_name,
                departure_at,
                return_at,
                ticket_id,
            };
        }) 
    }

    async fetchTickets(params) {
        const respons = await this.api.prices(params);
        this.lastSearch = this.serializeTickets(respons.data);
    }
};

const locations = new Locations(api, {formatDate});

export default locations;

// {'City, Country': null}
// [{}, {}]
// {'City': {...}} => cities[code]
// 