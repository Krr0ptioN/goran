import { describe, it, expect } from 'vitest';
import { paginateArray } from './paginate-array';

describe('paginateArray', () => {
    const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it('should return the correct page of items', () => {
        expect(paginateArray(testArray, 3, 1)).toEqual([1, 2, 3]);
        expect(paginateArray(testArray, 3, 2)).toEqual([4, 5, 6]);
        expect(paginateArray(testArray, 3, 3)).toEqual([7, 8, 9]);
        expect(paginateArray(testArray, 3, 4)).toEqual([10]);
    });

    it('should handle page sizes larger than the array', () => {
        expect(paginateArray(testArray, 15, 1)).toEqual(testArray);
    });

    it('should return an empty array for out-of-range page numbers', () => {
        expect(paginateArray(testArray, 3, 5)).toEqual([]);
        expect(paginateArray(testArray, 3, 0)).toEqual([]);
    });

    it('should handle empty arrays', () => {
        expect(paginateArray([], 5, 1)).toEqual([]);
    });

    it('should work with different data types', () => {
        const stringArray = ['a', 'b', 'c', 'd', 'e'];
        expect(paginateArray(stringArray, 2, 2)).toEqual(['c', 'd']);
    });

    it('should handle edge cases', () => {
        expect(paginateArray(testArray, 1, 10)).toEqual([10]);
        expect(paginateArray(testArray, 10, 1)).toEqual(testArray);
    });
});
