import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { countLightConnections, findLastConnection } from './day08';

describe('Advent of code - Day 08', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(8, true);

      const result = countLightConnections(input, 10);

      expect(result).toEqual(40);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(8);

      const result = countLightConnections(input);

      expect(result).toEqual(52668);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(8, true);

      const result = findLastConnection(input);

      expect(result).toEqual(25272);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(8);

      const result = findLastConnection(input);

      expect(result).toEqual(1474050600);
    });
  });
});
