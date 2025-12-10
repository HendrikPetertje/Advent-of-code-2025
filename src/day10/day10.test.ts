import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { fixJoltageSettings, turnIndicatorLightsOn } from './day10';

describe('Advent of code - Day 10', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(10, true);

      const result = turnIndicatorLightsOn(input);

      expect(result).toEqual(7);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(10);

      const result = turnIndicatorLightsOn(input);

      expect(result).toEqual(475);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(10, true);

      const result = fixJoltageSettings(input);

      expect(result).toEqual(33);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(10);

      const result = fixJoltageSettings(input);

      expect(result).toEqual(33);
    });
  });
});
