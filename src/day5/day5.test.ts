import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { countFreshIngredients, countTotalRangeLength } from './day5';

describe('Advent of code - Day 5', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(5, true);

      const result = countFreshIngredients(input);

      expect(result).toEqual(3);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(5);

      const result = countFreshIngredients(input);

      expect(result).toEqual(652);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(5, true);

      const result = countTotalRangeLength(input);

      expect(result).toEqual(14);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(5);

      const result = countTotalRangeLength(input);

      expect(result).toEqual(341753674214273);
    });
  });
});
