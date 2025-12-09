import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import {
  getBiggestRectangleArea,
  getBiggestRectangleAreaWithGreenTiles,
} from './day09';

describe('Advent of code - Day 09', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(9, true);

      const result = getBiggestRectangleArea(input);
      expect(result).toEqual(50);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(9);

      const result = getBiggestRectangleArea(input);
      expect(result).toEqual(4755278336);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(9, true);

      const result = getBiggestRectangleAreaWithGreenTiles(input);
      expect(result).toEqual(24);
    });

    it.only('should pass the real test', async () => {
      const input = await getDayData(9);

      const result = getBiggestRectangleAreaWithGreenTiles(input);
      expect(result).not.toEqual(92770);
      console.log('Result: ', result);
    });
  });
});
