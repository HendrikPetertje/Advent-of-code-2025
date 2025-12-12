import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import {
  day1_1_getAmountof0passes,
  day1_2_getAmountofAll0Passes,
} from './day01';

describe('Advent of code - Day 01', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(1, true);

      const result = day1_1_getAmountof0passes(input);

      expect(result).toBe(3);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(1);

      const result = day1_1_getAmountof0passes(input);
      expect(result).toBe(1052);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(1, true);

      const result = day1_2_getAmountofAll0Passes(input);
      expect(result).toBe(6);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(1);

      const result = day1_2_getAmountofAll0Passes(input);
      expect(result).toBe(6295);
    });
  });
});
