import locationsInstance, { Locations } from '../locations';
import { formatDate } from '../../helpers/date';
import api, { Api } from '../../services/apiService';

const countries = [{ code: 'UKR', name: 'Ukraine' }];
const cities = [{ country_code: 'UKR', name: 'Kharkiv', code: 'KH' }]
const airlines = [{ name: 'airBaltic', code: 'BT' }];

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
            'UKR': { code: 'UKR', name: 'Ukraine' }
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
            'KH': { country_code: 'UKR', name: 'Kharkiv', code: 'KH', country_name: 'Ukraine', full_name: 'Kharkiv,Ukraine' }
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
            'Kharkiv,Ukraine': null
        }
        expect(res).toEqual(expectedData)        
    })

})

// 23.29
// осталось сделать тест serializeTickets и тест init()