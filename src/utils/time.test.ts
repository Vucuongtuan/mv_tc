import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getTimeNow } from './time.ts';

describe('getTimeNow', () => {
    // Fixed date for consistent testing: 2024-05-20 10:00:00 UTC
    // Vietnam time (UTC+7): 2024-05-20 17:00:00
    const mockDate = new Date('2024-05-20T10:00:00Z');

    test('should return full date-time string by default', () => {
        const result = getTimeNow(mockDate);
        assert.strictEqual(result, '2024-05-20 17:00:00');
    });

    test('should return only date parts when specified', () => {
        const result = getTimeNow(mockDate, { year: true, month: true, day: true });
        assert.strictEqual(result, '2024-05-20');
    });

    test('should return only time parts when specified', () => {
        const result = getTimeNow(mockDate, { hours: true, minutes: true, seconds: true });
        assert.strictEqual(result, '17:00:00');
    });

    test('should return partial date when only year is specified', () => {
        const result = getTimeNow(mockDate, { year: true });
        assert.strictEqual(result, '2024');
    });

    test('should return partial time when only hours and minutes are specified', () => {
        const result = getTimeNow(mockDate, { hours: true, minutes: true });
        assert.strictEqual(result, '17:00');
    });

    test('should return combined date and time parts', () => {
        const result = getTimeNow(mockDate, { day: true, month: true, hours: true });
        assert.strictEqual(result, '05-20 17');
    });

    test('should handle empty options object by returning empty string', () => {
        const result = getTimeNow(mockDate, {});
        assert.strictEqual(result, '');
    });

    test('should use current date if none is provided', () => {
        const result = getTimeNow();
        // Just verify it returns a string in the expected format (YYYY-MM-DD HH:mm:ss)
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        assert.ok(regex.test(result), `Result "${result}" should match full date-time regex`);
    });

    test('should correctly pad single digit values', () => {
        // 2024-01-02 03:04:05 UTC -> 2024-01-02 10:04:05 Vietnam
        const earlyDate = new Date('2024-01-02T03:04:05Z');
        const result = getTimeNow(earlyDate);
        assert.strictEqual(result, '2024-01-02 10:04:05');
    });

    test('should handle edge of the day (Vietnam time)', () => {
        // 2024-05-20T20:00:00Z -> 2024-05-21T03:00:00 in Vietnam
        const lateDate = new Date('2024-05-20T20:00:00Z');
        const result = getTimeNow(lateDate, { day: true, month: true, year: true, hours: true });
        assert.strictEqual(result, '2024-05-21 03');
    });
});
