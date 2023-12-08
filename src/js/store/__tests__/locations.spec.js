import locationsInstance, { Locations } from '../locations';
import { formatDate } from '../../helpers/date';
import api, { Api } from '../../services/apiService';

const countries = [{ code: 'UKR', name: 'Ukraine' }, { code: 'RUS', name: 'Russia' }];
const cities = [{ country_code: 'UKR', name: 'Kharkiv', code: 'KH' }, { country_code: 'RUS', name: 'Moscow', code: 'MOW' }]
const airlines = [{ name: 'airBaltic', code: 'BT' }];
const tickets = [{ airline: 'BT', destination: 'KH', origin: 'MOW', departure_at: '2023-12-07T23:45:00+03:00', return_at: '2023-12-09T20:10:00+03:00'}]

jest.mock('../../services/apiService', () => {
    const mockApi = {
        countries: jest.fn(() => Promise.resolve([{ code: 'UKR', name: 'Ukraine' }, { code: 'RUS', name: 'Russia' }])),
        cities: jest.fn(() => Promise.resolve([{ country_code: 'UKR', name: 'Kharkiv', code: 'KH' }, { country_code: 'RUS', name: 'Moscow', code: 'MOW' }])),
        airlines: jest.fn(() => Promise.resolve([{ name: 'airBaltic', code: 'BT' }])),
        prices: jest.fn(() => Promise.resolve([{ airline: 'BT', destination: 'KH', origin: 'MOW', departure_at: '2023-12-07T23:45:00+03:00', return_at: '2023-12-09T20:10:00+03:00' }]))
    }

    return {
        Api: jest.fn(() => mockApi)
    }
})

const apiService = new Api()

describe('Location store tests', () => {
    beforeEach(() => {
        locationsInstance.countries = locationsInstance.serializeCountry(countries);
        locationsInstance.cities = locationsInstance.serializeCities(cities);
        locationsInstance.airlines = locationsInstance.serializeAirlines(airlines);
    })

    it('Check that locationInstance is instance of Locations class', () => {
        expect(locationsInstance).toBeInstanceOf(Locations)
    })

    it('Success Locations instance create', () => {
        const instance = new Locations(api, { formatDate });
        expect(instance.api).toEqual(api)
        expect(instance.countries).toBe(null)
        expect(instance.cities).toBe(null)
        expect(instance.shortCitiesList).toEqual({})
        expect(instance.lastSearch).toEqual({})
        expect(instance.airlines).toEqual({})
        expect(instance.formatDate).toEqual(formatDate)
    })

    it('Check correct serialize country', () => {
        const res = locationsInstance.serializeCountry(countries);
        const expectedData = {
            'UKR': { code: 'UKR', name: 'Ukraine' },
            'RUS': { code: 'RUS', name: 'Russia' }
        }
        expect(res).toEqual(expectedData)
    })

    it('Check serialize country with incorrect data', () => {
        const res = locationsInstance.serializeCountry(null);
        const expectedData = {}
        expect(res).toEqual(expectedData)
    })

    it('Check correct serialize cities', () => {
        const res = locationsInstance.serializeCities(cities)
        const expextedData = {
            'KH': { country_code: 'UKR', name: 'Kharkiv', code: 'KH', country_name: 'Ukraine', full_name: 'Kharkiv,Ukraine' },
            'MOW': { country_code: 'RUS', name: 'Moscow', code: 'MOW', country_name: 'Russia', full_name: 'Moscow,Russia' }
        }
        expect(res).toEqual(expextedData)
    })

    it('Check correct serialize airlines', () => {
        const res = locationsInstance.serializeAirlines(airlines)
        const expectedData = {
            'BT': { code: 'BT', name: 'airBaltic', logo: 'http://pics.avs.io/200/200/BT.png' }
        }
        expect(res).toEqual(expectedData)
    })

    it('Check correct get city code by key', () => {
        const res = locationsInstance.getCityCodeByKey('Kharkiv,Ukraine');
        expect(res).toBe('KH')
    })

    it('Check correct get country name by code', () => {
        const res = locationsInstance.getCountryNameByCode('UKR')
        expect(res).toBe('Ukraine')
    })

    it('Check correct get airline name by code', () => {
        const res = locationsInstance.getAirlineNameByCode('BT')
        expect(res).toBe('airBaltic')
    })

    it('Check correct get airline logo by code', () => {
        const res = locationsInstance.getAirlineLogoByCode('BT')
        expect(res).toBe('http://pics.avs.io/200/200/BT.png')
    })

    it('Check correct get city name by code', () => {
        const res = locationsInstance.getCityNameByCode('KH')
        expect(res).toBe('Kharkiv')
    })

    it('Check correct create short cities list', () => {
        const newCities = locationsInstance.cities; // cities after serializeCities
        const res = locationsInstance.createShortCitiesList(newCities)
        const expectedData = {
            'Kharkiv,Ukraine': null,
            'Moscow,Russia': null
        }
        expect(res).toEqual(expectedData)        
    })

    it('Check correct init() method call', () => {
        const instance = new Locations(apiService, { formatDate })
        expect(instance.init()).resolves.toEqual([countries, cities, airlines])
    })

    it('Check correct serialize tickets', () => {
        const res = locationsInstance.serializeTickets(tickets);
        const expectedData = [{
            airline: 'BT',
            destination: 'KH',
            origin: 'MOW',
            departure_at: '2023-12-07T23:45:00+03:00',
            return_at: '2023-12-09T20:10:00+03:00',
            airline_name: 'airBaltic',
            airline_logo: 'http://pics.avs.io/200/200/BT.png',
            destination_name: 'Kharkiv',
            origin_name: 'Moscow',
            departure_at: '07 Dec 2023 23:45',
            return_at: '09 Dec 2023 20:10'
            //ticket_id в location.js нужно закомитить перед запуском теста, так как id генерируется случайным образом, и предугадать его невозможно
        }]
        expect(res).toEqual(expectedData)
    })

    it('Check correct fetchTickets() method call', () => {
        const instance = new Locations(apiService, { formatDate })
        instance.countries = locationsInstance.serializeCountry(countries);
        instance.cities = locationsInstance.serializeCities(cities);
        instance.airlines = locationsInstance.serializeAirlines(airlines);
        expect(instance.fetchTickets()).resolves.toEqual(tickets)
    })
})
