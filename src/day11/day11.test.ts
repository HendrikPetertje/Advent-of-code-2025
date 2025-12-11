import { describe, expect, it } from 'bun:test';
import { getDayData } from '../utils/getDayData';
import { getPossiblePaths } from './day11';

describe('Advent of code - Day 11', () => {
  describe('Part 1', () => {
    it('should pass the dummy test', async () => {
      const input = await getDayData(11, true);

      const result = getPossiblePaths(input, 'you');
      expect(result).toBe(5);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(11);

      const result = getPossiblePaths(input, 'you');
      expect(result).toBe(431);
    });
  });

  describe('Part 2', () => {
    it('should pass the dummy test', async () => {
      const input = `
svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out
`.trim();

      const result = getPossiblePaths(input, 'svr', ['fft', 'dac']);
      expect(result).toBe(2);
    });

    it('should pass the real test', async () => {
      const input = await getDayData(11);

      const result = getPossiblePaths(input, 'svr', ['fft', 'dac']);
      expect(result).toBe(2);
    });
  });
});
