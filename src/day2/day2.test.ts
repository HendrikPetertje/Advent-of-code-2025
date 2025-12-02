import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { getInvalidIds } from './day2';

describe('Advent of code - Day 2', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(2, true);

      const result = getInvalidIds(input);
      expect(result).toEqual(1227775554);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(2);

      const result = getInvalidIds(input);
      expect(result).toEqual(19386344315);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(2, true);

      const result = getInvalidIds(input, true);
      expect(result).toEqual(4174379265);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(2);

      const result = getInvalidIds(input, true);
      expect(result).toEqual(34421651192);
    });
  });
});
