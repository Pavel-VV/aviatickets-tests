import { formatDate } from './date';

describe('formatDate', () => {
    it('check format', () => {
        expect(formatDate(1700942682049, 'yyyy')).toBe("2023");
    });
});