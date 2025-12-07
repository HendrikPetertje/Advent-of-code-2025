/** biome-ignore-all lint/style/noNonNullAssertion: lots of assuming here */

export const countSplits = (input: string) => {
  const { lines, start } = parseInput(input);

  const memory: Record<string, boolean> = {};
  const activatedSplits: Record<string, boolean> = {};

  const iterate = (posY: number, posX: number) => {
    const posLoc = `${posY}.${posX}`;
    if (memory[posLoc]) return;
    memory[posLoc] = true;

    const pos = lines[posY]?.[posX];
    // if there is no such POS, then we reached the end and no further splits are possible
    if (!pos) return;

    if (pos === '.') {
      iterate(posY + 1, posX);
      return;
    }

    if (pos === '^') {
      activatedSplits[posLoc] = true;
      iterate(posY, posX - 1);
      iterate(posY, posX + 1);
      return;
    }

    throw new Error(`iterated outside of some scope: ${posY}, ${posX}`);
  };

  iterate(1, start);

  return Object.keys(activatedSplits).length;
};

export const countUniquePaths = (input: string) => {
  const { lines, start } = parseInput(input);

  const memory: Record<string, number> = {};

  const iterate = (posY: number, posX: number): number => {
    const posLoc = `${posY}.${posX}`;
    if (memory[posLoc] !== undefined) return memory[posLoc];

    const pos = lines[posY]?.[posX];
    // if there is no such POS, then we reached the end and no further splits are possible
    // the single code path count can be returned
    if (!pos) return 1;

    if (pos === '.') {
      const count = iterate(posY + 1, posX);
      memory[posLoc] = count;
      return count;
    }

    if (pos === '^') {
      const left = iterate(posY, posX - 1);
      const right = iterate(posY, posX + 1);
      const count = left + right;
      memory[posLoc] = count;
      return count;
    }

    throw new Error(`iterated outside of some scope: ${posY}, ${posX}`);
  };

  const totalCount = iterate(1, start);
  return totalCount;
};

const parseInput = (input: string) => {
  const lines = input.split('\n').map((line) => line.split(''));

  const start = lines[0]!.indexOf('S');

  if (!start) throw new Error('start not found');

  return { lines, start };
};

// little support map for debugging
// const map = lines
//   .map((line, y) => {
//     return line
//       .map((column, x) => {
//         const pos = `${y}.${x}`;
//         if (activatedSplits[pos]) return '0';
//         if (memory.has(pos)) return '|';
//         return column;
//       })
//       .join('');
//   })
//   .join('\n');
//
// console.log(map);
