import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { doTheMath, doTheMathCephalopodsStyle } from './day6';

describe('Advent of code - Day 6', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(6, true, true);

      const result = doTheMath(input);

      expect(result).toEqual(BigInt(4277556));
    });

    it('should pass the real test', async () => {
      const input = await getDayData(6, false, true);

      const result = doTheMath(input);

      expect(result).toEqual(BigInt(5595593539811));
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(6, true, true);

      const result = doTheMathCephalopodsStyle(input);

      expect(result).toEqual(BigInt(3263827));
    });

    it('should pass the real test', async () => {
      const input = await getDayData(6, false, true);

      const result = doTheMathCephalopodsStyle(input);

      expect(result).toEqual(BigInt(10153315705125));
    });
  });
});
