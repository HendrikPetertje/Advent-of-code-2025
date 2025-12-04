import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import {
  getMovableToiletRollsCount,
  getMovableToiletrollsCountWhenRemoving,
} from './day4';

describe('Advent of code - Day 4', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(4, true);

      const result = getMovableToiletRollsCount(input);
      expect(result).toEqual(13);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(4);

      const result = getMovableToiletRollsCount(input);
      expect(result).toEqual(1397);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(4, true);

      const result = getMovableToiletrollsCountWhenRemoving(input);

      expect(result).toEqual(43);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(4);

      const result = getMovableToiletrollsCountWhenRemoving(input);

      expect(result).toEqual(8758);
    });
  });
});
