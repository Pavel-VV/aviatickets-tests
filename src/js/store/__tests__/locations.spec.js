import locationsInstance, { Locations } from '../locations';
import { formatDate } from '../../helpers/date';
import api, { Api } from '../../services/apiService';

describe('Location store tests', () => {
    it('Check that locationInstance is instance of Locations class', () => {
        expect(locationsInstance).toBeInstanceOf(Locations)
    });

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
})