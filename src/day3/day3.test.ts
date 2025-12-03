import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { getHighestJoltageChainofNum } from './day3';

describe('Advent of code - Day 2', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(3, true);

      const result = getHighestJoltageChainofNum(input, 2);
      expect(result).toEqual(357);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(3);

      const result = getHighestJoltageChainofNum(input, 2);
      expect(result).toEqual(17196);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(3, true);
      const result = getHighestJoltageChainofNum(input, 12);

      expect(result).toEqual(3121910778619);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(3);

      const result = getHighestJoltageChainofNum(input, 12);

      expect(result).toEqual(171039099596062);
    });
  });
});
