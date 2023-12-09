import api, { Api } from '../apiService'
import axios from 'axios'
import config from '../../config/apiConfig'

jest.mock('axios')

const cities = [{ country_code: 'UKR', name: 'Kharkiv', code: 'KH' }]

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
})