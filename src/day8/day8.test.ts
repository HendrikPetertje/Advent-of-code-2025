import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { countLightConnections } from './day8';

describe('Advent of code - Day 8', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(8, true);

      const result = countLightConnections(input, 10);

      expect(result).toEqual(40); // Updated based on Euclidean distance
    });

    it('should pass the real test', async () => {
      const input = await getDayData(8, false, true);
      const result = countLightConnections(input); // Back to 1000 connections

      console.log('Real result:', result);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(8, true, true);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(8, false, true);
    });
  });
});
