import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { countSplits, countUniquePaths } from './day7';

describe('Advent of code - Day 7', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(7, true);

      const result = countSplits(input);

      expect(result).toEqual(21);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(7, false, true);

      const result = countSplits(input);

      expect(result).toEqual(1570);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(7, true, true);

      const result = countUniquePaths(input);
      expect(result).toEqual(40);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(7, false, true);

      const result = countUniquePaths(input);
      expect(result).toEqual(15118009521693);
    });
  });
});
