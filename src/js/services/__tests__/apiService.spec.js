import api, { Api } from '../apiService'
import axios from 'axios'
import config from '../../config/apiConfig'

jest.mock('axios')

const cities = [{ country_code: 'UKR', name: 'Kharkiv', code: 'KH' }]
const countries = [{ code: 'UKR', name: 'Ukraine' }]
const airlines = [{ name: 'airBaltic', code: 'BT' }]
const params = {
    currency: 'USD',
    depart_date: '2023-12',
    destination: 'IWA',
    origin: 'MOW',
    return_date: ''
}
const tickets = { '2023-12-10': {
    airline: 'SU',
    departure_at: '2023-12-10T23:30:00+03:00',
    destination: 'IWA',
    expires_at: '2023-12-10T20:54:23Z',
    flight_number: 42,
    origin: 'MOW',
    price: 202,
    return_at: '2023-12-12T20:10:00+03:00',
    transfers: 1
} }

describe('Test API servise', () => {
    it('Check api is instance of Api class', () => {
        expect(api).toBeInstanceOf(Api)
    })

    it('Check Api instance create', () => {
        const apiInstance = new Api(config);
        expect(apiInstance.url).toBe(config.url)
    })

    it('Success fetch cities', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve({ data: cities }))
        await expect(api.cities()).resolves.toEqual(cities)
        expect(axios.get).toHaveBeenCalledWith(`${config.url}/cities`)
    })

    it('Success fetch countries', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve({ data: countries }))
        await expect(api.countries()).resolves.toEqual(countries)
        expect(axios.get).toHaveBeenCalledWith(`${config.url}/countries`)
    })

    it('Success fetch airlines', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve({ data: airlines }))
        await expect(api.airlines()).resolves.toEqual(airlines)
        expect(axios.get).toHaveBeenCalledWith(`${config.url}/airlines`)
    })

    it('Success fetch prices', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve({ data: { data: tickets }}))
        await expect(api.prices(params)).resolves.toEqual(tickets)
        expect(axios.get).toHaveBeenCalledWith(`${config.url}/prices/cheap`, { params })
    })
})