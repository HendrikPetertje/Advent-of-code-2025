import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { packageFittingChecker } from './day12';

describe('Advent of code - Day 12', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(12, true);

      const result = packageFittingChecker(input);
      expect(result).toBeTruthy();
    });

    it('should pass the real test', async () => {
      const input = await getDayData(12);
      const result = packageFittingChecker(input);
      expect(result).toEqual(538);
    });
  });
});
