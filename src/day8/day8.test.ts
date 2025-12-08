import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { countLightConnections, findLastConnection } from './day8';

describe('Advent of code - Day 8', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(8, true);

      const result = countLightConnections(input, 10);

      expect(result).toEqual(40); // Updated based on Euclidean distance
    });

    // this is super slow
    it.skip('should pass the real test', async () => {
      const input = await getDayData(8, false, true);

      const result = countLightConnections(input); // Back to 1000 connections

      expect(result).toEqual(52668);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(8, true, true);

      const result = findLastConnection(input);

      expect(result).toEqual(25272);
    });

    // this is super slow
    it.skip('should pass the real test', async () => {
      const input = await getDayData(8, false, true);

      const result = findLastConnection(input);

      expect(result).toEqual(1474050600);
    });
  });
});
